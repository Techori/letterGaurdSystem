
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, Plus, Calendar, User, Building, Hash, Clock, LogOut, Send, Save, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { apiService } from '@/services/apiService';
import { Category, LetterType, Document } from '@/types';

const ModernStaffDashboard = ({ onLogout }: { onLogout: () => void }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [letterTypes, setLetterTypes] = useState<LetterType[]>([]);
  
  // Form states
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [letterTypeId, setLetterTypeId] = useState('');
  const [letterNumber, setLetterNumber] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [content, setContent] = useState('');

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [categoriesData, letterTypesData, documentsData] = await Promise.all([
        apiService.getCategories(),
        apiService.getLetterTypes(),
        apiService.getDocuments()
      ]);
      
      setCategories(categoriesData);
      setLetterTypes(letterTypesData);
      setDocuments(documentsData);
    } catch (error) {
      toast.error('Failed to load data');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateLetterNumber = () => {
    const category = categories.find(cat => cat._id === categoryId);
    if (category) {
      const year = new Date().getFullYear();
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      return `${category.prefix}/${year}/${random}`;
    }
    return '';
  };

  const generateReferenceNumber = () => {
    const category = categories.find(cat => cat._id === categoryId);
    if (category) {
      const date = new Date();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
      return `REF/${category.prefix}/${month}${year}/${random}`;
    }
    return '';
  };

  const resetForm = () => {
    setTitle('');
    setCategoryId('');
    setLetterTypeId('');
    setLetterNumber('');
    setReferenceNumber('');
    setIssueDate('');
    setContent('');
  };

  const handleSubmit = async (submitStatus: 'Draft' | 'Pending' = 'Draft') => {
    if (!title || !categoryId || !letterTypeId || !content) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const finalLetterNumber = letterNumber || generateLetterNumber();
      const finalReferenceNumber = referenceNumber || generateReferenceNumber();
      const finalIssueDate = issueDate || new Date().toISOString().split('T')[0];

      const documentData = {
        title,
        categoryId,
        letterTypeId,
        letterNumber: finalLetterNumber,
        referenceNumber: finalReferenceNumber,
        issueDate: finalIssueDate,
        content,
        status: submitStatus
      };

      const newDocument = await apiService.createDocument(documentData);
      setDocuments([...documents, newDocument]);
      toast.success(`Document ${submitStatus === 'Draft' ? 'saved as draft' : 'submitted for approval'}!`);
      resetForm();
    } catch (error) {
      toast.error('Failed to create document');
      console.error(error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-6 h-6 animate-spin text-primary" />
          <span className="text-lg">Loading data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-primary rounded-lg">
                <FileText className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Staff Dashboard</h1>
                <p className="text-sm text-gray-600">Create and manage documents</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button onClick={loadData} variant="outline" size="icon">
                <RefreshCw className="w-4 h-4" />
              </Button>
              <Button onClick={onLogout} variant="outline" className="flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Documents</p>
                  <p className="text-3xl font-bold">{documents.length}</p>
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
                  <p className="text-3xl font-bold">{documents.filter(d => d.status === 'Approved').length}</p>
                </div>
                <Badge className="bg-green-200 text-green-800 border-0">✓</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm font-medium">Pending</p>
                  <p className="text-3xl font-bold">{documents.filter(d => d.status === 'Pending').length}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Drafts</p>
                  <p className="text-3xl font-bold">{documents.filter(d => d.status === 'Draft').length}</p>
                </div>
                <Save className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Document Creation Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Plus className="w-5 h-5" />
                  Create New Document
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-semibold text-gray-700">
                    Document Title *
                  </Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter document title"
                    className="h-11"
                  />
                </div>

                {/* Category and Letter Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">
                      Category *
                    </Label>
                    <Select onValueChange={setCategoryId} value={categoryId}>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category._id} value={category._id}>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">{category.prefix}</Badge>
                              {category.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">
                      Letter Type *
                    </Label>
                    <Select onValueChange={setLetterTypeId} value={letterTypeId}>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select letter type" />
                      </SelectTrigger>
                      <SelectContent>
                        {letterTypes.filter(type => type.categoryId === categoryId).map((type) => (
                          <SelectItem key={type._id} value={type._id}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Numbers and Date */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">
                      Letter Number
                    </Label>
                    <Input
                      value={letterNumber}
                      onChange={(e) => setLetterNumber(e.target.value)}
                      placeholder="Auto-generated"
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">
                      Reference Number
                    </Label>
                    <Input
                      value={referenceNumber}
                      onChange={(e) => setReferenceNumber(e.target.value)}
                      placeholder="Auto-generated"
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">
                      Issue Date
                    </Label>
                    <Input
                      type="date"
                      value={issueDate}
                      onChange={(e) => setIssueDate(e.target.value)}
                      className="h-11"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">
                    Document Content *
                  </Label>
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Enter document content..."
                    className="min-h-32 resize-none"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button 
                    onClick={() => handleSubmit('Draft')} 
                    variant="outline" 
                    className="flex-1 h-11"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save as Draft
                  </Button>
                  <Button 
                    onClick={() => handleSubmit('Pending')} 
                    className="flex-1 h-11"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Submit for Approval
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Documents */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
                <CardTitle className="text-lg">Recent Documents</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-96 overflow-y-auto">
                  {documents.slice(-5).reverse().map((doc) => (
                    <div key={doc._id} className="p-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors">
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm truncate">{doc.title}</h4>
                        <div className="flex items-center justify-between">
                          <Badge className={`text-xs ${getStatusColor(doc.status)}`}>
                            {doc.status}
                          </Badge>
                          <span className="text-xs text-gray-500">{doc.issueDate}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {documents.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                      <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">No documents created yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* All Documents Table */}
        {documents.length > 0 && (
          <Card className="mt-8 shadow-lg border-0">
            <CardHeader>
              <CardTitle>All Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Letter Number</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Issue Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.map((doc) => (
                    <TableRow key={doc._id}>
                      <TableCell className="font-medium">{doc.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{doc.letterNumber}</Badge>
                      </TableCell>
                      <TableCell>
                        {categories.find(cat => cat._id === doc.categoryId)?.name || 'N/A'}
                      </TableCell>
                      <TableCell>{doc.issueDate}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(doc.status)}>
                          {doc.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ModernStaffDashboard;
