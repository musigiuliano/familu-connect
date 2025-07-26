import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Heart, Mail, Lock, User, Building, Phone, MapPin } from "lucide-react";
import AddressInput from "@/components/AddressInput";

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);
const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
    userType: "family"
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleGoogleSignUp = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Errore",
          description: "Errore durante l'autenticazione con Google.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Errore",
        description: "Si è verificato un errore durante l'autenticazione.",
      });
    }
  };

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
            user_type: formData.userType
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
        // Create the appropriate profile based on user type
        await createUserProfile(data.user.id, formData);
        
        toast({
          title: "Registrazione completata",
          description: "Account creato con successo! Verifica la tua email per attivare l'account.",
        });
        navigate("/login");
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

  const createUserProfile = async (userId: string, data: typeof formData) => {
    try {
      if (data.userType === "family") {
        await supabase.from('families').insert({
          family_name: data.name,
          email: data.email,
          phone: data.phone,
          address: data.location,
        });
      } else if (data.userType === "operator") {
        await supabase.from('operators').insert({
          user_id: userId,
        });
      } else if (data.userType === "organization") {
        await supabase.from('organizations').insert({
          name: data.name,
          email: data.email,
          phone: data.phone,
          address: data.location,
        });
      }
    } catch (error) {
      console.error('Error creating profile:', error);
    }
  };
  return <div className="min-h-screen bg-[var(--gradient-primary)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/lovable-uploads/33195e00-6787-46f5-ad3c-c9e98b9b6a0e.png" alt="FamiLu" className="h-16 w-auto mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-2">Benvenuto su FamiLu</h1>
          <p className="text-white/80">Crea il tuo account per iniziare</p>
        </div>

        <Card className="shadow-[var(--shadow-familu)] border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Crea il tuo account</CardTitle>
            <CardDescription>
              Scegli il tipo di account che fa per te
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

              {["family", "operator", "organization"].map(type => <TabsContent key={type} value={type}>
                  {/* Google Sign Up Button */}
                  <div className="mb-6">
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      className="w-full flex items-center justify-center gap-3 hover:bg-gray-50"
                      onClick={handleGoogleSignUp}
                    >
                      <GoogleIcon />
                      Continua con Google
                    </Button>
                    
                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                          oppure con email
                        </span>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">
                        {type === "family" ? "Nome Famiglia" : type === "operator" ? "Nome e Cognome" : "Nome Organizzazione"}
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="name" type="text" placeholder={type === "family" ? "Es. Famiglia Rossi" : type === "operator" ? "Mario Rossi" : "Nome della tua organizzazione"} value={formData.name} onChange={e => setFormData({
                      ...formData,
                      name: e.target.value
                    })} className="pl-10" required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="email" type="email" placeholder="nome@email.com" value={formData.email} onChange={e => setFormData({
                      ...formData,
                      email: e.target.value
                    })} className="pl-10" required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefono</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="phone" type="tel" placeholder="+39 123 456 7890" value={formData.phone} onChange={e => setFormData({
                      ...formData,
                      phone: e.target.value
                    })} className="pl-10" required />
                      </div>
                    </div>

                    <AddressInput
                      label="Località"
                      value={formData.location}
                      onChange={(address, coordinates) => setFormData({
                        ...formData,
                        location: address
                      })}
                      placeholder="Roma, Italia"
                      id="location"
                    />

                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="password" type="password" placeholder="Crea una password sicura" value={formData.password} onChange={e => setFormData({
                      ...formData,
                      password: e.target.value
                    })} className="pl-10" required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Conferma Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="confirmPassword" type="password" placeholder="Ripeti la password" value={formData.confirmPassword} onChange={e => setFormData({
                      ...formData,
                      confirmPassword: e.target.value
                    })} className="pl-10" required />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox id="terms" checked={formData.termsAccepted} onCheckedChange={checked => setFormData({
                    ...formData,
                    termsAccepted: checked as boolean
                  })} />
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

                    <Button type="submit" variant="familu" size="lg" disabled={!formData.termsAccepted || loading} className="w-full text-sky-600 font-bold">
                      {loading ? "Registrazione in corso..." : `Registrati come ${type === "family" ? "Famiglia" : type === "operator" ? "Operatore" : "Organizzazione"}`}
                    </Button>
                  </form>
                </TabsContent>)}
            </Tabs>

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
    </div>;
};
export default Register;