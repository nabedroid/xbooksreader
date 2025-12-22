/**
 * ナビゲーションバーコンポーネント
 */
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Navbar.module.css';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.brand}>xBooksReader</div>
      <div className={styles.links}>
        <button
          className={`${styles.link} ${isActive('/') ? styles.active : ''}`}
          onClick={() => navigate('/')}
        >
          本棚
        </button>
        <button
          className={`${styles.link} ${isActive('/settings') ? styles.active : ''}`}
          onClick={() => navigate('/settings')}
        >
          設定
        </button>
      </div>
    </nav>
  );
}
