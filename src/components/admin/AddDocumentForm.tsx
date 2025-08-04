
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, FileText, RefreshCw } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { apiService } from "@/services/apiService";

interface Category {
  _id: string;
  name: string;
  prefix: string;
  description?: string;
  isActive: boolean;
}

interface LetterType {
  _id: string;
  name: string;
  categoryId: string;
  description?: string;
  isActive: boolean;
}

interface AddDocumentFormProps {
  onDocumentAdded: () => void;
}

export function AddDocumentForm({ onDocumentAdded }: AddDocumentFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [letterTypes, setLetterTypes] = useState<LetterType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    categoryId: "",
    letterTypeId: "",
    letterNumber: "",
    referenceNumber: "",
    issueDate: "",
    content: "",
    status: "Draft"
  });

  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [categoriesData, letterTypesData] = await Promise.all([
        apiService.getCategories(),
        apiService.getLetterTypes()
      ]);
      
      setCategories(categoriesData.filter((cat: Category) => cat.isActive));
      setLetterTypes(letterTypesData.filter((type: LetterType) => type.isActive));
    } catch (error) {
      console.error('Error loading data:', error);
      toast({ 
        title: "Error", 
        description: "Failed to load categories and letter types",
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateLetterNumber = () => {
    const category = categories.find(cat => cat._id === formData.categoryId);
    if (category) {
      const year = new Date().getFullYear();
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      return `${category.prefix}/${year}/${random}`;
    }
    return '';
  };

  const generateReferenceNumber = () => {
    const category = categories.find(cat => cat._id === formData.categoryId);
    if (category) {
      const date = new Date();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
      return `REF/${category.prefix}/${month}${year}/${random}`;
    }
    return '';
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast({ title: "Validation Error", description: "Title is required", variant: "destructive" });
      return false;
    }
    if (!formData.categoryId) {
      toast({ title: "Validation Error", description: "Category is required", variant: "destructive" });
      return false;
    }
    if (!formData.letterTypeId) {
      toast({ title: "Validation Error", description: "Letter type is required", variant: "destructive" });
      return false;
    }
    if (!formData.content.trim()) {
      toast({ title: "Validation Error", description: "Content is required", variant: "destructive" });
      return false;
    }
    if (!formData.issueDate) {
      toast({ title: "Validation Error", description: "Issue date is required", variant: "destructive" });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const documentData = {
        title: formData.title.trim(),
        categoryId: formData.categoryId,
        letterTypeId: formData.letterTypeId,
        letterNumber: formData.letterNumber || generateLetterNumber(),
        referenceNumber: formData.referenceNumber || generateReferenceNumber(),
        issueDate: formData.issueDate,
        content: formData.content.trim(),
        status: formData.status
      };

      await apiService.createDocument(documentData);
      
      toast({ 
        title: "Document Created Successfully!", 
        description: `Document has been created with letter number: ${documentData.letterNumber}` 
      });
      
      // Reset form
      setFormData({
        title: "",
        categoryId: "",
        letterTypeId: "",
        letterNumber: "",
        referenceNumber: "",
        issueDate: "",
        content: "",
        status: "Draft"
      });
      
      setIsOpen(false);
      onDocumentAdded();
    } catch (error: any) {
      console.error('Error creating document:', error);
      toast({ 
        title: "Error", 
        description: error.message || "Failed to create document. Please try again.",
        variant: "destructive" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    setFormData({
      ...formData,
      categoryId,
      letterTypeId: "", // Reset letter type when category changes
      letterNumber: "", // Reset letter number
      referenceNumber: "" // Reset reference number
    });
  };

  const filteredLetterTypes = letterTypes.filter(type => type.categoryId === formData.categoryId);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground animate-pulse-hover hover-lift">
          <Plus className="h-4 w-4 mr-2" />
          Add New Document
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FileText className="h-6 w-6 text-primary" />
            Create New Document
          </DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new official document
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-6 h-6 animate-spin text-primary mr-2" />
            <span>Loading categories and letter types...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Document Information */}
            <Card className="hover-lift">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Document Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-sm font-medium">Document Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Enter document title"
                    className="mt-1"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="categoryId" className="text-sm font-medium">Category *</Label>
                    <Select 
                      value={formData.categoryId} 
                      onValueChange={handleCategoryChange}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category._id} value={category._id}>
                            <div className="flex items-center gap-2">
                              <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
                                {category.prefix}
                              </span>
                              {category.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="letterTypeId" className="text-sm font-medium">Letter Type *</Label>
                    <Select 
                      value={formData.letterTypeId} 
                      onValueChange={(value) => setFormData({...formData, letterTypeId: value})}
                      disabled={isSubmitting || !formData.categoryId}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select letter type" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredLetterTypes.map((type) => (
                          <SelectItem key={type._id} value={type._id}>{type.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="letterNumber" className="text-sm font-medium">Letter Number</Label>
                    <Input
                      id="letterNumber"
                      value={formData.letterNumber}
                      onChange={(e) => setFormData({...formData, letterNumber: e.target.value})}
                      placeholder="Auto-generated"
                      className="mt-1"
                      disabled={isSubmitting}
                    />
                    <p className="text-xs text-gray-500 mt-1">Leave empty for auto-generation</p>
                  </div>

                  <div>
                    <Label htmlFor="referenceNumber" className="text-sm font-medium">Reference Number</Label>
                    <Input
                      id="referenceNumber"
                      value={formData.referenceNumber}
                      onChange={(e) => setFormData({...formData, referenceNumber: e.target.value})}
                      placeholder="Auto-generated"
                      className="mt-1"
                      disabled={isSubmitting}
                    />
                    <p className="text-xs text-gray-500 mt-1">Leave empty for auto-generation</p>
                  </div>

                  <div>
                    <Label htmlFor="issueDate" className="text-sm font-medium">Issue Date *</Label>
                    <Input
                      id="issueDate"
                      type="date"
                      value={formData.issueDate}
                      onChange={(e) => setFormData({...formData, issueDate: e.target.value})}
                      className="mt-1"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="status" className="text-sm font-medium">Status</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value) => setFormData({...formData, status: value})}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Draft">Draft</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Approved">Approved</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="content" className="text-sm font-medium">Document Content *</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    placeholder="Enter the document content..."
                    rows={6}
                    className="mt-1"
                    disabled={isSubmitting}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-primary hover:bg-primary/90 hover-glow"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="animate-spin h-4 w-4 mr-2" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Document
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
