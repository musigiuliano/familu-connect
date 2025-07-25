import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Heart, Users, Crown, Star } from "lucide-react";
import Navbar from "@/components/Navbar";

const Pricing = () => {
  const plans = [
    {
      name: "Friends",
      price: "Gratuito",
      description: "Perfetto per iniziare a esplorare FamiLu",
      icon: Heart,
      popular: false,
      features: [
        "Profilo base",
        "Ricerca limitata (5 al giorno)",
        "Messaggi limitati (3 al giorno)",
        "Supporto via email",
        "Accesso alla community"
      ],
      limitations: [
        "Nessuna priorità nelle ricerche",
        "Nessun accesso a filtri avanzati",
        "Nessuna verifica profilo"
      ]
    },
    {
      name: "Network",
      price: "€19.99",
      period: "/mese",
      description: "La scelta ideale per famiglie attive",
      icon: Users,
      popular: true,
      features: [
        "Tutto di Friends +",
        "Ricerche illimitate",
        "Messaggi illimitati",
        "Filtri avanzati di ricerca",
        "Verifica profilo con badge",
        "Priorità nel customer support",
        "Accesso a webinar esclusivi",
        "Sistema di recensioni esteso"
      ],
      limitations: []
    },
    {
      name: "Alliance", 
      price: "€49.99",
      period: "/mese",
      description: "Massima priorità e funzionalità premium",
      icon: Crown,
      popular: false,
      features: [
        "Tutto di Network +",
        "Profilo in evidenza nei risultati",
        "Account manager dedicato",
        "Accesso anticipato a nuove funzionalità",
        "Analisi dettagliate del profilo",
        "Video-chiamate illimitate",
        "Consulenza personalizzata",
        "Supporto prioritario 24/7"
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
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Scegli il Piano Perfetto per Te
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Da famiglie che cercano assistenza occasionale a organizzazioni che offrono servizi completi,
            abbiamo il piano giusto per ogni esigenza.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => {
            const IconComponent = plan.icon;
            return (
              <Card 
                key={plan.name} 
                className={`relative shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-familu)] transition-all duration-300 ${
                  plan.popular ? 'ring-2 ring-familu-blue scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-familu-blue text-white px-4 py-1">
                      <Star className="h-3 w-3 mr-1" />
                      Più Popolare
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-8">
                  <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                    plan.name === "Friends" ? "bg-familu-light-blue" :
                    plan.name === "Network" ? "bg-familu-light-green" :
                    "bg-accent"
                  }`}>
                    <IconComponent className={`h-8 w-8 ${
                      plan.name === "Friends" ? "text-familu-blue" :
                      plan.name === "Network" ? "text-familu-green" :
                      "text-primary"
                    }`} />
                  </div>
                  
                  <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                  <CardDescription className="text-muted-foreground mb-4">
                    {plan.description}
                  </CardDescription>
                  
                  <div className="text-center">
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    {plan.period && (
                      <span className="text-muted-foreground">{plan.period}</span>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4 mb-8">
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

                  <Button 
                    variant={plan.popular ? "familu" : "familu-outline"} 
                    size="lg" 
                    className="w-full"
                  >
                    {plan.name === "Friends" ? "Inizia Gratis" : "Inizia Prova Gratuita"}
                  </Button>
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
                  <th className="text-center py-4 px-4">Friends</th>
                  <th className="text-center py-4 px-4">Network</th>
                  <th className="text-center py-4 px-4">Alliance</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {[
                  { feature: "Ricerche al giorno", friends: "5", network: "Illimitate", alliance: "Illimitate" },
                  { feature: "Messaggi al giorno", friends: "3", network: "Illimitati", alliance: "Illimitati" },
                  { feature: "Verifica profilo", friends: "❌", network: "✅", alliance: "✅" },
                  { feature: "Filtri avanzati", friends: "❌", network: "✅", alliance: "✅" },
                  { feature: "Profilo in evidenza", friends: "❌", network: "❌", alliance: "✅" },
                  { feature: "Account manager", friends: "❌", network: "❌", alliance: "✅" },
                  { feature: "Video-chiamate", friends: "❌", network: "Limitate", alliance: "Illimitate" },
                  { feature: "Supporto prioritario", friends: "❌", network: "✅", alliance: "24/7" }
                ].map((row, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3 px-4 font-medium">{row.feature}</td>
                    <td className="py-3 px-4 text-center">{row.friends}</td>
                    <td className="py-3 px-4 text-center">{row.network}</td>
                    <td className="py-3 px-4 text-center">{row.alliance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-8">Domande Frequenti</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="text-left">
              <h3 className="font-semibold mb-2">Posso cambiare piano in qualsiasi momento?</h3>
              <p className="text-muted-foreground text-sm">
                Sì, puoi aggiornare o ridurre il tuo piano in qualsiasi momento. 
                Le modifiche avranno effetto dal prossimo ciclo di fatturazione.
              </p>
            </div>
            <div className="text-left">
              <h3 className="font-semibold mb-2">È disponibile una prova gratuita?</h3>
              <p className="text-muted-foreground text-sm">
                Sì, tutti i piani a pagamento includono una prova gratuita di 14 giorni.
                Nessun impegno, puoi cancellare in qualsiasi momento.
              </p>
            </div>
            <div className="text-left">
              <h3 className="font-semibold mb-2">Come funziona la fatturazione?</h3>
              <p className="text-muted-foreground text-sm">
                La fatturazione avviene mensilmente. Accettiamo tutte le principali 
                carte di credito e bonifici bancari per le organizzazioni.
              </p>
            </div>
            <div className="text-left">
              <h3 className="font-semibold mb-2">Supporto disponibile?</h3>
              <p className="text-muted-foreground text-sm">
                Tutti i piani includono supporto via email. I piani Network e Alliance 
                hanno accesso prioritario e supporto telefonico.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 p-8 bg-[var(--gradient-primary)] rounded-lg">
          <h2 className="text-2xl font-bold text-white mb-4">
            Pronto a Iniziare con FamiLu?
          </h2>
          <p className="text-white/90 mb-6">
            Unisciti a migliaia di famiglie e operatori che già si fidano di FamiLu
          </p>
          <Button variant="secondary" size="xl" className="bg-white text-primary hover:bg-white/90">
            Inizia la Tua Prova Gratuita
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Pricing;