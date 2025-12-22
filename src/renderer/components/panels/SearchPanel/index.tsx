import { useState, useEffect } from 'react';
import { useBookStore } from '@/renderer/store/useBookStore';
import type { SearchFilter } from '@/types';
import SelectionOverlay from '@/renderer/components/ui/SelectionOverlay';
import styles from './SearchPanel.module.css';

interface SearchPanelProps {
  onSearch: (filter: SearchFilter) => void;
  onClear: () => void;
}

export default function SearchPanel({ onSearch, onClear }: SearchPanelProps) {
  const [query, setQuery] = useState('');
  const [series, setSeries] = useState('');
  const [author, setAuthor] = useState('');
  const [originalWork, setOriginalWork] = useState('');
  const [characters, setCharacters] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [rating, setRating] = useState<number | undefined>();
  const [favorite, setFavorite] = useState<boolean | undefined>();

  const storeSearchFilter = useBookStore((state: any) => state.searchFilter);

  // ストアの検索フィルターが変更されたら内部状態を同期する
  useEffect(() => {
    if (storeSearchFilter) {
      setQuery(storeSearchFilter.query || '');
      setSeries(storeSearchFilter.series || '');
      setAuthor(storeSearchFilter.author || '');
      setOriginalWork(storeSearchFilter.original_work || '');
      setCharacters(storeSearchFilter.characters || '');
      setTags(storeSearchFilter.tags || []);
      setRating(storeSearchFilter.rating);
      setFavorite(storeSearchFilter.favorite);
    }
  }, [storeSearchFilter]);

  // 選択オーバーレイ用の状態
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [overlayTitle, setOverlayTitle] = useState('');
  const [overlayItems, setOverlayItems] = useState<string[]>([]);
  const [activeField, setActiveField] = useState<'series' | 'author' | 'original_work' | 'characters' | 'tags' | null>(null);

  const handleSearch = () => {
    const filter: SearchFilter = {
      query: query || undefined,
      series: series || undefined,
      author: author || undefined,
      original_work: originalWork || undefined,
      characters: characters || undefined,
      tags: tags.length > 0 ? tags : undefined,
      rating,
      favorite,
    };
    onSearch(filter);
  };

  const handleClear = () => {
    setQuery('');
    setSeries('');
    setAuthor('');
    setOriginalWork('');
    setCharacters('');
    setTags([]);
    setTagInput('');
    setRating(undefined);
    setFavorite(undefined);
    onClear();
  };

  const openSelection = async (field: 'series' | 'author' | 'original_work' | 'characters' | 'tags', titleStr: string) => {
    try {
      let items: string[] = [];
      if (field === 'tags') {
        const allTags = await window.electronAPI.tags.getAll();
        items = allTags.map(t => t.name);
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

  const handleSelect = (value: string) => {
    if (activeField === 'series') setSeries(value);
    if (activeField === 'author') setAuthor(value);
    if (activeField === 'original_work') setOriginalWork(value);
    if (activeField === 'characters') setCharacters(value);
    if (activeField === 'tags') {
      if (!tags.includes(value)) {
        setTags([...tags, value]);
      }
    }
  };

  const handleAddTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  return (
    <div className={styles.panel}>
      <h3 className={styles.title}>検索</h3>

      <div className={styles.field}>
        <label>キーワード</label>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="タイトル、作者、サークル..."
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
      </div>

      <div className={styles.field}>
        <div className={styles.labelWithAction}>
          <label>シリーズ</label>
          <button className={styles.selectButton} onClick={() => openSelection('series', 'シリーズを選択')}>選択</button>
        </div>
        <input
          type="text"
          value={series}
          onChange={(e) => setSeries(e.target.value)}
        />
      </div>

      <div className={styles.field}>
        <div className={styles.labelWithAction}>
          <label>作者</label>
          <button className={styles.selectButton} onClick={() => openSelection('author', '作者を選択')}>選択</button>
        </div>
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
      </div>

      <div className={styles.field}>
        <div className={styles.labelWithAction}>
          <label>原作</label>
          <button className={styles.selectButton} onClick={() => openSelection('original_work', '原作を選択')}>選択</button>
        </div>
        <input
          type="text"
          value={originalWork}
          onChange={(e) => setOriginalWork(e.target.value)}
        />
      </div>

      <div className={styles.field}>
        <div className={styles.labelWithAction}>
          <label>キャラクター</label>
          <button className={styles.selectButton} onClick={() => openSelection('characters', 'キャラクターを選択')}>選択</button>
        </div>
        <input
          type="text"
          value={characters}
          onChange={(e) => setCharacters(e.target.value)}
        />
      </div>

      <div className={styles.field}>
        <div className={styles.labelWithAction}>
          <label>タグ（すべて含む）</label>
          <button className={styles.selectButton} onClick={() => openSelection('tags', 'タグを選択')}>選択</button>
        </div>
        <div className={styles.tagChips}>
          {tags.map(tag => (
            <span key={tag} className={styles.tagChip}>
              {tag}
              <button onClick={() => handleRemoveTag(tag)}>×</button>
            </span>
          ))}
        </div>
        <input
          type="text"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
          placeholder="タグを追加してEnter"
        />
      </div>

      <div className={styles.field}>
        <label>評価</label>
        <select
          value={rating ?? ''}
          onChange={(e) => setRating(e.target.value !== '' ? Number(e.target.value) : undefined)}
        >
          <option value="">すべて</option>
          <option value="0">未設定（★0）</option>
          <option value="5">★★★★★</option>
          <option value="4">★★★★☆ 以上</option>
          <option value="3">★★★☆☆ 以上</option>
          <option value="2">★★☆☆☆ 以上</option>
          <option value="1">★☆☆☆☆ 以上</option>
        </select>
      </div>

      <div className={styles.field}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={favorite ?? false}
            onChange={(e) => setFavorite(e.target.checked || undefined)}
          />
          お気に入りのみ
        </label>
      </div>

      <div className={styles.buttons}>
        <button onClick={handleSearch} className={styles.searchButton}>
          検索
        </button>
        <button onClick={handleClear} className={styles.clearButton}>
          クリア
        </button>
      </div>

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
