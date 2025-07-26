import { useState } from "react";
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

const OperatorProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "Maria Bianchi",
    email: "maria.bianchi@email.com",
    phone: "+39 123 456 7890",
    location: "Roma, Italia",
    bio: "Fisioterapista specializzata con oltre 5 anni di esperienza nell'assistenza domiciliare. Appassionata di aiutare le persone a migliorare la loro qualità di vita attraverso trattamenti personalizzati.",
    experience: "5+ anni",
    hourlyRate: "25",
    skills: ["Fisioterapia", "Assistenza Anziani", "Riabilitazione Motoria", "Terapia del Dolore"],
    certifications: [
      { name: "Laurea in Fisioterapia", institution: "Università La Sapienza", year: "2018" },
      { name: "Certificazione Assistenza Domiciliare", institution: "ASL Roma 1", year: "2020" }
    ],
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

  const handleSave = () => {
    setIsEditing(false);
    // Here you would save to backend
  };

  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

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
                        {profileData.name.split(' ').map(n => n[0]).join('')}
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
                    <span className="font-medium">{averageRating.toFixed(1)}</span>
                    <span className="text-muted-foreground">({reviews.length} recensioni)</span>
                  </div>
                  
                  <Badge variant="secondary" className="mb-4">
                    <Award className="h-3 w-3 mr-1" />
                    Verificato
                  </Badge>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{profileData.location}</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{profileData.experience} di esperienza</span>
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
                      <Label htmlFor="name">Nome e Cognome</Label>
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
                          <p className="text-sm text-muted-foreground">{profileData.location}</p>
                        </>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="hourlyRate">Tariffa Oraria (€)</Label>
                      {isEditing ? (
                        <Input
                          id="hourlyRate"
                          type="number"
                          value={profileData.hourlyRate}
                          onChange={(e) => setProfileData({...profileData, hourlyRate: e.target.value})}
                        />
                      ) : (
                        <p className="text-sm text-muted-foreground">€{profileData.hourlyRate}/ora</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Biografia Professionale</Label>
                    {isEditing ? (
                      <Textarea
                        id="bio"
                        value={profileData.bio}
                        onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                        rows={4}
                        placeholder="Descrivi la tua esperienza e approccio professionale..."
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground">{profileData.bio}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="skills" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Skills */}
              <Card>
                <CardHeader>
                  <CardTitle>Competenze</CardTitle>
                  <CardDescription>Le tue specializzazioni professionali</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {profileData.skills.map((skill, index) => (
                        <Badge key={index} variant="outline" className="flex items-center gap-1">
                          {skill}
                          {isEditing && (
                            <X className="h-3 w-3 cursor-pointer" onClick={() => {
                              const newSkills = profileData.skills.filter((_, i) => i !== index);
                              setProfileData({...profileData, skills: newSkills});
                            }} />
                          )}
                        </Badge>
                      ))}
                      {isEditing && (
                        <Button variant="ghost" size="sm">
                          <Plus className="h-4 w-4 mr-1" />
                          Aggiungi
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Certifications */}
              <Card>
                <CardHeader>
                  <CardTitle>Certificazioni</CardTitle>
                  <CardDescription>Titoli e qualifiche professionali</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {profileData.certifications.map((cert, index) => (
                      <div key={index} className="p-3 border border-border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{cert.name}</h4>
                            <p className="text-sm text-muted-foreground">{cert.institution}</p>
                            <p className="text-xs text-muted-foreground">Anno: {cert.year}</p>
                          </div>
                          <FileText className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    ))}
                    {isEditing && (
                      <Button variant="familu-outline" size="sm" className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Aggiungi Certificazione
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
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
                  Valutazione media: {averageRating.toFixed(1)}/5 da {reviews.length} recensioni
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