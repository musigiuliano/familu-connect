import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, Building2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useNavigate } from "react-router-dom";

const PricingSelection = () => {
  const navigate = useNavigate();

  const userTypes = [
    {
      title: "Famiglia",
      description: "Cerco assistenza per la mia famiglia e i miei cari",
      icon: Users,
      color: "familu-blue",
      bgColor: "familu-light-blue",
      route: "/pricing-families"
    },
    {
      title: "Operatore",
      description: "Offro servizi di assistenza professionale",
      icon: UserCheck,
      color: "familu-green",
      bgColor: "familu-light-green",
      route: "/pricing-operators"
    },
    {
      title: "Organizzazione",
      description: "Gestisco un'organizzazione che offre servizi assistenziali",
      icon: Building2,
      color: "accent-foreground",
      bgColor: "accent",
      route: "/pricing-organizations"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-familu-blue mb-4">
            Trova il Piano Perfetto per Te
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            I nostri piani sono pensati per soddisfare le diverse esigenze di famiglie, 
            operatori e organizzazioni. Seleziona la tua categoria per vedere i prezzi dedicati.
          </p>
        </div>

        {/* User Type Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {userTypes.map((type) => {
            const IconComponent = type.icon;
            return (
              <Card 
                key={type.title} 
                className="relative shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-familu)] transition-all duration-300 cursor-pointer group hover:scale-105"
                onClick={() => {
                  navigate(type.route);
                  window.scrollTo(0, 0);
                }}
              >
                <CardHeader className="text-center pb-8">
                  <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6 bg-${type.bgColor} group-hover:scale-110 transition-transform`}>
                    <IconComponent className={`h-10 w-10 text-${type.color}`} />
                  </div>
                  
                  <CardTitle className="text-2xl mb-4">{type.title}</CardTitle>
                  <CardDescription className="text-muted-foreground text-base">
                    {type.description}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <Button 
                    variant="familu-outline" 
                    size="lg" 
                    className="w-full group-hover:bg-familu-blue group-hover:text-white transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(type.route);
                      window.scrollTo(0, 0);
                    }}
                  >
                    Scopri Dettagli
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Info Section */}
        <div className="text-center mt-16 p-8 bg-[var(--gradient-primary)] rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-primary-foreground">
            Non Sai Quale Categoria Scegliere?
          </h2>
          <p className="mb-6 text-primary-foreground/80 text-base">
            Contattaci per una consulenza gratuita e ti aiuteremo a trovare la soluzione migliore
          </p>
          <Button variant="secondary" size="lg" className="bg-white text-primary hover:bg-white/90">
            Contattaci
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PricingSelection;