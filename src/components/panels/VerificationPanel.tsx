import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UserCheck, Search, CheckCircle, XCircle, Shield, Download, Calendar, User, Building } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export function VerificationPanel({ onLogout }: { onLogout: () => void }) {
  const [categoryCode, setCategoryCode] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Mock database of documents for verification
  const mockDocuments = {
    "INT-2025-0001": {
      id: "INT-2025-0001",
      type: "Internship Certificate",
      recipient: "Alice Johnson",
      recipientEmail: "alice@email.com",
      position: "Software Development Intern",
      company: "TechCorp Solutions",
      startDate: "2024-06-01",
      endDate: "2024-12-01",
      issuedBy: "John Doe",
      issuedDate: "2025-01-15",
      status: "Active",
      isValid: true
    },
    "OFR-2025-0010": {
      id: "OFR-2025-0010",
      type: "Offer Letter",
      recipient: "Bob Smith",
      recipientEmail: "bob@email.com",
      position: "Senior Developer",
      company: "TechCorp Solutions",
      salary: "$85,000",
      startDate: "2025-02-01",
      issuedBy: "Jane Smith",
      issuedDate: "2025-01-14",
      status: "Active",
      isValid: true
    },
    "EXP-2025-0005": {
      id: "EXP-2025-0005",
      type: "Experience Letter",
      recipient: "Carol Wilson",
      recipientEmail: "carol@email.com",
      position: "Project Manager",
      company: "TechCorp Solutions",
      startDate: "2022-03-01",
      endDate: "2024-12-31",
      issuedBy: "John Doe",
      issuedDate: "2025-01-13",
      status: "Active",
      isValid: true
    }
  };

  const categories = [
    { name: "Internship Certificate", code: "INT" },
    { name: "Offer Letter", code: "OFR" },
    { name: "Experience Letter", code: "EXP" },
    { name: "Joining Letter", code: "JOI" },
    { name: "Relieving Letter", code: "REL" },
  ];

  const verifyDocument = async () => {
    if (!categoryCode || !documentNumber) {
      toast({ title: "Please fill in all fields", variant: "destructive" });
      return;
    }

    setIsVerifying(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const documentId = `${categoryCode}-${documentNumber}`;
    const document = mockDocuments[documentId as keyof typeof mockDocuments];

    if (document) {
      setVerificationResult(document);
      toast({ title: "Document verified successfully!", description: "Document is valid and authentic." });
    } else {
      setVerificationResult({
        isValid: false,
        message: "Document not found or invalid",
        searchedId: documentId
      });
      toast({ title: "Document not found", description: "The document ID is invalid or does not exist.", variant: "destructive" });
    }

    setIsVerifying(false);
  };

  const resetVerification = () => {
    setCategoryCode("");
    setDocumentNumber("");
    setVerificationResult(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <UserCheck className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">Document Verification Portal</h1>
              <p className="text-sm text-muted-foreground">Verify the authenticity of official documents</p>
            </div>
          </div>
          <Button variant="outline" onClick={onLogout}>
            Logout
          </Button>
        </div>
      </header>

      <div className="p-6 max-w-4xl mx-auto">
        {/* Verification Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Document Verification
            </CardTitle>
            <CardDescription>
              Enter the document category and ID to verify authenticity
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="category">Document Category</Label>
                <Select value={categoryCode} onValueChange={setCategoryCode}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.code} value={category.code}>
                        {category.name} ({category.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="documentNumber">Document Number</Label>
                <Input
                  id="documentNumber"
                  value={documentNumber}
                  onChange={(e) => setDocumentNumber(e.target.value)}
                  placeholder="e.g., 2025-0001"
                  maxLength={9}
                />
              </div>
            </div>

            {categoryCode && documentNumber && (
              <Alert>
                <AlertDescription>
                  <strong>Verifying:</strong> {categoryCode}-{documentNumber}
                </AlertDescription>
              </Alert>
            )}

            <div className="flex gap-4">
              <Button 
                onClick={verifyDocument} 
                disabled={!categoryCode || !documentNumber || isVerifying}
                className="flex-1"
              >
                <Search className="h-4 w-4 mr-2" />
                {isVerifying ? "Verifying..." : "Verify Document"}
              </Button>
              <Button variant="outline" onClick={resetVerification}>
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Verification Result */}
        {verificationResult && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {verificationResult.isValid ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span className="text-success">Document Verified</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5 text-destructive" />
                    <span className="text-destructive">Document Invalid</span>
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {verificationResult.isValid ? (
                <div className="space-y-6">
                  {/* Document Details */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Recipient</p>
                          <p className="font-medium">{verificationResult.recipient}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Company</p>
                          <p className="font-medium">{verificationResult.company}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Issue Date</p>
                          <p className="font-medium">{verificationResult.issuedDate}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Document Type</p>
                        <Badge variant="default" className="mt-1">
                          {verificationResult.type}
                        </Badge>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground">Position/Role</p>
                        <p className="font-medium">{verificationResult.position}</p>
                      </div>

                      {verificationResult.salary && (
                        <div>
                          <p className="text-sm text-muted-foreground">Salary/CTC</p>
                          <p className="font-medium">{verificationResult.salary}</p>
                        </div>
                      )}

                      {verificationResult.startDate && (
                        <div>
                          <p className="text-sm text-muted-foreground">
                            {verificationResult.endDate ? "Duration" : "Start Date"}
                          </p>
                          <p className="font-medium">
                            {verificationResult.startDate}
                            {verificationResult.endDate && ` to ${verificationResult.endDate}`}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status and Actions */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <Badge variant="default" className="bg-success">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified & Active
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        Issued by: {verificationResult.issuedBy}
                      </span>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download Certificate
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-destructive mb-2">Document Not Found</h3>
                  <p className="text-muted-foreground mb-4">
                    The document ID "{verificationResult.searchedId}" could not be verified.
                  </p>
                  <Alert>
                    <AlertDescription>
                      This document may be invalid, expired, or the ID was entered incorrectly. 
                      Please verify the document details and try again.
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Demo Information */}
        {!verificationResult && (
          <Card>
            <CardHeader>
              <CardTitle>Demo Document IDs</CardTitle>
              <CardDescription>Use these sample document IDs to test the verification system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-3">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="font-mono text-sm font-medium">INT-2025-0001</p>
                  <p className="text-xs text-muted-foreground">Internship Certificate</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="font-mono text-sm font-medium">OFR-2025-0010</p>
                  <p className="text-xs text-muted-foreground">Offer Letter</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="font-mono text-sm font-medium">EXP-2025-0005</p>
                  <p className="text-xs text-muted-foreground">Experience Letter</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}