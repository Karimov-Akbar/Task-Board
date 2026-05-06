import { useState, useEffect } from 'react';
import { useTasksStore } from '@/features/tasks/model/tasksStore';
import styles from './TaskFilters.module.css';

const STATUS_OPTIONS = [
  { value: '', label: 'Все статусы' },
  { value: 'TODO', label: 'К выполнению' },
  { value: 'IN_PROGRESS', label: 'В работе' },
  { value: 'DONE', label: 'Готово' },
];

const PRIORITY_OPTIONS = [
  { value: '', label: 'Все приоритеты' },
  { value: 'LOW', label: 'Низкий' },
  { value: 'MEDIUM', label: 'Средний' },
  { value: 'HIGH', label: 'Высокий' },
];

const SORT_OPTIONS = [
  { value: 'updatedAt', label: 'По обновлению' },
  { value: 'createdAt', label: 'По созданию' },
  { value: 'title', label: 'По названию' },
];

export const TaskFilters = () => {
  const { filters, setFilters, resetFilters } = useTasksStore();
  const [search, setSearch] = useState(filters.q ?? '');

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters({ q: search || undefined });
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className={styles.filters}>
      <input
        type="text"
        placeholder="Поиск..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={styles.search}
      />

      <select
        value={filters.status?.[0] ?? ''}
        onChange={(e) =>
          setFilters({
            status: e.target.value ? [e.target.value] : undefined,
          })
        }
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>

      <select
        value={filters.priority?.[0] ?? ''}
        onChange={(e) =>
          setFilters({
            priority: e.target.value ? [e.target.value] : undefined,
          })
        }
      >
        {PRIORITY_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>

      <select
        value={filters.sort ?? 'updatedAt'}
        onChange={(e) => setFilters({ sort: e.target.value as any })}
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>

      <button onClick={resetFilters}>Сбросить</button>
    </div>
  );
};
