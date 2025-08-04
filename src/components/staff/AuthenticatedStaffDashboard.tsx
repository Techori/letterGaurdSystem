
import { useState, useEffect } from 'react';
import { documentService } from '@/services/documentService';
import { StaffHeader, StaffStats } from './StaffComponents';
import ModernStaffDashboard from './ModernStaffDashboard';
import { toast } from 'sonner';

export function AuthenticatedStaffDashboard() {
  const [documents, setDocuments] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const mockUser = {
    id: 'staff-1',
    name: 'Staff User',
    email: 'staff@ripl.com',
    role: 'staff' as const
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoadingData(true);
      const docs = await documentService.getDocuments();
      setDocuments(docs);
    } catch (error: any) {
      console.error('Failed to fetch data:', error);
      toast.error('Failed to fetch data: ' + error.message);
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
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
      <StaffHeader user={mockUser} onLogout={handleLogout} />
      <div className="p-6">
        <StaffStats documents={documents} />
        <ModernStaffDashboard onLogout={handleLogout} />
      </div>
    </div>
  );
}
