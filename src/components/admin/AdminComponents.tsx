
import { useState, useEffect } from 'react';
import { apiService } from '@/services/apiService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogOut, Shield, Users, FileText, Settings } from 'lucide-react';
import { toast } from 'sonner';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export function AdminHeader({ user, onLogout }: { user: AdminUser; onLogout: () => void }) {
  return (
    <header className="bg-card border-b px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">Administrator Portal - {user.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="text-sm font-medium">{user.email}</span>
          </div>
          <Button variant="outline" onClick={onLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}

export function AdminStats({ documents, staff }: { documents: any[]; staff: any[] }) {
  const stats = {
    totalDocuments: documents.length,
    pendingDocuments: documents.filter(d => d.status === 'Pending').length,
    totalStaff: staff.length,
    approvedToday: documents.filter(d => 
      d.status === 'Approved' && 
      new Date(d.updated_at).toDateString() === new Date().toDateString()
    ).length,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Documents</p>
              <p className="text-3xl font-bold">{stats.totalDocuments}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-200" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Pending Review</p>
              <p className="text-3xl font-bold">{stats.pendingDocuments}</p>
            </div>
            <div className="w-8 h-8 text-orange-200">⏳</div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Staff Members</p>
              <p className="text-3xl font-bold">{stats.totalStaff}</p>
            </div>
            <Users className="w-8 h-8 text-green-200" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Approved Today</p>
              <p className="text-3xl font-bold">{stats.approvedToday}</p>
            </div>
            <div className="w-8 h-8 text-purple-200">✅</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
