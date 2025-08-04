
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AdminPanel } from '@/components/panels/AdminPanel';
import { StaffPanel } from '@/components/panels/StaffPanel';

export default function AdminDashboard() {
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute allowedRoles={['admin', 'staff']}>
      {user?.role === 'admin' ? (
        <AdminPanel onLogout={logout} />
      ) : (
        <StaffPanel onLogout={logout} />
      )}
    </ProtectedRoute>
  );
}
