import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Heart, Mail, Lock, User, Building } from "lucide-react";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    userType: "family"
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Errore di accesso",
          description: error.message === "Invalid login credentials" 
            ? "Credenziali non valide. Verifica email e password." 
            : error.message,
        });
        return;
      }

      if (data.user) {
        toast({
          title: "Accesso effettuato",
          description: "Benvenuto di nuovo!",
        });
        
        // Redirect based on user type or to dashboard
        navigate("/dashboard");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Errore",
        description: "Si è verificato un errore durante l'accesso.",
      });
    } finally {
      setLoading(false);
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
          <h1 className="text-3xl font-bold text-familu-blue mb-2">Bentornato su FamiLu</h1>
          <p className="text-familu-green">Accedi per trovare o offrire assistenza</p>
        </div>

        <Card className="shadow-[var(--shadow-familu)] border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Accedi al tuo account</CardTitle>
            <CardDescription>
              Inserisci le tue credenziali per continuare
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="family" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="family" className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  <span className="hidden sm:inline">Famiglia</span>
                </TabsTrigger>
                <TabsTrigger value="operator" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Operatore</span>
                </TabsTrigger>
                <TabsTrigger value="organization" className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  <span className="hidden sm:inline">Organizzazione</span>
                </TabsTrigger>
              </TabsList>

              {["family", "operator", "organization"].map((type) => (
                <TabsContent key={type} value={type}>

                  <form onSubmit={handleSubmit} className="space-y-4">
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
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="password"
                          type="password"
                          placeholder="La tua password"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
                      {loading ? "Accesso in corso..." : `Accedi come ${type === "family" ? "Famiglia" : type === "operator" ? "Operatore" : "Organizzazione"}`}
                    </Button>
                  </form>
                </TabsContent>
              ))}
            </Tabs>

            <div className="mt-6 text-center space-y-2">
              <Link 
                to="/forgot-password" 
                className="text-sm text-primary hover:text-primary-hover transition-colors"
              >
                Hai dimenticato la password?
              </Link>
              <p className="text-sm text-muted-foreground">
                Non hai un account?{" "}
                <Link 
                  to="/pricing" 
                  className="text-primary hover:text-primary-hover transition-colors font-medium"
                >
                  Registrati qui
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;