import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBookStore } from '@/renderer/store/useBookStore';
import type { Book, Tag, ScrapedBook, SearchFilter } from '@/types';
import styles from './MetadataEditor.module.css';
import SelectionOverlay from '@/renderer/components/ui/SelectionOverlay';
import WebSearchModal from './WebSearchModal';

interface MetadataEditorProps {
  book: Book;
  onUpdate: (bookId: number, data: any) => void;
  onTagsUpdate: (bookId: number, tags: string[]) => Promise<void>;
}

// ヘルパー関数
const parseMultiValue = (val: string | string[] | null | undefined): string[] => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  return val.split(',').map(s => s.trim()).filter(Boolean);
};

export default function MetadataEditor({ book, onUpdate, onTagsUpdate }: MetadataEditorProps) {
  const navigate = useNavigate();
  const searchBooks = useBookStore(state => state.searchBooks);

  /* State */
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(book.title || '');
  const [rating, setRating] = useState(book.rating || 0);
  const [favorite, setFavorite] = useState(book.favorite || false);

  // 複数項目
  const [series, setSeries] = useState<string[]>([]);
  const [author, setAuthor] = useState<string[]>([]);
  const [circle, setCircle] = useState<string[]>([]);
  const [originalWork, setOriginalWork] = useState<string[]>([]);
  const [characters, setCharacters] = useState<string[]>([]);

  const [tags, setTags] = useState<Tag[]>([]);
  const [newTag, setNewTag] = useState('');
  const [showTagInput, setShowTagInput] = useState(false);

  // フィールドごとの入力用
  const [fieldInputs, setFieldInputs] = useState<Record<string, string>>({});

  // オーバーレイの状態
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [overlayItems, setOverlayItems] = useState<string[]>([]);
  const [activeField, setActiveField] = useState<'series' | 'author' | 'circle' | 'original_work' | 'characters' | null>(null);

  // Web検索モーダルの状態
  const [showWebSearch, setShowWebSearch] = useState(false);

  /* Effects */
  useEffect(() => {
    setTitle(book.title || '');
    setRating(book.rating || 0);
    setFavorite(book.favorite || false);
    setSeries(parseMultiValue(book.series));
    setAuthor(parseMultiValue(book.author));
    setCircle(parseMultiValue(book.circle));
    setOriginalWork(parseMultiValue(book.original_work));
    setCharacters(parseMultiValue(book.characters));
    loadBookTags();
  }, [book]);

  // F2キーでの編集モード起動
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F2') {
        e.preventDefault();
        setIsEditing(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const loadBookTags = async () => {
    try {
      const bookTags = await window.electronAPI.tags.getBookTags(book.id);
      setTags(bookTags);
    } catch (error) {
      console.error('Failed to load tags:', error);
    }
  };

  /* Handlers */
  const handleSave = () => {
    const updates: any = {};
    if (title !== book.title) updates.title = title;
    if (rating !== book.rating) updates.rating = rating;

    // 配列の比較（空配列とnull/undefinedを同等に扱う）
    const compareArrays = (a: string[] | null | undefined, b: string[] | null | undefined) => {
      const arrA = Array.isArray(a) ? a : [];
      const arrB = Array.isArray(b) ? b : [];
      if (arrA.length !== arrB.length) return false;
      return JSON.stringify([...arrA].sort()) === JSON.stringify([...arrB].sort());
    };

    if (!compareArrays(series, book.series)) updates.series = series;
    if (!compareArrays(author, book.author)) updates.author = author;
    if (!compareArrays(circle, book.circle)) updates.circle = circle;
    if (!compareArrays(originalWork, book.original_work)) updates.original_work = originalWork;
    if (!compareArrays(characters, book.characters)) updates.characters = characters;

    if (Object.keys(updates).length > 0) {
      onUpdate(book.id, updates);
    }
    setIsEditing(false);
  };

  const handleWebApply = async (data: ScrapedBook) => {
    if (data.title) setTitle(data.title);
    if (data.author) setAuthor(prev => Array.from(new Set([...prev, ...parseMultiValue(data.author || '')])));
    if (data.circle) setCircle(prev => Array.from(new Set([...prev, ...parseMultiValue(data.circle || '')])));

    // タグの処理
    if (data.tags && data.tags.length > 0) {
      const currentTagNames = tags.map(t => t.name);
      const newTags = data.tags.filter(t => !currentTagNames.includes(t));

      if (newTags.length > 0) {
        const mergedTags = [...currentTagNames, ...newTags];
        await onTagsUpdate(book.id, mergedTags);
        await loadBookTags();
      }
    }

    setShowWebSearch(false);
  };

  const handleSearchLink = (field: keyof SearchFilter, value: string) => {
    if (!value) return;
    const filter: SearchFilter = { [field]: value };
    searchBooks(filter);
    navigate('/');
  };

  const openOverlay = async (field: 'series' | 'author' | 'circle' | 'original_work' | 'characters') => {
    setActiveField(field);
    try {
      const list = await window.electronAPI.books.getMetadataList(field);
      setOverlayItems(list);
      setIsOverlayOpen(true);
    } catch (e) {
      console.error(e);
    }
  };

  const handleOverlaySelect = (value: string) => {
    if (!activeField) return;

    const updateSet = (prev: string[]) => Array.from(new Set([...prev, value]));

    if (activeField === 'series') setSeries(updateSet);
    if (activeField === 'author') setAuthor(updateSet);
    if (activeField === 'circle') setCircle(updateSet);
    if (activeField === 'original_work') setOriginalWork(updateSet);
    if (activeField === 'characters') setCharacters(updateSet);

    setIsOverlayOpen(false);
  };

  const handleFavoriteToggle = () => {
    const nextFavorite = !favorite;
    setFavorite(nextFavorite);
    onUpdate(book.id, { favorite: nextFavorite });
  };

  const handleAddTag = async () => {
    if (!newTag.trim()) return;
    try {
      if (tags.some(t => t.name === newTag.trim())) {
        setNewTag('');
        return;
      }

      const currentTags = tags.map(t => t.name);
      const nextTags = [...currentTags, newTag.trim()];
      await onTagsUpdate(book.id, nextTags);
      await loadBookTags();
      setNewTag('');
    } catch (error) {
      console.error('タグ追加エラー', error);
    }
  };

  const handleRemoveTag = async (tagName: string) => {
    const nextTags = tags.filter(t => t.name !== tagName).map(t => t.name);
    await onTagsUpdate(book.id, nextTags);
    await loadBookTags();
  };


  /* Render Helpers */
  const renderStars = () => {
    return (
      <div className={styles.rating}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
          <span
            key={star}
            className={`${styles.star} ${star <= rating ? styles.filled : ''}`}
            onClick={() => isEditing && setRating(star)}
            style={{ cursor: isEditing ? 'pointer' : 'default' }}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const addItem = (field: string, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    const val = fieldInputs[field]?.trim();
    if (val) {
      setter(prev => Array.from(new Set([...prev, val])));
      setFieldInputs(prev => ({ ...prev, [field]: '' }));
    }
  };

  const removeItem = (val: string, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter(prev => prev.filter(v => v !== val));
  };

  const renderMultiFieldEditor = (
    label: string,
    values: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    field: 'series' | 'author' | 'circle' | 'original_work' | 'characters'
  ) => (
    <div className={styles.field}>
      <div className={styles.labelWithAction}>
        <label>{label}</label>
        <button
          className={styles.selectButton}
          onClick={() => openOverlay(field)}
        >
          選択
        </button>
      </div>
      <div className={styles.tags} style={{ marginBottom: '0.3rem' }}>
        {values.map((v, i) => (
          <span key={i} className={styles.tag}>
            {v}
            <button onClick={() => removeItem(v, setter)}>×</button>
          </span>
        ))}
      </div>
      <div className={styles.tagInput}>
        <input
          type="text"
          value={fieldInputs[field] || ''}
          onChange={(e) => setFieldInputs(prev => ({ ...prev, [field]: e.target.value }))}
          onKeyDown={(e) => {
            e.stopPropagation();
            if (e.key === 'Enter') addItem(field, setter);
          }}
          placeholder={`${label}を追加...`}
        />
        <button onClick={() => addItem(field, setter)}>追加</button>
      </div>
    </div>
  );

  const renderChipList = (label: string, field: keyof SearchFilter, values: string[]) => (
    <div className={styles.displayItem}>
      <label>{label}</label>
      {values.length > 0 ? (
        <div className={styles.displayTags}>
          {values.map((v, i) => (
            <span
              key={i}
              className={styles.displayTag}
              onClick={() => handleSearchLink(field, v)}
            >
              {v}
            </span>
          ))}
        </div>
      ) : <span className={styles.none}>-</span>}
    </div>
  );

  return (
    <div className={styles.panel}>
      {isEditing ? (
        <>
          <div className={styles.header}>
            <h2 className={styles.title}>メタデータ編集</h2>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                className={styles.editButton}
                onClick={() => setShowWebSearch(true)}
                style={{ backgroundColor: '#2d8f85' }}
              >
                Web取得
              </button>
              <button className={styles.editButton} onClick={handleSave}>保存</button>
            </div>
          </div>

          <div className={styles.field}>
            <label>タイトル</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.stopPropagation()}
            />
          </div>

          {renderMultiFieldEditor('シリーズ', series, setSeries, 'series')}
          {renderMultiFieldEditor('サークル', circle, setCircle, 'circle')}
          {renderMultiFieldEditor('作者', author, setAuthor, 'author')}
          {renderMultiFieldEditor('原作', originalWork, setOriginalWork, 'original_work')}
          {renderMultiFieldEditor('キャラクター', characters, setCharacters, 'characters')}

          <div className={styles.field}>
            <label>評価</label>
            {renderStars()}
          </div>

          <div className={styles.field}>
            <label>タグ</label>
            <div className={styles.tags}>
              {tags.map((tag) => (
                <span key={tag.id} className={styles.tag}>
                  {tag.name}
                  <button onClick={() => handleRemoveTag(tag.name)}>×</button>
                </span>
              ))}
            </div>
            {showTagInput ? (
              <div className={styles.tagInput}>
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="タグを入力..."
                  autoFocus
                  onBlur={() => !newTag && setShowTagInput(false)}
                  onKeyDown={(e) => {
                    e.stopPropagation();
                    if (e.key === 'Enter') {
                      handleAddTag();
                    }
                  }}
                />
                <button onClick={handleAddTag}>追加</button>
              </div>
            ) : (
              <button
                className={styles.selectButton}
                onClick={() => setShowTagInput(true)}
                style={{ marginTop: '0.2rem' }}
              >
                + タグを追加
              </button>
            )}
          </div>

          <button className={styles.saveButton} onClick={handleSave}>
            保存して終了
          </button>
        </>
      ) : (
        /* 表示モード */
        <>
          <div className={styles.header}>
            <h2 className={styles.title}>情報</h2>
            <button className={styles.editButton} onClick={() => setIsEditing(true)}>編集</button>
          </div>

          <div className={styles.displayMode}>
            <div className={styles.titleRow}>
              <div className={styles.displayTitle}>{title || 'タイトル未設定'}</div>
              <button
                className={`${styles.favoriteButton} ${favorite ? styles.active : ''}`}
                onClick={handleFavoriteToggle}
                title={favorite ? 'お気に入り解除' : 'お気に入りに追加'}
              >
                {favorite ? '❤️' : '🤍'}
              </button>
            </div>

            <div className={styles.readCount}>
              読書回数: <span>{book.read_count}</span> 回
            </div>

            {renderChipList('シリーズ', 'series', series)}
            {renderChipList('サークル', 'circle', circle)}
            {renderChipList('作者', 'author', author)}
            {renderChipList('原作', 'original_work', originalWork)}
            {renderChipList('キャラクター', 'characters', characters)}

            <div className={styles.displayItem}>
              <label>評価</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className={styles.displayRating}>{'★'.repeat(Math.min(10, Math.max(0, rating || 0)))}{'☆'.repeat(Math.max(0, 10 - Math.min(10, Math.max(0, rating || 0))))}</span>
              </div>
            </div>

            <div className={styles.displayItem}>
              <label>タグ</label>
              {tags.length > 0 ? (
                <div className={styles.displayTags}>
                  {tags.map(tag => (
                    <span
                      key={tag.id}
                      className={styles.displayTag}
                      onClick={() => {
                        const filter: SearchFilter = { tags: [tag.name] };
                        searchBooks(filter);
                        navigate('/');
                      }}
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              ) : <span className={styles.none}>-</span>}
            </div>
          </div>
        </>
      )}

      {isOverlayOpen && (
        <SelectionOverlay
          title={
            activeField === 'series' ? 'シリーズを選択' :
              activeField === 'author' ? '作者を選択' :
                activeField === 'circle' ? 'サークルを選択' :
                  activeField === 'original_work' ? '原作を選択' :
                    activeField === 'characters' ? 'キャラクターを選択' : '選択'
          }
          items={overlayItems}
          isOpen={true}
          onClose={() => setIsOverlayOpen(false)}
          onSelect={handleOverlaySelect}
        />
      )}

      {showWebSearch && (
        <WebSearchModal
          initialQuery={title}
          onClose={() => setShowWebSearch(false)}
          onApply={handleWebApply}
        />
      )}
    </div>
  );
}

