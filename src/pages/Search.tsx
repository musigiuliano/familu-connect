import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Search as SearchIcon, MapPin, Star, Filter, User, Building, MessageCircle, Calendar, Phone, Mail, Shield, Award, Lock } from "lucide-react";
import Navbar from "@/components/Navbar";
import AddressInput from "@/components/AddressInput";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { supabase } from "@/integrations/supabase/client";
const Search = () => {
  const {
    user
  } = useAuth();
  const {
    subscribed,
    subscriptionTier
  } = useSubscription();
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [specializations, setSpecializations] = useState<Array<{
    id: string;
    name: string;
  }>>([]);
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
        const {
          data,
          error
        } = await supabase.from('specializations').select('id, name').eq('active', true).order('name');
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
    setSelectedSpecializations(prev => prev.includes(specId) ? prev.filter(id => id !== specId) : [...prev, specId]);
  };
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);

  // Load search results
  const performSearch = async () => {
    try {
      setSearchLoading(true);

      // Query operators
      let operatorQuery = supabase.from('operators').select(`
          id,
          user_id,
          license_number,
          status,
          created_at,
          operator_specializations(
            id,
            experience_years,
            certification_level,
            specializations(
              id,
              name
            )
          )
        `).eq('status', 'active');

      // Filter by specializations if selected
      if (selectedSpecializations.length > 0) {
        operatorQuery = operatorQuery.in('operator_specializations.specialization_id', selectedSpecializations);
      }
      
      const { data: operators, error: operatorError } = await operatorQuery;
      if (operatorError) throw operatorError;

      // Get profile data for operators
      const operatorUserIds = operators?.map(op => op.user_id).filter(Boolean) || [];
      const { data: operatorProfiles } = await supabase
        .from('profiles')
        .select('user_id, first_name, last_name, display_name')
        .in('user_id', operatorUserIds);

      // Combine operator data with profiles
      const operatorsWithProfiles = operators?.map(op => ({
        ...op,
        profile: operatorProfiles?.find(p => p.user_id === op.user_id)
      })) || [];

      // Query organizations
      let organizationQuery = supabase.from('organizations').select(`
          id,
          name,
          description,
          address,
          phone,
          email,
          website,
          organization_type,
          organization_specializations(
            id,
            team_size,
            certification_level,
            specializations(
              id,
              name
            )
          )
        `);

      // Filter by specializations if selected
      if (selectedSpecializations.length > 0) {
        organizationQuery = organizationQuery.in('organization_specializations.specialization_id', selectedSpecializations);
      }
      const {
        data: organizations,
        error: orgError
      } = await organizationQuery;
      if (orgError) throw orgError;

      // Format results - use operatorsWithProfiles instead of operators
      const formattedOperators = operatorsWithProfiles?.map(op => ({
        id: op.id,
        type: 'operator' as const,
        name: `${op.profile?.first_name || ''} ${op.profile?.last_name || ''}`.trim() || 'Operatore',
        specializations: op.operator_specializations?.map((os: any) => os.specializations?.name).filter(Boolean) || [],
        location: "Italia",
        // TODO: add location data
        rating: 4.8,
        reviews: 12,
        experience: `${Math.max(...(op.operator_specializations?.map((os: any) => os.experience_years || 0) || [0]))}+ anni`,
        verified: true,
        available: op.status === 'active',
        price: "€25/ora",
        // TODO: add price data
        description: `Operatore specializzato con licenza ${op.license_number || 'N/A'}`,
        avatar: "/placeholder-avatar.jpg"
      })) || [];
      const formattedOrganizations = organizations?.map(org => ({
        id: org.id,
        type: 'organization' as const,
        name: org.name || 'Organizzazione',
        specializations: org.organization_specializations?.map((os: any) => os.specializations?.name).filter(Boolean) || [],
        location: org.address || "Italia",
        rating: 4.6,
        reviews: 28,
        teamSize: org.organization_specializations?.reduce((acc: number, os: any) => acc + (os.team_size || 0), 0) || 1,
        verified: true,
        description: org.description || 'Organizzazione professionale di assistenza',
        avatar: "/placeholder-org.jpg"
      })) || [];
      const allResults = [...formattedOperators, ...formattedOrganizations];
      setTotalResults(allResults.length);

      // Apply filters
      let filteredResults = allResults;
      if (filters.userType !== "all") {
        filteredResults = filteredResults.filter(result => result.type === filters.userType);
      }
      if (searchQuery) {
        filteredResults = filteredResults.filter(result => result.name.toLowerCase().includes(searchQuery.toLowerCase()) || result.specializations.some((spec: string) => spec.toLowerCase().includes(searchQuery.toLowerCase())) || result.description.toLowerCase().includes(searchQuery.toLowerCase()));
      }

      // Always show at least 3 results as preview (or all if less than 3)
      const previewResults = filteredResults.slice(0, 3);
      setSearchResults(previewResults);
    } catch (error) {
      console.error('Error performing search:', error);
    } finally {
      setSearchLoading(false);
    }
  };

  // Load results on component mount and when filters change
  useEffect(() => {
    performSearch();
  }, [selectedSpecializations, filters.userType]);

  // Handle search button click
  const handleSearch = () => {
    performSearch();
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
  return <div className="min-h-screen bg-background">
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
                <Input placeholder="Cosa cerchi? (es. fisioterapista, assistenza anziani)" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10" />
              </div>
              <div className="relative">
                <AddressInput label="" value={location} onChange={address => setLocation(address)} placeholder="Dove? (es. Roma, Milano)" id="location-search" />
              </div>
              <Button variant="familu" size="lg" onClick={handleSearch} className="w-full text-lime-500 text-lg font-bold">
                <SearchIcon className="h-4 w-4 mr-2" />
                {searchLoading ? "Cercando..." : "Cerca"}
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
                  <Select value={filters.userType} onValueChange={value => setFilters({
                  ...filters,
                  userType: value
                })}>
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
                    {specializations.map(spec => <div key={spec.id} className="flex items-center space-x-2">
                        <Checkbox id={spec.id} checked={selectedSpecializations.includes(spec.id)} onCheckedChange={() => toggleSpecialization(spec.id)} />
                        <label htmlFor={spec.id} className="text-sm">{spec.name}</label>
                      </div>)}
                  </div>
                </div>

                {/* Rating Filter */}
                <div>
                  <label className="text-sm font-medium mb-3 block">Valutazione Minima</label>
                  <Select value={filters.rating} onValueChange={value => setFilters({
                  ...filters,
                  rating: value
                })}>
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
                  <Select value={filters.availability} onValueChange={value => setFilters({
                  ...filters,
                  availability: value
                })}>
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
                {searchResults.length} risultati mostrati {totalResults > 3 && !canSeeNames() ? `di ${totalResults} totali` : ""}
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

            {/* Preview Banner for non-premium users */}
            {!canSeeNames() && totalResults > 0 && <Card className="mb-6 bg-gradient-to-r from-familu-blue/10 to-familu-green/10 border-familu-blue/20">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center space-x-2 mb-3">
                    <Lock className="h-5 w-5 text-familu-blue" />
                    <h3 className="text-lg font-semibold text-familu-blue">Anteprima Risultati</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Stai visualizzando {searchResults.length} risultati di anteprima su {totalResults} totali disponibili.
                    {!user && " Accedi per vedere più risultati."}
                    {user && !subscribed && " Abbonati per accedere a tutti i risultati e contattare direttamente gli operatori."}
                  </p>
                  <div className="flex flex-wrap justify-center gap-3">
                    {!user && <>
                        <Button variant="familu" onClick={() => window.location.href = "/login"}>
                          Accedi
                        </Button>
                        <Button variant="familu-outline" onClick={() => window.location.href = "/register"}>
                          Registrati
                        </Button>
                      </>}
                    {user && !subscribed && <Button variant="familu" onClick={() => window.location.href = "/pricing"}>
                        Scopri i Piani Premium
                      </Button>}
                  </div>
                </CardContent>
              </Card>}

            <div className="space-y-6">
              {searchLoading ? <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p>Caricamento risultati...</p>
                </div> : searchResults.length === 0 ? <div className="text-center py-8">
                  <p className="text-muted-foreground">Nessun risultato trovato. Prova a modificare i filtri di ricerca.</p>
                </div> : searchResults.map((result, index) => <Card key={result.id} className="shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-familu)] transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={result.avatar} />
                          <AvatarFallback>
                            {result.type === "organization" ? <Building className="h-8 w-8" /> : <User className="h-8 w-8" />}
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
                              {!canSeeNames() && <div className="flex items-center space-x-1">
                                  <Lock className="h-4 w-4 text-muted-foreground" />
                                  <Badge variant="outline" className="text-xs">
                                    Anteprima
                                  </Badge>
                                </div>}
                              {result.verified && <Shield className="h-4 w-4 text-familu-green" />}
                              {result.type === "operator" && result.available && <Badge variant="secondary" className="bg-familu-light-green text-familu-green">
                                  Disponibile
                                </Badge>}
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
                          {result.type === "operator" && result.price && <div className="text-right">
                              <p className="text-lg font-semibold text-familu-blue">{result.price}</p>
                            </div>}
                        </div>

                        {/* Specializations */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {result.specializations.map(spec => <Badge key={spec} variant="outline" className="text-xs">
                              {spec}
                            </Badge>)}
                        </div>

                        {/* Description */}
                        <p className="text-sm text-muted-foreground mb-4">
                          {result.description}
                        </p>

                        {/* Additional Info */}
                        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mb-4">
                          {result.type === "operator" && result.experience && <div className="flex items-center space-x-1">
                              <Award className="h-3 w-3" />
                              <span>{result.experience} di esperienza</span>
                            </div>}
                          {result.type === "organization" && result.teamSize && <div className="flex items-center space-x-1">
                              <User className="h-3 w-3" />
                              <span>{result.teamSize} membri del team</span>
                            </div>}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-3">
                          {canSeeNames() ? <>
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
                            </> : <>
                              <Button variant="outline" size="sm" disabled>
                                <Lock className="h-4 w-4 mr-2" />
                                {!user ? "Accedi per Contattare" : "Premium per Contattare"}
                              </Button>
                              <Button variant="familu" size="sm" onClick={() => window.location.href = !user ? "/login" : "/pricing"}>
                                {!user ? "Accedi" : "Ottieni Accesso Premium"}
                              </Button>
                            </>}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>)}
            </div>

            {/* Load More Button - only show for premium users with more results */}
            {canSeeNames() && totalResults > searchResults.length && <div className="text-center mt-8">
                <Button variant="outline" size="lg">
                  Carica Altri Risultati ({totalResults - searchResults.length} rimanenti)
                </Button>
              </div>}

            {/* Upgrade prompt for more results */}
            {!canSeeNames() && totalResults > 3 && <div className="text-center mt-8">
                <Card className="bg-gradient-to-r from-familu-blue/5 to-familu-green/5">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-2">Altri {totalResults - 3} risultati disponibili</h3>
                    <p className="text-muted-foreground mb-4">
                      {!user ? "Accedi per vedere tutti i risultati e contattare direttamente gli operatori." : "Abbonati per accedere a tutti i risultati e alle funzionalità complete."}
                    </p>
                    <Button variant="familu" onClick={() => window.location.href = !user ? "/login" : "/pricing"}>
                      {!user ? "Accedi Ora" : "Scopri i Piani Premium"}
                    </Button>
                  </CardContent>
                </Card>
              </div>}
          </div>
        </div>
      </div>
    </div>;
};
export default Search;