import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Edit, 
  Plus, 
  X, 
  Star, 
  Award, 
  FileText, 
  Camera,
  Calendar as CalendarIcon,
  Clock
} from "lucide-react";
import Navbar from "@/components/Navbar";
import AddressInput from "@/components/AddressInput";
import SpecializationSelector from "@/components/SpecializationSelector";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const OperatorProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [operatorId, setOperatorId] = useState<string | null>(null);
  const [profileData, setProfileData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    bio: "",
    experience_years: 0,
    hourly_rate: 0,
    license_number: "",
    specializations: [] as any[],
    availability: {
      monday: { available: true, hours: "09:00-18:00" },
      tuesday: { available: true, hours: "09:00-18:00" },
      wednesday: { available: true, hours: "09:00-17:00" },
      thursday: { available: true, hours: "09:00-18:00" },
      friday: { available: true, hours: "09:00-16:00" },
      saturday: { available: false, hours: "" },
      sunday: { available: false, hours: "" }
    }
  });

  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (user) {
      loadOperatorProfile();
    }
  }, [user]);

  const loadOperatorProfile = async () => {
    try {
      setLoading(true);
      
      // Load operator profile
      const { data: operatorData, error: operatorError } = await supabase
        .from('operators')
        .select(`
          *,
          operator_specializations(
            id,
            experience_years,
            certification_level,
            notes,
            specializations(*)
          )
        `)
        .eq('user_id', user?.id)
        .maybeSingle();

      if (operatorError && operatorError.code !== 'PGRST116') {
        throw operatorError;
      }

      if (operatorData) {
        setOperatorId(operatorData.id);
        
        // Load user profile for additional info
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user?.id)
          .maybeSingle();

        const specializations = operatorData.operator_specializations?.map((os: any) => ({
          id: os.specializations.id,
          name: os.specializations.name,
          description: os.specializations.description,
          category: os.specializations.category,
          experience_years: os.experience_years,
          certification_level: os.certification_level,
          notes: os.notes
        })) || [];

        setProfileData({
          first_name: userProfile?.first_name || "",
          last_name: userProfile?.last_name || "",
          email: user?.email || "",
          phone: "",
          address: "",
          bio: "",
          experience_years: 0,
          hourly_rate: 0,
          license_number: operatorData.license_number || "",
          specializations,
          availability: {
            monday: { available: true, hours: "09:00-18:00" },
            tuesday: { available: true, hours: "09:00-18:00" },
            wednesday: { available: true, hours: "09:00-17:00" },
            thursday: { available: true, hours: "09:00-18:00" },
            friday: { available: true, hours: "09:00-16:00" },
            saturday: { available: false, hours: "" },
            sunday: { available: false, hours: "" }
          }
        });
        setProfile(userProfile);
      }
    } catch (error) {
      console.error('Error loading operator profile:', error);
      toast({
        variant: "destructive",
        title: "Errore",
        description: "Errore nel caricamento del profilo operatore.",
      });
    } finally {
      setLoading(false);
    }
  };

  const [reviews] = useState([
    {
      id: 1,
      familyName: "Famiglia Rossi",
      rating: 5,
      comment: "Maria è stata fantastica con mia nonna. Professionale, gentile e molto competente.",
      date: "2 settimane fa"
    },
    {
      id: 2,
      familyName: "Famiglia Verdi",
      rating: 5,
      comment: "Eccellente fisioterapista. Ha aiutato molto mio padre nel recupero post-operatorio.",
      date: "1 mese fa"
    }
  ]);

  const handleSave = async () => {
    if (!operatorId && !user) return;
    
    try {
      setLoading(true);
      
      // Update or create operator profile
      if (operatorId) {
        const { error } = await supabase
          .from('operators')
          .update({
            license_number: profileData.license_number,
          })
          .eq('id', operatorId);
        if (error) throw error;
      } else {
        // Create new operator profile
        const { data: newOperator, error } = await supabase
          .from('operators')
          .insert({
            user_id: user?.id,
            license_number: profileData.license_number,
          })
          .select()
          .single();
        
        if (error) throw error;
        setOperatorId(newOperator.id);
      }

      // Update user profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: profileData.first_name,
          last_name: profileData.last_name,
        })
        .eq('user_id', user?.id);

      if (profileError) throw profileError;

      toast({
        title: "Profilo aggiornato",
        description: "I dati sono stati salvati con successo.",
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving operator profile:', error);
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
    if (!operatorId) return;
    
    try {
      // Delete existing specializations
      await supabase
        .from('operator_specializations')
        .delete()
        .eq('operator_id', operatorId);

      // Insert new specializations
      if (specializations.length > 0) {
        const specializationsToInsert = specializations.map(spec => ({
          operator_id: operatorId,
          specialization_id: spec.id,
          experience_years: spec.experience_years,
          certification_level: spec.certification_level,
          notes: spec.notes
        }));

        const { error } = await supabase
          .from('operator_specializations')
          .insert(specializationsToInsert);

        if (error) throw error;
      }

      setProfileData({ ...profileData, specializations });
      
      toast({
        title: "Specializzazioni aggiornate",
        description: "Le tue specializzazioni sono state salvate.",
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">Caricamento profilo operatore...</div>
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
            <h1 className="text-3xl font-bold text-foreground mb-2">Profilo Operatore</h1>
            <p className="text-muted-foreground">Gestisci il tuo profilo professionale e la disponibilità</p>
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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profilo</TabsTrigger>
            <TabsTrigger value="skills">Competenze</TabsTrigger>
            <TabsTrigger value="availability">Disponibilità</TabsTrigger>
            <TabsTrigger value="reviews">Recensioni</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Picture & Basic Info */}
              <Card className="lg:col-span-1">
                <CardContent className="p-6 text-center">
                  <div className="relative mb-4">
                    <Avatar className="h-32 w-32 mx-auto">
                      <AvatarImage src="/placeholder-avatar.jpg" />
                      <AvatarFallback className="text-2xl">
                        {(profileData.first_name + ' ' + profileData.last_name).split(' ').map(n => n[0]).join('')}
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
                  
                  <h3 className="text-xl font-bold mb-2">{profileData.first_name} {profileData.last_name}</h3>
                   <div className="flex items-center justify-center space-x-1 mb-2">
                     <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                     <span className="font-medium">4.8</span>
                     <span className="text-muted-foreground">(12 recensioni)</span>
                   </div>
                  
                  <Badge variant="secondary" className="mb-4">
                    <Award className="h-3 w-3 mr-1" />
                    Verificato
                  </Badge>
                  
                   <div className="space-y-2 text-sm">
                     <div className="flex items-center justify-center space-x-2">
                       <MapPin className="h-4 w-4 text-muted-foreground" />
                       <span>{profileData.address || "Indirizzo non specificato"}</span>
                     </div>
                     <div className="flex items-center justify-center space-x-2">
                       <Clock className="h-4 w-4 text-muted-foreground" />
                       <span>{profileData.experience_years} anni di esperienza</span>
                     </div>
                   </div>
                </CardContent>
              </Card>

              {/* Detailed Information */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Informazioni Professionali</CardTitle>
                </CardHeader>
                 <CardContent className="space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="space-y-2">
                       <Label htmlFor="first_name">Nome</Label>
                       {isEditing ? (
                         <Input
                           id="first_name"
                           value={profileData.first_name}
                           onChange={(e) => setProfileData({...profileData, first_name: e.target.value})}
                         />
                       ) : (
                         <p className="text-sm text-muted-foreground">{profileData.first_name}</p>
                       )}
                     </div>

                     <div className="space-y-2">
                       <Label htmlFor="last_name">Cognome</Label>
                       {isEditing ? (
                         <Input
                           id="last_name"
                           value={profileData.last_name}
                           onChange={(e) => setProfileData({...profileData, last_name: e.target.value})}
                         />
                       ) : (
                         <p className="text-sm text-muted-foreground">{profileData.last_name}</p>
                       )}
                     </div>

                     <div className="space-y-2">
                       <Label htmlFor="email">Email</Label>
                       <p className="text-sm text-muted-foreground">{profileData.email}</p>
                     </div>

                     <div className="space-y-2">
                       <Label htmlFor="license_number">Numero Licenza</Label>
                       {isEditing ? (
                         <Input
                           id="license_number"
                           value={profileData.license_number}
                           onChange={(e) => setProfileData({...profileData, license_number: e.target.value})}
                         />
                       ) : (
                         <p className="text-sm text-muted-foreground">{profileData.license_number}</p>
                       )}
                     </div>
                   </div>
                 </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="skills" className="mt-6">
            <SpecializationSelector
              selectedSpecializations={profileData.specializations}
              onSpecializationsChange={handleSpecializationsChange}
              type="operator"
              readOnly={!isEditing}
            />
          </TabsContent>

          <TabsContent value="availability" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Gestione Disponibilità</CardTitle>
                <CardDescription>Imposta i tuoi orari di lavoro settimanali</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(profileData.availability).map(([day, schedule]) => (
                    <div key={day} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <span className="font-medium capitalize w-20">
                          {day === 'monday' ? 'Lunedì' :
                           day === 'tuesday' ? 'Martedì' :
                           day === 'wednesday' ? 'Mercoledì' :
                           day === 'thursday' ? 'Giovedì' :
                           day === 'friday' ? 'Venerdì' :
                           day === 'saturday' ? 'Sabato' : 'Domenica'}
                        </span>
                        {isEditing ? (
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={schedule.available}
                              onChange={(e) => {
                                const newAvailability = {
                                  ...profileData.availability,
                                  [day]: { ...schedule, available: e.target.checked }
                                };
                                setProfileData({...profileData, availability: newAvailability});
                              }}
                              className="rounded"
                            />
                            {schedule.available && (
                              <Input
                                value={schedule.hours}
                                onChange={(e) => {
                                  const newAvailability = {
                                    ...profileData.availability,
                                    [day]: { ...schedule, hours: e.target.value }
                                  };
                                  setProfileData({...profileData, availability: newAvailability});
                                }}
                                placeholder="es. 09:00-18:00"
                                className="w-32"
                              />
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">
                            {schedule.available ? schedule.hours : 'Non disponibile'}
                          </span>
                        )}
                      </div>
                      <Badge variant={schedule.available ? "secondary" : "outline"}>
                        {schedule.available ? 'Disponibile' : 'Non disponibile'}
                      </Badge>
                    </div>
                  ))}
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
                  Valutazione media: 4.8/5 da {reviews.length} recensioni
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

export default OperatorProfile;