import { useState } from "react";
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

const OrganizationProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "AssistCare Roma",
    email: "info@assistcare-roma.it",
    phone: "+39 06 123 4567",
    website: "www.assistcare-roma.it",
    address: "Via dei Servizi 123, 00100 Roma",
    description: "AssistCare Roma è un'organizzazione leader nell'assistenza domiciliare con oltre 10 anni di esperienza. Offriamo servizi personalizzati di alta qualità per famiglie e anziani.",
    foundedYear: "2013",
    teamSize: "25",
    licenseNumber: "ASL-RM-001234",
    services: [
      "Assistenza Domiciliare 24h",
      "Fisioterapia a Domicilio", 
      "Supporto Psicologico",
      "Assistenza Medica Specialistica",
      "Riabilitazione Post-Operatoria",
      "Supporto Familiare"
    ],
    serviceAreas: ["Roma Centro", "Roma Nord", "Roma Sud", "Castelli Romani"],
    certifications: [
      { name: "Certificazione ISO 9001", year: "2022" },
      { name: "Accreditamento ASL Lazio", year: "2023" },
      { name: "Certificazione Qualità Servizi", year: "2023" }
    ]
  });

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

  const handleSave = () => {
    setIsEditing(false);
    // Here you would save to backend
  };

  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

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
                    <span className="font-medium">{averageRating.toFixed(1)}</span>
                    <span className="text-muted-foreground">({reviews.length} recensioni)</span>
                  </div>
                  
                  <Badge variant="secondary" className="mb-4">
                    <Award className="h-3 w-3 mr-1" />
                    Certificata
                  </Badge>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-center space-x-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{profileData.teamSize} membri del team</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span>Fondata nel {profileData.foundedYear}</span>
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

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="foundedYear">Anno di Fondazione</Label>
                      {isEditing ? (
                        <Input
                          id="foundedYear"
                          value={profileData.foundedYear}
                          onChange={(e) => setProfileData({...profileData, foundedYear: e.target.value})}
                        />
                      ) : (
                        <p className="text-sm text-muted-foreground">{profileData.foundedYear}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="teamSize">Dimensione Team</Label>
                      {isEditing ? (
                        <Input
                          id="teamSize"
                          value={profileData.teamSize}
                          onChange={(e) => setProfileData({...profileData, teamSize: e.target.value})}
                        />
                      ) : (
                        <p className="text-sm text-muted-foreground">{profileData.teamSize} professionisti</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="licenseNumber">Numero Licenza</Label>
                      {isEditing ? (
                        <Input
                          id="licenseNumber"
                          value={profileData.licenseNumber}
                          onChange={(e) => setProfileData({...profileData, licenseNumber: e.target.value})}
                        />
                      ) : (
                        <p className="text-sm text-muted-foreground">{profileData.licenseNumber}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Certifications */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-familu-green" />
                  <span>Certificazioni</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {profileData.certifications.map((cert, index) => (
                    <div key={index} className="p-4 border border-border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">{cert.name}</h4>
                          <p className="text-sm text-muted-foreground">Anno: {cert.year}</p>
                        </div>
                        <CheckCircle className="h-5 w-5 text-familu-green" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Servizi Offerti</CardTitle>
                <CardDescription>Gestisci l'elenco dei servizi che la tua organizzazione offre</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {profileData.services.map((service, index) => (
                      <div key={index} className="p-4 border border-border rounded-lg flex justify-between items-center">
                        <span className="font-medium">{service}</span>
                        {isEditing && (
                          <X 
                            className="h-4 w-4 cursor-pointer text-muted-foreground hover:text-destructive" 
                            onClick={() => {
                              const newServices = profileData.services.filter((_, i) => i !== index);
                              setProfileData({...profileData, services: newServices});
                            }} 
                          />
                        )}
                      </div>
                    ))}
                    {isEditing && (
                      <Button variant="familu-outline" className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Aggiungi Servizio
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    {profileData.serviceAreas.map((area, index) => (
                      <div key={index} className="p-3 border border-border rounded-lg flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-familu-blue" />
                          <span className="font-medium">{area}</span>
                        </div>
                        {isEditing && (
                          <X 
                            className="h-4 w-4 cursor-pointer text-muted-foreground hover:text-destructive" 
                            onClick={() => {
                              const newAreas = profileData.serviceAreas.filter((_, i) => i !== index);
                              setProfileData({...profileData, serviceAreas: newAreas});
                            }} 
                          />
                        )}
                      </div>
                    ))}
                    {isEditing && (
                      <Button variant="familu-outline">
                        <Plus className="h-4 w-4 mr-2" />
                        Aggiungi Area
                      </Button>
                    )}
                  </div>
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

export default OrganizationProfile;