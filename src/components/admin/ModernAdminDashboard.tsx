
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreateDocumentForm } from '../staff/CreateDocumentForm';
import { DocumentManagementTable } from '../staff/DocumentManagementTable';
import { DocumentVerification } from '../verification/DocumentVerification';
import { DocumentApproval } from './DocumentApproval';
import { BackendSystemSettings } from './BackendSystemSettings';
import { DashboardAnalytics } from './DashboardAnalytics';
import { documentService } from '@/services/documentService';
import { toast } from 'sonner';

interface ModernAdminDashboardProps {
  onLogout: () => void;
}

export default function ModernAdminDashboard({ onLogout }: ModernAdminDashboardProps) {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      const docs = await documentService.getDocuments();
      setDocuments(docs);
    } catch (error: any) {
      console.error('Failed to fetch documents:', error);
      toast.error('Failed to fetch documents: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Transform documents for the existing DocumentManagementTable component
  const transformedDocuments = documents.map(doc => ({
    id: doc.id,
    type: doc.letterType?.name || 'Unknown Type',
    recipient: doc.title,
    issuedBy: doc.creator?.name || 'Unknown',
    issuedDate: new Date(doc.issueDate).toLocaleDateString('en-IN'),
    status: doc.status === 'Approved' ? 'Active' : doc.status,
    downloadUrl: '#'
  }));

  return (
    <div className="space-y-6">
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="approvals">Approvals</TabsTrigger>
          <TabsTrigger value="documents">All Documents</TabsTrigger>
          <TabsTrigger value="create">Create Document</TabsTrigger>
          <TabsTrigger value="verify">Verify Document</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="space-y-6">
          <DashboardAnalytics />
        </TabsContent>
        
        <TabsContent value="approvals" className="space-y-6">
          <DocumentApproval />
        </TabsContent>
        
        <TabsContent value="documents" className="space-y-6">
          {isLoading ? (
            <Card>
              <CardContent className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </CardContent>
            </Card>
          ) : (
            <DocumentManagementTable documents={transformedDocuments} />
          )}
        </TabsContent>
        
        <TabsContent value="create" className="space-y-6">
          <CreateDocumentForm onDocumentCreated={fetchDocuments} />
        </TabsContent>
        
        <TabsContent value="verify" className="space-y-6">
          <DocumentVerification />
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-6">
          <BackendSystemSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
