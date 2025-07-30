import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Loader2, Lock, Clock, CheckCircle } from "lucide-react";

interface Specialization {
  id: string;
  name: string;
  description: string;
  one_time_price: number;
  category: string;
}

interface UserPayment {
  specialization_id: string;
  status: string;
  expires_at: string;
}

const PricingOneTime = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [userPayments, setUserPayments] = useState<UserPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchSpecializations();
    if (user) {
      fetchUserPayments();
    }
  }, [user]);

  const fetchSpecializations = async () => {
    try {
      const { data, error } = await supabase
        .from('specializations')
        .select('id, name, description, one_time_price, category')
        .not('one_time_price', 'is', null)
        .eq('active', true)
        .order('one_time_price', { ascending: true });

      if (error) throw error;
      setSpecializations(data || []);
    } catch (error) {
      console.error('Error fetching specializations:', error);
      toast({
        title: "Errore",
        description: "Impossibile caricare le specializzazioni",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPayments = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('one_time_payments')
        .select('specialization_id, status, expires_at')
        .eq('user_id', user.id)
        .eq('status', 'paid')
        .gte('expires_at', new Date().toISOString());

      if (error) throw error;
      setUserPayments(data || []);
    } catch (error) {
      console.error('Error fetching user payments:', error);
    }
  };

  const handlePurchase = async (specializationId: string) => {
    if (!user) {
      navigate('/login');
      return;
    }

    setPaymentLoading(specializationId);

    try {
      const { data, error } = await supabase.functions.invoke('create-one-time-payment', {
        body: { specializationId }
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Errore",
        description: "Impossibile avviare il pagamento. Riprova più tardi.",
        variant: "destructive",
      });
    } finally {
      setPaymentLoading(null);
    }
  };

  const formatPrice = (priceInCents: number) => {
    return `€${(priceInCents / 100).toFixed(2)}`;
  };

  const hasAccess = (specializationId: string) => {
    return userPayments.some(payment => 
      payment.specialization_id === specializationId && 
      new Date(payment.expires_at) > new Date()
    );
  };

  const getExpiryDate = (specializationId: string) => {
    const payment = userPayments.find(p => p.specialization_id === specializationId);
    if (payment) {
      return new Date(payment.expires_at).toLocaleDateString('it-IT');
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-familu-blue mb-4">
            Accesso Premium per Specializzazione
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Ottieni accesso esclusivo ai migliori professionisti per ogni specializzazione. 
            Paga solo per quello di cui hai bisogno, quando ne hai bisogno.
          </p>
        </div>

        {/* Specializations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {specializations.map((spec) => {
            const userHasAccess = hasAccess(spec.id);
            const expiryDate = getExpiryDate(spec.id);
            const isLoading = paymentLoading === spec.id;

            return (
              <Card key={spec.id} className="relative shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-familu)] transition-all duration-300">
                <CardHeader className="text-center pb-8">
                  <div className="flex items-center justify-center mb-4">
                    {userHasAccess ? (
                      <CheckCircle className="h-8 w-8 text-familu-green" />
                    ) : (
                      <Lock className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                  
                  <CardTitle className="text-xl mb-2">{spec.name}</CardTitle>
                  {spec.category && (
                    <Badge variant="secondary" className="mb-3">
                      {spec.category}
                    </Badge>
                  )}
                  <CardDescription className="text-muted-foreground">
                    {spec.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-familu-blue mb-1">
                      {formatPrice(spec.one_time_price)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Accesso per 30 giorni
                    </p>
                  </div>

                  {userHasAccess ? (
                    <div className="space-y-3">
                      <Button 
                        variant="secondary" 
                        size="lg" 
                        className="w-full"
                        disabled
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Accesso Attivo
                      </Button>
                      <div className="flex items-center justify-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-1" />
                        Scade il {expiryDate}
                      </div>
                    </div>
                  ) : (
                    <Button 
                      variant="familu-outline"
                      size="lg" 
                      className="w-full hover:bg-familu-blue hover:text-white transition-colors"
                      onClick={() => handlePurchase(spec.id)}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Elaborazione...
                        </>
                      ) : (
                        'Acquista Accesso'
                      )}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Benefits Section */}
        <div className="text-center mt-16 p-8 bg-[var(--gradient-primary)] rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-familu-blue">
            Perché Scegliere l'Accesso Premium?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-familu-blue/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="h-6 w-6 text-familu-blue" />
              </div>
              <h3 className="font-semibold mb-2">Professionisti Verificati</h3>
              <p className="text-sm text-muted-foreground">
                Accesso esclusivo ai migliori professionisti della categoria
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-familu-green/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="h-6 w-6 text-familu-green" />
              </div>
              <h3 className="font-semibold mb-2">Accesso Immediato</h3>
              <p className="text-sm text-muted-foreground">
                Contatta subito i professionisti dopo l'acquisto
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-accent/50 rounded-full flex items-center justify-center mx-auto mb-3">
                <Lock className="h-6 w-6 text-accent-foreground" />
              </div>
              <h3 className="font-semibold mb-2">Flessibilità</h3>
              <p className="text-sm text-muted-foreground">
                Paga solo per le specializzazioni che ti servono
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingOneTime;