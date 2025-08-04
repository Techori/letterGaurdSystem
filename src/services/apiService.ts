const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? import.meta.env.VITE_API_BASE_URL || "https://lettergaurdsystem.onrender.com/api"
  : 'http://localhost:5000/api';

  class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('token');
  }

  private getHeaders(isMultipart: boolean = false) {
    return isMultipart
      ? { ...(this.token && { Authorization: `Bearer ${this.token}` }) }
      : {
          'Content-Type': 'application/json',
          ...(this.token && { Authorization: `Bearer ${this.token}` })
        };
  }

  // Auth methods
  async login(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }
    
    const data = await response.json();
    this.token = data.token;
    localStorage.setItem('token', data.token);
    return data;
  }

  async register(name: string, email: string, password: string, role: string = 'staff') {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }
    
    const data = await response.json();
    this.token = data.token;
    localStorage.setItem('token', data.token);
    return data;
  }

  async getCurrentUser() {
    if (!this.token) {
      throw new Error('No token available');
    }
    
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: this.getHeaders()
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        this.logout();
        throw new Error('Token expired or invalid');
      }
      throw new Error('Failed to get user');
    }
    
    return response.json();
  }

  // Document methods
  async getDocuments() {
    const response = await fetch(`${API_BASE_URL}/documents`, {
      headers: this.getHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch documents');
    }
    
    return response.json();
  }

  async getDocument(id: string) {
    const response = await fetch(`${API_BASE_URL}/documents/${id}`, {
      headers: this.getHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch document');
    }
    
    return response.json();
  }

  async createDocument(documentData: any) {
    const response = await fetch(`${API_BASE_URL}/documents`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(documentData)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create document');
    }
    
    return response.json();
  }

  async bulkCreateDocuments(formData: FormData) {
    const response = await fetch(`${API_BASE_URL}/documents/bulk`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: formData
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create documents from Excel');
    }
    
    return response.json();
  }

  async updateDocument(id: string, documentData: any) {
    const response = await fetch(`${API_BASE_URL}/documents/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(documentData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to update document');
    }
    
    return response.json();
  }

  async updateDocumentStatus(documentId: string, status: string, rejectionReason?: string) {
    const response = await fetch(`${API_BASE_URL}/documents/${documentId}/status`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify({ status, rejectionReason })
    });
    
    if (!response.ok) {
      throw new Error('Failed to update document status');
    }
    
    return response.json();
  }

  async deleteDocument(id: string) {
    const response = await fetch(`${API_BASE_URL}/documents/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete document');
    }
    
    return response.json();
  }

  // Category methods
  async getCategories() {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      headers: this.getHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    
    return response.json();
  }

  async createCategory(categoryData: any) {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(categoryData)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create category');
    }
    
    return response.json();
  }

  async updateCategory(id: string, categoryData: any) {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(categoryData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to update category');
    }
    
    return response.json();
  }

  async deleteCategory(id: string) {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete category');
    }
    
    return response.json();
  }

  // Letter Type methods
  async getLetterTypes() {
    const response = await fetch(`${API_BASE_URL}/letter-types`, {
      headers: this.getHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch letter types');
    }
    
    return response.json();
  }

  async getLetterType(id: string) {
    const response = await fetch(`${API_BASE_URL}/letter-types/${id}`, {
      headers: this.getHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch letter type');
    }
    
    return response.json();
  }

  async createLetterType(letterTypeData: any) {
    const response = await fetch(`${API_BASE_URL}/letter-types`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(letterTypeData)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create letter type');
    }
    
    return response.json();
  }

  async updateLetterType(id: string, letterTypeData: any) {
    const response = await fetch(`${API_BASE_URL}/letter-types/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(letterTypeData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to update letter type');
    }
    
    return response.json();
  }

  async deleteLetterType(id: string) {
    const response = await fetch(`${API_BASE_URL}/letter-types/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete letter type');
    }
    
    return response.json();
  }

  // Staff methods
  async getStaff() {
    const response = await fetch(`${API_BASE_URL}/staff`, {
      headers: this.getHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch staff');
    }
    
    return response.json();
  }

  logout() {
    this.token = null;
    localStorage.removeItem('token');
  }
}

export const apiService = new ApiService();