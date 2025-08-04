
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Settings, Plus, Trash2 } from 'lucide-react';
import { backendService, Category, LetterType } from '@/services/backendService';
import { toast } from 'sonner';

export function BackendSystemSettings() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [letterTypes, setLetterTypes] = useState<LetterType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newCategory, setNewCategory] = useState({ name: '', prefix: '', description: '' });
  const [newLetterType, setNewLetterType] = useState({ name: '', categoryId: '', description: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [cats, types] = await Promise.all([
        backendService.getCategories(),
        backendService.getLetterTypes()
      ]);
      setCategories(cats);
      setLetterTypes(types);
    } catch (error: any) {
      console.error('Failed to fetch data:', error);
      toast.error('Failed to fetch settings data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategory.name || !newCategory.prefix) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      await backendService.createCategory({
        ...newCategory,
        isActive: true
      });
      setNewCategory({ name: '', prefix: '', description: '' });
      await fetchData();
      toast.success('Category created successfully');
    } catch (error: any) {
      toast.error('Failed to create category: ' + error.message);
    }
  };

  const handleCreateLetterType = async () => {
    if (!newLetterType.name || !newLetterType.categoryId) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      await backendService.createLetterType({
        ...newLetterType,
        isActive: true
      });
      setNewLetterType({ name: '', categoryId: '', description: '' });
      await fetchData();
      toast.success('Letter type created successfully');
    } catch (error: any) {
      toast.error('Failed to create letter type: ' + error.message);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      await backendService.deleteCategory(id);
      await fetchData();
      toast.success('Category deleted successfully');
    } catch (error: any) {
      toast.error('Failed to delete category: ' + error.message);
    }
  };

  const handleDeleteLetterType = async (id: string) => {
    if (!confirm('Are you sure you want to delete this letter type?')) return;

    try {
      await backendService.deleteLetterType(id);
      await fetchData();
      toast.success('Letter type deleted successfully');
    } catch (error: any) {
      toast.error('Failed to delete letter type: ' + error.message);
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
          <Settings className="w-5 h-5" />
          System Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="categories" className="space-y-4">
          <TabsList>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="letterTypes">Letter Types</TabsTrigger>
          </TabsList>

          <TabsContent value="categories" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Category Management</h3>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Category
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Category</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="cat-name">Category Name</Label>
                      <Input
                        id="cat-name"
                        value={newCategory.name}
                        onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                        placeholder="e.g., Employment Letters"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cat-prefix">Prefix</Label>
                      <Input
                        id="cat-prefix"
                        value={newCategory.prefix}
                        onChange={(e) => setNewCategory({ ...newCategory, prefix: e.target.value.toUpperCase() })}
                        placeholder="e.g., EMP"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cat-desc">Description (Optional)</Label>
                      <Textarea
                        id="cat-desc"
                        value={newCategory.description}
                        onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                        placeholder="Category description"
                      />
                    </div>
                    <Button onClick={handleCreateCategory} className="w-full">
                      Create Category
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Prefix</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((cat) => (
                  <TableRow key={cat.id}>
                    <TableCell className="font-medium">{cat.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{cat.prefix}</Badge>
                    </TableCell>
                    <TableCell>{cat.description || 'N/A'}</TableCell>
                    <TableCell>{new Date(cat.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteCategory(cat.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="letterTypes" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Letter Types</h3>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Letter Type
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Letter Type</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="type-name">Letter Type Name</Label>
                      <Input
                        id="type-name"
                        value={newLetterType.name}
                        onChange={(e) => setNewLetterType({ ...newLetterType, name: e.target.value })}
                        placeholder="e.g., Offer Letter"
                      />
                    </div>
                    <div>
                      <Label htmlFor="type-category">Category</Label>
                      <select
                        id="type-category"
                        className="w-full p-2 border rounded"
                        value={newLetterType.categoryId}
                        onChange={(e) => setNewLetterType({ ...newLetterType, categoryId: e.target.value })}
                      >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="type-desc">Description (Optional)</Label>
                      <Textarea
                        id="type-desc"
                        value={newLetterType.description}
                        onChange={(e) => setNewLetterType({ ...newLetterType, description: e.target.value })}
                        placeholder="Letter type description"
                      />
                    </div>
                    <Button onClick={handleCreateLetterType} className="w-full">
                      Create Letter Type
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {letterTypes.map((type) => (
                  <TableRow key={type.id}>
                    <TableCell className="font-medium">{type.name}</TableCell>
                    <TableCell>
                      {categories.find(cat => cat.id === type.categoryId)?.name || 'Unknown'}
                    </TableCell>
                    <TableCell>{type.description || 'N/A'}</TableCell>
                    <TableCell>{new Date(type.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteLetterType(type.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
