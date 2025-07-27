import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, ArrowLeft, CheckCircle, Search } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const { toast } = useToast();

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Errore",
          description: error.message,
        });
        return;
      }

      setEmailSent(true);
      toast({
        title: "Email inviata",
        description: "Controlla la tua casella di posta per le istruzioni per resettare la password.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Errore",
        description: "Si è verificato un errore durante l'invio dell'email.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAccountSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchLoading(true);

    try {
      // Search in families table
      const { data: families } = await supabase
        .from('families')
        .select('family_name, email')
        .eq('email', email);

      // Search in organizations table  
      const { data: organizations } = await supabase
        .from('organizations')
        .select('name, email')
        .eq('email', email);

      const results = [
        ...(families || []).map(f => ({ type: 'Famiglia', name: f.family_name, email: f.email })),
        ...(organizations || []).map(o => ({ type: 'Organizzazione', name: o.name, email: o.email }))
      ];

      setSearchResults(results);

      if (results.length === 0) {
        toast({
          variant: "destructive",
          title: "Nessun account trovato",
          description: "Non è stato trovato nessun account associato a questa email.",
        });
      } else {
        toast({
          title: "Account trovati",
          description: `Trovati ${results.length} account associati a questa email.`,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Errore",
        description: "Si è verificato un errore durante la ricerca.",
      });
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--gradient-primary)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img 
            src="/lovable-uploads/33195e00-6787-46f5-ad3c-c9e98b9b6a0e.png" 
            alt="FamiLu" 
            className="h-16 w-auto mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold text-familu-blue mb-2">Recupera il tuo account</h1>
          <p className="text-familu-green">Ti aiutiamo a rientrare nel tuo account</p>
        </div>

        <Card className="shadow-[var(--shadow-familu)] border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Recupero Account</CardTitle>
            <CardDescription>
              Scegli come vuoi recuperare il tuo account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="password" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="password">Reset Password</TabsTrigger>
                <TabsTrigger value="search">Trova Account</TabsTrigger>
              </TabsList>

              <TabsContent value="password">
                {emailSent ? (
                  <div className="text-center space-y-4">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                    <h3 className="text-lg font-semibold">Email inviata!</h3>
                    <p className="text-muted-foreground">
                      Abbiamo inviato le istruzioni per resettare la password a:
                    </p>
                    <p className="font-medium">{email}</p>
                    <p className="text-sm text-muted-foreground">
                      Controlla anche la cartella spam se non vedi l'email.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEmailSent(false);
                        setEmail("");
                      }}
                    >
                      Invia a un'altra email
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handlePasswordReset} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="Inserisci la tua email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      variant="familu" 
                      size="lg" 
                      className="w-full"
                      disabled={loading}
                    >
                      {loading ? "Invio in corso..." : "Invia istruzioni"}
                    </Button>
                  </form>
                )}
              </TabsContent>

              <TabsContent value="search">
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Inserisci la tua email per trovare tutti gli account associati.
                  </p>
                  
                  <form onSubmit={handleAccountSearch} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="search-email">Email</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="search-email"
                          type="email"
                          placeholder="Inserisci la tua email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      variant="outline" 
                      size="lg" 
                      className="w-full"
                      disabled={searchLoading}
                    >
                      {searchLoading ? "Ricerca in corso..." : "Cerca account"}
                    </Button>
                  </form>

                  {searchResults.length > 0 && (
                    <div className="mt-6 space-y-2">
                      <h4 className="font-medium">Account trovati:</h4>
                      {searchResults.map((result, index) => (
                        <div key={index} className="p-3 bg-muted rounded-lg">
                          <p className="font-medium">{result.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Tipo: {result.type}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Email: {result.email}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <Link 
                to="/login" 
                className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary-hover transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Torna al login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;