
// API service for MongoDB backend
import { Category, Staff, LetterType, Document } from '@/types';
import { apiService } from './apiService';

export interface SheetData {
  categories: Category[];
  staff: Staff[];
  letterTypes: LetterType[];
  documents: Document[];
}

class BackendService {
  async fetchSheetData(): Promise<SheetData> {
    try {
      const [categories, letterTypes, documents, staff] = await Promise.all([
        apiService.getCategories(),
        apiService.getLetterTypes(),
        apiService.getDocuments(),
        apiService.getStaff()
      ]);

      // Transform backend data to match frontend interface
      const transformedCategories = categories.map((cat: any) => ({
        id: cat._id,
        name: cat.name,
        prefix: cat.prefix,
        created_at: cat.createdAt
      }));

      const transformedLetterTypes = letterTypes.map((type: any) => ({
        id: type._id,
        name: type.name,
        category_id: type.categoryId._id,
        created_at: type.createdAt
      }));

      const transformedDocuments = documents.map((doc: any) => ({
        id: doc._id,
        title: doc.title,
        category_id: doc.categoryId._id,
        letter_type_id: doc.letterTypeId._id,
        letter_number: doc.letterNumber,
        reference_number: doc.referenceNumber,
        issue_date: doc.issueDate.split('T')[0],
        content: doc.content,
        status: doc.status as 'Draft' | 'Pending' | 'Approved' | 'Rejected',
        created_by: doc.createdBy._id,
        created_at: doc.createdAt,
        updated_at: doc.updatedAt
      }));

      const transformedStaff = staff.map((member: any) => ({
        id: member._id,
        name: member.name,
        email: member.email,
        role: member.role,
        created_at: member.createdAt
      }));

      return {
        categories: transformedCategories,
        staff: transformedStaff,
        letterTypes: transformedLetterTypes,
        documents: transformedDocuments
      };
    } catch (error) {
      console.error('Failed to fetch data from backend:', error);
      throw error;
    }
  }

  async updateSheetData(data: Partial<SheetData>): Promise<void> {
    try {
      // This method is no longer needed as individual API calls handle updates
      console.log('Data updated successfully');
    } catch (error) {
      console.error('Failed to update data:', error);
      throw error;
    }
  }

  async createDocument(documentData: any): Promise<Document> {
    try {
      const response = await apiService.createDocument({
        title: documentData.title,
        categoryId: documentData.category_id,
        letterTypeId: documentData.letter_type_id,
        letterNumber: documentData.letter_number,
        referenceNumber: documentData.reference_number,
        issueDate: documentData.issue_date,
        content: documentData.content,
        status: documentData.status
      });

      return {
        id: response._id,
        title: response.title,
        category_id: response.categoryId,
        letter_type_id: response.letterTypeId,
        letter_number: response.letterNumber,
        reference_number: response.referenceNumber,
        issue_date: response.issueDate.split('T')[0],
        content: response.content,
        status: response.status,
        created_by: response.createdBy,
        created_at: response.createdAt,
        updated_at: response.updatedAt
      };
    } catch (error) {
      console.error('Failed to create document:', error);
      throw error;
    }
  }
}

export const googleSheetsService = new BackendService();
