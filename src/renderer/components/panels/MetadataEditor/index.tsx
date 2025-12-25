import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBookStore } from '@/renderer/store/useBookStore';
import type { Book } from '@/types';
import styles from './MetadataEditor.module.css';
import SelectionOverlay from '@/renderer/components/ui/SelectionOverlay';

interface MetadataEditorProps {
  book: Book;
  onUpdate: (updates: Partial<Book>) => void;
}

export default function MetadataEditor({ book, onUpdate }: MetadataEditorProps) {
  const navigate = useNavigate();
  const searchBooks = useBookStore(state => state.searchBooks);

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(book.title || '');
  const [series, setSeries] = useState<string[]>([]);
  const [author, setAuthor] = useState<string[]>([]);
  const [circle, setCircle] = useState<string[]>([]);
  const [originalWork, setOriginalWork] = useState<string[]>([]);
  const [characters, setCharacters] = useState<string[]>([]);
  const [rating, setRating] = useState(book.rating);
  const [favorite, setFavorite] = useState(book.favorite);
  const [tags, setTags] = useState<string[]>([]);
  const [newValues, setNewValues] = useState<{ [key: string]: string }>({
    series: '',
    author: '',
    circle: '',
    original_work: '',
    characters: '',
    tags: ''
  });

  // 選択オーバーレイ用の状態
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [overlayTitle, setOverlayTitle] = useState('');
  const [overlayItems, setOverlayItems] = useState<string[]>([]);
  const [activeField, setActiveField] = useState<'series' | 'author' | 'circle' | 'original_work' | 'characters' | 'tags' | null>(null);

  useEffect(() => {
    setTitle(book.title || '');
    setSeries(book.series ? book.series.split(',').map(s => s.trim()) : []);
    setAuthor(book.author ? book.author.split(',').map(s => s.trim()) : []);
    setCircle(book.circle ? book.circle.split(',').map(s => s.trim()) : []);
    setOriginalWork(book.original_work ? book.original_work.split(',').map(s => s.trim()) : []);
    setCharacters(book.characters ? book.characters.split(',').map(s => s.trim()) : []);
    setRating(book.rating);
    setFavorite(book.favorite);
    loadTags();
  }, [book.id]);

  const loadTags = async () => {
    try {
      const bookTags = await window.electronAPI.tags.getBookTags(book.id);
      setTags(bookTags.map(t => t.name));
    } catch (error) {
      console.error('タグ読み込みエラー:', error);
    }
  };

  const handleSave = () => {
    onUpdate({
      title,
      series: series.join(','),
      author: author.join(','),
      circle: circle.join(','),
      original_work: originalWork.join(','),
      characters: characters.join(','),
      rating,
      favorite,
    } as any);

    // タグを更新
    window.electronAPI.tags.setBookTags(book.id, tags);
    setIsEditing(false);
  };

  const handleSearchLink = (field: string, value: string) => {
    if (!value) return;
    const filter = { [field]: value };
    searchBooks(filter);
    navigate('/');
  };

  const openSelection = async (field: 'series' | 'author' | 'circle' | 'original_work' | 'characters' | 'tags', titleStr: string) => {
    try {
      let items: string[] = [];
      if (field === 'tags') {
        const allTags = await window.electronAPI.tags.getAll();
        items = allTags.map((t: any) => t.name);
      } else {
        items = await window.electronAPI.books.getMetadataList(field);
      }
      setOverlayTitle(titleStr);
      setOverlayItems(items);
      setActiveField(field);
      setIsOverlayOpen(true);
    } catch (error) {
      console.error('リスト取得エラー:', error);
    }
  };

  const addValue = (field: keyof typeof newValues, value: string) => {
    const val = value || newValues[field];
    if (!val) return;

    if (field === 'series') !series.includes(val) && setSeries([...series, val]);
    if (field === 'author') !author.includes(val) && setAuthor([...author, val]);
    if (field === 'circle') !circle.includes(val) && setCircle([...circle, val]);
    if (field === 'original_work') !originalWork.includes(val) && setOriginalWork([...originalWork, val]);
    if (field === 'characters') !characters.includes(val) && setCharacters([...characters, val]);
    if (field === 'tags') !tags.includes(val) && setTags([...tags, val]);

    setNewValues({ ...newValues, [field]: '' });
  };

  const removeValue = (field: string, value: string) => {
    if (field === 'series') setSeries(series.filter(v => v !== value));
    if (field === 'author') setAuthor(author.filter(v => v !== value));
    if (field === 'circle') setCircle(circle.filter(v => v !== value));
    if (field === 'original_work') setOriginalWork(originalWork.filter(v => v !== value));
    if (field === 'characters') setCharacters(characters.filter(v => v !== value));
    if (field === 'tags') setTags(tags.filter(v => v !== value));
  };

  const handleSelect = (value: string) => {
    if (activeField) {
      addValue(activeField as any, value);
    }
  };

  const renderStars = () => {
    return Array.from({ length: 10 }, (_, i) => (
      <span
        key={i}
        className={`${styles.star} ${i < rating ? styles.filled : ''}`}
        onClick={() => setRating(i + 1)}
      >
        ★
      </span>
    ));
  };

  const renderFieldEditor = (label: string, field: 'series' | 'author' | 'circle' | 'original_work' | 'characters', values: string[]) => {
    return (
      <div className={styles.field}>
        <div className={styles.labelWithAction}>
          <label>{label}</label>
          <button className={styles.selectButton} onClick={() => openSelection(field, `${label}を選択`)}>選択</button>
        </div>
        <div className={styles.tags}>
          {values.map(val => (
            <span key={val} className={styles.tag}>
              {val}
              <button onClick={() => removeValue(field, val)}>×</button>
            </span>
          ))}
        </div>
        <div className={styles.tagInput}>
          <input
            type="text"
            value={newValues[field]}
            onChange={(e) => setNewValues({ ...newValues, [field]: e.target.value })}
            onKeyDown={(e) => e.key === 'Enter' && addValue(field, '')}
            placeholder={`${label}を追加`}
          />
          <button onClick={() => addValue(field, '')}>追加</button>
        </div>
      </div>
    );
  };

  const renderDisplayItems = (label: string, field: string, values: string[]) => {
    return (
      <div className={styles.displayItem}>
        <label>{label}</label>
        <div className={styles.displayTags}>
          {values.length > 0 ? values.map((val: string) => (
            <span
              key={val}
              className={`${styles.displayTag} ${styles.link}`}
              onClick={() => handleSearchLink(field, val)}
            >
              {val}
            </span>
          )) : <span className={styles.none}>-</span>}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h3 className={styles.title}>メタデータ</h3>
        <button
          className={styles.editButton}
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
        >
          {isEditing ? '保存' : '編集'}
        </button>
      </div>

      <div className={styles.readCount}>
        閲覧回数: <span>{book.read_count || 0}</span> 回
      </div>

      {isEditing ? (
        <>
          <div className={styles.field}>
            <label>タイトル</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {renderFieldEditor('シリーズ', 'series', series)}
          {renderFieldEditor('作者', 'author', author)}
          {renderFieldEditor('サークル', 'circle', circle)}
          {renderFieldEditor('原作', 'original_work', originalWork)}
          {renderFieldEditor('キャラクター', 'characters', characters)}

          <div className={styles.field}>
            <label>評価</label>
            <div className={styles.rating}>
              {renderStars()}
            </div>
          </div>

          <div className={styles.field}>
            <label>
              <input
                type="checkbox"
                checked={favorite}
                onChange={(e) => setFavorite(e.target.checked)}
              />
              お気に入り
            </label>
          </div>

          <div className={styles.field}>
            <div className={styles.labelWithAction}>
              <label>タグ</label>
              <button className={styles.selectButton} onClick={() => openSelection('tags', 'タグを選択')}>選択</button>
            </div>
            <div className={styles.tags}>
              {tags.map(tag => (
                <span key={tag} className={styles.tag}>
                  {tag}
                  <button onClick={() => removeValue('tags', tag)}>×</button>
                </span>
              ))}
            </div>
            <div className={styles.tagInput}>
              <input
                type="text"
                value={newValues.tags}
                onChange={(e) => setNewValues({ ...newValues, tags: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && addValue('tags', '')}
                placeholder="新しいタグ"
              />
              <button onClick={() => addValue('tags', '')}>追加</button>
            </div>
          </div>
        </>
      ) : (
        <div className={styles.displayMode}>
          <h4 className={styles.displayTitle}>{title}</h4>

          {renderDisplayItems('シリーズ', 'series', series)}
          {renderDisplayItems('作者', 'author', author)}
          {renderDisplayItems('サークル', 'circle', circle)}
          {renderDisplayItems('原作', 'original_work', originalWork)}
          {renderDisplayItems('キャラクター', 'characters', characters)}

          <div className={styles.displayItem}>
            <label>評価</label>
            <div className={styles.displayRating}>
              {'★'.repeat(rating || 0)}{'☆'.repeat(5 - (rating || 0))}
            </div>
          </div>

          <div className={styles.displayItem}>
            <label>タグ</label>
            <div className={styles.displayTags}>
              {tags.length > 0 ? tags.map((tag: string) => (
                <span
                  key={tag}
                  className={styles.displayTag}
                  onClick={() => handleSearchLink('tags', tag)}
                >
                  {tag}
                </span>
              )) : <span className={styles.none}>-</span>}
            </div>
          </div>
        </div>
      )}

      <SelectionOverlay
        isOpen={isOverlayOpen}
        title={overlayTitle}
        items={overlayItems}
        onClose={() => setIsOverlayOpen(false)}
        onSelect={handleSelect}
      />
    </div>
  );
}
