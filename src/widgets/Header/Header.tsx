import { useAuthStore } from '@/features/auth/model/authStore';
import { useNavigate } from 'react-router-dom';
import styles from './Header.module.css';

export const Header = () => {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className={styles.header}>
      <h2 className={styles.logo}>Task Board</h2>

      <div className={styles.right}>
        <button className={styles.newTaskBtn} onClick={() => navigate('/tasks/new')}>
          + Новая задача
        </button>

        <div className={styles.userInfo}>
          <span>{user?.nickname}</span>
          <button className={styles.logoutBtn} onClick={handleLogout} title="Выйти">
            →
          </button>
        </div>
      </div>
    </header>
  );
};
