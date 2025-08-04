
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AuthenticatedStaffPanel } from '@/components/panels/AuthenticatedStaffPanel';
import { AuthenticatedAdminPanel } from '@/components/panels/AuthenticatedAdminPanel';
import { VerificationPanel } from '@/components/panels/VerificationPanel';
import { LoginForm } from './LoginForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Shield, Search, ArrowLeft } from 'lucide-react';

export function AuthenticatedApp() {
  const { user, isLoading, login, isAuthenticated } = useAuth();
  const [selectedRole, setSelectedRole] = useState<'admin' | 'staff' | 'verification' | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [pendingRole, setPendingRole] = useState<'admin' | 'staff' | null>(null);

  const handleRoleSelection = (role: 'admin' | 'staff' | 'verification') => {
    if (role === 'verification') {
      setSelectedRole('verification');
      return;
    }

    if (!isAuthenticated) {
      setPendingRole(role);
      setShowLogin(true);
    } else if (user) {
      // Check if user has permission for the selected role
      if (role === 'admin' && user.role !== 'admin') {
        alert('Access denied. Admin privileges required.');
        return;
      }
      setSelectedRole(role);
    }
  };

  const handleLogin = async (role: string, credentials: { email: string; password: string }) => {
    try {
      await login(credentials.email, credentials.password);
      // After successful login, the useEffect will handle role assignment
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleLogout = () => {
    setSelectedRole(null);
    setShowLogin(false);
    setPendingRole(null);
    localStorage.removeItem('token');
    console.log("removing token")
  };

  const handleBackToRoleSelection = () => {
    setShowLogin(false);
    setPendingRole(null);
  };

  // Handle role assignment after successful login
  useEffect(() => {
    if (isAuthenticated && user && pendingRole) {
      // Check if user has permission for the pending role
      if (pendingRole === 'admin' && user.role !== 'admin') {
        alert('Access denied. Admin privileges required.');
        setShowLogin(false);
        setPendingRole(null);
        return;
      }
      
      setSelectedRole(pendingRole);
      setShowLogin(false);
      setPendingRole(null);
    }
  }, [isAuthenticated, user, pendingRole]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login form when needed
  if (showLogin && pendingRole) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">
                  {pendingRole === 'admin' ? 'Admin Login' : 'Staff Login'}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackToRoleSelection}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <LoginForm
                onLogin={handleLogin}
                allowedRoles={[pendingRole]}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Render appropriate panel based on selected role
  if (selectedRole) {
    switch (selectedRole) {
      case 'admin':
        return <AuthenticatedAdminPanel onLogout={handleLogout} />;
      case 'staff':
        return <AuthenticatedStaffPanel onLogout={handleLogout} />;
      case 'verification':
        return <VerificationPanel onLogout={handleLogout} />;
      default:
        return null;
    }
  }

  // Show role selection screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Letter Guard</h1>
          <p className="text-xl text-gray-600">Document Management & Verification System</p>
          <p className="text-gray-500 mt-2">Select your role to access the system</p>
          {isAuthenticated && user && (
            <p className="text-sm text-green-600 mt-2">
              Logged in as: {user.name} ({user.role})
            </p>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleRoleSelection('admin')}>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Admin Panel</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-4">Complete system management with full access to all documents, staff management, and system configuration.</p>
              <Button className="w-full">Access Admin Panel</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleRoleSelection('staff')}>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-16 h-16 flex items-center justify-center">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-xl">Staff Panel</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-4">Document creation, management, and tracking with role-based access to staff functions.</p>
              <Button className="w-full" variant="outline">Access Staff Panel</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleRoleSelection('verification')}>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center">
                <Search className="w-8 h-8 text-purple-600" />
              </div>
              <CardTitle className="text-xl">Public Verification</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-4">Public access for document verification and authenticity checking without system login.</p>
              <Button className="w-full" variant="secondary">Verify Documents</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
