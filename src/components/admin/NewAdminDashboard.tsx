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
  Building, Hash, Calendar, RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { mockDataService, CategoryData, StaffData, LetterTypeData, DocumentData } from '@/services/mockDataService';

const NewAdminDashboard = ({ onLogout }: { onLogout: () => void }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [staff, setStaff] = useState<StaffData[]>([]);
  const [letterTypes, setLetterTypes] = useState<LetterTypeData[]>([]);
  const [documents, setDocuments] = useState<DocumentData[]>([]);

  // Load data from mock service
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [docsData, catsData, staffData, typesData] = await Promise.all([
        mockDataService.getDocuments(),
        mockDataService.getCategories(),
        mockDataService.getStaff(),
        mockDataService.getLetterTypes()
      ]);
      setDocuments(docsData);
      setCategories(catsData);
      setStaff(staffData);
      setLetterTypes(typesData);
      toast.success('Data loaded successfully');
    } catch (error) {
      toast.error('Failed to load data');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Form states
  const [newCategory, setNewCategory] = useState({ name: '', prefix: '' });
  const [newStaff, setNewStaff] = useState({ name: '', email: '', role: '' });
  const [newLetterType, setNewLetterType] = useState({ name: '', category_id: '' });
  const [editingCategory, setEditingCategory] = useState<CategoryData | null>(null);
  const [editingStaff, setEditingStaff] = useState<StaffData | null>(null);
  const [editingLetterType, setEditingLetterType] = useState<LetterTypeData | null>(null);

  // Category Management
  const handleAddCategory = async () => {
    if (!newCategory.name || !newCategory.prefix) {
      toast.error('Please fill in all fields');
      return;
    }
    
    const category: CategoryData = {
      id: Date.now().toString(),
      name: newCategory.name,
      prefix: newCategory.prefix.toUpperCase(),
      created_at: new Date().toISOString()
    };
    
    setCategories([...categories, category]);
    setNewCategory({ name: '', prefix: '' });
    toast.success('Category added successfully');
  };

  const handleDeleteCategory = async (id: string) => {
    setCategories(categories.filter(cat => cat.id !== id));
    toast.success('Category deleted successfully');
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory) return;
    
    setCategories(categories.map(cat => 
      cat.id === editingCategory.id ? editingCategory : cat
    ));
    setEditingCategory(null);
    toast.success('Category updated successfully');
  };

  // Staff Management
  const handleAddStaff = async () => {
    if (!newStaff.name || !newStaff.email || !newStaff.role) {
      toast.error('Please fill in all fields');
      return;
    }
    
    const staffMember: StaffData = {
      id: Date.now().toString(),
      name: newStaff.name,
      email: newStaff.email,
      role: newStaff.role,
      created_at: new Date().toISOString()
    };
    
    setStaff([...staff, staffMember]);
    setNewStaff({ name: '', email: '', role: '' });
    toast.success('Staff member added successfully');
  };

  const handleDeleteStaff = async (id: string) => {
    setStaff(staff.filter(member => member.id !== id));
    toast.success('Staff member deleted successfully');
  };

  const handleUpdateStaff = async () => {
    if (!editingStaff) return;
    
    setStaff(staff.map(member => 
      member.id === editingStaff.id ? editingStaff : member
    ));
    setEditingStaff(null);
    toast.success('Staff member updated successfully');
  };

  // Letter Type Management
  const handleAddLetterType = async () => {
    if (!newLetterType.name || !newLetterType.category_id) {
      toast.error('Please fill in all fields');
      return;
    }
    
    const letterType: LetterTypeData = {
      id: Date.now().toString(),
      name: newLetterType.name,
      category_id: newLetterType.category_id,
      created_at: new Date().toISOString()
    };
    
    setLetterTypes([...letterTypes, letterType]);
    setNewLetterType({ name: '', category_id: '' });
    toast.success('Letter type added successfully');
  };

  const handleDeleteLetterType = async (id: string) => {
    setLetterTypes(letterTypes.filter(type => type.id !== id));
    toast.success('Letter type deleted successfully');
  };

  const handleUpdateLetterType = async () => {
    if (!editingLetterType) return;
    
    setLetterTypes(letterTypes.map(type => 
      type.id === editingLetterType.id ? editingLetterType : type
    ));
    setEditingLetterType(null);
    toast.success('Letter type updated successfully');
  };

  // Document Management
  const handleApproveDocument = async (id: string) => {
    const updatedDocuments = documents.map(doc => 
      doc.id === id ? { ...doc, status: 'Approved' as const } : doc
    );
    setDocuments(updatedDocuments);
    toast.success('Document approved successfully');
  };

  const handleRejectDocument = async (id: string) => {
    const updatedDocuments = documents.map(doc => 
      doc.id === id ? { ...doc, status: 'Rejected' as const } : doc
    );
    setDocuments(updatedDocuments);
    toast.success('Document rejected');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved': return <CheckCircle className="w-4 h-4" />;
      case 'Rejected': return <XCircle className="w-4 h-4" />;
      case 'Pending': return <Clock className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'Rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-6 h-6 animate-spin text-primary" />
          <span className="text-lg">Loading dashboard data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary rounded-xl">
                <Shield className="w-7 h-7 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
                <p className="text-muted-foreground">Complete system management for Letter Guard</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button onClick={loadData} variant="outline" size="icon">
                <RefreshCw className="w-4 h-4" />
              </Button>
              <ThemeToggle />
              <Button onClick={onLogout} variant="outline" className="flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                Back to Home
              </Button>
            </div>
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
                  <p className="text-blue-200 text-xs mt-2">All documents in system</p>
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
                  <p className="text-purple-100 text-sm font-medium mb-1">Approved Documents</p>
                  <p className="text-3xl font-bold">{documents.filter(d => d.status === 'Approved').length}</p>
                  <p className="text-purple-200 text-xs mt-2">Successfully processed</p>
                </div>
                <div className="p-3 bg-purple-400/30 rounded-lg">
                  <CheckCircle className="w-8 h-8" />
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
                      <div key={doc.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                        {getStatusIcon(doc.status)}
                        <div className="flex-1">
                          <p className="font-medium text-sm">{doc.subject}</p>
                          <p className="text-xs text-gray-500">
                            {doc.issuedTo} • {doc.issuedDate}
                          </p>
                        </div>
                        <Badge className={getStatusColor(doc.status)}>
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
                      <span className="font-semibold">Employment Letters</span>
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
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="md:col-span-2">
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
                  <div className="flex items-end">
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
                        <TableHead>Letter Types</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {categories.map((category) => (
                        <TableRow key={category.id}>
                          <TableCell className="font-medium">{category.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-mono">{category.prefix}</Badge>
                          </TableCell>
                          <TableCell>
                            {letterTypes.filter(lt => lt.category_id === category.id).length} types
                          </TableCell>
                          <TableCell>{new Date(category.created_at).toLocaleDateString()}</TableCell>
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
                                onClick={() => handleDeleteCategory(category.id)}
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
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                  <div>
                    <Label htmlFor="staff-name">Full Name</Label>
                    <Input
                      id="staff-name"
                      value={newStaff.name}
                      onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                      placeholder="John Doe"
                      className="h-11 mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="staff-email">Email Address</Label>
                    <Input
                      id="staff-email"
                      type="email"
                      value={newStaff.email}
                      onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                      placeholder="john@company.com"
                      className="h-11 mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="staff-role">Role/Position</Label>
                    <Input
                      id="staff-role"
                      value={newStaff.role}
                      onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                      placeholder="Document Manager"
                      className="h-11 mt-1"
                    />
                  </div>
                  <div className="md:col-span-2 flex items-end">
                    <Button onClick={handleAddStaff} className="w-full h-11">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Staff Member
                    </Button>
                  </div>
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
                        <TableRow key={member.id}>
                          <TableCell className="font-medium">{member.name}</TableCell>
                          <TableCell>{member.email}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{member.role}</Badge>
                          </TableCell>
                          <TableCell>
                            {documents.filter(d => d.issuedBy === member.name).length}
                          </TableCell>
                          <TableCell>{new Date(member.created_at).toLocaleDateString()}</TableCell>
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
                                onClick={() => handleDeleteStaff(member.id)}
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
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="md:col-span-2">
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
                      value={newLetterType.category_id}
                      onValueChange={(value) => setNewLetterType({ ...newLetterType, category_id: value })}
                    >
                      <SelectTrigger className="h-11 mt-1">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">{category.prefix}</Badge>
                              {category.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
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
                        <TableHead>Documents</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {letterTypes.map((letterType) => (
                        <TableRow key={letterType.id}>
                          <TableCell className="font-medium">{letterType.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {categories.find(cat => cat.id === letterType.category_id)?.name || 'Unknown'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {documents.filter(d => d.letterType === letterType.name).length}
                          </TableCell>
                          <TableCell>{new Date(letterType.created_at).toLocaleDateString()}</TableCell>
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
                                onClick={() => handleDeleteLetterType(letterType.id)}
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
                        <TableHead>Letter Number</TableHead>
                        <TableHead>Issued To</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Issue Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {documents.map((document) => (
                        <TableRow key={document.id}>
                          <TableCell>
                            <Badge variant="outline" className="font-mono">{document.letterNumber}</Badge>
                          </TableCell>
                          <TableCell className="font-medium">{document.issuedTo}</TableCell>
                          <TableCell>{document.letterCategory}</TableCell>
                          <TableCell>{document.subject}</TableCell>
                          <TableCell>{document.issuedDate}</TableCell>
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
                        <TableHead>Letter Number</TableHead>
                        <TableHead>Issued To</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {documents.filter(doc => doc.status === 'Pending' || doc.status === 'Draft').map((document) => (
                        <TableRow key={document.id}>
                          <TableCell>
                            <Badge variant="outline" className="font-mono">{document.letterNumber}</Badge>
                          </TableCell>
                          <TableCell className="font-medium">{document.issuedTo}</TableCell>
                          <TableCell>{document.subject}</TableCell>
                          <TableCell>{document.issuedDate}</TableCell>
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
                                onClick={() => handleApproveDocument(document.id)}
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleRejectDocument(document.id)}
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
                      const count = documents.filter(doc => doc.letterCategory === category.name).length;
                      const percentage = documents.length > 0 ? (count / documents.length) * 100 : 0;
                      return (
                        <div key={category.id} className="space-y-2">
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
                <Button onClick={handleUpdateStaff}>Update</Button>
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
                  value={editingLetterType.category_id}
                  onValueChange={(value) => setEditingLetterType({ ...editingLetterType, category_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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

export default NewAdminDashboard;
