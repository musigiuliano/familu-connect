import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Heart, Mail, Lock, User, Building, Phone, MapPin } from "lucide-react";
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
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle registration logic here
    console.log("Registration data:", formData);
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

                    <div className="space-y-2">
                      <Label htmlFor="location">Località</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="location" type="text" placeholder="Roma, Italia" value={formData.location} onChange={e => setFormData({
                      ...formData,
                      location: e.target.value
                    })} className="pl-10" required />
                      </div>
                    </div>

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

                    <Button type="submit" variant="familu" size="lg" disabled={!formData.termsAccepted} className="w-full text-sky-600 font-bold">
                      Registrati come {type === "family" ? "Famiglia" : type === "operator" ? "Operatore" : "Organizzazione"}
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