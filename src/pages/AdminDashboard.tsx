
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Download, LogOut, FileText, Users, Settings, Filter, CheckCircle, XCircle, Shield, TrendingUp, Clock, Building } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { AddDocumentForm } from "@/components/admin/AddDocumentForm";

interface Document {
  id: string;
  letterNumber: string;
  referenceNumber: string;
  documentType: string;
  issuedTo: string;
  dateOfIssue: string;
  status: string;
  createdBy: string;
  approvalStatus: "Pending" | "Approved" | "Rejected";
  letterCategory: string;
  issuedBy: string;
  department: string;
}

export default function AdminDashboard() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [approvalFilter, setApprovalFilter] = useState("all");
  
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "1",
      letterNumber: "RIPL/2025-26/001",
      referenceNumber: "OTAL/2025-26/001",
      documentType: "Appointment Letter",
      letterCategory: "Employment",
      issuedTo: "John Doe",
      issuedBy: "HR Manager",
      department: "Human Resources",
      dateOfIssue: "2024-01-15",
      status: "Active",
      createdBy: "HR Manager",
      approvalStatus: "Pending"
    },
    {
      id: "2",
      letterNumber: "INT-2025-0001",
      referenceNumber: "INT/2025/001",
      documentType: "Internship Certificate",
      letterCategory: "Certificate",
      issuedTo: "Jane Smith",
      issuedBy: "Operations Head",
      department: "Operations",
      dateOfIssue: "2024-01-16",
      status: "Active",
      createdBy: "Operations Head",
      approvalStatus: "Approved"
    },
    {
      id: "3",
      letterNumber: "OFR-2025-0010",
      referenceNumber: "OFR/2025/010",
      documentType: "Offer Letter",
      letterCategory: "Employment",
      issuedTo: "Mike Johnson",
      issuedBy: "Managing Director",
      department: "Administration",
      dateOfIssue: "2024-01-17",
      status: "Active",
      createdBy: "HR Executive",
      approvalStatus: "Approved"
    }
  ]);

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = 
      doc.letterNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.issuedTo.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === "all" || doc.documentType === filterType;
    const matchesApproval = approvalFilter === "all" || doc.approvalStatus.toLowerCase() === approvalFilter;
    
    return matchesSearch && matchesFilter && matchesApproval;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
      case "Archived":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Archived</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getApprovalBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>;
      case "Pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
      case "Rejected":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleApprove = (docId: string) => {
    setDocuments(documents.map(doc => 
      doc.id === docId ? { ...doc, approvalStatus: "Approved" as const } : doc
    ));
    toast({ 
      title: "Document Approved", 
      description: "Document has been approved successfully",
      className: "bg-primary text-primary-foreground"
    });
  };

  const handleReject = (docId: string) => {
    setDocuments(documents.map(doc => 
      doc.id === docId ? { ...doc, approvalStatus: "Rejected" as const } : doc
    ));
    toast({ 
      title: "Document Rejected", 
      description: "Document has been rejected",
      variant: "destructive"
    });
  };

  const handleDownload = (letterNumber: string) => {
    console.log(`Downloading PDF for ${letterNumber}`);
    toast({ 
      title: "PDF Downloaded", 
      description: "Document PDF has been downloaded successfully",
      className: "bg-primary text-primary-foreground"
    });
  };

  const handleDocumentAdded = () => {
    // Refresh documents list or perform any necessary updates
    toast({ 
      title: "Document Added", 
      description: "New document has been created successfully",
      className: "bg-primary text-primary-foreground"
    });
  };

  const stats = {
    totalDocuments: documents.length,
    pendingApprovals: documents.filter(d => d.approvalStatus === "Pending").length,
    approvedDocuments: documents.filter(d => d.approvalStatus === "Approved").length,
    activeDocuments: documents.filter(d => d.status === "Active").length
  };

  return (
    <div className="min-h-screen bg-dark-gradient">
      {/* Animated Header */}
      <header className="bg-card/95 backdrop-blur-sm border-b border-primary/20 animate-fade-in">
        <div className="flex h-20 items-center justify-between px-6 max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-saffron-gradient rounded-xl animate-pulse-hover">
              <Shield className="h-8 w-8 text-black" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground">Complete Document Management System</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/verify">
              <Button variant="outline" className="hover-lift border-primary/20 hover:bg-primary/10">
                <FileText className="h-4 w-4 mr-2" />
                Verification Portal
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline" className="hover-lift border-primary/20 hover:bg-primary/10">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="p-6 max-w-7xl mx-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 animate-fade-in">
          <Card className="glass-effect hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Documents</p>
                  <p className="text-3xl font-bold text-primary">{stats.totalDocuments}</p>
                </div>
                <div className="p-3 bg-primary/10 rounded-lg">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Approvals</p>
                  <p className="text-3xl font-bold text-yellow-600">{stats.pendingApprovals}</p>
                </div>
                <div className="p-3 bg-yellow-500/10 rounded-lg">
                  <Clock className="h-8 w-8 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Approved Documents</p>
                  <p className="text-3xl font-bold text-green-600">{stats.approvedDocuments}</p>
                </div>
                <div className="p-3 bg-green-500/10 rounded-lg">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Documents</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.activeDocuments}</p>
                </div>
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <TrendingUp className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="documents" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-card/50 backdrop-blur-sm">
            <TabsTrigger value="documents" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Documents
            </TabsTrigger>
            <TabsTrigger value="management" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Management
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-6">
            <Card className="glass-effect animate-fade-in">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-3 text-2xl">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      Document Management & Approval
                    </CardTitle>
                    <CardDescription>Manage all documents and their approval status</CardDescription>
                  </div>
                  <AddDocumentForm onDocumentAdded={handleDocumentAdded} />
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by Letter No, Reference No, or Recipient Name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 h-12 border-primary/20 focus:border-primary hover-lift"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <Filter className="h-4 w-4 text-primary" />
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger className="w-48 h-12 border-primary/20 hover-lift">
                        <SelectValue placeholder="Filter by type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="Appointment Letter">Appointment Letter</SelectItem>
                        <SelectItem value="Internship Certificate">Internship Certificate</SelectItem>
                        <SelectItem value="Experience Letter">Experience Letter</SelectItem>
                        <SelectItem value="Offer Letter">Offer Letter</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={approvalFilter} onValueChange={setApprovalFilter}>
                      <SelectTrigger className="w-48 h-12 border-primary/20 hover-lift">
                        <SelectValue placeholder="Filter by approval" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="rounded-xl border border-primary/20 overflow-hidden bg-card/50">
                  <Table>
                    <TableHeader className="bg-primary/5">
                      <TableRow>
                        <TableHead className="font-semibold">Letter Number</TableHead>
                        <TableHead className="font-semibold">Reference Number</TableHead>
                        <TableHead className="font-semibold">Document Type</TableHead>
                        <TableHead className="font-semibold">Issued To</TableHead>
                        <TableHead className="font-semibold">Department</TableHead>
                        <TableHead className="font-semibold">Date</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="font-semibold">Approval</TableHead>
                        <TableHead className="text-right font-semibold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDocuments.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={9} className="h-32 text-center">
                            <div className="flex flex-col items-center justify-center text-muted-foreground">
                              <FileText className="h-12 w-12 mb-4 opacity-50" />
                              <p className="text-lg font-medium">No documents found</p>
                              <p className="text-sm">Try adjusting your search or filter criteria</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredDocuments.map((doc) => (
                          <TableRow key={doc.id} className="hover:bg-primary/5 transition-colors">
                            <TableCell className="font-medium font-mono text-sm">{doc.letterNumber}</TableCell>
                            <TableCell className="font-mono text-sm">{doc.referenceNumber}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="border-primary/20">{doc.documentType}</Badge>
                            </TableCell>
                            <TableCell className="font-medium">{doc.issuedTo}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Building className="h-4 w-4 text-primary" />
                                {doc.department}
                              </div>
                            </TableCell>
                            <TableCell>{new Date(doc.dateOfIssue).toLocaleDateString()}</TableCell>
                            <TableCell>{getStatusBadge(doc.status)}</TableCell>
                            <TableCell>{getApprovalBadge(doc.approvalStatus)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                {doc.approvalStatus === "Pending" && (
                                  <>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleApprove(doc.id)}
                                      className="hover:bg-green-50 hover:text-green-700 hover:border-green-300 hover-lift"
                                    >
                                      <CheckCircle className="h-4 w-4 mr-1" />
                                      Approve
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleReject(doc.id)}
                                      className="hover:bg-red-50 hover:text-red-700 hover:border-red-300 hover-lift"
                                    >
                                      <XCircle className="h-4 w-4 mr-1" />
                                      Reject
                                    </Button>
                                  </>
                                )}
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDownload(doc.letterNumber)}
                                  className="hover:bg-primary/10 hover:text-primary hover:border-primary hover-lift hover-glow"
                                >
                                  <Download className="h-4 w-4 mr-1" />
                                  PDF
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Management Tab */}
          <TabsContent value="management" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="glass-effect hover-lift animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    User Management
                  </CardTitle>
                  <CardDescription>Manage system users and permissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">System Administrator</p>
                        <p className="text-sm text-muted-foreground">Full system access</p>
                      </div>
                      <Badge className="bg-primary text-primary-foreground">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">Document Officer</p>
                        <p className="text-sm text-muted-foreground">Document management access</p>
                      </div>
                      <Badge className="bg-primary text-primary-foreground">Active</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-effect hover-lift animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Settings className="h-5 w-5 text-primary" />
                    </div>
                    System Settings
                  </CardTitle>
                  <CardDescription>Configure system parameters</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="font-medium">Document Security</Label>
                      <Badge className="bg-green-500 text-white">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="font-medium">Auto Verification</Label>
                      <Badge className="bg-primary text-primary-foreground">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="font-medium">PDF Protection</Label>
                      <Badge className="bg-green-500 text-white">Enabled</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card className="glass-effect hover-lift animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  System Analytics
                </CardTitle>
                <CardDescription>Overview of system performance and usage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center p-6 bg-primary/5 rounded-lg hover-lift">
                    <h3 className="text-2xl font-bold text-primary mb-2">156</h3>
                    <p className="text-sm text-muted-foreground">Documents This Month</p>
                  </div>
                  <div className="text-center p-6 bg-green-500/10 rounded-lg hover-lift">
                    <h3 className="text-2xl font-bold text-green-600 mb-2">94%</h3>
                    <p className="text-sm text-muted-foreground">Verification Success Rate</p>
                  </div>
                  <div className="text-center p-6 bg-blue-500/10 rounded-lg hover-lift">
                    <h3 className="text-2xl font-bold text-blue-600 mb-2">2.3s</h3>
                    <p className="text-sm text-muted-foreground">Average Verification Time</p>
                  </div>
                  <div className="text-center p-6 bg-purple-500/10 rounded-lg hover-lift">
                    <h3 className="text-2xl font-bold text-purple-600 mb-2">1,247</h3>
                    <p className="text-sm text-muted-foreground">Total Verifications</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
