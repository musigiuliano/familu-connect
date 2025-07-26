-- Crea tabella delle specializzazioni
CREATE TABLE public.specializations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  category TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Abilita RLS
ALTER TABLE public.specializations ENABLE ROW LEVEL SECURITY;

-- Policy per visualizzare tutte le specializzazioni
CREATE POLICY "Everyone can view active specializations" 
ON public.specializations 
FOR SELECT 
USING (active = true);

-- Policy per gestire le specializzazioni (solo per admin futuri)
CREATE POLICY "Only authenticated users can manage specializations" 
ON public.specializations 
FOR ALL 
USING (true);

-- Inserisci le specializzazioni di base
INSERT INTO public.specializations (name, description, category) VALUES
('Assistenza Anziani', 'Cura e assistenza per persone anziane', 'Assistenza Domiciliare'),
('Assistenza Disabili', 'Supporto per persone con disabilità', 'Assistenza Specializzata'),
('Fisioterapia', 'Riabilitazione e terapie fisiche', 'Sanitario'),
('Supporto Psicologico', 'Consulenza e supporto psicologico', 'Sanitario'),
('Assistenza Medica', 'Cure mediche e infermieristiche', 'Sanitario'),
('Riabilitazione', 'Percorsi di riabilitazione motoria', 'Sanitario'),
('Assistenza Domiciliare', 'Servizi di assistenza a domicilio', 'Assistenza Domiciliare'),
('Supporto Medico', 'Assistenza medica specializzata', 'Sanitario'),
('Terapia Occupazionale', 'Riabilitazione nelle attività quotidiane', 'Riabilitazione'),
('Logopedia', 'Terapia per disturbi del linguaggio', 'Sanitario');

-- Crea tabella collegamento operatori-specializzazioni
CREATE TABLE public.operator_specializations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  operator_id UUID NOT NULL REFERENCES public.operators(id) ON DELETE CASCADE,
  specialization_id UUID NOT NULL REFERENCES public.specializations(id) ON DELETE CASCADE,
  experience_years INTEGER,
  certification_level TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(operator_id, specialization_id)
);

-- Abilita RLS
ALTER TABLE public.operator_specializations ENABLE ROW LEVEL SECURITY;

-- Policy per visualizzare collegamenti
CREATE POLICY "Users can view operator specializations" 
ON public.operator_specializations 
FOR SELECT 
USING (true);

-- Policy per gestire i propri collegamenti
CREATE POLICY "Operators can manage their own specializations" 
ON public.operator_specializations 
FOR ALL 
USING (
  operator_id IN (
    SELECT id FROM public.operators WHERE user_id = auth.uid()
  )
);

-- Crea tabella collegamento organizzazioni-specializzazioni
CREATE TABLE public.organization_specializations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  specialization_id UUID NOT NULL REFERENCES public.specializations(id) ON DELETE CASCADE,
  team_size INTEGER,
  certification_level TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(organization_id, specialization_id)
);

-- Abilita RLS
ALTER TABLE public.organization_specializations ENABLE ROW LEVEL SECURITY;

-- Policy per visualizzare collegamenti
CREATE POLICY "Users can view organization specializations" 
ON public.organization_specializations 
FOR SELECT 
USING (true);

-- Policy per gestire i propri collegamenti (per admin organizzazione)
CREATE POLICY "Organizations can manage their own specializations" 
ON public.organization_specializations 
FOR ALL 
USING (true);

-- Trigger per aggiornare timestamp
CREATE TRIGGER update_specializations_updated_at
BEFORE UPDATE ON public.specializations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();