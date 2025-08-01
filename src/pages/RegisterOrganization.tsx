import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSubscription } from "@/hooks/useSubscription";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Building2, Mail, Lock, User, Phone, Users, Crown } from "lucide-react";
import AddressInput from "@/components/AddressInput";

const RegisterOrganization = () => {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { createCheckout } = useSubscription();
  
  const plan = searchParams.get('plan') || 'starter';
  
  const planInfo = {
    starter: { name: "Starter", price: "Gratuito", icon: Building2, color: "primary" },
    business: { name: "Business", price: "€99,90/mese", icon: Users, color: "familu-blue" },
    enterprise: { name: "Enterprise", price: "€199,90/mese", icon: Crown, color: "accent" }
  };
  
  const currentPlan = planInfo[plan as keyof typeof planInfo] || planInfo.starter;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Errore",
        description: "Le password non coincidono.",
      });
      return;
    }

    if (!formData.termsAccepted) {
      toast({
        variant: "destructive",
        title: "Errore",
        description: "Devi accettare i termini di servizio per continuare.",
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            first_name: formData.name.split(' ')[0],
            last_name: formData.name.split(' ').slice(1).join(' '),
            display_name: formData.name,
            phone: formData.phone,
            location: formData.location,
            user_type: "organization"
          }
        }
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Errore di registrazione",
          description: error.message,
        });
        return;
      }

      if (data.user) {
        try {
          await supabase.from('organizations').insert({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            address: formData.location,
          });
        } catch (error) {
          console.error('Error creating organization profile:', error);
        }
        
        if (plan === 'starter') {
          toast({
            title: "Registrazione completata",
            description: "Account organizzazione creato con successo! Benvenuto nel piano Starter gratuito.",
          });
          navigate("/organization-dashboard");
        } else {
          // Per piani a pagamento, procedi con Stripe checkout
          try {
            await createCheckout(plan);
          } catch (error) {
            toast({
              title: "Errore",
              description: "Si è verificato un errore durante il pagamento. Contatta il supporto.",
              variant: "destructive"
            });
          }
        }
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Errore",
        description: "Si è verificato un errore durante la registrazione.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--gradient-primary)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/lovable-uploads/33195e00-6787-46f5-ad3c-c9e98b9b6a0e.png" alt="FamiLu" className="h-16 w-auto mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-familu-blue mb-2">Benvenuto su FamiLu</h1>
          <p className="text-familu-green">Crea il tuo account organizzazione</p>
          
          {/* Piano selezionato */}
          <div className="mt-6 p-4 bg-white/20 rounded-lg backdrop-blur-sm">
            <div className="flex items-center justify-center space-x-3">
              {React.createElement(currentPlan.icon, { className: `h-6 w-6 text-primary` })}
              <div>
                <h3 className="text-lg font-semibold text-familu-blue">
                  Abbonamento {currentPlan.name}
                </h3>
                <p className="text-sm text-familu-green">
                  {plan === 'starter' ? 'Gratuito' : currentPlan.price}
                </p>
              </div>
            </div>
          </div>
        </div>

        <Card className="shadow-[var(--shadow-familu)] border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-accent">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Account Organizzazione</CardTitle>
            <CardDescription>
              {plan === 'starter' 
                ? "Registrati gratuitamente per iniziare come organizzazione su FamiLu"
                : `Completa la registrazione per attivare il piano ${currentPlan.name}`
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Organizzazione</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="name" 
                    type="text" 
                    placeholder="Nome della tua organizzazione" 
                    value={formData.name} 
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                    className="pl-10" 
                    required 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="nome@email.com" 
                    value={formData.email} 
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                    className="pl-10" 
                    required 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefono</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="phone" 
                    type="tel" 
                    placeholder="+39 123 456 7890" 
                    value={formData.phone} 
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
                    className="pl-10" 
                    required 
                  />
                </div>
              </div>

              <AddressInput
                label="Località"
                value={formData.location}
                onChange={(address) => setFormData({ ...formData, location: address })}
                placeholder="Roma, Italia"
                id="location"
              />

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="Crea una password sicura" 
                    value={formData.password} 
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
                    className="pl-10" 
                    required 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Conferma Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="confirmPassword" 
                    type="password" 
                    placeholder="Ripeti la password" 
                    value={formData.confirmPassword} 
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} 
                    className="pl-10" 
                    required 
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="terms" 
                  checked={formData.termsAccepted} 
                  onCheckedChange={(checked) => setFormData({ ...formData, termsAccepted: checked as boolean })} 
                />
                <Label htmlFor="terms" className="text-sm">
                  Accetto i{" "}
                  <Link to="/terms" className="text-primary hover:text-primary-hover">
                    Termini di Servizio
                  </Link>{" "}
                  e la{" "}
                  <Link to="/privacy" className="text-primary hover:text-primary-hover">
                    Privacy Policy
                  </Link>
                </Label>
              </div>

              <Button 
                type="submit" 
                variant="familu" 
                size="lg" 
                disabled={!formData.termsAccepted || loading} 
                className="w-full text-sky-600 font-bold"
              >
                {loading 
                  ? "Registrazione in corso..." 
                  : plan === 'starter' 
                    ? "Registrati Gratuitamente" 
                    : `Registrati e Attiva ${currentPlan.name}`
                }
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Hai già un account?{" "}
                <Link to="/login" className="text-primary hover:text-primary-hover transition-colors font-medium">
                  Accedi qui
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegisterOrganization;