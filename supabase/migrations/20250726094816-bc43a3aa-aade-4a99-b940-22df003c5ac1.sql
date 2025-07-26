-- Create organizations table
CREATE TABLE public.organizations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  organization_type TEXT CHECK (organization_type IN ('public', 'private', 'nonprofit')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create families table (replacing the existing simple one)
CREATE TABLE public.families (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  family_name TEXT NOT NULL,
  address TEXT,
  city TEXT,
  postal_code TEXT,
  phone TEXT,
  email TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  notes TEXT,
  status TEXT CHECK (status IN ('active', 'inactive', 'pending')) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create operators table
CREATE TABLE public.operators (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  specialization TEXT,
  qualifications TEXT[],
  license_number TEXT,
  status TEXT CHECK (status IN ('active', 'inactive', 'suspended')) DEFAULT 'active',
  hire_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create family members table (linking profiles to families)
CREATE TABLE public.family_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  relationship TEXT CHECK (relationship IN ('parent', 'child', 'guardian', 'other')),
  is_primary_contact BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(family_id, user_id)
);

-- Create family assignments table (linking operators to families)
CREATE TABLE public.family_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  operator_id UUID NOT NULL REFERENCES public.operators(id) ON DELETE CASCADE,
  assignment_type TEXT CHECK (assignment_type IN ('primary', 'secondary', 'temporary')),
  assigned_date DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.families ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.operators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_assignments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for organizations
CREATE POLICY "Users can view all organizations" 
ON public.organizations FOR SELECT USING (true);

CREATE POLICY "Only authenticated users can insert organizations" 
ON public.organizations FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Only authenticated users can update organizations" 
ON public.organizations FOR UPDATE TO authenticated USING (true);

-- RLS Policies for families
CREATE POLICY "Users can view all families" 
ON public.families FOR SELECT USING (true);

CREATE POLICY "Only authenticated users can insert families" 
ON public.families FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Only authenticated users can update families" 
ON public.families FOR UPDATE TO authenticated USING (true);

-- RLS Policies for operators
CREATE POLICY "Users can view all operators" 
ON public.operators FOR SELECT USING (true);

CREATE POLICY "Users can insert their own operator profile" 
ON public.operators FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own operator profile" 
ON public.operators FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for family_members
CREATE POLICY "Users can view all family members" 
ON public.family_members FOR SELECT USING (true);

CREATE POLICY "Users can insert their own family membership" 
ON public.family_members FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own family membership" 
ON public.family_members FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own family membership" 
ON public.family_members FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for family_assignments
CREATE POLICY "Users can view all family assignments" 
ON public.family_assignments FOR SELECT USING (true);

CREATE POLICY "Only authenticated users can manage family assignments" 
ON public.family_assignments FOR ALL TO authenticated USING (true);

-- Add triggers for timestamp updates
CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON public.organizations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_families_updated_at
  BEFORE UPDATE ON public.families
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_operators_updated_at
  BEFORE UPDATE ON public.operators
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_family_assignments_updated_at
  BEFORE UPDATE ON public.family_assignments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_operators_user_id ON public.operators(user_id);
CREATE INDEX idx_operators_organization_id ON public.operators(organization_id);
CREATE INDEX idx_family_members_family_id ON public.family_members(family_id);
CREATE INDEX idx_family_members_user_id ON public.family_members(user_id);
CREATE INDEX idx_family_assignments_family_id ON public.family_assignments(family_id);
CREATE INDEX idx_family_assignments_operator_id ON public.family_assignments(operator_id);