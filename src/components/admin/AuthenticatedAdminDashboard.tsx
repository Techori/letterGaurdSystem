
import { useState, useEffect } from 'react';
import { documentService } from '@/services/documentService';
import { backendService } from '@/services/backendService';
import { AdminHeader, AdminStats } from './AdminComponents';
import ModernAdminDashboard from './ModernAdminDashboard';
import { toast } from 'sonner';

export function AuthenticatedAdminDashboard() {
  const [documents, setDocuments] = useState([]);
  const [staff, setStaff] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const mockUser = {
    id: 'admin-1',
    name: 'Admin User',
    email: 'admin@ripl.com',
    role: 'admin' as const
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoadingData(true);
      const [docs, staffMembers] = await Promise.all([
        documentService.getDocuments(),
        backendService.getStaff()
      ]);
      
      setDocuments(docs);
      setStaff(staffMembers);
    } catch (error: any) {
      console.error('Failed to fetch data:', error);
      toast.error('Failed to fetch data: ' + error.message);
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token')
    window.location.reload();
  };

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader user={mockUser} onLogout={handleLogout} />
      <div className="p-6">
        <AdminStats documents={documents} staff={staff} />
        <ModernAdminDashboard onLogout={handleLogout} />
      </div>
    </div>
  );
}
