import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  User, 
  Calendar, 
  MessageCircle, 
  Star, 
  MapPin, 
  Phone,
  Mail,
  Settings,
  Bell,
  Clock,
  Users,
  Award,
  TrendingUp,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import Navbar from "@/components/Navbar";

const OperatorDashboard = () => {
  const operatorData = {
    name: "Maria Bianchi",
    specialization: "Assistenza Anziani",
    rating: 4.8,
    totalClients: 12,
    activeClients: 8,
    experience: "5 anni",
    phone: "+39 345 678 9012",
    email: "maria.bianchi@email.com",
    availability: "Disponibile",
    thisWeekHours: 32,
    targetHours: 40,
    certifications: ["OSS", "Primo Soccorso", "Alzheimer Care"],
    todayAppointments: [
      {
        id: 1,
        family: "Famiglia Rossi",
        time: "09:00 - 12:00",
        type: "Assistenza domiciliare",
        address: "Via Roma 123, Roma",
        status: "Confermato"
      },
      {
        id: 2,
        family: "Famiglia Verdi",
        time: "14:30 - 17:30",
        type: "Compagnia e sorveglianza",
        address: "Via Milano 45, Roma",
        status: "Confermato"
      }
    ],
    recentMessages: [
      {
        id: 1,
        from: "Famiglia Rossi",
        message: "Confermiamo l'appuntamento di domani...",
        time: "15 min fa",
        unread: true
      },
      {
        id: 2,
        from: "Dr. Coordinatore",
        message: "Nuova assegnazione disponibile...",
        time: "2 ore fa",
        unread: false
      }
    ],
    weeklyStats: {
      completedSessions: 18,
      clientSatisfaction: 98,
      punctuality: 100,
      communicationRating: 4.9
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Dashboard Operatore - {operatorData.name}
            </h1>
            <div className="flex items-center space-x-4 text-muted-foreground">
              <span>{operatorData.specialization}</span>
              <Badge variant={operatorData.availability === "Disponibile" ? "default" : "secondary"}>
                {operatorData.availability}
              </Badge>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>{operatorData.rating}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <Button variant="familu-outline" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              Notifiche
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-familu-blue" />
                <div>
                  <p className="text-2xl font-bold">{operatorData.activeClients}</p>
                  <p className="text-sm text-muted-foreground">Clienti Attivi</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-familu-green" />
                <div>
                  <p className="text-2xl font-bold">{operatorData.thisWeekHours}h</p>
                  <p className="text-sm text-muted-foreground">Ore Settimana</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold">{operatorData.rating}/5</p>
                  <p className="text-sm text-muted-foreground">Rating Medio</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{operatorData.weeklyStats.completedSessions}</p>
                  <p className="text-sm text-muted-foreground">Sessioni Completate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="today" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="today">Oggi</TabsTrigger>
            <TabsTrigger value="schedule">Calendario</TabsTrigger>
            <TabsTrigger value="clients">Clienti</TabsTrigger>
            <TabsTrigger value="messages">Messaggi</TabsTrigger>
            <TabsTrigger value="profile">Profilo</TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Today's Appointments */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span>Appuntamenti di Oggi</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {operatorData.todayAppointments.map((appointment) => (
                      <div key={appointment.id} className="p-4 border border-border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{appointment.family}</h4>
                          <Badge variant="default">{appointment.status}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{appointment.type}</p>
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{appointment.time}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-4 w-4" />
                            <span className="truncate">{appointment.address}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Weekly Progress */}
              <Card>
                <CardHeader>
                  <CardTitle>Progresso Settimanale</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Ore Lavorate</span>
                        <span className="text-sm">{operatorData.thisWeekHours}/{operatorData.targetHours}h</span>
                      </div>
                      <Progress value={(operatorData.thisWeekHours / operatorData.targetHours) * 100} />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-familu-blue">{operatorData.weeklyStats.clientSatisfaction}%</p>
                        <p className="text-xs text-muted-foreground">Soddisfazione</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-familu-green">{operatorData.weeklyStats.punctuality}%</p>
                        <p className="text-xs text-muted-foreground">Puntualità</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Gestione Calendario</CardTitle>
                <CardDescription>
                  Visualizza e gestisci i tuoi appuntamenti
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Calendario Interattivo</h3>
                  <p className="text-muted-foreground">
                    Qui sarà implementato il calendario completo con tutti gli appuntamenti
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="clients" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>I Tuoi Clienti</CardTitle>
                <CardDescription>
                  Gestisci le famiglie a te assegnate
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Lista Clienti</h3>
                  <p className="text-muted-foreground">
                    Visualizza informazioni dettagliate sui tuoi clienti e le loro necessità
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Centro Messaggi</CardTitle>
                <CardDescription>
                  Comunica con famiglie e coordinatori
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {operatorData.recentMessages.map((message) => (
                    <div key={message.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-accent transition-colors">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="" />
                        <AvatarFallback>{message.from.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">{message.from}</p>
                          <span className="text-xs text-muted-foreground">{message.time}</span>
                        </div>
                        <p className="text-sm mt-1 truncate">{message.message}</p>
                      </div>
                      {message.unread && (
                        <div className="w-2 h-2 bg-familu-blue rounded-full"></div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Profilo Operatore</CardTitle>
                <CardDescription>
                  Gestisci le tue informazioni e qualifiche
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Nome Completo</label>
                      <p className="text-sm text-muted-foreground">{operatorData.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Specializzazione</label>
                      <p className="text-sm text-muted-foreground">{operatorData.specialization}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <p className="text-sm text-muted-foreground">{operatorData.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Telefono</label>
                      <p className="text-sm text-muted-foreground">{operatorData.phone}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Esperienza</label>
                      <p className="text-sm text-muted-foreground">{operatorData.experience}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Stato</label>
                      <p className="text-sm text-muted-foreground">{operatorData.availability}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Certificazioni</label>
                    <div className="flex flex-wrap gap-2">
                      {operatorData.certifications.map((cert, index) => (
                        <Badge key={index} variant="secondary">{cert}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button variant="familu-outline">
                      Modifica Profilo
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default OperatorDashboard;