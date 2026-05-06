import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TaskForm, type TaskFormData } from '@/features/tasks/ui/TaskForm/TaskForm';
import { tasksApi } from '@/features/tasks/api/tasksApi';
import { useTasksStore } from '@/features/tasks/model/tasksStore';
import { getApiErrorMessage } from '@/shared/api/axiosInstance';
import styles from './TaskCreatePage.module.css';

const TaskCreatePage = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const handleCreate = async (data: TaskFormData) => {
    try {
      setServerError(null);
      await tasksApi.create({
        title: data.title,
        description: data.description || undefined,
        status: data.status,
        priority: data.priority,
        visibility: data.visibility,
        viewerUserIds: data.viewerUserIds ?? [],
      });
      useTasksStore.getState().fetchTasks();
      navigate('/tasks');
    } catch (e) {
      setServerError(getApiErrorMessage(e));
    }
  };

  return (
    <div className={styles.overlay} onClick={() => navigate('/tasks')}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Новая задача</h2>
          <button className={styles.closeBtn} onClick={() => navigate('/tasks')}>✕</button>
        </div>
        <TaskForm
          onSubmit={handleCreate}
          submitLabel="Создать"
          onCancel={() => navigate('/tasks')}
          serverError={serverError}
        />
      </div>
    </div>
  );
};

export default TaskCreatePage;