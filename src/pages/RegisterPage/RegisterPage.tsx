import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/model/authStore';
import { registerSchema, type RegisterFormData } from '@/features/auth/model/authSchemas';
import { getApiErrorMessage } from '@/shared/api/axiosInstance';
import styles from './RegisterPage.module.css';

const RegisterPage = () => {
    const navigate = useNavigate();
    const registerUser = useAuthStore((s) => s.register);
    const [serverError, setServerError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormData) => {
        try {
            setServerError(null);
            await registerUser({
                nickname: data.nickname,
                password: data.password,
                email: data.email || undefined,
            });
            navigate('/tasks');
        } 
        catch (error) {
            setServerError(getApiErrorMessage(error));
        }
    };

    return (
        <div className={styles.page}>
            <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
                <h1>Task Board</h1>
                <p className={styles.subtitle}>Создайте аккаунт</p>
                <div className={styles.field}>
                    <label htmlFor="nickname">Логин</label>
                    <input
                        id="nickname"
                        placeholder="username"
                        {...register('nickname')}
                    />
                    {errors.nickname && (
                        <span className={styles.error}>{errors.nickname.message}</span>
                    )}
                </div>

                <div className={styles.field}>
                    <label htmlFor="email">Email (необязательно)</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="email@example.com"
                        {...register('email')}
                    />
                    {errors.email && (
                        <span className={styles.error}>{errors.email.message}</span>
                    )}
                </div>

                <div className={styles.field}>
                    <label htmlFor="password">Пароль</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="Минимум 8 символов"
                        {...register('password')}
                    />
                    {errors.password && (
                        <span className={styles.error}>{errors.password.message}</span>
                    )}
                </div>

                {serverError && (
                    <div className={styles.serverError}>{serverError}</div>
                )}

                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
                </button>

                <p className={styles.link}>
                    Уже есть аккаунт? <Link to="/login">Войти</Link>
                </p>
            </form>
        </div>
    );
};

export default RegisterPage;