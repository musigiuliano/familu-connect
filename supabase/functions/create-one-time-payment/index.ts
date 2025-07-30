import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper logging function for enhanced debugging
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-ONE-TIME-PAYMENT] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Create Supabase client using the anon key for user authentication
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  // Service role client for writing payment records
  const supabaseService = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    // Retrieve authenticated user
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    // Parse request body
    const { specializationId } = await req.json();
    if (!specializationId) throw new Error("Specialization ID is required");
    logStep("Request parsed", { specializationId });

    // Get specialization details including price
    const { data: specialization, error: specError } = await supabaseClient
      .from('specializations')
      .select('id, name, one_time_price')
      .eq('id', specializationId)
      .single();

    if (specError || !specialization) {
      throw new Error("Specialization not found");
    }

    if (!specialization.one_time_price) {
      throw new Error("This specialization does not have a one-time payment option");
    }

    logStep("Specialization found", { 
      name: specialization.name, 
      price: specialization.one_time_price 
    });

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Check if a Stripe customer record exists for this user
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Found existing customer", { customerId });
    } else {
      logStep("No existing customer found");
    }

    // Create checkout session for one-time payment
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: { 
              name: `Accesso Premium - ${specialization.name}`,
              description: `Accesso esclusivo ai professionisti per ${specialization.name} per 30 giorni`
            },
            unit_amount: specialization.one_time_price,
          },
          quantity: 1,
        },
      ],
      mode: "payment", // One-time payment
      success_url: `${req.headers.get("origin")}/payment-success?type=one-time&specialization=${specializationId}`,
      cancel_url: `${req.headers.get("origin")}/pricing-families`,
      metadata: {
        user_id: user.id,
        specialization_id: specializationId,
        payment_type: "profile_access"
      }
    });

    logStep("Checkout session created", { sessionId: session.id });

    // Record the payment attempt in our database
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 days access

    const { error: insertError } = await supabaseService
      .from("one_time_payments")
      .insert({
        user_id: user.id,
        specialization_id: specializationId,
        amount: specialization.one_time_price,
        currency: "eur",
        payment_type: "profile_access",
        stripe_session_id: session.id,
        status: "pending",
        expires_at: expiresAt.toISOString(),
      });

    if (insertError) {
      logStep("Error inserting payment record", { error: insertError });
      throw new Error("Failed to record payment attempt");
    }

    logStep("Payment record created successfully");

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in create-one-time-payment", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});