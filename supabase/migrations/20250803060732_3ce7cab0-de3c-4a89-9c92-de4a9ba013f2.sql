
-- Create enum types for document statuses and categories
CREATE TYPE document_status AS ENUM ('draft', 'pending', 'approved', 'rejected');
CREATE TYPE letter_category AS ENUM ('Employment Latters', 'Certificate', 'Circulars and Management');
CREATE TYPE letter_type AS ENUM ('Offer Letter ( Internship )', 'Offer Letter ( PPO )', 'Letter of agree to pay');
CREATE TYPE dispatch_mode AS ENUM ('E Mail', 'Hand Delivery', 'Post', 'Courier');

-- Create departments table
CREATE TABLE IF NOT EXISTS departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create document_issuers table  
CREATE TABLE IF NOT EXISTS document_issuers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  designation TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  department_id UUID REFERENCES departments(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  letter_number TEXT NOT NULL UNIQUE,
  reference_number TEXT NOT NULL,
  issued_to TEXT NOT NULL,
  issued_date DATE NOT NULL,
  issued_by_id UUID REFERENCES document_issuers(id) NOT NULL,
  letter_category letter_category NOT NULL,
  letter_type letter_type NOT NULL,
  issued_department_id UUID REFERENCES departments(id) NOT NULL,
  dispatch_mode dispatch_mode NOT NULL,
  dispatch_date DATE NOT NULL,
  subject TEXT NOT NULL,
  description TEXT,
  status document_status DEFAULT 'draft',
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_issuers ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for departments
CREATE POLICY "Anyone can view departments" ON departments
  FOR SELECT USING (true);
  
CREATE POLICY "Authenticated users can manage departments" ON departments
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Create RLS policies for document_issuers  
CREATE POLICY "Anyone can view document issuers" ON document_issuers
  FOR SELECT USING (true);
  
CREATE POLICY "Authenticated users can manage document issuers" ON document_issuers
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Create RLS policies for documents
CREATE POLICY "Anyone can view documents for verification" ON documents
  FOR SELECT USING (true);
  
CREATE POLICY "Authenticated users can manage documents" ON documents
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
  
CREATE POLICY "Authenticated users can update documents" ON documents
  FOR UPDATE USING (auth.uid() IS NOT NULL);
  
CREATE POLICY "Authenticated users can delete documents" ON documents
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Create trigger for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_documents_updated_at 
    BEFORE UPDATE ON documents 
    FOR EACH ROW 
    EXECUTE PROCEDURE update_updated_at_column();

-- Insert sample departments
INSERT INTO departments (name, code) VALUES 
('Human Resource', 'HR'),
('Information Technology', 'IT'),
('Sales & Marketing', 'SM'),
('Finance', 'FIN')
ON CONFLICT (code) DO NOTHING;

-- Insert sample document issuers
INSERT INTO document_issuers (name, designation, email, department_id) 
SELECT 
  'HR Manager',
  'Manager',
  'hr@ripl.com',
  d.id
FROM departments d WHERE d.code = 'HR'
ON CONFLICT DO NOTHING;

-- Insert sample documents from your data
INSERT INTO documents (
  letter_number, reference_number, issued_to, issued_date, 
  letter_category, letter_type, dispatch_mode, dispatch_date,
  subject, description, status, issued_by_id, issued_department_id
) 
SELECT 
  'RIPL/2025-26/04', 'OTAL/2025-26/03', 'Anuj Jain', '2025-04-13'::date,
  'Employment Latters'::letter_category, 'Offer Letter ( Internship )'::letter_type, 
  'E Mail'::dispatch_mode, '2025-04-14'::date,
  'Internship Offer Letter', '', 'approved'::document_status,
  di.id, d.id
FROM departments d, document_issuers di 
WHERE d.code = 'HR' AND di.name = 'HR Manager'
ON CONFLICT (letter_number) DO NOTHING;
