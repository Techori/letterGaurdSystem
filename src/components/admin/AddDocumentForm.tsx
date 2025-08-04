
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, FileText, Calendar, User, Building, Mail, Phone, MapPin } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface AddDocumentFormProps {
  onDocumentAdded: () => void;
}

export function AddDocumentForm({ onDocumentAdded }: AddDocumentFormProps) {
  const [formData, setFormData] = useState({
    letterNumber: "",
    referenceNumber: "",
    issuedTo: "",
    issuedBy: "",
    letterCategory: "",
    letterType: "",
    issuedDepartment: "",
    dispatchMode: "",
    dispatchDate: "",
    subject: "",
    description: "",
    recipientEmail: "",
    recipientPhone: "",
    recipientAddress: ""
  });

  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const letterCategories = [
    "Employment",
    "Certificate", 
    "Circular",
    "Notice",
    "Permission",
    "Official"
  ];

  const letterTypes = [
    "Appointment Letter",
    "Offer Letter",
    "Experience Letter",
    "Internship Certificate",
    "Transfer Letter",
    "Circular",
    "Notice",
    "Permission Letter"
  ];

  const departments = [
    "Human Resources",
    "Administration",
    "Operations",
    "Finance",
    "IT Department",
    "Legal",
    "Marketing"
  ];

  const dispatchModes = [
    "Hand Delivery",
    "Email",
    "Post",
    "Courier",
    "Digital Portal"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.letterNumber || !formData.referenceNumber || !formData.issuedTo) {
      toast({ 
        title: "Missing Fields", 
        description: "Please fill in all required fields",
        variant: "destructive" 
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({ 
        title: "Document Created Successfully!", 
        description: `Letter ${formData.letterNumber} has been created and is ready for verification.` 
      });
      
      // Reset form
      setFormData({
        letterNumber: "",
        referenceNumber: "",
        issuedTo: "",
        issuedBy: "",
        letterCategory: "",
        letterType: "",
        issuedDepartment: "",
        dispatchMode: "",
        dispatchDate: "",
        subject: "",
        description: "",
        recipientEmail: "",
        recipientPhone: "",
        recipientAddress: ""
      });
      
      setIsOpen(false);
      onDocumentAdded();
    } catch (error) {
      toast({ 
        title: "Error", 
        description: "Failed to create document. Please try again.",
        variant: "destructive" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground animate-pulse-hover hover-lift">
          <Plus className="h-4 w-4 mr-2" />
          Add New Document
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto animate-fade-in">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FileText className="h-6 w-6 text-primary" />
            Create New Document
          </DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new official document
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <Label htmlFor="letterNumber" className="text-sm font-medium">Letter Number *</Label>
                  <Input
                    id="letterNumber"
                    value={formData.letterNumber}
                    onChange={(e) => setFormData({...formData, letterNumber: e.target.value})}
                    placeholder="e.g., RIPL/2025-26/001"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="referenceNumber" className="text-sm font-medium">Reference Number *</Label>
                  <Input
                    id="referenceNumber"
                    value={formData.referenceNumber}
                    onChange={(e) => setFormData({...formData, referenceNumber: e.target.value})}
                    placeholder="e.g., REF/2025/001"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="letterCategory" className="text-sm font-medium">Letter Category</Label>
                  <Select value={formData.letterCategory} onValueChange={(value) => setFormData({...formData, letterCategory: value})}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {letterCategories.map((category) => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="letterType" className="text-sm font-medium">Letter Type</Label>
                  <Select value={formData.letterType} onValueChange={(value) => setFormData({...formData, letterType: value})}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {letterTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Personnel Information */}
            <Card className="hover-lift">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Personnel Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="issuedTo" className="text-sm font-medium">Issued To *</Label>
                  <Input
                    id="issuedTo"
                    value={formData.issuedTo}
                    onChange={(e) => setFormData({...formData, issuedTo: e.target.value})}
                    placeholder="Recipient name"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="issuedBy" className="text-sm font-medium">Issued By</Label>
                  <Input
                    id="issuedBy"
                    value={formData.issuedBy}
                    onChange={(e) => setFormData({...formData, issuedBy: e.target.value})}
                    placeholder="Issuing authority"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="recipientEmail" className="text-sm font-medium">Recipient Email</Label>
                  <Input
                    id="recipientEmail"
                    type="email"
                    value={formData.recipientEmail}
                    onChange={(e) => setFormData({...formData, recipientEmail: e.target.value})}
                    placeholder="recipient@email.com"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="recipientPhone" className="text-sm font-medium">Recipient Phone</Label>
                  <Input
                    id="recipientPhone"
                    value={formData.recipientPhone}
                    onChange={(e) => setFormData({...formData, recipientPhone: e.target.value})}
                    placeholder="+91 9876543210"
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Department & Dispatch Information */}
          <Card className="hover-lift">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Building className="h-5 w-5 text-primary" />
                Department & Dispatch Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="issuedDepartment" className="text-sm font-medium">Issued Department</Label>
                <Select value={formData.issuedDepartment} onValueChange={(value) => setFormData({...formData, issuedDepartment: value})}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="dispatchMode" className="text-sm font-medium">Dispatch Mode</Label>
                <Select value={formData.dispatchMode} onValueChange={(value) => setFormData({...formData, dispatchMode: value})}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                  <SelectContent>
                    {dispatchModes.map((mode) => (
                      <SelectItem key={mode} value={mode}>{mode}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="dispatchDate" className="text-sm font-medium">Dispatch Date</Label>
                <Input
                  id="dispatchDate"
                  type="date"
                  value={formData.dispatchDate}
                  onChange={(e) => setFormData({...formData, dispatchDate: e.target.value})}
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Content Information */}
          <Card className="hover-lift">
            <CardHeader>
              <CardTitle className="text-lg">Content Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="subject" className="text-sm font-medium">Subject</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  placeholder="Document subject"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Document description and content"
                  rows={4}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="recipientAddress" className="text-sm font-medium">Recipient Address</Label>
                <Textarea
                  id="recipientAddress"
                  value={formData.recipientAddress}
                  onChange={(e) => setFormData({...formData, recipientAddress: e.target.value})}
                  placeholder="Complete address"
                  rows={3}
                  className="mt-1"
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
                  <div className="animate-spin-slow h-4 w-4 mr-2">⟳</div>
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
      </DialogContent>
    </Dialog>
  );
}
