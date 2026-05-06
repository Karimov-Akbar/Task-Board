import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useTasksStore } from '@/features/tasks/model/tasksStore';
import { TaskCard } from '@/features/tasks/ui/TaskCard/TaskCard';
import { TaskFilters } from '@/features/tasks/ui/TaskFilters/TaskFilters';
import styles from './TasksPage.module.css';

type ViewMode = 'board' | 'list';

const STATUS_COLUMNS = [
  { key: 'TODO', label: 'К выполнению', color: '#bbb' },
  { key: 'IN_PROGRESS', label: 'В работе', color: '#4a90d9' },
  { key: 'DONE', label: 'Готово', color: '#4cd964' },
];

const TasksPage = () => {
  const { tasks, total, page, pageSize, isLoading, error, fetchTasks, setPage } =
    useTasksStore();
  const [viewMode, setViewMode] = useState<ViewMode>('board');

  useEffect(() => {
    fetchTasks();
  }, []);

  const totalPages = Math.ceil(total / pageSize);

  const groupedByStatus = STATUS_COLUMNS.map((col) => ({
    ...col,
    tasks: tasks.filter((t) => t.status === col.key),
  }));

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <h1>Задачи</h1>
        <div className={styles.viewToggle}>
          <button
            className={`${styles.toggleBtn} ${viewMode === 'board' ? styles.active : ''}`}
            onClick={() => setViewMode('board')}
            title="Kanban"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
              <rect x="1" y="1" width="7" height="7" rx="1.5"/>
              <rect x="10" y="1" width="7" height="7" rx="1.5"/>
              <rect x="1" y="10" width="7" height="7" rx="1.5"/>
              <rect x="10" y="10" width="7" height="7" rx="1.5"/>
            </svg>
          </button>
          <button
            className={`${styles.toggleBtn} ${viewMode === 'list' ? styles.active : ''}`}
            onClick={() => setViewMode('list')}
            title="Список"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
              <rect x="1" y="2" width="16" height="3" rx="1"/>
              <rect x="1" y="7.5" width="16" height="3" rx="1"/>
              <rect x="1" y="13" width="16" height="3" rx="1"/>
            </svg>
          </button>
        </div>
      </div>

      <TaskFilters />

      {isLoading && tasks.length === 0 && (
        <div className={styles.center}>Загрузка...</div>
      )}

      {error && (
        <div className={styles.error}>
          <p>{error}</p>
          <button onClick={fetchTasks}>Повторить</button>
        </div>
      )}

      {!isLoading && !error && tasks.length === 0 && (
        <div className={styles.center}>Задач пока нет</div>
      )}

      {viewMode === 'board' && tasks.length > 0 && (
        <div className={styles.board}>
          {groupedByStatus.map((col) => (
            <div key={col.key} className={styles.column}>
              <div className={styles.columnHeader}>
                <span className={styles.columnDot} style={{ background: col.color }} />
                <span className={styles.columnTitle}>{col.label}</span>
                <span className={styles.columnCount}>{col.tasks.length}</span>
              </div>
              <div className={styles.columnCards}>
                {col.tasks.map((task) => (
                  <TaskCard key={task.id} task={task} view="board" />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {viewMode === 'list' && tasks.length > 0 && (
        <div className={styles.list}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} view="list" />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button disabled={page <= 1} onClick={() => setPage(page - 1)}>
            ← Назад
          </button>
          <span>{page} / {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
            Вперёд →
          </button>
        </div>
      )}

      <Outlet />
    </div>
  );
};

export default TasksPage;
