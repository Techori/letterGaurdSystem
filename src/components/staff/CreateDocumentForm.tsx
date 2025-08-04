import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { documentService } from '@/services/documentService';
import { backendService } from '@/services/backendService';
import * as XLSX from 'xlsx';

interface CreateDocumentFormProps {
  onDocumentCreated?: () => void;
}

export function CreateDocumentForm({ onDocumentCreated }: CreateDocumentFormProps) {
  const [categories, setCategories] = useState<any[]>([]);
  const [letterTypes, setLetterTypes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    letterNumber: '',
    referenceNumber: '',
    issuedTo: '',
    issueDate: '',
    issuedBy: '',
    letterCategory: '',
    letterType: '',
    department: '',
    dispatchMode: '',
    dispatchDate: '',
    subject: '',
    description: '',
    status: 'draft' as const
  });
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [cats, types] = await Promise.all([
        backendService.getCategories(),
        backendService.getLetterTypes()
      ]);
      setCategories(cats);
      setLetterTypes(types);
    } catch (error) {
      toast.error('Failed to load form data');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleExcelUpload = async () => {
    if (!file) {
      toast.error('Please select an Excel file');
      return;
    }

    setIsLoading(true);

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        try {
          for (const doc of jsonData) {
            await documentService.create({
              ...doc,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            });
          }
          toast.success(`Successfully created ${jsonData.length} documents!`);
          setFile(null);
          if (onDocumentCreated) {
            onDocumentCreated();
          }
        } catch (error: any) {
          toast.error('Failed to create documents: ' + error.message);
        } finally {
          setIsLoading(false);
        }
      };
      reader.readAsArrayBuffer(file);
    } catch (error: any) {
      toast.error('Failed to process Excel file: ' + error.message);
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.letterNumber || !formData.issuedTo || !formData.issueDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);

    try {
      await documentService.create({
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      toast.success('Document created successfully!');
      
      // Reset form
      setFormData({
        letterNumber: '',
        referenceNumber: '',
        issuedTo: '',
        issueDate: '',
        issuedBy: '',
        letterCategory: '',
        letterType: '',
        department: '',
        dispatchMode: '',
        dispatchDate: '',
        subject: '',
        description: '',
        status: 'draft'
      });

      if (onDocumentCreated) {
        onDocumentCreated();
      }
    } catch (error: any) {
      console.error('Error creating document:', error);
      toast.error('Failed to create document: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Document</CardTitle>
        <CardDescription>Fill in the details or upload an Excel file to create documents</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="excelUpload">Upload Excel File</Label>
            <Input
              id="excelUpload"
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
            />
            <Button 
              onClick={handleExcelUpload} 
              disabled={isLoading || !file}
              className="mt-2"
            >
              {isLoading ? 'Processing...' : 'Upload and Create Documents'}
            </Button>
          </div>
          
          <div className="border-t pt-4">
            <h3 className="text-lg font-medium mb-2">Or Create Single Document</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="letterNumber">Letter Number *</Label>
                  <Input
                    id="letterNumber"
                    value={formData.letterNumber}
                    onChange={(e) => handleInputChange('letterNumber', e.target.value)}
                    placeholder="RIPL/2025-26/XX"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="referenceNumber">Reference Number</Label>
                  <Input
                    id="referenceNumber"
                    value={formData.referenceNumber}
                    onChange={(e) => handleInputChange('referenceNumber', e.target.value)}
                    placeholder="REF/2025-26/XX"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="issuedTo">Issued To *</Label>
                  <Input
                    id="issuedTo"
                    value={formData.issuedTo}
                    onChange={(e) => handleInputChange('issuedTo', e.target.value)}
                    placeholder="Recipient Name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="issueDate">Issue Date *</Label>
                  <Input
                    id="issueDate"
                    type="date"
                    value={formData.issueDate}
                    onChange={(e) => handleInputChange('issueDate', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="issuedBy">Issued By</Label>
                  <Input
                    id="issuedBy"
                    value={formData.issuedBy}
                    onChange={(e) => handleInputChange('issuedBy', e.target.value)}
                    placeholder="Issuer Name"
                  />
                </div>
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    placeholder="Department Name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="letterCategory">Letter Category</Label>
                  <Select value={formData.letterCategory} onValueChange={(value) => handleInputChange('letterCategory', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="letterType">Letter Type</Label>
                  <Select value={formData.letterType} onValueChange={(value) => handleInputChange('letterType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {letterTypes.map((type) => (
                        <SelectItem key={type.id} value={type.name}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dispatchMode">Dispatch Mode</Label>
                  <Select value={formData.dispatchMode} onValueChange={(value) => handleInputChange('dispatchMode', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select dispatch mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="E Mail">E Mail</SelectItem>
                      <SelectItem value="Hand Delivery">Hand Delivery</SelectItem>
                      <SelectItem value="Post">Post</SelectItem>
                      <SelectItem value="Courier">Courier</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="dispatchDate">Dispatch Date</Label>
                  <Input
                    id="dispatchDate"
                    type="date"
                    value={formData.dispatchDate}
                    onChange={(e) => handleInputChange('dispatchDate', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  placeholder="Document subject"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Document description"
                  rows={3}
                />
              </div>

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? 'Creating...' : 'Create Document'}
              </Button>
            </form>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}