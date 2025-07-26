-- Temporarily disable foreign key constraints for testing
-- This will allow us to insert test data without real authenticated users

-- First, let's drop the foreign key constraints temporarily
ALTER TABLE public.operators DROP CONSTRAINT IF EXISTS operators_user_id_fkey;
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_user_id_fkey;
ALTER TABLE public.family_members DROP CONSTRAINT IF EXISTS family_members_user_id_fkey;

-- Add some sample data with fake user IDs for testing
-- Note: In production, these would be real authenticated user IDs