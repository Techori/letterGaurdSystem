
export interface DocumentData {
  id: string;
  letterNumber: string;
  referenceNumber: string;
  issuedTo: string;
  issuedDate: string;
  issuedBy: string;
  letterCategory: string;
  letterType: string;
  issuedDepartment: string;
  dispatchMode: string;
  dispatchDate: string;
  subject: string;
  description: string;
  status: 'Draft' | 'Pending' | 'Approved' | 'Rejected';
}

export interface CategoryData {
  id: string;
  name: string;
  prefix: string;
  created_at: string;
}

export interface StaffData {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

export interface LetterTypeData {
  id: string;
  name: string;
  category_id: string;
  created_at: string;
}

export const mockDocuments: DocumentData[] = [
  {
    id: '1',
    letterNumber: 'RIPL/2025-26/04',
    referenceNumber: 'OTAL/2025-26/03',
    issuedTo: 'Anuj Jain',
    issuedDate: '13-Apr-25',
    issuedBy: '',
    letterCategory: 'Employment Letters',
    letterType: 'Offer Letter (Internship)',
    issuedDepartment: 'Human Resource',
    dispatchMode: 'E Mail',
    dispatchDate: '14-04-25',
    subject: 'Internship Offer Letter',
    description: '',
    status: 'Approved'
  },
  {
    id: '2',
    letterNumber: 'RIPL/2025-26/05',
    referenceNumber: 'OTAL/2025-26/04',
    issuedTo: 'Raj Shivhare',
    issuedDate: '13-Apr-25',
    issuedBy: '',
    letterCategory: 'Employment Letters',
    letterType: 'Offer Letter (Internship)',
    issuedDepartment: 'Human Resource',
    dispatchMode: 'E Mail',
    dispatchDate: '14-04-25',
    subject: 'Internship Offer Letter',
    description: '',
    status: 'Approved'
  },
  {
    id: '3',
    letterNumber: 'RIPL/2025-26/72',
    referenceNumber: 'OTAL/2025-26/70',
    issuedTo: 'Raj Shivhare',
    issuedDate: '3-Jul-25',
    issuedBy: '',
    letterCategory: 'Employment Letters',
    letterType: 'Offer Letter (PPO)',
    issuedDepartment: 'Human Resource',
    dispatchMode: 'E Mail',
    dispatchDate: '04-07-25',
    subject: 'Pre Placement Offer Letter',
    description: '',
    status: 'Approved'
  },
  {
    id: '4',
    letterNumber: 'RIPL/2025-26/104',
    referenceNumber: 'CRTF/2025-26/16',
    issuedTo: 'Raj Shivhare',
    issuedDate: '30-07-25',
    issuedBy: '',
    letterCategory: 'Certificate',
    letterType: '',
    issuedDepartment: 'Human Resource',
    dispatchMode: 'E Mail',
    dispatchDate: '',
    subject: 'Internship Completion Certificate',
    description: 'This certificate confirms the successful completion of internship program in our IT department.',
    status: 'Approved'
  },
  {
    id: '5',
    letterNumber: 'RIPL/2025-26/116',
    referenceNumber: 'CRTF/2025-26/28',
    issuedTo: 'Nisha',
    issuedDate: '30-07-25',
    issuedBy: '',
    letterCategory: 'Certificate',
    letterType: '',
    issuedDepartment: 'Human Resource',
    dispatchMode: 'E Mail',
    dispatchDate: '',
    subject: 'Internship Completion Certificate',
    description: 'This certificate confirms the completion of the internship program in the IT Department as of July 31, 2025. However, the intern\'s behavior towards seniors has been unsatisfactory, work performance was slow, and connectivity with seniors was lacking, with no communication for the past 20 days.',
    status: 'Approved'
  }
];

export const mockCategories: CategoryData[] = [
  {
    id: '1',
    name: 'Employment Letters',
    prefix: 'EMP',
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Certificate',
    prefix: 'CERT',
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Circulars and Management',
    prefix: 'CIRC',
    created_at: new Date().toISOString()
  }
];

export const mockStaff: StaffData[] = [
  {
    id: '1',
    name: 'HR Manager',
    email: 'hr@ripl.com',
    role: 'HR Manager',
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Admin Officer',
    email: 'admin@ripl.com',
    role: 'Admin',
    created_at: new Date().toISOString()
  }
];

export const mockLetterTypes: LetterTypeData[] = [
  {
    id: '1',
    name: 'Offer Letter (Internship)',
    category_id: '1',
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Offer Letter (PPO)',
    category_id: '1',
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Letter of agree to pay',
    category_id: '3',
    created_at: new Date().toISOString()
  }
];

class MockDataService {
  async getDocuments() {
    return mockDocuments;
  }

  async getCategories() {
    return mockCategories;
  }

  async getStaff() {
    return mockStaff;
  }

  async getLetterTypes() {
    return mockLetterTypes;
  }

  async createDocument(documentData: Partial<DocumentData>) {
    const newDoc: DocumentData = {
      id: Date.now().toString(),
      letterNumber: documentData.letterNumber || '',
      referenceNumber: documentData.referenceNumber || '',
      issuedTo: documentData.issuedTo || '',
      issuedDate: documentData.issuedDate || '',
      issuedBy: documentData.issuedBy || '',
      letterCategory: documentData.letterCategory || '',
      letterType: documentData.letterType || '',
      issuedDepartment: documentData.issuedDepartment || '',
      dispatchMode: documentData.dispatchMode || '',
      dispatchDate: documentData.dispatchDate || '',
      subject: documentData.subject || '',
      description: documentData.description || '',
      status: documentData.status || 'Draft'
    };
    mockDocuments.push(newDoc);
    return newDoc;
  }

  async updateDocumentStatus(documentId: string, status: string) {
    const docIndex = mockDocuments.findIndex(doc => doc.id === documentId);
    if (docIndex !== -1) {
      mockDocuments[docIndex].status = status as any;
      return mockDocuments[docIndex];
    }
    throw new Error('Document not found');
  }
}

export const mockDataService = new MockDataService();
