
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Users, FileText, Plus, Trash2, Edit, Shield, Settings, Filter, Search, CheckCircle, XCircle, Clock, Eye, Download, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Staff {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "Active" | "Inactive";
  createdAt: string;
}

interface LetterTemplate {
  id: string;
  name: string;
  category: string;
  fields: string[];
  content: string;
  status: "Active" | "Draft";
}

interface DocumentIssuer {
  id: string;
  name: string;
  designation: string;
  department: string;
  signature: string;
  status: "Active" | "Inactive";
}

interface Category {
  id: string;
  name: string;
  code: string;
  prefix: string;
  description: string;
  status: "Active" | "Inactive";
}

interface Document {
  id: string;
  letterNumber: string;
  referenceNumber: string;
  type: string;
  recipient: string;
  issuer: string;
  status: "Pending" | "Approved" | "Rejected" | "Live";
  dateCreated: string;
  dateApproved?: string;
}

export function AdminPanel({ onLogout }: { onLogout: () => void }) {
  const { toast } = useToast();
  
  // Mock data states
  const [staff, setStaff] = useState<Staff[]>([
    { id: "1", name: "John Doe", email: "john@example.com", role: "Staff", status: "Active", createdAt: "2024-01-15" },
    { id: "2", name: "Jane Smith", email: "jane@example.com", role: "Senior Staff", status: "Active", createdAt: "2024-01-10" },
  ]);

  const [templates, setTemplates] = useState<LetterTemplate[]>([
    { id: "1", name: "Offer Letter", category: "Employment", fields: ["name", "position", "salary"], content: "Template content...", status: "Active" },
    { id: "2", name: "Experience Letter", category: "Employment", fields: ["name", "duration"], content: "Template content...", status: "Active" },
  ]);

  const [issuers, setIssuers] = useState<DocumentIssuer[]>([
    { id: "1", name: "Dr. Smith", designation: "Director", department: "HR", signature: "signature.png", status: "Active" },
    { id: "2", name: "Mr. Johnson", designation: "Manager", department: "Operations", signature: "signature2.png", status: "Active" },
  ]);

  const [categories, setCategories] = useState<Category[]>([
    { id: "1", name: "Offer Letter", code: "OFR", prefix: "OTAL", description: "Employment offer letters", status: "Active" },
    { id: "2", name: "Experience Letter", code: "EXP", prefix: "EXP", description: "Work experience certificates", status: "Active" },
    { id: "3", name: "Internship Certificate", code: "INT", prefix: "INT", description: "Internship completion certificates", status: "Active" },
  ]);

  const [documents, setDocuments] = useState<Document[]>([
    { id: "1", letterNumber: "RIPL/2025-26/001", referenceNumber: "OTAL-2025-001", type: "Offer Letter", recipient: "John Doe", issuer: "Dr. Smith", status: "Pending", dateCreated: "2024-01-15" },
    { id: "2", letterNumber: "RIPL/2025-26/002", referenceNumber: "EXP-2025-001", type: "Experience Letter", recipient: "Jane Smith", issuer: "Mr. Johnson", status: "Approved", dateCreated: "2024-01-14", dateApproved: "2024-01-15" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Form states
  const [newStaff, setNewStaff] = useState({ name: "", email: "", role: "" });
  const [newTemplate, setNewTemplate] = useState({ name: "", category: "", fields: "", content: "" });
  const [newIssuer, setNewIssuer] = useState({ name: "", designation: "", department: "" });
  const [newCategory, setNewCategory] = useState({ name: "", code: "", prefix: "", description: "" });
  
  // Edit states
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<LetterTemplate | null>(null);
  const [editingIssuer, setEditingIssuer] = useState<DocumentIssuer | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  
  // Modal states
  const [showStaffDialog, setShowStaffDialog] = useState(false);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [showIssuerDialog, setShowIssuerDialog] = useState(false);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);

  const generateLetterNumber = () => {
    const year = new Date().getFullYear();
    const nextYear = year + 1;
    const count = documents.length + 1;
    return `RIPL/${year}-${String(nextYear).slice(-2)}/${String(count).padStart(3, '0')}`;
  };

  const generateReferenceNumber = (categoryCode: string) => {
    const year = new Date().getFullYear();
    const categoryDocs = documents.filter(doc => doc.referenceNumber.startsWith(categoryCode)).length + 1;
    return `${categoryCode}-${year}-${String(categoryDocs).padStart(3, '0')}`;
  };

  const addStaff = () => {
    if (!newStaff.name || !newStaff.email || !newStaff.role) {
      toast({ title: "Error", description: "Please fill all fields", variant: "destructive" });
      return;
    }
    
    const staffMember: Staff = {
      id: String(staff.length + 1),
      ...newStaff,
      status: "Active",
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setStaff([...staff, staffMember]);
    setNewStaff({ name: "", email: "", role: "" });
    setShowStaffDialog(false);
    toast({ title: "Success", description: "Staff member added successfully" });
  };

  const updateStaff = () => {
    if (!editingStaff || !editingStaff.name || !editingStaff.email || !editingStaff.role) {
      toast({ title: "Error", description: "Please fill all fields", variant: "destructive" });
      return;
    }
    
    setStaff(staff.map(s => s.id === editingStaff.id ? editingStaff : s));
    setEditingStaff(null);
    setShowStaffDialog(false);
    toast({ title: "Success", description: "Staff member updated successfully" });
  };

  const removeStaff = (id: string) => {
    setStaff(staff.filter(s => s.id !== id));
    toast({ title: "Success", description: "Staff member removed" });
  };

  const toggleStaffStatus = (id: string) => {
    setStaff(staff.map(s => 
      s.id === id 
        ? { ...s, status: s.status === "Active" ? "Inactive" : "Active" }
        : s
    ));
    toast({ title: "Success", description: "Staff status updated" });
  };

  const addTemplate = () => {
    if (!newTemplate.name || !newTemplate.category) {
      toast({ title: "Error", description: "Please fill required fields", variant: "destructive" });
      return;
    }
    
    const template: LetterTemplate = {
      id: String(templates.length + 1),
      ...newTemplate,
      fields: newTemplate.fields.split(',').map(f => f.trim()),
      status: "Active"
    };
    
    setTemplates([...templates, template]);
    setNewTemplate({ name: "", category: "", fields: "", content: "" });
    setShowTemplateDialog(false);
    toast({ title: "Success", description: "Template created successfully" });
  };

  const updateTemplate = () => {
    if (!editingTemplate || !editingTemplate.name || !editingTemplate.category) {
      toast({ title: "Error", description: "Please fill required fields", variant: "destructive" });
      return;
    }
    
    setTemplates(templates.map(t => t.id === editingTemplate.id ? editingTemplate : t));
    setEditingTemplate(null);
    setShowTemplateDialog(false);
    toast({ title: "Success", description: "Template updated successfully" });
  };

  const removeTemplate = (id: string) => {
    setTemplates(templates.filter(t => t.id !== id));
    toast({ title: "Success", description: "Template removed" });
  };

  const toggleTemplateStatus = (id: string) => {
    setTemplates(templates.map(t => 
      t.id === id 
        ? { ...t, status: t.status === "Active" ? "Draft" : "Active" }
        : t
    ));
    toast({ title: "Success", description: "Template status updated" });
  };

  const addIssuer = () => {
    if (!newIssuer.name || !newIssuer.designation) {
      toast({ title: "Error", description: "Please fill required fields", variant: "destructive" });
      return;
    }
    
    const issuer: DocumentIssuer = {
      id: String(issuers.length + 1),
      ...newIssuer,
      signature: "default-signature.png",
      status: "Active"
    };
    
    setIssuers([...issuers, issuer]);
    setNewIssuer({ name: "", designation: "", department: "" });
    setShowIssuerDialog(false);
    toast({ title: "Success", description: "Document issuer added successfully" });
  };

  const updateIssuer = () => {
    if (!editingIssuer || !editingIssuer.name || !editingIssuer.designation) {
      toast({ title: "Error", description: "Please fill required fields", variant: "destructive" });
      return;
    }
    
    setIssuers(issuers.map(i => i.id === editingIssuer.id ? editingIssuer : i));
    setEditingIssuer(null);
    setShowIssuerDialog(false);
    toast({ title: "Success", description: "Issuer updated successfully" });
  };

  const removeIssuer = (id: string) => {
    setIssuers(issuers.filter(i => i.id !== id));
    toast({ title: "Success", description: "Issuer removed" });
  };

  const toggleIssuerStatus = (id: string) => {
    setIssuers(issuers.map(i => 
      i.id === id 
        ? { ...i, status: i.status === "Active" ? "Inactive" : "Active" }
        : i
    ));
    toast({ title: "Success", description: "Issuer status updated" });
  };

  const addCategory = () => {
    if (!newCategory.name || !newCategory.code || !newCategory.prefix) {
      toast({ title: "Error", description: "Please fill all fields", variant: "destructive" });
      return;
    }
    
    const category: Category = {
      id: String(categories.length + 1),
      ...newCategory,
      status: "Active"
    };
    
    setCategories([...categories, category]);
    setNewCategory({ name: "", code: "", prefix: "", description: "" });
    setShowCategoryDialog(false);
    toast({ title: "Success", description: "Category added successfully" });
  };

  const updateCategory = () => {
    if (!editingCategory || !editingCategory.name || !editingCategory.code || !editingCategory.prefix) {
      toast({ title: "Error", description: "Please fill all fields", variant: "destructive" });
      return;
    }
    
    setCategories(categories.map(c => c.id === editingCategory.id ? editingCategory : c));
    setEditingCategory(null);
    setShowCategoryDialog(false);
    toast({ title: "Success", description: "Category updated successfully" });
  };

  const removeCategory = (id: string) => {
    setCategories(categories.filter(c => c.id !== id));
    toast({ title: "Success", description: "Category removed" });
  };

  const toggleCategoryStatus = (id: string) => {
    setCategories(categories.map(c => 
      c.id === id 
        ? { ...c, status: c.status === "Active" ? "Inactive" : "Active" }
        : c
    ));
    toast({ title: "Success", description: "Category status updated" });
  };

  const approveDocument = (id: string) => {
    setDocuments(documents.map(doc => 
      doc.id === id 
        ? { ...doc, status: "Approved" as const, dateApproved: new Date().toISOString().split('T')[0] }
        : doc
    ));
    toast({ title: "Success", description: "Document approved and is now live" });
  };

  const rejectDocument = (id: string) => {
    setDocuments(documents.map(doc => 
      doc.id === id 
        ? { ...doc, status: "Rejected" as const }
        : doc
    ));
    toast({ title: "Success", description: "Document rejected" });
  };

  const viewDocument = (id: string) => {
    const doc = documents.find(d => d.id === id);
    if (doc) {
      toast({ title: "Document View", description: `Viewing ${doc.letterNumber}` });
      // In real app, this would open document viewer
    }
  };

  const downloadDocument = (id: string) => {
    const doc = documents.find(d => d.id === id);
    if (doc) {
      toast({ title: "Download Started", description: `Downloading ${doc.letterNumber}` });
      // In real app, this would trigger download
    }
  };

  const editDocument = (id: string) => {
    const doc = documents.find(d => d.id === id);
    if (doc) {
      toast({ title: "Edit Mode", description: `Editing ${doc.letterNumber}` });
      // In real app, this would open edit modal
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.letterNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || doc.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Approved": case "Live": return "bg-green-100 text-green-800";
      case "Pending": return "bg-yellow-100 text-yellow-800";
      case "Rejected": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold">Admin Panel</h1>
              <p className="text-sm text-muted-foreground">Complete System Management</p>
            </div>
          </div>
          <Button variant="outline" onClick={onLogout}>
            Logout
          </Button>
        </div>
      </header>

      <div className="p-6">
        <Tabs defaultValue="documents" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="staff">Staff</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="issuers">Issuers</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Document Management Tab */}
          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Document Management & Approval
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search documents..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Letter Number</TableHead>
                        <TableHead>Reference Number</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Recipient</TableHead>
                        <TableHead>Issuer</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDocuments.map((doc) => (
                        <TableRow key={doc.id}>
                          <TableCell className="font-mono text-sm">{doc.letterNumber}</TableCell>
                          <TableCell className="font-mono text-sm">{doc.referenceNumber}</TableCell>
                          <TableCell>{doc.type}</TableCell>
                          <TableCell>{doc.recipient}</TableCell>
                          <TableCell>{doc.issuer}</TableCell>
                          <TableCell>
                            <Badge className={getStatusBadgeColor(doc.status)}>
                              {doc.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{doc.dateCreated}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              {doc.status === "Pending" && (
                                <>
                                  <Button size="sm" variant="outline" onClick={() => approveDocument(doc.id)}>
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Approve
                                  </Button>
                                  <Button size="sm" variant="destructive" onClick={() => rejectDocument(doc.id)}>
                                    <XCircle className="h-4 w-4 mr-1" />
                                    Reject
                                  </Button>
                                </>
                              )}
                              <Button size="sm" variant="outline" onClick={() => viewDocument(doc.id)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => downloadDocument(doc.id)}>
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => editDocument(doc.id)}>
                                <Edit className="h-4 w-4" />
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

          {/* Staff Management Tab */}
          <TabsContent value="staff" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Staff Management
                  </div>
                  <Dialog open={showStaffDialog} onOpenChange={setShowStaffDialog}>
                    <DialogTrigger asChild>
                      <Button onClick={() => {
                        setEditingStaff(null);
                        setNewStaff({ name: "", email: "", role: "" });
                      }}>
                        <Plus className="h-4 w-4 mr-1" />
                        Add Staff
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{editingStaff ? "Edit Staff Member" : "Add New Staff Member"}</DialogTitle>
                        <DialogDescription>
                          {editingStaff ? "Update staff member details" : "Enter details for the new staff member"}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Input
                          placeholder="Staff Name"
                          value={editingStaff ? editingStaff.name : newStaff.name}
                          onChange={(e) => editingStaff 
                            ? setEditingStaff({...editingStaff, name: e.target.value})
                            : setNewStaff({...newStaff, name: e.target.value})
                          }
                        />
                        <Input
                          placeholder="Email"
                          type="email"
                          value={editingStaff ? editingStaff.email : newStaff.email}
                          onChange={(e) => editingStaff 
                            ? setEditingStaff({...editingStaff, email: e.target.value})
                            : setNewStaff({...newStaff, email: e.target.value})
                          }
                        />
                        <Input
                          placeholder="Role"
                          value={editingStaff ? editingStaff.role : newStaff.role}
                          onChange={(e) => editingStaff 
                            ? setEditingStaff({...editingStaff, role: e.target.value})
                            : setNewStaff({...newStaff, role: e.target.value})
                          }
                        />
                        <div className="flex gap-2">
                          <Button 
                            onClick={editingStaff ? updateStaff : addStaff}
                            className="flex-1"
                          >
                            {editingStaff ? "Update" : "Add"} Staff
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => setShowStaffDialog(false)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {staff.map((member) => (
                        <TableRow key={member.id}>
                          <TableCell>{member.name}</TableCell>
                          <TableCell>{member.email}</TableCell>
                          <TableCell>{member.role}</TableCell>
                          <TableCell>
                            <Badge variant={member.status === "Active" ? "default" : "secondary"}>
                              {member.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{member.createdAt}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => {
                                  setEditingStaff(member);
                                  setShowStaffDialog(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant={member.status === "Active" ? "secondary" : "default"}
                                onClick={() => toggleStaffStatus(member.id)}
                              >
                                {member.status === "Active" ? "Deactivate" : "Activate"}
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => removeStaff(member.id)}>
                                <Trash2 className="h-4 w-4" />
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

          {/* Template Management Tab */}
          <TabsContent value="templates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Letter Templates</span>
                  <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
                    <DialogTrigger asChild>
                      <Button onClick={() => {
                        setEditingTemplate(null);
                        setNewTemplate({ name: "", category: "", fields: "", content: "" });
                      }}>
                        <Plus className="h-4 w-4 mr-1" />
                        Add Template
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>{editingTemplate ? "Edit Template" : "Add New Template"}</DialogTitle>
                        <DialogDescription>
                          {editingTemplate ? "Update template details" : "Create a new letter template"}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <Input
                            placeholder="Template Name"
                            value={editingTemplate ? editingTemplate.name : newTemplate.name}
                            onChange={(e) => editingTemplate 
                              ? setEditingTemplate({...editingTemplate, name: e.target.value})
                              : setNewTemplate({...newTemplate, name: e.target.value})
                            }
                          />
                          <Input
                            placeholder="Category"
                            value={editingTemplate ? editingTemplate.category : newTemplate.category}
                            onChange={(e) => editingTemplate 
                              ? setEditingTemplate({...editingTemplate, category: e.target.value})
                              : setNewTemplate({...newTemplate, category: e.target.value})
                            }
                          />
                        </div>
                        <Input
                          placeholder="Fields (comma separated)"
                          value={editingTemplate ? editingTemplate.fields.join(', ') : newTemplate.fields}
                          onChange={(e) => editingTemplate 
                            ? setEditingTemplate({...editingTemplate, fields: e.target.value.split(',').map(f => f.trim())})
                            : setNewTemplate({...newTemplate, fields: e.target.value})
                          }
                        />
                        <Textarea
                          placeholder="Template Content"
                          value={editingTemplate ? editingTemplate.content : newTemplate.content}
                          onChange={(e) => editingTemplate 
                            ? setEditingTemplate({...editingTemplate, content: e.target.value})
                            : setNewTemplate({...newTemplate, content: e.target.value})
                          }
                          rows={6}
                        />
                        <div className="flex gap-2">
                          <Button 
                            onClick={editingTemplate ? updateTemplate : addTemplate}
                            className="flex-1"
                          >
                            {editingTemplate ? "Update" : "Add"} Template
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => setShowTemplateDialog(false)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {templates.map((template) => (
                    <Card key={template.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium">{template.name}</h4>
                            <p className="text-sm text-muted-foreground">{template.category}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Fields: {template.fields.join(', ')}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={template.status === "Active" ? "default" : "secondary"}>
                              {template.status}
                            </Badge>
                            <div className="flex gap-1">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => {
                                  setEditingTemplate(template);
                                  setShowTemplateDialog(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant={template.status === "Active" ? "secondary" : "default"}
                                onClick={() => toggleTemplateStatus(template.id)}
                              >
                                {template.status === "Active" ? "Draft" : "Activate"}
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive" 
                                onClick={() => removeTemplate(template.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Document Issuers Tab */}
          <TabsContent value="issuers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Document Issuers</span>
                  <Dialog open={showIssuerDialog} onOpenChange={setShowIssuerDialog}>
                    <DialogTrigger asChild>
                      <Button onClick={() => {
                        setEditingIssuer(null);
                        setNewIssuer({ name: "", designation: "", department: "" });
                      }}>
                        <Plus className="h-4 w-4 mr-1" />
                        Add Issuer
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{editingIssuer ? "Edit Issuer" : "Add New Issuer"}</DialogTitle>
                        <DialogDescription>
                          {editingIssuer ? "Update issuer details" : "Add a new document issuer"}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Input
                          placeholder="Issuer Name"
                          value={editingIssuer ? editingIssuer.name : newIssuer.name}
                          onChange={(e) => editingIssuer 
                            ? setEditingIssuer({...editingIssuer, name: e.target.value})
                            : setNewIssuer({...newIssuer, name: e.target.value})
                          }
                        />
                        <Input
                          placeholder="Designation"
                          value={editingIssuer ? editingIssuer.designation : newIssuer.designation}
                          onChange={(e) => editingIssuer 
                            ? setEditingIssuer({...editingIssuer, designation: e.target.value})
                            : setNewIssuer({...newIssuer, designation: e.target.value})
                          }
                        />
                        <Input
                          placeholder="Department"
                          value={editingIssuer ? editingIssuer.department : newIssuer.department}
                          onChange={(e) => editingIssuer 
                            ? setEditingIssuer({...editingIssuer, department: e.target.value})
                            : setNewIssuer({...newIssuer, department: e.target.value})
                          }
                        />
                        <div className="flex gap-2">
                          <Button 
                            onClick={editingIssuer ? updateIssuer : addIssuer}
                            className="flex-1"
                          >
                            {editingIssuer ? "Update" : "Add"} Issuer
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => setShowIssuerDialog(false)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Designation</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {issuers.map((issuer) => (
                        <TableRow key={issuer.id}>
                          <TableCell>{issuer.name}</TableCell>
                          <TableCell>{issuer.designation}</TableCell>
                          <TableCell>{issuer.department}</TableCell>
                          <TableCell>
                            <Badge variant={issuer.status === "Active" ? "default" : "secondary"}>
                              {issuer.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => {
                                  setEditingIssuer(issuer);
                                  setShowIssuerDialog(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant={issuer.status === "Active" ? "secondary" : "default"}
                                onClick={() => toggleIssuerStatus(issuer.id)}
                              >
                                {issuer.status === "Active" ? "Deactivate" : "Activate"}
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive" 
                                onClick={() => removeIssuer(issuer.id)}
                              >
                                <Trash2 className="h-4 w-4" />
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

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Document Categories</span>
                  <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
                    <DialogTrigger asChild>
                      <Button onClick={() => {
                        setEditingCategory(null);
                        setNewCategory({ name: "", code: "", prefix: "", description: "" });
                      }}>
                        <Plus className="h-4 w-4 mr-1" />
                        Add Category
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{editingCategory ? "Edit Category" : "Add New Category"}</DialogTitle>
                        <DialogDescription>
                          {editingCategory ? "Update category details" : "Create a new document category"}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                          <Input
                            placeholder="Category Name"
                            value={editingCategory ? editingCategory.name : newCategory.name}
                            onChange={(e) => editingCategory 
                              ? setEditingCategory({...editingCategory, name: e.target.value})
                              : setNewCategory({...newCategory, name: e.target.value})
                            }
                          />
                          <Input
                            placeholder="Code"
                            value={editingCategory ? editingCategory.code : newCategory.code}
                            onChange={(e) => editingCategory 
                              ? setEditingCategory({...editingCategory, code: e.target.value})
                              : setNewCategory({...newCategory, code: e.target.value})
                            }
                          />
                          <Input
                            placeholder="Prefix"
                            value={editingCategory ? editingCategory.prefix : newCategory.prefix}
                            onChange={(e) => editingCategory 
                              ? setEditingCategory({...editingCategory, prefix: e.target.value})
                              : setNewCategory({...newCategory, prefix: e.target.value})
                            }
                          />
                        </div>
                        <Textarea
                          placeholder="Description"
                          value={editingCategory ? editingCategory.description : newCategory.description}
                          onChange={(e) => editingCategory 
                            ? setEditingCategory({...editingCategory, description: e.target.value})
                            : setNewCategory({...newCategory, description: e.target.value})
                          }
                          rows={3}
                        />
                        <div className="flex gap-2">
                          <Button 
                            onClick={editingCategory ? updateCategory : addCategory}
                            className="flex-1"
                          >
                            {editingCategory ? "Update" : "Add"} Category
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => setShowCategoryDialog(false)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Code</TableHead>
                        <TableHead>Prefix</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {categories.map((category) => (
                        <TableRow key={category.id}>
                          <TableCell>{category.name}</TableCell>
                          <TableCell className="font-mono">{category.code}</TableCell>
                          <TableCell className="font-mono">{category.prefix}</TableCell>
                          <TableCell>
                            <Badge variant={category.status === "Active" ? "default" : "secondary"}>
                              {category.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => {
                                  setEditingCategory(category);
                                  setShowCategoryDialog(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant={category.status === "Active" ? "secondary" : "default"}
                                onClick={() => toggleCategoryStatus(category.id)}
                              >
                                {category.status === "Active" ? "Deactivate" : "Activate"}
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive" 
                                onClick={() => removeCategory(category.id)}
                              >
                                <Trash2 className="h-4 w-4" />
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

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Total Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{documents.length}</div>
                  <p className="text-xs text-muted-foreground">+2 from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Pending Approval</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{documents.filter(d => d.status === "Pending").length}</div>
                  <p className="text-xs text-muted-foreground">Requires attention</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Active Staff</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{staff.filter(s => s.status === "Active").length}</div>
                  <p className="text-xs text-muted-foreground">Total staff members</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Templates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{templates.length}</div>
                  <p className="text-xs text-muted-foreground">Available templates</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
