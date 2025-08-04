import { apiService } from './apiService';

export interface Document {
  id: string;
  title: string;
  categoryId: string;
  letterTypeId: string;
  letterNumber: string;
  referenceNumber: string;
  issueDate: string;
  content: string;
  status: 'Draft' | 'Pending' | 'Approved' | 'Rejected';
  createdBy: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
  issuedTo: string;
  subject: string;
  description?: string;
  dispatchDate: string;
  issuedBy: string;
  department: string;
  letterCategory: string;
  letterType: string;
  dispatchMode: string;
}

export interface DocumentWithDetails extends Document {
  category?: { name: string; prefix: string };
  letterTypeDetails?: { name: string };
  creator?: { name: string; email: string };
  approver?: { name: string; email: string };
}

class DocumentService {
  async getDocuments(): Promise<Document[]> {
    try {
      const documents = await apiService.getDocuments();
      return documents.map(this.transformDocument);
    } catch (error) {
      console.error('Error fetching documents:', error);
      throw new Error('Failed to fetch documents');
    }
  }

  async getAll(): Promise<Document[]> {
    return this.getDocuments();
  }

  async getDocument(id: string): Promise<Document | null> {
    try {
      const document = await apiService.getDocument(id);
      return this.transformDocument(document);
    } catch (error) {
      console.error('Error fetching document:', error);
      return null;
    }
  }

  async getByLetterNumber(letterNumber: string): Promise<Document | null> {
    try {
      const documents = await this.getDocuments();
      return documents.find(doc => doc.letterNumber === letterNumber) || null;
    } catch (error) {
      console.error('Error fetching document by letter number:', error);
      throw new Error('Failed to fetch document');
    }
  }

  async createDocument(documentData: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>): Promise<Document> {
    try {
      const document = await apiService.createDocument(documentData);
      return this.transformDocument(document);
    } catch (error) {
      console.error('Error creating document:', error);
      throw new Error('Failed to create document');
    }
  }

  async create(documentData: any): Promise<Document> {
    return this.createDocument(documentData);
  }

  async bulkCreate(documentsData: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<Document[]> {
    try {
      const formData = new FormData();
      formData.append('documents', JSON.stringify(documentsData));
      
      const response = await apiService.bulkCreateDocuments(formData);
      return response.documents.map(this.transformDocument);
    } catch (error) {
      console.error('Error creating documents from Excel:', error);
      throw new Error('Failed to create documents from Excel');
    }
  }

  async updateDocument(id: string, updates: Partial<Document>): Promise<Document> {
    try {
      const document = await apiService.updateDocument(id, updates);
      return this.transformDocument(document);
    } catch (error) {
      console.error('Error updating document:', error);
      throw new Error('Failed to update document');
    }
  }

  async updateDocumentStatus(id: string, status: string, rejectionReason?: string): Promise<Document> {
    try {
      const document = await apiService.updateDocumentStatus(id, status, rejectionReason);
      return this.transformDocument(document);
    } catch (error) {
      console.error('Error updating document status:', error);
      throw new Error('Failed to update document status');
    }
  }

  async updateStatus(id: string, status: string, rejectionReason?: string): Promise<Document> {
    return this.updateDocumentStatus(id, status, rejectionReason);
  }

  async deleteDocument(id: string): Promise<void> {
    try {
      await apiService.deleteDocument(id);
    } catch (error) {
      console.error('Error deleting document:', error);
      throw new Error('Failed to delete document');
    }
  }

  private transformDocument(doc: any): Document {
    return {
      id: doc._id || doc.id,
      title: doc.title,
      categoryId: doc.categoryId?._id || doc.categoryId,
      letterTypeId: doc.letterTypeId?._id || doc.letterTypeId,
      letterNumber: doc.letterNumber,
      referenceNumber: doc.referenceNumber,
      issueDate: doc.issueDate?.split('T')[0] || doc.issueDate,
      content: doc.content,
      status: doc.status,
      createdBy: doc.createdBy?._id || doc.createdBy,
      approvedBy: doc.approvedBy?._id || doc.approvedBy,
      approvedAt: doc.approvedAt,
      rejectionReason: doc.rejectionReason,
      createdAt: doc.createdAt || doc.created_at,
      updatedAt: doc.updatedAt || doc.updated_at,
      issuedTo: doc.issuedTo || doc.title || 'Unknown Recipient',
      subject: doc.subject || doc.title || 'No Subject',
      description: doc.description || doc.content,
      dispatchDate: doc.dispatchDate || doc.issueDate,
      issuedBy: doc.issuedBy || doc.createdBy?.name || 'Unknown Issuer',
      department: doc.department || 'Unknown Department',
      letterCategory: doc.letterCategory || doc.categoryId?.name || 'General',
      letterType: doc.letterType || doc.letterTypeId?.name || 'Letter',
      dispatchMode: doc.dispatchMode || 'Email'
    };
  }

  async getDocumentStats() {
    try {
      const documents = await this.getDocuments();
      return {
        total: documents.length,
        draft: documents.filter(doc => doc.status === 'Draft').length,
        pending: documents.filter(doc => doc.status === 'Pending').length,
        approved: documents.filter(doc => doc.status === 'Approved').length,
        rejected: documents.filter(doc => doc.status === 'Rejected').length
      };
    } catch (error) {
      console.error('Error getting document stats:', error);
      return {
        total: 0,
        draft: 0,
        pending: 0,
        approved: 0,
        rejected: 0
      };
    }
  }
}

export const documentService = new DocumentService();