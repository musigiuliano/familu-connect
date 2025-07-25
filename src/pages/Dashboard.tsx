import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Heart, 
  User, 
  Building, 
  MessageCircle, 
  Calendar, 
  Star, 
  MapPin, 
  Phone,
  Mail,
  Settings,
  Search,
  Bell
} from "lucide-react";
import Navbar from "@/components/Navbar";

const Dashboard = () => {
  const [userType] = useState("family"); // This would come from auth context

  const familyData = {
    name: "Famiglia Rossi",
    location: "Roma, Italia",
    phone: "+39 123 456 7890",
    email: "famiglia.rossi@email.com",
    subscriptionTier: "Network",
    assistanceRequests: [
      {
        id: 1,
        title: "Assistenza per anziana - Urgente",
        description: "Cerchiamo assistenza domiciliare per nonna di 85 anni",
        status: "Attiva",
        responses: 5,
        createdAt: "2 giorni fa"
      }
    ],
    recentMessages: [
      {
        id: 1,
        from: "Maria Bianchi",
        role: "Operatrice",
        message: "Sono disponibile per l'assistenza richiesta...",
        time: "10 min fa",
        unread: true
      }
    ],
    upcomingAppointments: [
      {
        id: 1,
        with: "Dr. Marco Verdi",
        role: "Fisioterapista",
        date: "Domani",
        time: "14:00",
        type: "Consulto iniziale"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Benvenuto, {familyData.name}
            </h1>
            <p className="text-muted-foreground">
              Piano attuale: <Badge variant="secondary">{familyData.subscriptionTier}</Badge>
            </p>
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

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-familu)] transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-familu-light-blue rounded-lg">
                  <Search className="h-6 w-6 text-familu-blue" />
                </div>
                <div>
                  <h3 className="font-semibold">Trova Assistenza</h3>
                  <p className="text-sm text-muted-foreground">Cerca operatori nella tua zona</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-familu)] transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-familu-light-green rounded-lg">
                  <MessageCircle className="h-6 w-6 text-familu-green" />
                </div>
                <div>
                  <h3 className="font-semibold">Messaggi</h3>
                  <p className="text-sm text-muted-foreground">1 nuovo messaggio</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-familu)] transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-accent rounded-lg">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Appuntamenti</h3>
                  <p className="text-sm text-muted-foreground">1 appuntamento domani</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Panoramica</TabsTrigger>
            <TabsTrigger value="requests">Richieste</TabsTrigger>
            <TabsTrigger value="messages">Messaggi</TabsTrigger>
            <TabsTrigger value="profile">Profilo</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Messages */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageCircle className="h-5 w-5" />
                    <span>Messaggi Recenti</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {familyData.recentMessages.map((message) => (
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
                          <p className="text-sm text-muted-foreground">{message.role}</p>
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

              {/* Upcoming Appointments */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span>Prossimi Appuntamenti</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {familyData.upcomingAppointments.map((appointment) => (
                      <div key={appointment.id} className="p-4 border border-border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{appointment.with}</h4>
                            <p className="text-sm text-muted-foreground">{appointment.role}</p>
                            <p className="text-sm mt-1">{appointment.type}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{appointment.date}</p>
                            <p className="text-sm text-muted-foreground">{appointment.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="requests" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Le Tue Richieste di Assistenza</CardTitle>
                <CardDescription>
                  Gestisci le tue richieste attive e visualizza le risposte
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {familyData.assistanceRequests.map((request) => (
                    <div key={request.id} className="p-4 border border-border rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-medium">{request.title}</h4>
                        <Badge variant={request.status === "Attiva" ? "default" : "secondary"}>
                          {request.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{request.description}</p>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Creata {request.createdAt}</span>
                        <span className="text-familu-blue font-medium">{request.responses} risposte</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <Button variant="familu" className="w-full sm:w-auto">
                    Crea Nuova Richiesta
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Centro Messaggi</CardTitle>
                <CardDescription>
                  Comunica con operatori e organizzazioni
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Centro Messaggi</h3>
                  <p className="text-muted-foreground">
                    Le tue conversazioni appariranno qui quando inizierai a chattare con operatori
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Profilo Famiglia</CardTitle>
                <CardDescription>
                  Gestisci le informazioni del tuo profilo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Nome Famiglia</label>
                      <p className="text-sm text-muted-foreground">{familyData.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <p className="text-sm text-muted-foreground">{familyData.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Telefono</label>
                      <p className="text-sm text-muted-foreground">{familyData.phone}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Località</label>
                      <p className="text-sm text-muted-foreground">{familyData.location}</p>
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

export default Dashboard;