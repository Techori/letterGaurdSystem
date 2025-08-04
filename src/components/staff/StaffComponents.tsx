
import { useState, useEffect } from 'react';
import { apiService } from '@/services/apiService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogOut, User, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export function StaffHeader({ user, onLogout }: { user: StaffUser; onLogout: () => void }) {
  return (
    <header className="bg-card border-b px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Staff Dashboard</h1>
            <p className="text-sm text-muted-foreground">Welcome, {user.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="text-sm">{user.email}</span>
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

export function StaffStats({ documents }: { documents: any[] }) {
  const stats = {
    total: documents.length,
    approved: documents.filter(d => d.status === 'Approved').length,
    pending: documents.filter(d => d.status === 'Pending').length,
    drafts: documents.filter(d => d.status === 'Draft').length,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Documents</p>
              <p className="text-3xl font-bold">{stats.total}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-200" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Approved</p>
              <p className="text-3xl font-bold">{stats.approved}</p>
            </div>
            <div className="bg-green-200 text-green-800 border-0 rounded px-2 py-1">✓</div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm font-medium">Pending</p>
              <p className="text-3xl font-bold">{stats.pending}</p>
            </div>
            <div className="w-8 h-8 text-yellow-200">⏱</div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Drafts</p>
              <p className="text-3xl font-bold">{stats.drafts}</p>
            </div>
            <div className="w-8 h-8 text-purple-200">📝</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
