-- Fix security warning for handle_new_user function
ALTER FUNCTION public.handle_new_user() SET search_path = '';