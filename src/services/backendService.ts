
import { apiService } from './apiService';

export interface Category {
  id: string;
  name: string;
  prefix: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LetterType {
  id: string;
  name: string;
  categoryId: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Staff {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'staff';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

class BackendService {
  // Categories
  async getCategories(): Promise<Category[]> {
    try {
      const categories = await apiService.getCategories();
      return categories.map(this.transformCategory);
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw new Error('Failed to fetch categories');
    }
  }

  async createCategory(categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category> {
    try {
      const category = await apiService.createCategory(categoryData);
      return this.transformCategory(category);
    } catch (error) {
      console.error('Error creating category:', error);
      throw new Error('Failed to create category');
    }
  }

  async updateCategory(id: string, updates: Partial<Category>): Promise<Category> {
    try {
      const category = await apiService.updateCategory(id, updates);
      return this.transformCategory(category);
    } catch (error) {
      console.error('Error updating category:', error);
      throw new Error('Failed to update category');
    }
  }

  async deleteCategory(id: string): Promise<void> {
    try {
      await apiService.deleteCategory(id);
    } catch (error) {
      console.error('Error deleting category:', error);
      throw new Error('Failed to delete category');
    }
  }

  // Letter Types
  async getLetterTypes(): Promise<LetterType[]> {
    try {
      const letterTypes = await apiService.getLetterTypes();
      return letterTypes.map(this.transformLetterType);
    } catch (error) {
      console.error('Error fetching letter types:', error);
      throw new Error('Failed to fetch letter types');
    }
  }

  async createLetterType(letterTypeData: Omit<LetterType, 'id' | 'createdAt' | 'updatedAt'>): Promise<LetterType> {
    try {
      const letterType = await apiService.createLetterType(letterTypeData);
      return this.transformLetterType(letterType);
    } catch (error) {
      console.error('Error creating letter type:', error);
      throw new Error('Failed to create letter type');
    }
  }

  async updateLetterType(id: string, updates: Partial<LetterType>): Promise<LetterType> {
    try {
      const letterType = await apiService.updateLetterType(id, updates);
      return this.transformLetterType(letterType);
    } catch (error) {
      console.error('Error updating letter type:', error);
      throw new Error('Failed to update letter type');
    }
  }

  async deleteLetterType(id: string): Promise<void> {
    try {
      await apiService.deleteLetterType(id);
    } catch (error) {
      console.error('Error deleting letter type:', error);
      throw new Error('Failed to delete letter type');
    }
  }

  // Staff
  async getStaff(): Promise<Staff[]> {
    try {
      const staff = await apiService.getStaff();
      return staff.map(this.transformStaff);
    } catch (error) {
      console.error('Error fetching staff:', error);
      throw new Error('Failed to fetch staff');
    }
  }

  private transformCategory(cat: any): Category {
    return {
      id: cat._id || cat.id,
      name: cat.name,
      prefix: cat.prefix,
      description: cat.description,
      isActive: cat.isActive,
      createdAt: cat.createdAt || cat.created_at,
      updatedAt: cat.updatedAt || cat.updated_at
    };
  }

  private transformLetterType(type: any): LetterType {
    return {
      id: type._id || type.id,
      name: type.name,
      categoryId: type.categoryId?._id || type.categoryId,
      description: type.description,
      isActive: type.isActive,
      createdAt: type.createdAt || type.created_at,
      updatedAt: type.updatedAt || type.updated_at
    };
  }

  private transformStaff(member: any): Staff {
    return {
      id: member._id || member.id,
      name: member.name,
      email: member.email,
      role: member.role,
      isActive: member.isActive,
      createdAt: member.createdAt || member.created_at,
      updatedAt: member.updatedAt || member.updated_at
    };
  }
}

export const backendService = new BackendService();
