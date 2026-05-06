import { Link } from 'react-router-dom';
import type { Task } from '@/shared/types';
import styles from './TaskCard.module.css';

interface TaskCardProps {
  task: Task;
  view?: 'board' | 'list';
}

const PRIORITY_LABELS: Record<string, string> = {
  LOW: 'Низкий',
  MEDIUM: 'Средний',
  HIGH: 'Высокий',
};

const STATUS_COLORS: Record<string, string> = {
  TODO: '#bbb',
  IN_PROGRESS: '#4a90d9',
  DONE: '#4cd964',
};

export const TaskCard = ({ task, view = 'list' }: TaskCardProps) => {
  const dotColor = STATUS_COLORS[task.status] ?? '#bbb';
  const priorityKey = task.priority.toLowerCase();

  if (view === 'board') {
    return (
      <Link to={`/tasks/${task.id}`} className={styles.card}>
        <h3 className={styles.cardTitle}>{task.title}</h3>
        {task.description && (
          <p className={styles.cardDesc}>{task.description}</p>
        )}
        <span className={`${styles.priority} ${styles[priorityKey]}`}>
          {PRIORITY_LABELS[task.priority]}
        </span>
      </Link>
    );
  }

  return (
    <Link to={`/tasks/${task.id}`} className={styles.row}>
      <span className={styles.rowDot} style={{ background: dotColor }} />
      <div className={styles.rowContent}>
        <h3 className={styles.rowTitle}>{task.title}</h3>
        {task.description && (
          <p className={styles.rowDesc}>{task.description}</p>
        )}
      </div>
      <span className={`${styles.priority} ${styles[priorityKey]}`}>
        {PRIORITY_LABELS[task.priority]}
      </span>
    </Link>
  );
};