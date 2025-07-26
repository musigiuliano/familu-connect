import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  Building, 
  MapPin, 
  Phone, 
  Mail, 
  Edit, 
  Plus, 
  X, 
  Star, 
  Users, 
  FileText, 
  Camera,
  Globe,
  Award,
  CheckCircle
} from "lucide-react";
import Navbar from "@/components/Navbar";
import AddressInput from "@/components/AddressInput";
import SpecializationSelector from "@/components/SpecializationSelector";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const OrganizationProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    description: "",
    organization_type: "",
    specializations: [] as any[]
  });

  useEffect(() => {
    if (user) {
      loadOrganizationProfile();
    }
  }, [user]);

  const loadOrganizationProfile = async () => {
    try {
      setLoading(true);
      
      // Load organization profile
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .select(`
          *,
          organization_specializations(
            id,
            team_size,
            certification_level,
            notes,
            specializations(*)
          )
        `)
        .maybeSingle();

      if (orgError && orgError.code !== 'PGRST116') {
        throw orgError;
      }

      if (orgData) {
        setOrganizationId(orgData.id);
        
        const specializations = orgData.organization_specializations?.map((os: any) => ({
          id: os.specializations.id,
          name: os.specializations.name,
          description: os.specializations.description,
          category: os.specializations.category,
          team_size: os.team_size,
          certification_level: os.certification_level,
          notes: os.notes
        })) || [];

        setProfileData({
          name: orgData.name || "",
          email: orgData.email || "",
          phone: orgData.phone || "",
          website: orgData.website || "",
          address: orgData.address || "",
          description: orgData.description || "",
          organization_type: orgData.organization_type || "",
          specializations
        });
      }
    } catch (error) {
      console.error('Error loading organization profile:', error);
      toast({
        variant: "destructive",
        title: "Errore",
        description: "Errore nel caricamento del profilo organizzazione.",
      });
    } finally {
      setLoading(false);
    }
  };

  const [teamMembers] = useState([
    {
      id: 1,
      name: "Dr. Marco Verdi",
      role: "Direttore Sanitario",
      specialization: "Medicina Generale",
      experience: "15+ anni",
      avatar: "/placeholder-avatar.jpg"
    },
    {
      id: 2,
      name: "Maria Bianchi",
      role: "Coordinatore Fisioterapisti",
      specialization: "Fisioterapia",
      experience: "8+ anni",
      avatar: "/placeholder-avatar.jpg"
    },
    {
      id: 3,
      name: "Giuseppe Rossi",
      role: "Psicologo",
      specialization: "Supporto Psicologico",
      experience: "10+ anni",
      avatar: "/placeholder-avatar.jpg"
    }
  ]);

  const [reviews] = useState([
    {
      id: 1,
      familyName: "Famiglia Russo",
      rating: 5,
      comment: "Servizio eccellente, personale molto qualificato e professionale. Mia madre si è trovata benissimo.",
      date: "1 settimana fa"
    },
    {
      id: 2,
      familyName: "Famiglia Conti",
      rating: 4,
      comment: "Ottima organizzazione, sempre puntuali e attenti alle esigenze. Consigliatissimi.",
      date: "2 settimane fa"
    }
  ]);

  const handleSave = async () => {
    if (!organizationId && !user) return;
    
    try {
      setLoading(true);
      
      // Update or create organization profile
      if (organizationId) {
        const { error } = await supabase
          .from('organizations')
          .update({
            name: profileData.name,
            email: profileData.email,
            phone: profileData.phone,
            website: profileData.website,
            address: profileData.address,
            description: profileData.description,
            organization_type: profileData.organization_type,
          })
          .eq('id', organizationId);
        if (error) throw error;
      } else {
        // Create new organization profile
        const { data: newOrg, error } = await supabase
          .from('organizations')
          .insert({
            name: profileData.name,
            email: profileData.email,
            phone: profileData.phone,
            website: profileData.website,
            address: profileData.address,
            description: profileData.description,
            organization_type: profileData.organization_type,
          })
          .select()
          .single();
        
        if (error) throw error;
        setOrganizationId(newOrg.id);
      }

      toast({
        title: "Profilo aggiornato",
        description: "I dati dell'organizzazione sono stati salvati con successo.",
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving organization profile:', error);
      toast({
        variant: "destructive",
        title: "Errore",
        description: "Errore nel salvataggio del profilo.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSpecializationsChange = async (specializations: any[]) => {
    if (!organizationId) return;
    
    try {
      // Delete existing specializations
      await supabase
        .from('organization_specializations')
        .delete()
        .eq('organization_id', organizationId);

      // Insert new specializations
      if (specializations.length > 0) {
        const specializationsToInsert = specializations.map(spec => ({
          organization_id: organizationId,
          specialization_id: spec.id,
          team_size: spec.team_size,
          certification_level: spec.certification_level,
          notes: spec.notes
        }));

        const { error } = await supabase
          .from('organization_specializations')
          .insert(specializationsToInsert);

        if (error) throw error;
      }

      setProfileData({ ...profileData, specializations });
      
      toast({
        title: "Specializzazioni aggiornate",
        description: "Le specializzazioni dell'organizzazione sono state salvate.",
      });
    } catch (error) {
      console.error('Error updating specializations:', error);
      toast({
        variant: "destructive",
        title: "Errore",
        description: "Errore nel salvataggio delle specializzazioni.",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">Caricamento profilo organizzazione...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Profilo Organizzazione</h1>
            <p className="text-muted-foreground">Gestisci il profilo della tua organizzazione e i servizi offerti</p>
          </div>
          <Button 
            variant={isEditing ? "familu-green" : "familu-outline"}
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
            className="mt-4 sm:mt-0"
          >
            {isEditing ? "Salva Modifiche" : <><Edit className="h-4 w-4 mr-2" />Modifica Profilo</>}
          </Button>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile">Profilo</TabsTrigger>
            <TabsTrigger value="services">Servizi</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="areas">Aree Servizio</TabsTrigger>
            <TabsTrigger value="reviews">Recensioni</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Organization Logo & Basic Info */}
              <Card className="lg:col-span-1">
                <CardContent className="p-6 text-center">
                  <div className="relative mb-4">
                    <Avatar className="h-32 w-32 mx-auto">
                      <AvatarImage src="/placeholder-org.jpg" />
                      <AvatarFallback className="text-2xl">
                        <Building className="h-16 w-16" />
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <Button 
                        size="sm" 
                        variant="familu-outline" 
                        className="absolute bottom-0 right-1/2 transform translate-x-1/2 translate-y-2"
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2">{profileData.name}</h3>
                  
                   <div className="flex items-center justify-center space-x-1 mb-2">
                     <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                     <span className="font-medium">4.7</span>
                     <span className="text-muted-foreground">(24 recensioni)</span>
                   </div>
                  
                  <Badge variant="secondary" className="mb-4">
                    <Award className="h-3 w-3 mr-1" />
                    Certificata
                  </Badge>
                  
                   <div className="space-y-2 text-sm">
                     <div className="flex items-center justify-center space-x-2">
                       <Users className="h-4 w-4 text-muted-foreground" />
                       <span>Team qualificato</span>
                     </div>
                     <div className="flex items-center justify-center space-x-2">
                       <Building className="h-4 w-4 text-muted-foreground" />
                       <span>Organizzazione verificata</span>
                     </div>
                   </div>
                </CardContent>
              </Card>

              {/* Detailed Information */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Informazioni Organizzazione</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome Organizzazione</Label>
                      {isEditing ? (
                        <Input
                          id="name"
                          value={profileData.name}
                          onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                        />
                      ) : (
                        <p className="text-sm text-muted-foreground">{profileData.name}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      {isEditing ? (
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        />
                      ) : (
                        <p className="text-sm text-muted-foreground">{profileData.email}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefono</Label>
                      {isEditing ? (
                        <Input
                          id="phone"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                        />
                      ) : (
                        <p className="text-sm text-muted-foreground">{profileData.phone}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="website">Sito Web</Label>
                      {isEditing ? (
                        <Input
                          id="website"
                          value={profileData.website}
                          onChange={(e) => setProfileData({...profileData, website: e.target.value})}
                        />
                      ) : (
                        <p className="text-sm text-muted-foreground">{profileData.website}</p>
                      )}
                    </div>
                  </div>

                   <div className="space-y-2">
                     {isEditing ? (
                       <AddressInput
                         label="Indirizzo"
                         value={profileData.address}
                         onChange={(address) => setProfileData({...profileData, address: address})}
                         placeholder="Inserisci l'indirizzo completo"
                         id="address"
                       />
                     ) : (
                       <>
                         <Label htmlFor="address">Indirizzo</Label>
                         <p className="text-sm text-muted-foreground">{profileData.address}</p>
                       </>
                     )}
                   </div>

                   <div className="space-y-2">
                     <Label htmlFor="organization_type">Tipo Organizzazione</Label>
                     {isEditing ? (
                       <Input
                         id="organization_type"
                         value={profileData.organization_type}
                         onChange={(e) => setProfileData({...profileData, organization_type: e.target.value})}
                         placeholder="es. Casa di Cura, Centro Riabilitativo"
                       />
                     ) : (
                       <p className="text-sm text-muted-foreground">{profileData.organization_type}</p>
                     )}
                   </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Descrizione</Label>
                    {isEditing ? (
                      <Textarea
                        id="description"
                        value={profileData.description}
                        onChange={(e) => setProfileData({...profileData, description: e.target.value})}
                        rows={4}
                        placeholder="Descrivi la tua organizzazione, mission e valori..."
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground">{profileData.description}</p>
                    )}
                  </div>

                 </CardContent>
               </Card>
             </div>
           </TabsContent>

           <TabsContent value="services" className="mt-6">
             <SpecializationSelector
               selectedSpecializations={profileData.specializations}
               onSpecializationsChange={handleSpecializationsChange}
               type="organization"
               readOnly={!isEditing}
             />
           </TabsContent>

          <TabsContent value="team" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Membri del Team</span>
                  {isEditing && (
                    <Button variant="familu" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Aggiungi Membro
                    </Button>
                  )}
                </CardTitle>
                <CardDescription>I professionisti che fanno parte della tua organizzazione</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {teamMembers.map((member) => (
                    <Card key={member.id} className="shadow-[var(--shadow-card)]">
                      <CardContent className="p-4 text-center">
                        <Avatar className="h-16 w-16 mx-auto mb-3">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback>
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <h4 className="font-medium">{member.name}</h4>
                        <p className="text-sm text-familu-blue">{member.role}</p>
                        <p className="text-xs text-muted-foreground">{member.specialization}</p>
                        <p className="text-xs text-muted-foreground">{member.experience}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="areas" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Aree di Servizio</CardTitle>
                <CardDescription>Le zone geografiche dove offrite i vostri servizi</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Funzionalità per gestire le aree di servizio in fase di sviluppo.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-400" />
                  <span>Recensioni e Valutazioni</span>
                </CardTitle>
                <CardDescription>
                  Valutazione media: 4.7/5 da {reviews.length} recensioni
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="p-4 border border-border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">{review.familyName}</h4>
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground">{review.date}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default OrganizationProfile;