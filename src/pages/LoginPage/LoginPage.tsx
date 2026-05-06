import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/model/authStore';
import { loginSchema, type LoginFormData } from '@/features/auth/model/authSchemas';
import { getApiErrorMessage } from '@/shared/api/axiosInstance';
import styles from './LoginPage.module.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setServerError(null);
      await login(data);
      navigate('/tasks');
    } catch (error) {
      setServerError(getApiErrorMessage(error));
    }
  };

  return (
    <div className={styles.page}>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <h1>Вход</h1>

        <div className={styles.field}>
          <label htmlFor="nickname">Nickname</label>
          <input id="nickname" {...register('nickname')} />
          {errors.nickname && (
            <span className={styles.error}>{errors.nickname.message}</span>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="password">Пароль</label>
          <input id="password" type="password" {...register('password')} />
          {errors.password && (
            <span className={styles.error}>{errors.password.message}</span>
          )}
        </div>

        {serverError && (
          <div className={styles.serverError}>{serverError}</div>
        )}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Вход...' : 'Войти'}
        </button>

        <p>
          Нет аккаунта? <Link to="/register">Зарегистрируйтесь</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;