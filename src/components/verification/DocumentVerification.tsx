import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Search, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { documentService, Document } from '@/services/documentService';

export function DocumentVerification() {
  const [letterNumber, setLetterNumber] = useState('');
  const [document, setDocument] = useState<Document | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!letterNumber.trim()) {
      toast.error('Please enter a letter number');
      return;
    }

    setIsLoading(true);
    setHasSearched(false);

    try {
      const doc = await documentService.getByLetterNumber(letterNumber.trim());
      setDocument(doc);
      setHasSearched(true);
      
      if (!doc) {
        toast.error('Document not found');
      } else {
        toast.success('Document found');
      }
    } catch (error: any) {
      console.error('Error searching document:', error);
      toast.error('Failed to search document: ' + error.message);
      setDocument(null);
      setHasSearched(true);
    } finally {
      setIsLoading(false);
    }
  };

  

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-6 w-6" />
            Document Verification
          </CardTitle>
          <CardDescription>
            Enter a letter number to verify the authenticity of a document
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="letterNumber">Letter Number</Label>
              <Input
                id="letterNumber"
                value={letterNumber}
                onChange={(e) => setLetterNumber(e.target.value)}
                placeholder="Enter letter number (e.g., RIPL/2025-26/04)"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleSearch} disabled={isLoading}>
                {isLoading ? 'Searching...' : 'Search'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {hasSearched && (
        <Card>
          <CardHeader>
            <CardTitle>Verification Result</CardTitle>
          </CardHeader>
          <CardContent>
            {document ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(document.status)}
                    <span className="text-lg font-semibold">Document Found</span>
                  </div>
                  <Badge variant={getStatusColor(document.status) as any}>
                    {document.status.toUpperCase()}
                  </Badge>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Letter Number</Label>
                      <p className="font-mono text-lg">{document.letterNumber}</p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Reference Number</Label>
                      <p>{document.referenceNumber}</p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Issued To</Label>
                      <p className="font-medium">{document.issuedTo}</p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Issue Date</Label>
                      <p>{document.issueDate}</p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Dispatch Date</Label>
                      <p>{document.dispatchDate}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Issued By</Label>
                      <p>{document.issuedBy}</p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Department</Label>
                      <p>{document.department}</p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Category</Label>
                      <p>{document.letterCategory}</p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Type</Label>
                      <p>{document.letterType}</p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Dispatch Mode</Label>
                      <p>{document.dispatchMode}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Subject</Label>
                  <p className="mt-1">{document.subject}</p>
                </div>

                {document.description && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                    <p className="mt-1 text-sm">{document.description}</p>
                  </div>
                )}

                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4" />
                    This document has been verified as authentic and issued by RIPL.
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Document Not Found</h3>
                <p className="text-muted-foreground">
                  The letter number you entered does not match any document in our system.
                  Please verify the letter number and try again.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );

  function getStatusIcon(status: string) {
    switch (status.toLowerCase()) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'pending':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  }

  function getStatusColor(status: string) {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'default';
      case 'rejected':
        return 'destructive';
      case 'pending':
        return 'secondary';
      default:
        return 'outline';
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };
}
