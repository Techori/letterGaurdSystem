
export interface Category {
  id: string;
  name: string;
  prefix: string;
  created_at: string;
}

export interface Staff {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

export interface LetterType {
  id: string;
  name: string;
  category_id: string;
  created_at: string;
}

export interface Document {
  id: string;
  title: string;
  category_id: string;
  letter_type_id: string;
  letter_number: string;
  reference_number: string;
  issue_date: string;
  content: string;
  file_path?: string;
  status: 'Draft' | 'Pending' | 'Approved' | 'Rejected';
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'staff' | 'user';
  name: string;
  created_at: string;
}
