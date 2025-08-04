
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface DocumentCreationFormProps {
  onDocumentCreated: (document: any) => void;
}

export function DocumentCreationForm({ onDocumentCreated }: DocumentCreationFormProps) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [formData, setFormData] = useState({
    recipientName: "",
    recipientEmail: "",
    position: "",
    startDate: "",
    endDate: "",
    salary: "",
    company: "",
    additionalInfo: ""
  });

  const categories = [
    { name: "Internship Certificate", code: "INT", fields: ["recipientName", "recipientEmail", "position", "startDate", "endDate", "company"] },
    { name: "Offer Letter", code: "OFR", fields: ["recipientName", "recipientEmail", "position", "salary", "startDate", "company"] },
    { name: "Experience Letter", code: "EXP", fields: ["recipientName", "recipientEmail", "position", "startDate", "endDate", "company"] },
  ];

  const generateDocument = () => {
    if (!selectedCategory || !formData.recipientName) {
      toast({ title: "Please fill required fields", variant: "destructive" });
      return;
    }

    const category = categories.find(c => c.name === selectedCategory);
    if (!category) return;

    const newDocId = `${category.code}-2025-${String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0')}`;
    
    const newDocument = {
      id: newDocId,
      type: selectedCategory,
      recipient: formData.recipientName,
      issuedBy: "Current Staff",
      issuedDate: new Date().toISOString().split('T')[0],
      status: "Active",
      downloadUrl: "#"
    };

    onDocumentCreated(newDocument);
    setFormData({
      recipientName: "",
      recipientEmail: "",
      position: "",
      startDate: "",
      endDate: "",
      salary: "",
      company: "",
      additionalInfo: ""
    });
    setSelectedCategory("");

    toast({ 
      title: "Document Generated Successfully!", 
      description: `Document ID: ${newDocId}` 
    });
  };

  const getRequiredFields = () => {
    const category = categories.find(c => c.name === selectedCategory);
    return category ? category.fields : [];
  };

  const clearForm = () => {
    setFormData({
      recipientName: "",
      recipientEmail: "",
      position: "",
      startDate: "",
      endDate: "",
      salary: "",
      company: "",
      additionalInfo: ""
    });
    setSelectedCategory("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Generate New Document
        </CardTitle>
        <CardDescription>
          Select a category and fill in the required information to generate a new document
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="category">Document Category</Label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select document type" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.code} value={category.name}>
                  {category.name} ({category.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedCategory && (
          <div className="grid gap-4 md:grid-cols-2">
            {getRequiredFields().includes("recipientName") && (
              <div>
                <Label htmlFor="recipientName">Recipient Name *</Label>
                <Input
                  id="recipientName"
                  value={formData.recipientName}
                  onChange={(e) => setFormData({...formData, recipientName: e.target.value})}
                  placeholder="Enter full name"
                />
              </div>
            )}

            {getRequiredFields().includes("recipientEmail") && (
              <div>
                <Label htmlFor="recipientEmail">Recipient Email</Label>
                <Input
                  id="recipientEmail"
                  type="email"
                  value={formData.recipientEmail}
                  onChange={(e) => setFormData({...formData, recipientEmail: e.target.value})}
                  placeholder="Enter email address"
                />
              </div>
            )}

            {getRequiredFields().includes("position") && (
              <div>
                <Label htmlFor="position">Position/Role</Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) => setFormData({...formData, position: e.target.value})}
                  placeholder="Enter position or role"
                />
              </div>
            )}

            {getRequiredFields().includes("company") && (
              <div>
                <Label htmlFor="company">Company Name</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  placeholder="Enter company name"
                />
              </div>
            )}

            {getRequiredFields().includes("startDate") && (
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                />
              </div>
            )}

            {getRequiredFields().includes("endDate") && (
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                />
              </div>
            )}

            {getRequiredFields().includes("salary") && (
              <div>
                <Label htmlFor="salary">Salary/CTC</Label>
                <Input
                  id="salary"
                  value={formData.salary}
                  onChange={(e) => setFormData({...formData, salary: e.target.value})}
                  placeholder="Enter salary amount"
                />
              </div>
            )}
          </div>
        )}

        {selectedCategory && (
          <div className="flex gap-4 pt-4">
            <Button onClick={generateDocument} className="flex-1">
              <FileText className="h-4 w-4 mr-2" />
              Generate Document & PDF
            </Button>
            <Button variant="outline" onClick={clearForm}>
              Clear Form
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
