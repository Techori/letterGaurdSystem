
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreateDocumentForm } from './CreateDocumentForm';
import { DocumentManagementTable } from './DocumentManagementTable';
import { DocumentVerification } from '../verification/DocumentVerification';
import { documentService } from '@/services/documentService';
import { toast } from 'sonner';

interface ModernStaffDashboardProps {
  onLogout: () => void;
}

export default function ModernStaffDashboard({ onLogout }: ModernStaffDashboardProps) {
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
      <Tabs defaultValue="documents" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="create">Create Document</TabsTrigger>
          <TabsTrigger value="verify">Verify Document</TabsTrigger>
        </TabsList>
        
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
      </Tabs>
    </div>
  );
}
