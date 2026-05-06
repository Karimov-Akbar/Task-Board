import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tasksApi } from '@/features/tasks/api/tasksApi';
import { useAuthStore } from '@/features/auth/model/authStore';
import { useTasksStore } from '@/features/tasks/model/tasksStore';
import { TaskForm, type TaskFormData } from '@/features/tasks/ui/TaskForm/TaskForm';
import { getApiErrorMessage } from '@/shared/api/axiosInstance';
import type { Task, ReplaceTaskRequest } from '@/shared/types';
import styles from './TaskDetailPage.module.css';

const PRIORITY_LABELS: Record<string, string> = {
  LOW: 'Низкий',
  MEDIUM: 'Средний',
  HIGH: 'Высокий',
};

const STATUS_LABELS: Record<string, string> = {
  TODO: 'К выполнению',
  IN_PROGRESS: 'В работе',
  DONE: 'Готово',
};

const TaskDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const loadTask = async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      setError(null);
      const res = await tasksApi.getById(id);
      setTask(res.data);
    } catch (e) {
      setError(getApiErrorMessage(e));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadTask(); }, [id]);

  const canEdit = task && user &&
    (task.creator.id === user.id || user.role === 'ADMIN');

  const handleUpdate = async (data: TaskFormData) => {
    if (!id) return;
    try {
      setSubmitError(null);
      const body: ReplaceTaskRequest = {
        title: data.title,
        description: data.description || '',
        status: data.status,
        priority: data.priority,
        visibility: data.visibility,
        viewerUserIds: data.viewerUserIds ?? [],
      };
      const res = await tasksApi.update(id, body);
      setTask(res.data);
      setIsEditing(false);
      useTasksStore.getState().fetchTasks();
    } catch (e) {
      setSubmitError(getApiErrorMessage(e));
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      await tasksApi.delete(id);
      useTasksStore.getState().fetchTasks();
      navigate('/tasks');
    } catch (e) {
      alert(getApiErrorMessage(e));
    }
  };

  const close = () => navigate('/tasks');

  const priorityClass = task
    ? task.priority === 'HIGH' ? styles.badgeHigh
      : task.priority === 'MEDIUM' ? styles.badgeMedium
      : styles.badgeLow
    : '';

  if (isLoading) {
    return (
      <div className={styles.overlay}>
        <div className={styles.modal}>Загрузка...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.overlay}>
        <div className={styles.modal}>
          <p>{error}</p>
          <button onClick={loadTask}>Повторить</button>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className={styles.overlay}>
        <div className={styles.modal}>Задача не найдена</div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className={styles.overlay} onClick={close}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          <div className={styles.modalHeader}>
            <h2 className={styles.modalTitle}>Редактировать задачу</h2>
            <button className={styles.closeBtn} onClick={() => setIsEditing(false)}>✕</button>
          </div>
          <TaskForm
            defaultValues={{
              title: task.title,
              description: task.description ?? '',
              status: task.status,
              priority: task.priority,
              visibility: task.visibility,
              viewerUserIds: task.viewerUserIds,
            }}
            onSubmit={handleUpdate}
            submitLabel="Сохранить"
            onCancel={() => setIsEditing(false)}
            serverError={submitError}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.overlay} onClick={close}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{task.title}</h2>
          <button className={styles.closeBtn} onClick={close}>✕</button>
        </div>

        <div className={styles.badges}>
          <span className={styles.badge}>{STATUS_LABELS[task.status] ?? task.status}</span>
          <span className={`${styles.badge} ${priorityClass}`}>
            {PRIORITY_LABELS[task.priority] ?? task.priority}
          </span>
        </div>

        <p className={styles.detailDescription}>
          {task.description || 'Нет описания'}
        </p>

        <div className={styles.dates}>
          <span>Создано: {new Date(task.createdAt).toLocaleDateString('ru')}</span>
          <span>Обновлено: {new Date(task.updatedAt).toLocaleDateString('ru')}</span>
        </div>

        {canEdit && !showDeleteConfirm && (
          <div className={styles.actions}>
            <button className={styles.editBtn} onClick={() => setIsEditing(true)}>
              Редактировать
            </button>
            <button className={styles.deleteBtn} onClick={() => setShowDeleteConfirm(true)}>
              Удалить
            </button>
          </div>
        )}

        {showDeleteConfirm && (
          <div className={styles.confirmDelete}>
            <p className={styles.confirmText}>Вы уверены, что хотите удалить эту задачу?</p>
            <div className={styles.confirmActions}>
              <button className={styles.confirmCancelBtn} onClick={() => setShowDeleteConfirm(false)}>
                Отмена
              </button>
              <button className={styles.confirmDeleteBtn} onClick={handleDelete}>
                Удалить
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskDetailPage;