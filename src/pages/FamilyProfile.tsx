import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, MapPin, Phone, Mail, Edit, Plus, X, FileText } from "lucide-react";
import Navbar from "@/components/Navbar";
import AddressInput from "@/components/AddressInput";

const FamilyProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [familyId, setFamilyId] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [profileData, setProfileData] = useState({
    familyName: "",
    email: "",
    phone: "",
    location: "",
    address: "",
    city: "",
    postal_code: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    assistanceTypes: [] as string[],
    medicalConditions: [] as string[],
    description: "",
    notes: ""
  });

  const [activeRequests, setActiveRequests] = useState([]);

  useEffect(() => {
    if (user) {
      loadFamilyProfile();
    }
  }, [user]);

  const loadFamilyProfile = async () => {
    try {
      setLoading(true);
      
      // Check if user is a family member
      const { data: familyMember } = await supabase
        .from('family_members')
        .select('family_id, families(*)')
        .eq('user_id', user?.id)
        .single();

      if (familyMember?.families) {
        const family = familyMember.families as any;
        setFamilyId(family.id);
        setProfileData({
          familyName: family.family_name || "",
          email: family.email || "",
          phone: family.phone || "",
          location: family.address || "",
          address: family.address || "",
          city: family.city || "",
          postal_code: family.postal_code || "",
          emergencyContactName: family.emergency_contact_name || "",
          emergencyContactPhone: family.emergency_contact_phone || "",
          assistanceTypes: [],
          medicalConditions: [],
          description: family.notes || "",
          notes: family.notes || ""
        });
      }
    } catch (error) {
      console.error('Error loading family profile:', error);
      toast({
        variant: "destructive",
        title: "Errore",
        description: "Errore nel caricamento del profilo famiglia.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!familyId) return;
    
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('families')
        .update({
          family_name: profileData.familyName,
          email: profileData.email,
          phone: profileData.phone,
          address: profileData.address,
          city: profileData.city,
          postal_code: profileData.postal_code,
          emergency_contact_name: profileData.emergencyContactName,
          emergency_contact_phone: profileData.emergencyContactPhone,
          notes: profileData.notes,
        })
        .eq('id', familyId);

      if (error) throw error;

      toast({
        title: "Profilo aggiornato",
        description: "I dati della famiglia sono stati salvati con successo.",
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving family profile:', error);
      toast({
        variant: "destructive",
        title: "Errore",
        description: "Errore nel salvataggio del profilo.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">Caricamento profilo famiglia...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Profilo Famiglia</h1>
            <p className="text-muted-foreground">Gestisci le informazioni del tuo profilo e le richieste di assistenza</p>
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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Informazioni Profilo</TabsTrigger>
            <TabsTrigger value="requests">Richieste Assistenza</TabsTrigger>
            <TabsTrigger value="medical">Informazioni Mediche</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="h-5 w-5 text-familu-blue" />
                  <span>Informazioni Famiglia</span>
                </CardTitle>
                <CardDescription>
                  Le informazioni di base della tua famiglia
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="familyName">Nome Famiglia</Label>
                    {isEditing ? (
                      <Input
                        id="familyName"
                        value={profileData.familyName}
                        onChange={(e) => setProfileData({...profileData, familyName: e.target.value})}
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground">{profileData.familyName}</p>
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
                      <p className="text-sm text-muted-foreground flex items-center">
                        <Mail className="h-4 w-4 mr-2" />
                        {profileData.email}
                      </p>
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
                      <p className="text-sm text-muted-foreground flex items-center">
                        <Phone className="h-4 w-4 mr-2" />
                        {profileData.phone}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    {isEditing ? (
                      <AddressInput
                        label="Località"
                        value={profileData.location}
                        onChange={(address) => setProfileData({...profileData, location: address})}
                        placeholder="Inserisci l'indirizzo completo"
                        id="location"
                      />
                    ) : (
                      <>
                        <Label htmlFor="location">Località</Label>
                        <p className="text-sm text-muted-foreground flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          {profileData.location}
                        </p>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergencyContact">Contatto di Emergenza</Label>
                  {isEditing ? (
                    <Input
                      id="emergencyContact"
                      value={`${profileData.emergencyContactName} - ${profileData.emergencyContactPhone}`}
                      onChange={(e) => {
                        const parts = e.target.value.split(' - ');
                        setProfileData({
                          ...profileData, 
                          emergencyContactName: parts[0] || "",
                          emergencyContactPhone: parts[1] || ""
                        });
                      }}
                      placeholder="Nome - Numero di telefono"
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">{`${profileData.emergencyContactName} - ${profileData.emergencyContactPhone}`}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Tipi di Assistenza Richiesta</Label>
                  {isEditing ? (
                    <div className="flex flex-wrap gap-2">
                      {profileData.assistanceTypes.map((type, index) => (
                        <Badge key={index} variant="outline" className="flex items-center gap-1">
                          {type}
                          <X className="h-3 w-3 cursor-pointer" onClick={() => {
                            const newTypes = profileData.assistanceTypes.filter((_, i) => i !== index);
                            setProfileData({...profileData, assistanceTypes: newTypes});
                          }} />
                        </Badge>
                      ))}
                      <Button variant="ghost" size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                        Aggiungi
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {profileData.assistanceTypes.map((type, index) => (
                        <Badge key={index} variant="secondary">{type}</Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrizione</Label>
                  {isEditing ? (
                    <Textarea
                      id="description"
                      value={profileData.description}
                      onChange={(e) => setProfileData({...profileData, description: e.target.value})}
                      placeholder="Descrivi le tue esigenze di assistenza..."
                      rows={4}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">{profileData.description}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requests" className="mt-6">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Le Tue Richieste di Assistenza</h2>
                <Button variant="familu">
                  <Plus className="h-4 w-4 mr-2" />
                  Nuova Richiesta
                </Button>
              </div>

              {activeRequests.map((request) => (
                <Card key={request.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{request.title}</CardTitle>
                        <CardDescription>{request.description}</CardDescription>
                      </div>
                      <Badge variant={request.status === "Attiva" ? "default" : "secondary"}>
                        {request.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Tipo Assistenza</label>
                        <p className="text-sm">{request.assistanceType}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Urgenza</label>
                        <Badge variant="outline" className="text-xs">{request.urgency}</Badge>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Risposte</label>
                        <p className="text-sm font-medium text-familu-blue">{request.responses}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Creata</label>
                        <p className="text-sm">{request.createdAt}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="familu-outline" size="sm">
                        Visualizza Risposte
                      </Button>
                      <Button variant="ghost" size="sm">
                        Modifica
                      </Button>
                      <Button variant="ghost" size="sm">
                        <FileText className="h-4 w-4 mr-1" />
                        Condividi
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="medical" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Informazioni Mediche</CardTitle>
                <CardDescription>
                  Informazioni sanitarie importanti per gli operatori
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Condizioni Mediche</Label>
                  {isEditing ? (
                    <div className="flex flex-wrap gap-2">
                      {profileData.medicalConditions.map((condition, index) => (
                        <Badge key={index} variant="outline" className="flex items-center gap-1">
                          {condition}
                          <X className="h-3 w-3 cursor-pointer" onClick={() => {
                            const newConditions = profileData.medicalConditions.filter((_, i) => i !== index);
                            setProfileData({...profileData, medicalConditions: newConditions});
                          }} />
                        </Badge>
                      ))}
                      <Button variant="ghost" size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                        Aggiungi
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {profileData.medicalConditions.map((condition, index) => (
                        <Badge key={index} variant="secondary">{condition}</Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-familu-light-blue p-4 rounded-lg">
                  <h4 className="font-medium text-familu-blue mb-2">Nota sulla Privacy</h4>
                  <p className="text-sm text-muted-foreground">
                    Le informazioni mediche sono condivise solo con operatori verificati 
                    che hai contattato direttamente o che hanno risposto alle tue richieste.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FamilyProfile;