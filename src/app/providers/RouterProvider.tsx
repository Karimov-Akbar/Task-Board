import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/model/authStore';
import LoginPage from '@/pages/LoginPage/LoginPage';
import RegisterPage from '@/pages/RegisterPage/RegisterPage';
import TasksPage from '@/pages/TasksPage/TasksPage';
import TaskDetailPage from '@/pages/TaskDetailPage/TaskDetailPage';
import TaskCreatePage from '@/pages/TaskCreatePage/TaskCreatePage';
import { Header } from '@/widgets/Header/Header';

const ProtectedRoute = () => {
  const token = useAuthStore((s) => s.token);
  if (!token) return <Navigate to="/login" replace />;
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
    </>
  );
};

const GuestRoute = () => {
  const token = useAuthStore((s) => s.token);
  if (token) return <Navigate to="/tasks" replace />;
  return <Outlet />;
};

export const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="/tasks" element={<TasksPage />}>
          <Route path="new" element={<TaskCreatePage />} />
          <Route path=":id" element={<TaskDetailPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/tasks" replace />} />
    </Routes>
  </BrowserRouter>
);