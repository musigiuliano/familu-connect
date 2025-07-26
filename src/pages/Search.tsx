import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Search as SearchIcon, 
  MapPin, 
  Star, 
  Filter, 
  User, 
  Building, 
  MessageCircle, 
  Calendar,
  Phone,
  Mail,
  Shield,
  Award,
  Lock
} from "lucide-react";
import Navbar from "@/components/Navbar";
import AddressInput from "@/components/AddressInput";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { supabase } from "@/integrations/supabase/client";

const Search = () => {
  const { user } = useAuth();
  const { subscribed, subscriptionTier } = useSubscription();
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [specializations, setSpecializations] = useState<Array<{id: string, name: string}>>([]);
  const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    userType: "all",
    availability: "all",
    rating: "all"
  });

  // Load specializations from database
  useEffect(() => {
    const loadSpecializations = async () => {
      try {
        const { data, error } = await supabase
          .from('specializations')
          .select('id, name')
          .eq('active', true)
          .order('name');
        
        if (error) throw error;
        setSpecializations(data || []);
      } catch (error) {
        console.error('Error loading specializations:', error);
      }
    };

    loadSpecializations();
  }, []);
  // Handle specialization filter changes
  const toggleSpecialization = (specId: string) => {
    setSelectedSpecializations(prev => 
      prev.includes(specId) 
        ? prev.filter(id => id !== specId)
        : [...prev, specId]
    );
  };

  // Function to determine if names should be visible
  const canSeeNames = () => {
    if (!user) return false;
    if (!subscribed) return false;
    return true;
  };

  // Function to hide names based on subscription tier
  const getDisplayName = (name: string, type: "operator" | "organization") => {
    if (!canSeeNames()) {
      return type === "operator" ? "Operatore Verificato" : "Organizzazione Verificata";
    }
    
    // If user is subscribed but has basic tier, show partial name
    if (subscriptionTier === "Basic") {
      const words = name.split(" ");
      if (words.length > 1) {
        return `${words[0]} ${words[1].charAt(0)}.`;
      }
      return `${name.charAt(0)}***`;
    }
    
    // Premium and Enterprise users can see full names
    return name;
  };

  const mockResults = [
    {
      id: 1,
      type: "operator",
      name: "Maria Bianchi",
      specializations: ["Assistenza Anziani", "Fisioterapia"],
      location: "Roma Centro",
      rating: 4.8,
      reviews: 45,
      experience: "5+ anni",
      verified: true,
      available: true,
      price: "€25/ora",
      description: "Fisioterapista specializzata nell'assistenza domiciliare per anziani. Esperienza pluriennale nel settore.",
      avatar: "/placeholder-avatar.jpg"
    },
    {
      id: 2,
      type: "organization",
      name: "AssistCare Roma",
      specializations: ["Assistenza Domiciliare", "Supporto Medico", "Riabilitazione"],
      location: "Roma",
      rating: 4.6,
      reviews: 128,
      teamSize: 25,
      verified: true,
      description: "Organizzazione leader nell'assistenza domiciliare con un team di professionisti qualificati.",
      avatar: "/placeholder-org.jpg"
    },
    {
      id: 3,
      type: "operator",
      name: "Giuseppe Rossi",
      specializations: ["Assistenza Disabili", "Supporto Psicologico"],
      location: "Roma Sud",
      rating: 4.9,
      reviews: 32,
      experience: "8+ anni",
      verified: true,
      available: false,
      price: "€30/ora",
      description: "Psicologo e operatore sociale specializzato nel supporto a persone con disabilità.",
      avatar: "/placeholder-avatar.jpg"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Trova l'Assistenza che Ti Serve
          </h1>
          <p className="text-lg text-muted-foreground">
            Scopri operatori e organizzazioni qualificate nella tua zona
          </p>
        </div>

        {/* Search Bar */}
        <Card className="mb-8 shadow-[var(--shadow-card)]">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cosa cerchi? (es. fisioterapista, assistenza anziani)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="relative">
                <AddressInput
                  label=""
                  value={location}
                  onChange={(address) => setLocation(address)}
                  placeholder="Dove? (es. Roma, Milano)"
                  id="location-search"
                />
              </div>
              <Button variant="familu" size="lg" className="w-full">
                <SearchIcon className="h-4 w-4 mr-2" />
                Cerca
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Filter className="h-5 w-5" />
                  <span>Filtri</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Type Filter */}
                <div>
                  <label className="text-sm font-medium mb-3 block">Tipo</label>
                  <Select value={filters.userType} onValueChange={(value) => setFilters({...filters, userType: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tutti</SelectItem>
                      <SelectItem value="operator">Operatori</SelectItem>
                      <SelectItem value="organization">Organizzazioni</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Specializations */}
                <div>
                  <label className="text-sm font-medium mb-3 block">Specializzazioni</label>
                  <div className="space-y-2">
                    {specializations.map((spec) => (
                      <div key={spec.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={spec.id} 
                          checked={selectedSpecializations.includes(spec.id)}
                          onCheckedChange={() => toggleSpecialization(spec.id)}
                        />
                        <label htmlFor={spec.id} className="text-sm">{spec.name}</label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rating Filter */}
                <div>
                  <label className="text-sm font-medium mb-3 block">Valutazione Minima</label>
                  <Select value={filters.rating} onValueChange={(value) => setFilters({...filters, rating: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona valutazione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tutte</SelectItem>
                      <SelectItem value="4">4+ stelle</SelectItem>
                      <SelectItem value="4.5">4.5+ stelle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Availability */}
                <div>
                  <label className="text-sm font-medium mb-3 block">Disponibilità</label>
                  <Select value={filters.availability} onValueChange={(value) => setFilters({...filters, availability: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona disponibilità" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tutti</SelectItem>
                      <SelectItem value="available">Disponibili ora</SelectItem>
                      <SelectItem value="week">Disponibili questa settimana</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                {mockResults.length} risultati trovati
              </h2>
              <Select defaultValue="rating">
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Migliore valutazione</SelectItem>
                  <SelectItem value="distance">Più vicino</SelectItem>
                  <SelectItem value="price">Prezzo più basso</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-6">
              {mockResults.map((result) => (
                <Card key={result.id} className="shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-familu)] transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={result.avatar} />
                          <AvatarFallback>
                            {result.type === "organization" ? (
                              <Building className="h-8 w-8" />
                            ) : (
                              <User className="h-8 w-8" />
                            )}
                          </AvatarFallback>
                        </Avatar>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2">
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="text-lg font-semibold">
                                {getDisplayName(result.name, result.type as "operator" | "organization")}
                              </h3>
                              {!canSeeNames() && (
                                <div className="flex items-center space-x-1">
                                  <Lock className="h-4 w-4 text-muted-foreground" />
                                  <Badge variant="outline" className="text-xs">
                                    Accesso Premium
                                  </Badge>
                                </div>
                              )}
                              {result.verified && (
                                <Shield className="h-4 w-4 text-familu-green" />
                              )}
                              {result.type === "operator" && result.available && (
                                <Badge variant="secondary" className="bg-familu-light-green text-familu-green">
                                  Disponibile
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                              <div className="flex items-center space-x-1">
                                <MapPin className="h-4 w-4" />
                                <span>{result.location}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span>{result.rating}</span>
                                <span>({result.reviews} recensioni)</span>
                              </div>
                            </div>
                          </div>
                          {result.type === "operator" && result.price && (
                            <div className="text-right">
                              <p className="text-lg font-semibold text-familu-blue">{result.price}</p>
                            </div>
                          )}
                        </div>

                        {/* Specializations */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {result.specializations.map((spec) => (
                            <Badge key={spec} variant="outline" className="text-xs">
                              {spec}
                            </Badge>
                          ))}
                        </div>

                        {/* Description */}
                        <p className="text-sm text-muted-foreground mb-4">
                          {result.description}
                        </p>

                        {/* Additional Info */}
                        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mb-4">
                          {result.type === "operator" && result.experience && (
                            <div className="flex items-center space-x-1">
                              <Award className="h-3 w-3" />
                              <span>{result.experience} di esperienza</span>
                            </div>
                          )}
                          {result.type === "organization" && result.teamSize && (
                            <div className="flex items-center space-x-1">
                              <User className="h-3 w-3" />
                              <span>{result.teamSize} membri del team</span>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-3">
                          {canSeeNames() ? (
                            <>
                              <Button variant="familu" size="sm">
                                <MessageCircle className="h-4 w-4 mr-2" />
                                Invia Messaggio
                              </Button>
                              <Button variant="familu-outline" size="sm">
                                <Calendar className="h-4 w-4 mr-2" />
                                Prenota Appuntamento
                              </Button>
                              <Button variant="ghost" size="sm">
                                Visualizza Profilo
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button variant="outline" size="sm" disabled>
                                <Lock className="h-4 w-4 mr-2" />
                                Accedi per Contattare
                              </Button>
                              <Button variant="familu" size="sm" onClick={() => window.location.href = '/pricing'}>
                                Ottieni Accesso Premium
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-8">
              <Button variant="outline" size="lg">
                Carica Altri Risultati
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;