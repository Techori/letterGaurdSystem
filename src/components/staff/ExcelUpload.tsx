import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Upload, Download, FileSpreadsheet, Check, X, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';
import { apiService } from '@/services/apiService';

interface Category {
  _id: string;
  name: string;
  prefix: string;
}

interface LetterType {
  _id: string;
  name: string;
  categoryId: {
    _id: string;
    name: string;
    prefix: string;
  };
}

interface ExcelDocument {
  title: string;
  categoryName: string;
  letterTypeName: string;
  letterNumber?: string;
  referenceNumber?: string;
  issueDate: string;
  content: string;
  status: 'Valid' | 'Invalid';
  errors: string[];
  categoryId?: string;
  letterTypeId?: string;
}

interface ExcelUploadProps {
  categories: Category[];
  letterTypes: LetterType[];
  onDocumentsCreated: () => void;
}

// Helper function to convert index to Excel column letter (0-based index)
const getExcelColumnName = (index: number): string => {
  let colName = '';
  while (index >= 0) {
    colName = String.fromCharCode((index % 26) + 65) + colName;
    index = Math.floor(index / 26) - 1;
  }
  return colName;
};

// Helper function to sanitize category names for named ranges
const sanitizeName = (name: string): string => {
  return name.replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_');
};

const ExcelUpload: React.FC<ExcelUploadProps> = ({ categories, letterTypes, onDocumentsCreated }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewData, setPreviewData] = useState<ExcelDocument[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const downloadTemplate = async () => {
    try {
      // Check if category count exceeds Excel's column limit (16,384 columns, XFD)
      const MAX_COLUMNS = 16384;
      if (categories.length > MAX_COLUMNS - 1) {
        toast.error(`Too many categories (${categories.length}). Maximum allowed is ${MAX_COLUMNS - 1}.`);
        return;
      }

      const workbook = new ExcelJS.Workbook();
      
      // Create main template worksheet
      const worksheet = workbook.addWorksheet('Document Template');
      
      // Define headers
      const headers = [
        'Document Title',
        'Category Name',
        'Letter Type Name',
        'Letter Number',
        'Reference Number',
        'Issue Date',
        'Content'
      ];
      
      // Add headers
      worksheet.addRow(headers);
      
      // Add sample data row
      worksheet.addRow([
        'Sample Document Title',
        '',
        '',
        'Leave blank for auto-generation',
        'Leave blank for auto-generation',
        '2024-01-15',
        'Document content here...'
      ]);
      
      // Set column widths
      worksheet.columns = [
        { width: 25 }, // Document Title
        { width: 30 }, // Category Name
        { width: 30 }, // Letter Type Name
        { width: 25 }, // Letter Number
        { width: 25 }, // Reference Number
        { width: 15 }, // Issue Date
        { width: 40 }  // Content
      ];
      
      // Create options worksheet
      const optionsSheet = workbook.addWorksheet('Options', { state: 'hidden' });
      
      // Add categories to options sheet (column A)
      optionsSheet.addRow(['Categories']);
      categories.forEach(cat => optionsSheet.addRow([cat.name]));
      
      // Add letter types per category (starting from column B)
      const letterTypeRanges: { [key: string]: string } = {};
      categories.forEach((cat, index) => {
        const col = getExcelColumnName(index + 1); // Start from B (index 1)
        const types = letterTypes.filter(lt => lt.categoryId._id === cat._id).map(lt => lt.name);
        optionsSheet.getCell(`${col}1`).value = cat.name;
        types.forEach((type, i) => {
          optionsSheet.getCell(`${col}${i + 2}`).value = type;
        });
        // Store the range for this category's letter types
        if (types.length > 0) {
          letterTypeRanges[cat.name] = `Options!$${col}$2:$${col}$${types.length + 1}`;
          // Create named range for letter types
          const name = sanitizeName(cat.name);
          workbook.definedNames.add(name, `Options!$${col}$2:$${col}$${types.length + 1}`);
        }
      });
      
      // Add data validation for Category Name (B2:B100)
      for (let i = 2; i <= 100; i++) {
        worksheet.getCell(`B${i}`).dataValidation = {
          type: 'list',
          allowBlank: true,
          showInputMessage: true,
          prompt: 'Select a category',
          showErrorMessage: true,
          errorTitle: 'Invalid Category',
          error: 'Please select a valid category from the list.',
          formulae: [`=Options!$A$2:$A$${categories.length + 1}`]
        };
        
        // Add dependent data validation for Letter Type Name (C2:C100)
        worksheet.getCell(`C${i}`).dataValidation = {
          type: 'list',
          allowBlank: true,
          showInputMessage: true,
          prompt: 'Select a letter type',
          showErrorMessage: true,
          errorTitle: 'Invalid Letter Type',
          error: 'Please select a valid letter type from the list.',
          formulae: [`=INDIRECT(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(B${i}," ","_"),"&","_"),"-","_"),"and","_"))`]
        };
      }
      
      // Generate and download the file
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'document_template.xlsx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Template downloaded successfully');
    } catch (error) {
      console.error('Error generating template:', error);
      toast.error('Failed to generate template');
    }
  };

  const validateDocument = (doc: any): ExcelDocument => {
    const errors: string[] = [];
    let categoryId = '';
    let letterTypeId = '';
    
    // Title validation
    if (!doc['Document Title']?.toString().trim()) {
      errors.push('Document Title is required');
    }
    
    // Category validation
    const categoryName = doc['Category Name']?.toString().trim();
    if (!categoryName) {
      errors.push('Category Name is required');
    } else {
      const category = categories.find(cat => 
        cat.name.toLowerCase() === categoryName.toLowerCase()
      );
      if (!category) {
        errors.push(`Category '${categoryName}' not found. Available categories: ${categories.map(c => c.name).join(', ')}`);
      } else {
        categoryId = category._id;
      }
    }
    
    // Letter Type validation
    const letterTypeName = doc['Letter Type Name']?.toString().trim();
    if (!letterTypeName) {
      errors.push('Letter Type Name is required');
    } else {
      const letterType = letterTypes.find(lt => 
        lt.name.toLowerCase() === letterTypeName.toLowerCase()
      );
      if (!letterType) {
        errors.push(`Letter Type '${letterTypeName}' not found. Available letter types: ${letterTypes.map(lt => lt.name).join(', ')}`);
      } else {
        letterTypeId = letterType._id;
        // Validate that letter type belongs to selected category
        if (categoryId && letterType.categoryId._id !== categoryId) {
          const category = categories.find(c => c._id === categoryId);
          const validLetterTypes = letterTypes
            .filter(lt => lt.categoryId._id === categoryId)
            .map(lt => lt.name);
          errors.push(`Letter Type '${letterTypeName}' does not belong to category '${category?.name}'. Valid letter types for this category: ${validLetterTypes.join(', ')}`);
        }
      }
    }
    
    // Issue Date validation
    if (!doc['Issue Date']) {
      errors.push('Issue Date is required');
    } else {
      const date = new Date(doc['Issue Date']);
      if (isNaN(date.getTime())) {
        errors.push('Invalid Issue Date format. Use YYYY-MM-DD format');
      } else {
        // Check if issue date is not in the future
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        if (date > today) {
          errors.push('Issue date cannot be in the future');
        }
      }
    }
    
    // Content validation
    if (!doc['Content']?.toString().trim()) {
      errors.push('Content is required');
    }

    // Letter Number validation (optional)
    const letterNumber = doc['Letter Number']?.toString().trim() || '';
    
    // Reference Number validation (optional)
    const referenceNumber = doc['Reference Number']?.toString().trim() || '';

    return {
      title: doc['Document Title']?.toString().trim() || '',
      categoryName: categoryName || '',
      letterTypeName: letterTypeName || '',
      letterNumber,
      referenceNumber,
      issueDate: doc['Issue Date'] ? new Date(doc['Issue Date']).toISOString().split('T')[0] : '',
      content: doc['Content']?.toString().trim() || '',
      status: errors.length === 0 ? 'Valid' : 'Invalid',
      errors,
      categoryId,
      letterTypeId
    };
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        if (jsonData.length === 0) {
          toast.error('Excel file is empty');
          setIsProcessing(false);
          return;
        }

        const validatedData = jsonData.map(validateDocument);
        setPreviewData(validatedData);
        setShowPreview(true);
        
        const validCount = validatedData.filter(d => d.status === 'Valid').length;
        const invalidCount = validatedData.filter(d => d.status === 'Invalid').length;
        
        toast.success(`Processed ${validatedData.length} documents: ${validCount} valid, ${invalidCount} invalid`);
      } catch (error) {
        console.error('Error processing Excel file:', error);
        toast.error('Failed to process Excel file');
      } finally {
        setIsProcessing(false);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const generateLetterNumber = (categoryId: string) => {
    const category = categories.find(cat => cat._id === categoryId);
    if (category) {
      const year = new Date().getFullYear();
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      return `${category.prefix}/${year}-${year + 1}/${random}`;
    }
    return '';
  };

  const generateReferenceNumber = (categoryId: string) => {
    const category = categories.find(cat => cat._id === categoryId);
    if (category) {
      const date = new Date();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
      return `REF/${category.prefix}/${month}${year}/${random}`;
    }
    return '';
  };

  const createDocuments = async () => {
    const validDocuments = previewData.filter(doc => doc.status === 'Valid');
    
    if (validDocuments.length === 0) {
      toast.error('No valid documents to create');
      return;
    }

    setIsProcessing(true);
    let successCount = 0;
    let errorCount = 0;

    for (const doc of validDocuments) {
      try {
        if (!doc.categoryId || !doc.letterTypeId) {
          console.error('Missing category or letter type ID for document:', doc.title);
          errorCount++;
          continue;
        }

        // Generate numbers if not provided or empty
        const finalLetterNumber = doc.letterNumber || generateLetterNumber(doc.categoryId);
        const finalReferenceNumber = doc.referenceNumber || generateReferenceNumber(doc.categoryId);

        const documentData = {
          title: doc.title,
          categoryId: doc.categoryId,
          letterTypeId: doc.letterTypeId,
          letterNumber: finalLetterNumber,
          referenceNumber: finalReferenceNumber,
          issueDate: doc.issueDate,
          content: doc.content,
          status: 'Draft'
        };

        await apiService.createDocument(documentData);
        successCount++;
      } catch (error) {
        console.error('Error creating document:', error);
        errorCount++;
      }
    }

    setIsProcessing(false);
    
    if (successCount > 0) {
      toast.success(`Successfully created ${successCount} documents`);
      onDocumentsCreated();
      setShowPreview(false);
      setPreviewData([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
    
    if (errorCount > 0) {
      toast.error(`Failed to create ${errorCount} documents`);
    }
  };

  return (
    <Card className="shadow-lg border-0 bg-card hover-lift">
      <CardHeader className="bg-gradient-to-r from-green-500/10 to-green-600/5">
        <CardTitle className="flex items-center gap-2 text-xl">
          <FileSpreadsheet className="w-5 h-5 text-green-600" />
          Bulk Document Upload
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="flex gap-3">
          <Button 
            onClick={downloadTemplate} 
            variant="outline" 
            className="flex-1 h-11"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Template
          </Button>
          
          <div className="flex-1">
            <Input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              disabled={isProcessing}
              className="h-11"
            />
          </div>
          
          <Button 
            onClick={() => fileInputRef.current?.click()}
            className="h-11 px-6"
            disabled={isProcessing}
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </Button>
        </div>

        {showPreview && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Preview Documents</h3>
              <div className="flex gap-2">
                <Badge className="bg-green-100 text-green-800">
                  Valid: {previewData.filter(d => d.status === 'Valid').length}
                </Badge>
                <Badge className="bg-red-100 text-red-800">
                  Invalid: {previewData.filter(d => d.status === 'Invalid').length}
                </Badge>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto border rounded-lg">
              <div className="space-y-2 p-4">
                {previewData.map((doc, index) => (
                  <div key={index} className={`p-3 rounded-lg border ${
                    doc.status === 'Valid' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {doc.status === 'Valid' ? 
                            <Check className="w-4 h-4 text-green-600" /> : 
                            <X className="w-4 h-4 text-red-600" />
                          }
                          <span className="font-medium">{doc.title || 'Untitled'}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {doc.categoryName} • {doc.letterTypeName} • {doc.issueDate}
                        </div>
                        {doc.status === 'Valid' && (
                          <div className="text-xs text-green-600 mt-1">
                            {!doc.letterNumber && '• Letter number will be auto-generated'}
                            {!doc.referenceNumber && '• Reference number will be auto-generated'}
                          </div>
                        )}
                        {doc.errors.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {doc.errors.map((error, errorIndex) => (
                              <div key={errorIndex} className="flex items-center gap-1 text-xs text-red-600">
                                <AlertTriangle className="w-3 h-3" />
                                {error}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={() => {
                  setShowPreview(false);
                  setPreviewData([]);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
                variant="outline" 
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={createDocuments}
                disabled={isProcessing || previewData.filter(d => d.status === 'Valid').length === 0}
                className="flex-1"
              >
                {isProcessing ? 'Creating...' : `Create ${previewData.filter(d => d.status === 'Valid').length} Documents`}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExcelUpload;