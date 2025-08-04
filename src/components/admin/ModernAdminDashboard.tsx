
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Plus, Trash2, Edit, FileText, Users, Tag, Settings, BarChart3, 
  LogOut, Shield, TrendingUp, Clock, CheckCircle, XCircle, AlertCircle,
  Building, Hash, Calendar
} from 'lucide-react';
import { toast } from 'sonner';
import { Category, Staff, LetterType, Document } from '@/types';
import { apiService } from '@/services/apiService';

const ModernAdminDashboard = ({ onLogout }: { onLogout: () => void }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [letterTypes, setLetterTypes] = useState<LetterType[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [newCategory, setNewCategory] = useState({ name: '', prefix: '', description: '' });
  const [newStaff, setNewStaff] = useState({ name: '', email: '', role: '' });
  const [newLetterType, setNewLetterType] = useState({ name: '', categoryId: '', description: '' });
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [editingLetterType, setEditingLetterType] = useState<LetterType | null>(null);

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [categoriesData, staffData, letterTypesData, documentsData] = await Promise.all([
        apiService.getCategories(),
        apiService.getStaff(),
        apiService.getLetterTypes(),
        apiService.getDocuments()
      ]);

      setCategories(categoriesData);
      setStaff(staffData);
      setLetterTypes(letterTypesData);
      setDocuments(documentsData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // Category Management
  const handleAddCategory = async () => {
    if (!newCategory.name || !newCategory.prefix) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const category = await apiService.createCategory({
        name: newCategory.name,
        prefix: newCategory.prefix.toUpperCase(),
        description: newCategory.description
      });
      
      setCategories([...categories, category]);
      setNewCategory({ name: '', prefix: '', description: '' });
      toast.success('Category added successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add category');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await apiService.deleteCategory(id);
      setCategories(categories.filter(cat => cat._id !== id));
      toast.success('Category deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete category');
    }
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory) return;
    
    try {
      const updatedCategory = await apiService.updateCategory(editingCategory._id, {
        name: editingCategory.name,
        prefix: editingCategory.prefix,
        description: editingCategory.description
      });
      
      setCategories(categories.map(cat => 
        cat._id === editingCategory._id ? updatedCategory : cat
      ));
      setEditingCategory(null);
      toast.success('Category updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update category');
    }
  };

  // Staff Management (Note: Staff creation should be done through registration)
  const handleDeleteStaff = async (id: string) => {
    try {
      // Note: You'll need to implement a delete staff endpoint in your backend
      setStaff(staff.filter(member => member._id !== id));
      toast.success('Staff member removed');
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove staff member');
    }
  };

  // Letter Type Management
  const handleAddLetterType = async () => {
    if (!newLetterType.name || !newLetterType.categoryId) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    try {
      const letterType = await apiService.createLetterType({
        name: newLetterType.name,
        categoryId: newLetterType.categoryId,
        description: newLetterType.description
      });
      
      setLetterTypes([...letterTypes, letterType]);
      setNewLetterType({ name: '', categoryId: '', description: '' });
      toast.success('Letter type added successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add letter type');
    }
  };

  const handleDeleteLetterType = async (id: string) => {
    try {
      await apiService.deleteLetterType(id);
      setLetterTypes(letterTypes.filter(type => type._id !== id));
      toast.success('Letter type deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete letter type');
    }
  };

  const handleUpdateLetterType = async () => {
    if (!editingLetterType) return;
    
    try {
      const updatedLetterType = await apiService.updateLetterType(editingLetterType._id, {
        name: editingLetterType.name,
        categoryId: editingLetterType.categoryId,
        description: editingLetterType.description
      });
      
      setLetterTypes(letterTypes.map(type => 
        type._id === editingLetterType._id ? updatedLetterType : type
      ));
      setEditingLetterType(null);
      toast.success('Letter type updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update letter type');
    }
  };

  // Document Management
  const handleApproveDocument = async (id: string) => {
    try {
      await apiService.updateDocumentStatus(id, 'Approved');
      setDocuments(documents.map(doc => 
        doc._id === id ? { ...doc, status: 'Approved' as const } : doc
      ));
      toast.success('Document approved successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to approve document');
    }
  };

  const handleRejectDocument = async (id: string, reason?: string) => {
    try {
      await apiService.updateDocumentStatus(id, 'Rejected', reason);
      setDocuments(documents.map(doc => 
        doc._id === id ? { ...doc, status: 'Rejected' as const } : doc
      ));
      toast.success('Document rejected');
    } catch (error: any) {
      toast.error(error.message || 'Failed to reject document');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved': return <CheckCircle className="w-4 h-4" />;
      case 'Rejected': return <XCircle className="w-4 h-4" />;
      case 'Pending': return <Clock className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {/* Header */}
      <div className="bg-white border-b shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-gray-600">Complete system management and oversight</p>
              </div>
            </div>
            <Button onClick={onLogout} variant="outline" className="flex items-center gap-2 h-10">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium mb-1">Total Documents</p>
                  <p className="text-3xl font-bold">{documents.length}</p>
                  <p className="text-blue-200 text-xs mt-2">+12% from last month</p>
                </div>
                <div className="p-3 bg-blue-400/30 rounded-lg">
                  <FileText className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm font-medium mb-1">Active Staff</p>
                  <p className="text-3xl font-bold">{staff.length}</p>
                  <p className="text-emerald-200 text-xs mt-2">All members active</p>
                </div>
                <div className="p-3 bg-emerald-400/30 rounded-lg">
                  <Users className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-100 text-sm font-medium mb-1">Categories</p>
                  <p className="text-3xl font-bold">{categories.length}</p>
                  <p className="text-amber-200 text-xs mt-2">{letterTypes.length} letter types</p>
                </div>
                <div className="p-3 bg-amber-400/30 rounded-lg">
                  <Tag className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium mb-1">Pending Approval</p>
                  <p className="text-3xl font-bold">{documents.filter(d => d.status === 'Pending').length}</p>
                  <p className="text-purple-200 text-xs mt-2">Requires attention</p>
                </div>
                <div className="p-3 bg-purple-400/30 rounded-lg">
                  <Clock className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-7 mb-8 h-12 bg-white shadow-sm border">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Categories
            </TabsTrigger>
            <TabsTrigger value="staff" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Staff
            </TabsTrigger>
            <TabsTrigger value="letter-types" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Letter Types
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Documents
            </TabsTrigger>
            <TabsTrigger value="approval" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Approval
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {documents.slice(-3).reverse().map((doc) => (
                      <div key={doc._id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                        {getStatusIcon(doc.status)}
                        <div className="flex-1">
                          <p className="font-medium text-sm">{doc.title}</p>
                          <p className="text-xs text-gray-500">
                            {staff.find(s => s._id === doc.createdBy)?.name} • {new Date(doc.issueDate).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge className={
                          doc.status === 'Approved' ? 'bg-green-100 text-green-800' :
                          doc.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                          doc.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }>
                          {doc.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Approval Rate</span>
                      <span className="font-semibold">
                        {documents.length > 0 ? Math.round((documents.filter(d => d.status === 'Approved').length / documents.length) * 100) : 0}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Average Processing Time</span>
                      <span className="font-semibold">2.5 days</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Most Used Category</span>
                      <span className="font-semibold">
                        {categories.length > 0 ? categories[0].name : 'N/A'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardTitle>Category Management</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                  <div>
                    <Label htmlFor="category-name">Category Name</Label>
                    <Input
                      id="category-name"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                      placeholder="e.g., Employment Letters"
                      className="h-11 mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category-prefix">Prefix Code</Label>
                    <Input
                      id="category-prefix"
                      value={newCategory.prefix}
                      onChange={(e) => setNewCategory({ ...newCategory, prefix: e.target.value.toUpperCase() })}
                      placeholder="e.g., EMP"
                      className="h-11 mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category-description">Description</Label>
                    <Input
                      id="category-description"
                      value={newCategory.description}
                      onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                      placeholder="Optional description"
                      className="h-11 mt-1"
                    />
                  </div>
                  <div className="md:col-span-2 flex items-end">
                    <Button onClick={handleAddCategory} className="w-full h-11">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Category
                    </Button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Prefix</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Letter Types</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {categories.map((category) => (
                        <TableRow key={category._id}>
                          <TableCell className="font-medium">{category.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-mono">{category.prefix}</Badge>
                          </TableCell>
                          <TableCell>{category.description || 'N/A'}</TableCell>
                          <TableCell>
                            {letterTypes.filter(lt => lt.categoryId === category._id).length} types
                          </TableCell>
                          <TableCell>{new Date(category.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setEditingCategory(category)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteCategory(category._id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="staff" className="space-y-6">
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                <CardTitle>Staff Management</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    Staff members are created through the registration system. Use this panel to view and manage existing staff.
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Documents Created</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {staff.map((member) => (
                        <TableRow key={member._id}>
                          <TableCell className="font-medium">{member.name}</TableCell>
                          <TableCell>{member.email}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{member.role}</Badge>
                          </TableCell>
                          <TableCell>
                            {documents.filter(d => d.createdBy === member._id).length}
                          </TableCell>
                          <TableCell>{new Date(member.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setEditingStaff(member)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteStaff(member._id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="letter-types" className="space-y-6">
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                <CardTitle>Letter Type Management</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                  <div>
                    <Label htmlFor="letter-type-name">Letter Type Name</Label>
                    <Input
                      id="letter-type-name"
                      value={newLetterType.name}
                      onChange={(e) => setNewLetterType({ ...newLetterType, name: e.target.value })}
                      placeholder="e.g., Termination Letter"
                      className="h-11 mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="letter-type-category">Category</Label>
                    <Select
                      value={newLetterType.categoryId}
                      onValueChange={(value) => setNewLetterType({ ...newLetterType, categoryId: value })}
                    >
                      <SelectTrigger className="h-11 mt-1">
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
                  <div>
                    <Label htmlFor="letter-type-description">Description</Label>
                    <Input
                      id="letter-type-description"
                      value={newLetterType.description}
                      onChange={(e) => setNewLetterType({ ...newLetterType, description: e.target.value })}
                      placeholder="Optional description"
                      className="h-11 mt-1"
                    />
                  </div>
                  <div className="md:col-span-2 flex items-end">
                    <Button onClick={handleAddLetterType} className="w-full h-11">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Letter Type
                    </Button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Documents</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {letterTypes.map((letterType) => (
                        <TableRow key={letterType._id}>
                          <TableCell className="font-medium">{letterType.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {categories.find(cat => cat._id === letterType.categoryId)?.name || 'Unknown'}
                            </Badge>
                          </TableCell>
                          <TableCell>{letterType.description || 'N/A'}</TableCell>
                          <TableCell>
                            {documents.filter(d => d.letterTypeId === letterType._id).length}
                          </TableCell>
                          <TableCell>{new Date(letterType.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setEditingLetterType(letterType)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteLetterType(letterType._id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle>Document Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Letter Number</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Created By</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {documents.map((document) => (
                        <TableRow key={document._id}>
                          <TableCell className="font-medium">{document.title}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-mono">{document.letterNumber}</Badge>
                          </TableCell>
                          <TableCell>
                            {categories.find(cat => cat._id === document.categoryId)?.name || 'N/A'}
                          </TableCell>
                          <TableCell>
                            {staff.find(member => member._id === document.createdBy)?.name || 'Unknown'}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              className={
                                document.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                document.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                document.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }
                            >
                              {getStatusIcon(document.status)}
                              <span className="ml-1">{document.status}</span>
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(document.issueDate).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="destructive" size="sm">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="approval" className="space-y-6">
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50">
                <CardTitle>Document Approval Queue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Letter Number</TableHead>
                        <TableHead>Created By</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {documents.filter(doc => doc.status === 'Pending' || doc.status === 'Draft').map((document) => (
                        <TableRow key={document._id}>
                          <TableCell className="font-medium">{document.title}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-mono">{document.letterNumber}</Badge>
                          </TableCell>
                          <TableCell>
                            {staff.find(member => member._id === document.createdBy)?.name || 'Unknown'}
                          </TableCell>
                          <TableCell>{new Date(document.createdAt || document.issueDate).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge 
                              className={
                                document.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                              }
                            >
                              {getStatusIcon(document.status)}
                              <span className="ml-1">{document.status}</span>
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => handleApproveDocument(document._id!)}
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleRejectDocument(document._id!)}
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle>Document Status Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['Approved', 'Pending', 'Draft', 'Rejected'].map((status) => {
                      const count = documents.filter(doc => doc.status === status).length;
                      const percentage = documents.length > 0 ? (count / documents.length) * 100 : 0;
                      const colors = {
                        Approved: 'bg-green-500',
                        Pending: 'bg-yellow-500',
                        Draft: 'bg-gray-500',
                        Rejected: 'bg-red-500'
                      };
                      return (
                        <div key={status} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(status)}
                              <span className="text-sm font-medium">{status}</span>
                            </div>
                            <span className="text-sm text-gray-600">{count} ({Math.round(percentage)}%)</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-300 ${colors[status as keyof typeof colors]}`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle>Category Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {categories.map((category) => {
                      const count = documents.filter(doc => doc.categoryId === category._id).length;
                      const percentage = documents.length > 0 ? (count / documents.length) * 100 : 0;
                      return (
                        <div key={category._id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">{category.prefix}</Badge>
                              <span className="text-sm font-medium">{category.name}</span>
                            </div>
                            <span className="text-sm text-gray-600">{count} documents</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Dialogs */}
      {editingCategory && (
        <Dialog open={!!editingCategory} onOpenChange={() => setEditingCategory(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Category</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-category-name">Category Name</Label>
                <Input
                  id="edit-category-name"
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-category-prefix">Prefix</Label>
                <Input
                  id="edit-category-prefix"
                  value={editingCategory.prefix}
                  onChange={(e) => setEditingCategory({ ...editingCategory, prefix: e.target.value.toUpperCase() })}
                />
              </div>
              <div>
                <Label htmlFor="edit-category-description">Description</Label>
                <Input
                  id="edit-category-description"
                  value={editingCategory.description || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleUpdateCategory}>Update</Button>
                <Button variant="outline" onClick={() => setEditingCategory(null)}>Cancel</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {editingStaff && (
        <Dialog open={!!editingStaff} onOpenChange={() => setEditingStaff(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Staff Member</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-staff-name">Name</Label>
                <Input
                  id="edit-staff-name"
                  value={editingStaff.name}
                  onChange={(e) => setEditingStaff({ ...editingStaff, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-staff-email">Email</Label>
                <Input
                  id="edit-staff-email"
                  type="email"
                  value={editingStaff.email}
                  onChange={(e) => setEditingStaff({ ...editingStaff, email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-staff-role">Role</Label>
                <Input
                  id="edit-staff-role"
                  value={editingStaff.role}
                  onChange={(e) => setEditingStaff({ ...editingStaff, role: e.target.value })}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={() => {/* handleUpdateStaff */}}>Update</Button>
                <Button variant="outline" onClick={() => setEditingStaff(null)}>Cancel</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {editingLetterType && (
        <Dialog open={!!editingLetterType} onOpenChange={() => setEditingLetterType(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Letter Type</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-letter-type-name">Letter Type Name</Label>
                <Input
                  id="edit-letter-type-name"
                  value={editingLetterType.name}
                  onChange={(e) => setEditingLetterType({ ...editingLetterType, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-letter-type-category">Category</Label>
                <Select
                  value={editingLetterType.categoryId}
                  onValueChange={(value) => setEditingLetterType({ ...editingLetterType, categoryId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-letter-type-description">Description</Label>
                <Input
                  id="edit-letter-type-description"
                  value={editingLetterType.description || ''}
                  onChange={(e) => setEditingLetterType({ ...editingLetterType, description: e.target.value })}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleUpdateLetterType}>Update</Button>
                <Button variant="outline" onClick={() => setEditingLetterType(null)}>Cancel</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ModernAdminDashboard;
