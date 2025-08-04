import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle, XCircle, Clock, FileText, Eye } from 'lucide-react';
import { documentService, Document } from '@/services/documentService';
import { toast } from 'sonner';

export function DocumentApproval() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  useEffect(() => {
    fetchPendingDocuments();
  }, []);

  const fetchPendingDocuments = async () => {
    try {
      setIsLoading(true);
      const allDocs = await documentService.getAll();
      const pendingDocs = allDocs.filter(doc => doc.status === 'Pending' || doc.status === 'Draft');
      setDocuments(pendingDocs);
    } catch (error: any) {
      console.error('Failed to fetch documents:', error);
      toast.error('Failed to fetch pending documents');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Draft':
        return <Badge variant="secondary" className="bg-gray-100"><Clock className="w-3 h-3 mr-1" />Draft</Badge>;
      case 'Pending':
        return <Badge variant="secondary" className="bg-yellow-100"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Document Approvals ({documents.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {documents.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No documents pending approval</p>
          </div>
        ) : (
          <div className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Letter Number</TableHead>
                  <TableHead>Document Type</TableHead>
                  <TableHead>Issued To</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-mono text-sm">{doc.letterNumber}</TableCell>
                    <TableCell>{doc.letterType}</TableCell>
                    <TableCell>{doc.issuedTo}</TableCell>
                    <TableCell>{new Date(doc.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{getStatusBadge(doc.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => setSelectedDocument(doc)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Document Details</DialogTitle>
                            </DialogHeader>
                            {selectedDocument && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium">Letter Number</label>
                                    <p className="text-sm text-muted-foreground font-mono">{selectedDocument.letterNumber}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Reference Number</label>
                                    <p className="text-sm text-muted-foreground font-mono">{selectedDocument.referenceNumber}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Issued To</label>
                                    <p className="text-sm text-muted-foreground">{selectedDocument.issuedTo}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Issue Date</label>
                                    <p className="text-sm text-muted-foreground">{selectedDocument.issueDate}</p>
                                  </div>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Subject</label>
                                  <p className="text-sm text-muted-foreground">{selectedDocument.subject}</p>
                                </div>
                                {selectedDocument.description && (
                                  <div>
                                    <label className="text-sm font-medium">Description</label>
                                    <p className="text-sm text-muted-foreground">{selectedDocument.description}</p>
                                  </div>
                                )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        
                        <Button
                          size="sm"
                          onClick={() => handleApprove(doc.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => setSelectedDocument(doc)}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Reject Document</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <p className="text-sm text-muted-foreground">
                                Please provide a reason for rejecting this document:
                              </p>
                              <Textarea
                                placeholder="Enter rejection reason..."
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                rows={4}
                              />
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    setRejectionReason('');
                                    setSelectedDocument(null);
                                  }}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  variant="destructive"
                                  onClick={() => selectedDocument && handleReject(selectedDocument.id)}
                                  disabled={!rejectionReason.trim()}
                                >
                                  Confirm Reject
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );

  async function handleApprove(documentId: string) {
    try {
      await documentService.updateStatus(documentId, 'Approved');
      toast.success('Document approved successfully');
      await fetchPendingDocuments();
    } catch (error: any) {
      toast.error('Failed to approve document: ' + error.message);
    }
  }

  async function handleReject(documentId: string) {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    try {
      await documentService.updateStatus(documentId, 'Rejected', rejectionReason);
      toast.success('Document rejected');
      setRejectionReason('');
      setSelectedDocument(null);
      await fetchPendingDocuments();
    } catch (error: any) {
      toast.error('Failed to reject document: ' + error.message);
    }
  }
}
