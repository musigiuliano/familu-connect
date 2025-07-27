import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Users, Building, Search, Star, Shield, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
const Index = () => {
  const navigate = useNavigate();
  const userTypes = [{
    title: "Famiglie",
    description: "Trova assistenza generica e qualificata per i tuoi cari",
    icon: Heart,
    color: "familu-blue",
    features: ["Ricerca operatori preparati", "Verifica le recensioni", "Comunicazione diretta"],
    path: "/pricing-families"
  }, {
    title: "Operatori",
    description: "Offri i tuoi servizi alle famiglie che ti cercano",
    icon: Users,
    color: "familu-green",
    features: ["Profilo professionale", "Gestione appuntamenti", "Valutazioni clienti"],
    path: "/pricing-operators"
  }, {
    title: "Organizzazioni",
    description: "Offri la tua organizzazione e i tuoi servizi",
    icon: Building,
    color: "primary",
    features: ["Profilo organizzazione", "Presentazione del team", "Verifica contatti"],
    path: "/pricing-organizations"
  }];
  return <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 bg-[var(--gradient-primary)] text-familu-blue lg:px-[12px] py-[4px]">
        <div className="max-w-7xl mx-auto text-center">
          <img src="/lovable-uploads/33195e00-6787-46f5-ad3c-c9e98b9b6a0e.png" alt="FamiLu - Home, Care, Community" className="h-128 w-auto mx-auto" />
          <h1 className="text-5xl mb-6 font-extrabold text-[#489dd0] text-center">Colleghiamo Famiglie  con Operatori di Assistenza domiciliare</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90 text-lime-500 font-extrabold">
            FamiLu è la piattaforma che mette in contatto le famiglie che necessitano di assistenza 
            domiciliare con operatori e organizzazioni qualificate e verificate.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="xl" onClick={() => navigate("/search")} className="bg-white text-primary hover:bg-white/90">
              <Search className="h-5 w-5 mr-2" />
              Trova Assistenza
            </Button>
            <Button variant="familu-outline" size="xl" onClick={() => navigate("/register")} className="border-white hover:bg-white text-lime-500">
              Registrati Gratis
            </Button>
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-[39px]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-sky-600">Una Piattaforma dove bisogni e soluzioni si incontrano</h2>
            <p className="text-lg text-muted-foreground">Seleziona il tuo ruolo e inizia subito</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {userTypes.map((type, index) => {
            const IconComponent = type.icon;
            return <Card key={index} className="shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-familu)] transition-all duration-300 cursor-pointer" onClick={() => {
              navigate(type.path);
              window.scrollTo(0, 0);
            }}>
                  <CardHeader className="text-center">
                    <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${type.color === "familu-blue" ? "bg-familu-light-blue" : type.color === "familu-green" ? "bg-familu-light-green" : "bg-accent"}`}>
                      <IconComponent className={`h-8 w-8 ${type.color === "familu-blue" ? "text-familu-blue" : type.color === "familu-green" ? "text-familu-green" : "text-primary"}`} />
                    </div>
                    <CardTitle className="text-xl">{type.title}</CardTitle>
                    <CardDescription>{type.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {type.features.map((feature, i) => <li key={i} className="flex items-center space-x-2 text-sm">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                          <span>{feature}</span>
                        </li>)}
                    </ul>
                  </CardContent>
                </Card>;
          })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl mb-4 font-bold text-green-500">
              Perché Scegliere FamiLu?
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[{
            icon: Shield,
            title: "Sicurezza Garantita",
            description: "Tutti gli operatori sono verificati e certificati"
          }, {
            icon: Star,
            title: "Qualità ed empatia più sicura",
            description: "Col sistema delle recensioni e valutazioni trasparenti sei più sicuro affidando i tuoi cari"
          }, {
            icon: MessageCircle,
            title: "Comunicazione Diretta",
            description: "Con la Chat integrata puoi comunicare facilmente ed in sicurezza con gli operatori"
          }].map((feature, index) => {
            const IconComponent = feature.icon;
            return <div key={index} className="text-center">
                  <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <IconComponent className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title === "Sicurezza Garantita" ? "Maggiore sicurezza" : feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description === "Tutti gli operatori sono verificati e certificati" ? "Puoi verificare i profili degli operatori e ottenere recensioni e testimonianze di altre famiglie" : feature.description}</p>
                </div>;
          })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-bold mb-4 text-green-500 text-6xl">
            Pronto a Iniziare?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Unisciti alle famiglie e operatori che già usano FamiLu
          </p>
          <Button variant="familu" size="xl" onClick={() => navigate("/pricing-selection")} className="text-sky-600 text-3xl font-bold rounded-3xl">
            Registrati Gratuitamente
          </Button>
        </div>
      </section>
    </div>;
};
export default Index;