
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AuthenticatedAdminDashboard } from '@/components/admin/AuthenticatedAdminDashboard';
import { toast } from 'sonner';

export function AuthenticatedAdminPanel({ onLogout }: { onLogout: () => void }) {
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast.error('Authentication required');
      onLogout();
      return;
    }

    if (!isLoading && isAuthenticated && user?.role !== 'admin') {
      toast.error('Admin access required');
      onLogout();
      return;
    }
  }, [isAuthenticated, isLoading, user, onLogout]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user || user.role !== 'admin') {
    return null;
  }

  return <AuthenticatedAdminDashboard />;
}
