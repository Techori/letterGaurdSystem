
export interface Category {
  _id: string;
  name: string;
  prefix: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Staff {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface LetterType {
  _id: string;
  name: string;
  categoryId: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Document {
  _id?: string;
  title: string;
  categoryId: string;
  letterTypeId: string;
  letterNumber: string;
  referenceNumber: string;
  issueDate: string;
  content: string;
  filePath?: string;
  status: 'Draft' | 'Pending' | 'Approved' | 'Rejected';
  createdBy?: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  _id: string;
  email: string;
  role: 'admin' | 'staff' | 'user';
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiError {
  message: string;
  errors?: string[];
}
