
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle, FileText, Download, Calendar, User, Building, Home, Mail, Phone, MapPin, Truck, Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

export default function PublicVerification() {
  const [letterNumber, setLetterNumber] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [dateOfIssue, setDateOfIssue] = useState("");
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Enhanced mock database with all required fields
  const mockDocuments = {
    "RIPL/2025-26/02": {
      id: "RIPL/2025-26/02",
      referenceNumber: "OTAL/2025-26/01",
      letterCategory: "Employment",
      letterType: "Appointment Letter",
      issuedTo: "Manish Batham",
      issuedBy: "HR Manager - John Smith",
      issuedDepartment: "Human Resources",
      dispatchMode: "Email & Hand Delivery",
      dispatchDate: "06 April 2025",
      subject: "Appointment as Hospital Coordination Officer & Inside Sales Manager",
      description: "This letter confirms your appointment to the position of Hospital Coordination Officer & Inside Sales Manager at RIPL Healthcare effective from the date mentioned.",
      dateOfIssue: "05 April 2025",
      recipientEmail: "manish@email.com",
      recipientPhone: "+91 9876543210",
      recipientAddress: "123 Main Street, Mumbai, Maharashtra - 400001",
      status: "Active",
      isValid: true
    },
    "INT-2025-0001": {
      id: "INT-2025-0001",
      referenceNumber: "INT/2025/001",
      letterCategory: "Certificate",
      letterType: "Internship Certificate",
      issuedTo: "Alice Johnson",
      issuedBy: "Operations Head - Jane Doe",
      issuedDepartment: "Operations",
      dispatchMode: "Digital Portal",
      dispatchDate: "16 January 2025",
      subject: "Internship Completion Certificate - Software Development",
      description: "This certificate confirms the successful completion of 6-month internship program in Software Development department with excellent performance.",
      dateOfIssue: "15 January 2025",
      recipientEmail: "alice@email.com",
      recipientPhone: "+91 9876543211",
      recipientAddress: "456 Tech Avenue, Bangalore, Karnataka - 560001",
      status: "Active",
      isValid: true
    },
    "OFR-2025-0010": {
      id: "OFR-2025-0010",
      referenceNumber: "OFR/2025/010",
      letterCategory: "Employment",
      letterType: "Offer Letter",
      issuedTo: "Bob Smith",
      issuedBy: "Managing Director - Dr. Wilson",
      issuedDepartment: "Administration",
      dispatchMode: "Courier",
      dispatchDate: "15 January 2025",
      subject: "Job Offer - Senior Developer Position",
      description: "We are pleased to offer you the position of Senior Developer with our organization. This offer is subject to the terms and conditions mentioned in the detailed offer letter.",
      dateOfIssue: "14 January 2025",
      recipientEmail: "bob@email.com",
      recipientPhone: "+91 9876543212",
      recipientAddress: "789 Developer Street, Pune, Maharashtra - 411001",
      status: "Active",
      isValid: true
    }
  };

  const verifyDocument = async () => {
    if (!letterNumber || !referenceNumber || !dateOfIssue) {
      toast({ title: "Please fill in all fields", variant: "destructive" });
      return;
    }

    setIsVerifying(true);
    
    // Simulate API call delay with animation
    await new Promise(resolve => setTimeout(resolve, 2000));

    const document = mockDocuments[letterNumber as keyof typeof mockDocuments];

    if (document && document.referenceNumber === referenceNumber) {
      // Check if date matches
      const inputDate = new Date(dateOfIssue).toLocaleDateString('en-GB', { 
        day: '2-digit', 
        month: 'long', 
        year: 'numeric' 
      });
      const docDate = document.dateOfIssue;
      
      if (inputDate === docDate) {
        setVerificationResult(document);
        toast({ 
          title: "Document Verified Successfully!", 
          description: "Document is authentic and valid.",
          className: "bg-primary text-primary-foreground"
        });
      } else {
        setVerificationResult({
          isValid: false,
          message: "Date of issue does not match our records",
          searchedId: letterNumber
        });
        toast({ 
          title: "Verification Failed", 
          description: "Date of issue does not match records.", 
          variant: "destructive" 
        });
      }
    } else {
      setVerificationResult({
        isValid: false,
        message: "Document not found or reference number mismatch",
        searchedId: letterNumber
      });
      toast({ 
        title: "Document Not Found", 
        description: "Invalid document details or document does not exist.", 
        variant: "destructive" 
      });
    }

    setIsVerifying(false);
  };

  const resetVerification = () => {
    setLetterNumber("");
    setReferenceNumber("");
    setDateOfIssue("");
    setVerificationResult(null);
  };

  return (
    <div className="min-h-screen bg-dark-gradient">
      {/* Animated Header */}
      <header className="bg-card/95 backdrop-blur-sm border-b border-primary/20 px-6 py-4 animate-fade-in">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-saffron-gradient rounded-xl animate-pulse-hover">
              <FileText className="h-8 w-8 text-black" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Document Verification Portal
              </h1>
              <p className="text-muted-foreground">Verify authentic official documents instantly</p>
            </div>
          </div>
          <Link to="/admin">
            <Button variant="outline" className="hover-lift border-primary/20 hover:bg-primary/10">
              <Home className="h-4 w-4 mr-2" />
              Admin Portal
            </Button>
          </Link>
        </div>
      </header>

      <div className="p-6 max-w-7xl mx-auto">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Verification Form */}
          <Card className="glass-effect hover-lift animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                Document Verification
              </CardTitle>
              <CardDescription>
                Enter the document details to verify authenticity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="letterNumber" className="text-sm font-medium">Letter Number</Label>
                  <Input
                    id="letterNumber"
                    value={letterNumber}
                    onChange={(e) => setLetterNumber(e.target.value)}
                    placeholder="e.g., RIPL/2025-26/02"
                    className="h-12 border-primary/20 focus:border-primary hover-lift"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="referenceNumber" className="text-sm font-medium">Reference Number</Label>
                  <Input
                    id="referenceNumber"
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                    placeholder="e.g., OTAL/2025-26/01"
                    className="h-12 border-primary/20 focus:border-primary hover-lift"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfIssue" className="text-sm font-medium">Date of Issue</Label>
                  <Input
                    id="dateOfIssue"
                    type="date"
                    value={dateOfIssue}
                    onChange={(e) => setDateOfIssue(e.target.value)}
                    className="h-12 border-primary/20 focus:border-primary hover-lift"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button 
                  onClick={verifyDocument} 
                  disabled={!letterNumber || !referenceNumber || !dateOfIssue || isVerifying}
                  className="flex-1 h-12 bg-saffron-gradient hover:opacity-90 text-black font-semibold hover-glow"
                >
                  {isVerifying ? (
                    <>
                      <div className="animate-spin-slow h-5 w-5 mr-2">⟳</div>
                      Verifying...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Verify Document
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={resetVerification}
                  className="h-12 px-6 border-primary/20 hover:bg-primary/10 hover-lift"
                >
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Verification Result */}
          <Card className="glass-effect hover-lift animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                {verificationResult?.isValid ? (
                  <>
                    <div className="p-2 bg-green-500/10 rounded-lg">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <span className="text-green-600">Document Verified</span>
                  </>
                ) : verificationResult && !verificationResult.isValid ? (
                  <>
                    <div className="p-2 bg-red-500/10 rounded-lg">
                      <XCircle className="h-6 w-6 text-red-600" />
                    </div>
                    <span className="text-red-600">Document Invalid</span>
                  </>
                ) : (
                  <>
                    <div className="p-2 bg-muted/10 rounded-lg">
                      <FileText className="h-6 w-6 text-muted-foreground" />
                    </div>
                    Verification Result
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!verificationResult ? (
                <div className="text-center py-12 text-muted-foreground animate-bounce-slow">
                  <FileText className="h-20 w-20 mx-auto mb-6 opacity-50" />
                  <p className="text-lg mb-2">Ready to Verify</p>
                  <p>Enter document details above to begin verification</p>
                </div>
              ) : verificationResult.isValid ? (
                <div className="space-y-6 animate-fade-in">
                  {/* Document Details Grid */}
                  <div className="bg-muted/30 rounded-xl overflow-hidden">
                    <div className="grid grid-cols-1 gap-px bg-border">
                      {/* Letter Number */}
                      <div className="grid grid-cols-3 gap-px">
                        <div className="bg-primary text-primary-foreground p-4 font-semibold flex items-center">
                          <FileText className="h-4 w-4 mr-2" />
                          Letter Number
                        </div>
                        <div className="col-span-2 p-4 bg-card font-mono text-sm">
                          {verificationResult.id}
                        </div>
                      </div>

                      {/* Reference Number */}
                      <div className="grid grid-cols-3 gap-px">
                        <div className="bg-primary text-primary-foreground p-4 font-semibold flex items-center">
                          <FileText className="h-4 w-4 mr-2" />
                          Reference Number
                        </div>
                        <div className="col-span-2 p-4 bg-card font-mono text-sm">
                          {verificationResult.referenceNumber}
                        </div>
                      </div>

                      {/* Issued To */}
                      <div className="grid grid-cols-3 gap-px">
                        <div className="bg-primary text-primary-foreground p-4 font-semibold flex items-center">
                          <User className="h-4 w-4 mr-2" />
                          Issued To
                        </div>
                        <div className="col-span-2 p-4 bg-card">
                          {verificationResult.issuedTo}
                        </div>
                      </div>

                      {/* Issued By */}
                      <div className="grid grid-cols-3 gap-px">
                        <div className="bg-primary text-primary-foreground p-4 font-semibold flex items-center">
                          <User className="h-4 w-4 mr-2" />
                          Issued By
                        </div>
                        <div className="col-span-2 p-4 bg-card">
                          {verificationResult.issuedBy}
                        </div>
                      </div>

                      {/* Letter Category */}
                      <div className="grid grid-cols-3 gap-px">
                        <div className="bg-primary text-primary-foreground p-4 font-semibold flex items-center">
                          <FileText className="h-4 w-4 mr-2" />
                          Letter Category
                        </div>
                        <div className="col-span-2 p-4 bg-card">
                          <Badge variant="secondary">{verificationResult.letterCategory}</Badge>
                        </div>
                      </div>

                      {/* Letter Type */}
                      <div className="grid grid-cols-3 gap-px">
                        <div className="bg-primary text-primary-foreground p-4 font-semibold flex items-center">
                          <FileText className="h-4 w-4 mr-2" />
                          Letter Type
                        </div>
                        <div className="col-span-2 p-4 bg-card">
                          <Badge variant="outline">{verificationResult.letterType}</Badge>
                        </div>
                      </div>

                      {/* Issued Department */}
                      <div className="grid grid-cols-3 gap-px">
                        <div className="bg-primary text-primary-foreground p-4 font-semibold flex items-center">
                          <Building className="h-4 w-4 mr-2" />
                          Issued Department
                        </div>
                        <div className="col-span-2 p-4 bg-card">
                          {verificationResult.issuedDepartment}
                        </div>
                      </div>

                      {/* Dispatch Mode */}
                      <div className="grid grid-cols-3 gap-px">
                        <div className="bg-primary text-primary-foreground p-4 font-semibold flex items-center">
                          <Truck className="h-4 w-4 mr-2" />
                          Dispatch Mode
                        </div>
                        <div className="col-span-2 p-4 bg-card">
                          {verificationResult.dispatchMode}
                        </div>
                      </div>

                      {/* Dispatch Date */}
                      <div className="grid grid-cols-3 gap-px">
                        <div className="bg-primary text-primary-foreground p-4 font-semibold flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          Dispatch Date
                        </div>
                        <div className="col-span-2 p-4 bg-card">
                          {verificationResult.dispatchDate}
                        </div>
                      </div>

                      {/* Subject */}
                      <div className="grid grid-cols-3 gap-px">
                        <div className="bg-primary text-primary-foreground p-4 font-semibold flex items-center">
                          <FileText className="h-4 w-4 mr-2" />
                          Subject
                        </div>
                        <div className="col-span-2 p-4 bg-card">
                          {verificationResult.subject}
                        </div>
                      </div>

                      {/* Description */}
                      <div className="grid grid-cols-3 gap-px">
                        <div className="bg-primary text-primary-foreground p-4 font-semibold flex items-center">
                          <FileText className="h-4 w-4 mr-2" />
                          Description
                        </div>
                        <div className="col-span-2 p-4 bg-card text-sm">
                          {verificationResult.description}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <Card className="bg-muted/20">
                    <CardHeader>
                      <CardTitle className="text-lg">Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">Email</p>
                          <p className="text-sm text-muted-foreground">{verificationResult.recipientEmail}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">Phone</p>
                          <p className="text-sm text-muted-foreground">{verificationResult.recipientPhone}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 md:col-span-2">
                        <MapPin className="h-5 w-5 text-primary mt-1" />
                        <div>
                          <p className="font-medium">Address</p>
                          <p className="text-sm text-muted-foreground">{verificationResult.recipientAddress}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Download Button */}
                  <div className="flex justify-center pt-4">
                    <Button className="bg-green-600 hover:bg-green-700 hover-glow px-8 py-3">
                      <Download className="h-5 w-5 mr-2" />
                      Download Verified Document
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 animate-fade-in">
                  <XCircle className="h-20 w-20 text-red-600 mx-auto mb-6 animate-bounce-slow" />
                  <h3 className="text-xl font-semibold text-red-600 mb-4">Document Not Found</h3>
                  <p className="text-muted-foreground mb-6">
                    The document could not be verified with the provided details.
                  </p>
                  <Alert className="border-red-200 bg-red-50">
                    <AlertDescription className="text-sm">
                      This document may be invalid, expired, or the details were entered incorrectly. 
                      Please verify all information and try again.
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Demo Information */}
        {!verificationResult && (
          <Card className="mt-8 glass-effect hover-lift animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                Demo Document Details
              </CardTitle>
              <CardDescription>
                Use these sample document details to test the verification system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                <Card className="border-primary/20 hover-lift">
                  <CardContent className="p-6 space-y-3">
                    <Badge className="bg-primary text-primary-foreground">Appointment Letter</Badge>
                    <div className="space-y-2 font-mono text-sm">
                      <p><span className="font-medium">Letter:</span> RIPL/2025-26/02</p>
                      <p><span className="font-medium">Ref:</span> OTAL/2025-26/01</p>
                      <p><span className="font-medium">Date:</span> 2025-04-05</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-primary/20 hover-lift">
                  <CardContent className="p-6 space-y-3">
                    <Badge className="bg-accent text-black">Internship Certificate</Badge>
                    <div className="space-y-2 font-mono text-sm">
                      <p><span className="font-medium">Letter:</span> INT-2025-0001</p>
                      <p><span className="font-medium">Ref:</span> INT/2025/001</p>
                      <p><span className="font-medium">Date:</span> 2025-01-15</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-primary/20 hover-lift">
                  <CardContent className="p-6 space-y-3">
                    <Badge variant="outline">Offer Letter</Badge>
                    <div className="space-y-2 font-mono text-sm">
                      <p><span className="font-medium">Letter:</span> OFR-2025-0010</p>
                      <p><span className="font-medium">Ref:</span> OFR/2025/010</p>
                      <p><span className="font-medium">Date:</span> 2025-01-14</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
