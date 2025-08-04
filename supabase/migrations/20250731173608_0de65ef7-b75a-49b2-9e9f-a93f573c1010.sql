-- Create enum types for document management
CREATE TYPE document_category AS ENUM ('official', 'legal', 'administrative', 'technical', 'financial');
CREATE TYPE document_type AS ENUM ('letter', 'certificate', 'notification', 'circular', 'order');
CREATE TYPE dispatch_mode AS ENUM ('email', 'post', 'hand_delivery', 'courier', 'digital');
CREATE TYPE document_status AS ENUM ('draft', 'issued', 'delivered', 'archived');

-- Create departments table
CREATE TABLE public.departments (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create document issuers table  
CREATE TABLE public.document_issuers (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    designation TEXT NOT NULL,
    department_id UUID REFERENCES public.departments(id),
    email TEXT,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create main documents table
CREATE TABLE public.documents (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    letter_number TEXT NOT NULL UNIQUE,
    reference_number TEXT NOT NULL,
    issued_to TEXT NOT NULL,
    issued_by_id UUID REFERENCES public.document_issuers(id) NOT NULL,
    letter_category document_category NOT NULL,
    letter_type document_type NOT NULL,
    issued_department_id UUID REFERENCES public.departments(id) NOT NULL,
    dispatch_mode dispatch_mode NOT NULL,
    dispatch_date DATE NOT NULL,
    subject TEXT NOT NULL,
    description TEXT,
    status document_status NOT NULL DEFAULT 'draft',
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_issuers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Create policies for departments (public read, admin write)
CREATE POLICY "Anyone can view departments" 
ON public.departments 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can manage departments" 
ON public.departments 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Create policies for document_issuers (public read, admin write)
CREATE POLICY "Anyone can view document issuers" 
ON public.document_issuers 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can manage document issuers" 
ON public.document_issuers 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Create policies for documents (public read for verification, admin write)
CREATE POLICY "Anyone can view documents for verification" 
ON public.documents 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can manage documents" 
ON public.documents 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update documents" 
ON public.documents 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete documents" 
ON public.documents 
FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_documents_updated_at
    BEFORE UPDATE ON public.documents
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample departments
INSERT INTO public.departments (name, code) VALUES 
('Human Resources', 'HR'),
('Finance', 'FIN'),
('Information Technology', 'IT'),
('Administration', 'ADMIN'),
('Legal', 'LEGAL');

-- Insert sample document issuers
INSERT INTO public.document_issuers (name, designation, department_id, email, phone) 
SELECT 
    'John Smith', 
    'Director', 
    d.id, 
    'john.smith@company.com', 
    '+1-555-0101'
FROM public.departments d WHERE d.code = 'HR'
UNION ALL
SELECT 
    'Sarah Johnson', 
    'Manager', 
    d.id, 
    'sarah.johnson@company.com', 
    '+1-555-0102'
FROM public.departments d WHERE d.code = 'FIN'
UNION ALL
SELECT 
    'Mike Wilson', 
    'Lead', 
    d.id, 
    'mike.wilson@company.com', 
    '+1-555-0103'
FROM public.departments d WHERE d.code = 'IT';

-- Insert sample documents
INSERT INTO public.documents (
    letter_number, 
    reference_number, 
    issued_to, 
    issued_by_id, 
    letter_category, 
    letter_type, 
    issued_department_id, 
    dispatch_mode, 
    dispatch_date, 
    subject, 
    description, 
    status
) 
SELECT 
    'LTR-2024-001',
    'REF-HR-001',
    'All Employees',
    di.id,
    'administrative'::document_category,
    'circular'::document_type,
    d.id,
    'email'::dispatch_mode,
    CURRENT_DATE,
    'New Holiday Policy Implementation',
    'This letter announces the implementation of new holiday policies effective from next month.',
    'issued'::document_status
FROM public.departments d 
JOIN public.document_issuers di ON di.department_id = d.id 
WHERE d.code = 'HR'
LIMIT 1;

INSERT INTO public.documents (
    letter_number, 
    reference_number, 
    issued_to, 
    issued_by_id, 
    letter_category, 
    letter_type, 
    issued_department_id, 
    dispatch_mode, 
    dispatch_date, 
    subject, 
    description, 
    status
) 
SELECT 
    'LTR-2024-002',
    'REF-FIN-001',
    'Finance Team',
    di.id,
    'financial'::document_category,
    'notification'::document_type,
    d.id,
    'hand_delivery'::dispatch_mode,
    CURRENT_DATE - INTERVAL '5 days',
    'Budget Approval Process',
    'Guidelines for the new budget approval process for Q1 2024.',
    'issued'::document_status
FROM public.departments d 
JOIN public.document_issuers di ON di.department_id = d.id 
WHERE d.code = 'FIN'
LIMIT 1;