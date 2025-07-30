-- Add one_time_price column to specializations table
ALTER TABLE public.specializations 
ADD COLUMN one_time_price INTEGER; -- Price in cents (e.g., 5000 = €50.00)

-- Create one_time_payments table to track single payments
CREATE TABLE public.one_time_payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  specialization_id UUID REFERENCES public.specializations(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL, -- Amount in cents
  currency TEXT DEFAULT 'eur',
  payment_type TEXT NOT NULL, -- e.g., 'profile_access'
  stripe_session_id TEXT UNIQUE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
  expires_at TIMESTAMP WITH TIME ZONE, -- When access expires (e.g., 30 days from payment)
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.one_time_payments ENABLE ROW LEVEL SECURITY;

-- Create policies for one_time_payments
CREATE POLICY "Users can view their own payments" 
ON public.one_time_payments 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own payments" 
ON public.one_time_payments 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can update payments" 
ON public.one_time_payments 
FOR UPDATE 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_one_time_payments_updated_at
BEFORE UPDATE ON public.one_time_payments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_one_time_payments_user_id ON public.one_time_payments(user_id);
CREATE INDEX idx_one_time_payments_specialization_id ON public.one_time_payments(specialization_id);
CREATE INDEX idx_one_time_payments_status ON public.one_time_payments(status);
CREATE INDEX idx_one_time_payments_expires_at ON public.one_time_payments(expires_at);

-- Insert some sample prices for existing specializations
UPDATE public.specializations 
SET one_time_price = CASE 
  WHEN name ILIKE '%assistente%' OR name ILIKE '%generico%' THEN 5000  -- €50
  WHEN name ILIKE '%oss%' OR name ILIKE '%operatore%' THEN 10000 -- €100
  WHEN name ILIKE '%badante%' OR name ILIKE '%convivente%' THEN 20000 -- €200
  ELSE 7500 -- Default €75
END
WHERE one_time_price IS NULL;