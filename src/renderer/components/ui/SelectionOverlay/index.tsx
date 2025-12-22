/**
 * 選択用オーバーレイコンポーネント
 */
import { useState, useEffect, useRef } from 'react';
import styles from './SelectionOverlay.module.css';

interface SelectionOverlayProps {
  title: string;
  items: string[];
  isOpen: boolean;
  onClose: () => void;
  onSelect: (item: string) => void;
}

export default function SelectionOverlay({
  title,
  items,
  isOpen,
  onClose,
  onSelect,
}: SelectionOverlayProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredItems = items.filter(item =>
    item.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.container} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3>{title}</h3>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        <div className={styles.search}>
          <input
            ref={inputRef}
            type="text"
            placeholder="絞り込み..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className={styles.list}>
          {filteredItems.length === 0 ? (
            <p className={styles.empty}>一致する項目がありません</p>
          ) : (
            filteredItems.map((item, index) => (
              <div
                key={index}
                className={styles.item}
                onClick={() => {
                  onSelect(item);
                  onClose();
                }}
              >
                {item}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
