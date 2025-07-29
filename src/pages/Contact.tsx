import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin } from "lucide-react";
import Navbar from "@/components/Navbar";

const Contact = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    cognome: "",
    citta: "",
    email: "",
    messaggio: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Here you would typically send the data to your backend
      // For now, we'll just show a success message
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast({
        title: "Messaggio inviato!",
        description: "Grazie per averci contattato. Ti richiameremo a breve.",
      });
      
      // Reset form
      setFormData({
        nome: "",
        cognome: "",
        citta: "",
        email: "",
        messaggio: ""
      });
    } catch (error) {
      toast({
        title: "Errore",
        description: "Si è verificato un errore. Riprova più tardi.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-familu-blue mb-4">
            Contattaci
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Hai bisogno di aiuto per scegliere il piano giusto? Lascia i tuoi dati e ti richiameremo a breve.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader>
              <CardTitle className="text-2xl text-familu-blue">Lascia i tuoi dati</CardTitle>
              <CardDescription>
                Compila il modulo e verrai ricontattato a breve dal nostro team.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome *</Label>
                    <Input
                      id="nome"
                      name="nome"
                      type="text"
                      value={formData.nome}
                      onChange={handleChange}
                      required
                      placeholder="Il tuo nome"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cognome">Cognome *</Label>
                    <Input
                      id="cognome"
                      name="cognome"
                      type="text"
                      value={formData.cognome}
                      onChange={handleChange}
                      required
                      placeholder="Il tuo cognome"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="citta">Città *</Label>
                  <Input
                    id="citta"
                    name="citta"
                    type="text"
                    value={formData.citta}
                    onChange={handleChange}
                    required
                    placeholder="La tua città"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="la.tua.email@esempio.it"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="messaggio">Messaggio (opzionale)</Label>
                  <Textarea
                    id="messaggio"
                    name="messaggio"
                    value={formData.messaggio}
                    onChange={handleChange}
                    placeholder="Raccontaci di cosa hai bisogno..."
                    rows={4}
                  />
                </div>

                <Button 
                  type="submit" 
                  variant="familu" 
                  size="lg" 
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Invio in corso..." : "Invia Richiesta"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <div className="space-y-8">
            <Card className="shadow-[var(--shadow-card)]">
              <CardHeader>
                <CardTitle className="text-xl text-familu-blue">Altri modi per contattarci</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-familu-light-blue flex items-center justify-center">
                    <Mail className="h-6 w-6 text-familu-blue" />
                  </div>
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-muted-foreground">info@familu.it</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-familu-light-green flex items-center justify-center">
                    <Phone className="h-6 w-6 text-familu-green" />
                  </div>
                  <div>
                    <p className="font-medium">Telefono</p>
                    <p className="text-muted-foreground">+39 02 1234 5678</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">Sede</p>
                    <p className="text-muted-foreground">Milano, Italia</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-[var(--shadow-card)] bg-gradient-to-br from-familu-light-blue to-familu-light-green">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-familu-blue mb-2">
                  Tempi di risposta
                </h3>
                <p className="text-sm text-muted-foreground">
                  Il nostro team ti ricontatterà entro 24 ore durante i giorni lavorativi.
                  Per richieste urgenti, chiamaci direttamente.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;