import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, UserCheck, Users, Crown, Star } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const PricingOperators = () => {
  const { user } = useAuth();
  const {
    subscribed,
    subscriptionTier,
    createCheckout,
    openCustomerPortal,
    checkSubscription
  } = useSubscription();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check for success/cancel parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
      toast({
        title: "Subscription activated!",
        description: "Welcome to your new plan. It may take a few moments to update."
      });
      checkSubscription();
    } else if (urlParams.get('canceled') === 'true') {
      toast({
        title: "Subscription canceled",
        description: "No charges were made. You can try again anytime.",
        variant: "destructive"
      });
    }
  }, [toast, checkSubscription]);

  const handleSubscribe = async (plan: string) => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to subscribe to a plan.",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }

    if (plan === 'basic') {
      toast({
        title: "Benvenuto nel piano Basic!",
        description: "Il tuo account operatore è ora attivo con il piano gratuito."
      });
      checkSubscription();
      return;
    }

    try {
      await createCheckout(plan);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create checkout session. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleManageSubscription = async () => {
    try {
      await openCustomerPortal();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to open customer portal. Please try again.",
        variant: "destructive"
      });
    }
  };

  const plans = [
    {
      name: "Basic",
      price: "Gratuito",
      description: "Perfetto per iniziare come operatore",
      icon: UserCheck,
      popular: false,
      features: [
        "Profilo operatore base",
        "Fino a 3 candidature al giorno",
        "Accesso limitato alle famiglie",
        "Supporto via email",
        "Portfolio base"
      ],
      limitations: [
        "Nessuna priorità nelle ricerche",
        "Nessun badge di verifica",
        "Nessun accesso a funzionalità premium"
      ]
    },
    {
      name: "Professional",
      price: "€39,90",
      period: "/mese",
      description: "La scelta ideale per operatori attivi",
      icon: Users,
      popular: true,
      features: [
        "Tutto di Basic +",
        "Candidature illimitate",
        "Badge di verifica professionale",
        "Priorità nei risultati di ricerca",
        "Portfolio avanzato con foto",
        "Statistiche dettagliate",
        "Chat diretta con le famiglie",
        "Supporto prioritario"
      ],
      limitations: []
    },
    {
      name: "Expert",
      price: "€79,90",
      period: "/mese",
      description: "Massima visibilità e strumenti avanzati",
      icon: Crown,
      popular: false,
      features: [
        "Tutto di Professional +",
        "Profilo sempre in evidenza",
        "Account manager dedicato",
        "Recensioni premium",
        "Calendario integrato",
        "Sistema di fatturazione automatico",
        "Analisi avanzate del profilo",
        "Supporto 24/7"
      ],
      limitations: []
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-familu-blue mb-4">
            Piani per Operatori
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Scegli il piano che ti permette di offrire i tuoi servizi al massimo delle potenzialità.
            Dalla visibilità base alla gestione professionale completa.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map(plan => {
            const IconComponent = plan.icon;
            return (
              <Card key={plan.name} className={`relative shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-familu)] transition-all duration-300 flex flex-col h-full ${plan.popular ? 'ring-2 ring-familu-blue scale-105' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-familu-blue text-primary-foreground px-4 py-1">
                      <Star className="h-3 w-3 mr-1" />
                      Consigliato
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-8">
                  <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                    plan.name === "Basic" ? "bg-familu-light-blue" : 
                    plan.name === "Professional" ? "bg-familu-light-green" : "bg-accent"
                  }`}>
                    <IconComponent className={`h-8 w-8 ${
                      plan.name === "Basic" ? "text-familu-blue" : 
                      plan.name === "Professional" ? "text-familu-green" : "text-primary"
                    }`} />
                  </div>
                  
                  <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                  <CardDescription className="text-muted-foreground mb-4">
                    {plan.description}
                  </CardDescription>
                  
                  <div className="text-center">
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                  </div>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col">
                  <div className="space-y-4 flex-1">
                    <div>
                      <h4 className="font-semibold text-sm text-foreground mb-3">Cosa include:</h4>
                      <ul className="space-y-2">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-start space-x-3">
                            <Check className="h-4 w-4 text-familu-green mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-8">
                    {subscriptionTier === plan.name.toLowerCase() ? (
                      plan.name === "Basic" ? (
                        <Button variant="familu-outline" size="lg" className="w-full" disabled>
                          Piano Attuale
                        </Button>
                      ) : (
                        <Button variant="familu" size="lg" className="w-full" onClick={handleManageSubscription}>
                          Gestisci Abbonamento
                        </Button>
                      )
                    ) : (
                      <Button 
                        variant={plan.popular ? "familu" : "familu-outline"} 
                        size="lg" 
                        onClick={() => handleSubscribe(plan.name.toLowerCase())} 
                        className={`w-full ${
                          plan.name === "Professional" ? "border-2 border-familu-blue text-familu-blue" : 
                          plan.name === "Expert" ? "border-2 border-familu-green text-familu-green hover:bg-familu-green hover:text-white" : ""
                        }`}
                      >
                        {plan.name === "Basic" ? "Iscriviti Ora" : "Sottoscrivi Ora"}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Features Comparison */}
        <div className="bg-white rounded-lg shadow-[var(--shadow-card)] p-8 mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">Confronto Dettagliato</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-4 px-4">Funzionalità</th>
                  <th className="text-center py-4 px-4">Basic</th>
                  <th className="text-center py-4 px-4">Professional</th>
                  <th className="text-center py-4 px-4">Expert</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {[
                  { feature: "Candidature al giorno", basic: "3", professional: "Illimitate", expert: "Illimitate" },
                  { feature: "Badge di verifica", basic: "❌", professional: "✅", expert: "✅" },
                  { feature: "Priorità nei risultati", basic: "❌", professional: "✅", expert: "✅" },
                  { feature: "Portfolio avanzato", basic: "❌", professional: "✅", expert: "✅" },
                  { feature: "Profilo in evidenza", basic: "❌", professional: "❌", expert: "✅" },
                  { feature: "Account manager", basic: "❌", professional: "❌", expert: "✅" },
                  { feature: "Calendario integrato", basic: "❌", professional: "❌", expert: "✅" },
                  { feature: "Supporto prioritario", basic: "❌", professional: "✅", expert: "24/7" }
                ].map((row, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3 px-4 font-medium">{row.feature}</td>
                    <td className="py-3 px-4 text-center">{row.basic}</td>
                    <td className="py-3 px-4 text-center">{row.professional}</td>
                    <td className="py-3 px-4 text-center">{row.expert}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 p-8 bg-[var(--gradient-primary)] rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-primary-foreground">
            Pronto a Iniziare la Tua Carriera?
          </h2>
          <p className="mb-6 text-primary-foreground/80 text-base">
            Unisciti a centinaia di operatori che già lavorano attraverso FamiLu
          </p>
          <Button variant="secondary" size="lg" className="bg-white text-primary hover:bg-white/90">
            Inizia Subito
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PricingOperators;