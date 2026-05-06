import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TaskStatus, TaskPriority, TaskVisibility } from '@/shared/types';
import styles from './TaskForm.module.css';

const taskSchema = z.object({
  title: z.string().min(1, 'Обязательное поле').max(500, 'Максимум 500 символов'),
  description: z.string().max(5000).default(''),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  visibility: z.enum(['ONLY_ME', 'LIST', 'ANYONE']),
  viewerUserIds: z.array(z.string()).default([]),
});

export type TaskFormData = z.infer<typeof taskSchema>;

const STATUS_OPTIONS: Record<string, string> = {
  TODO: 'К выполнению',
  IN_PROGRESS: 'В работе',
  DONE: 'Готово',
};

const PRIORITY_OPTIONS: Record<string, string> = {
  LOW: 'Низкий',
  MEDIUM: 'Средний',
  HIGH: 'Высокий',
};

interface TaskFormProps {
  defaultValues?: Partial<TaskFormData>;
  onSubmit: (data: TaskFormData) => Promise<void>;
  submitLabel: string;
  onCancel?: () => void;
  serverError?: string | null;
}

export const TaskForm = ({
  defaultValues,
  onSubmit,
  submitLabel,
  onCancel,
  serverError,
}: TaskFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'TODO',
      priority: 'MEDIUM',
      visibility: 'ANYONE',
      viewerUserIds: [],
      ...defaultValues,
    },
  });

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.field}>
        <label>Название</label>
        <input placeholder="Название задачи" {...register('title')} />
        {errors.title && <span className={styles.error}>{errors.title.message}</span>}
      </div>

      <div className={styles.field}>
        <label>Описание</label>
        <textarea rows={4} placeholder="Описание задачи" {...register('description')} />
        {errors.description && <span className={styles.error}>{errors.description.message}</span>}
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label>Приоритет</label>
          <select {...register('priority')}>
            {Object.entries(PRIORITY_OPTIONS).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label>Статус</label>
          <select {...register('status')}>
            {Object.entries(STATUS_OPTIONS).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {serverError && <div className={styles.serverError}>{serverError}</div>}

      <div className={styles.buttons}>
        {onCancel && (
          <button type="button" className={styles.cancelBtn} onClick={onCancel}>
            Отмена
          </button>
        )}
        <button
          type="submit"
          className={styles.submitBtn}
          disabled={isSubmitting}
          style={!onCancel ? { gridColumn: '1 / -1' } : undefined}
        >
          {isSubmitting ? 'Сохранение...' : submitLabel}
        </button>
      </div>
    </form>
  );
};
