import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Building, 
  Users, 
  TrendingUp, 
  DollarSign,
  Calendar, 
  MessageCircle, 
  Settings,
  Bell,
  UserCheck,
  ClipboardList,
  BarChart3,
  FileText,
  Award,
  AlertTriangle,
  CheckCircle2,
  Clock
} from "lucide-react";
import Navbar from "@/components/Navbar";

const OrganizationDashboard = () => {
  const orgData = {
    name: "Centro Assistenza Roma Nord",
    type: "Cooperativa Sociale",
    activeOperators: 24,
    totalClients: 89,
    monthlyRevenue: 45680,
    clientSatisfaction: 94,
    operatorUtilization: 78,
    thisMonthHours: 1850,
    targetMonthlyHours: 2000,
    newRequestsToday: 5,
    pendingAssignments: 3,
    todayStats: {
      activeOperators: 18,
      scheduledSessions: 42,
      completedSessions: 28,
      cancelledSessions: 2
    },
    recentAlerts: [
      {
        id: 1,
        type: "urgent",
        message: "Operatore Maria B. assente - riassegnare clienti",
        time: "10 min fa"
      },
      {
        id: 2,
        type: "info",
        message: "Nuova richiesta famiglia - assistenza anziani",
        time: "30 min fa"
      }
    ],
    topOperators: [
      {
        name: "Maria Bianchi",
        rating: 4.9,
        clients: 8,
        hoursThisWeek: 35
      },
      {
        name: "Giovanni Rossi",
        rating: 4.8,
        clients: 6,
        hoursThisWeek: 32
      },
      {
        name: "Anna Verdi",
        rating: 4.7,
        clients: 7,
        hoursThisWeek: 38
      }
    ],
    monthlyMetrics: {
      newClients: 12,
      retainedClients: 94,
      avgSessionDuration: 3.2,
      operatorSatisfaction: 87
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
              Dashboard Organizzazione
            </h1>
            <div className="flex items-center space-x-4 text-muted-foreground">
              <span>{orgData.name}</span>
              <Badge variant="outline">{orgData.type}</Badge>
            </div>
          </div>
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <Button variant="familu-outline" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              Avvisi ({orgData.recentAlerts.length})
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-familu-blue" />
                <div>
                  <p className="text-2xl font-bold">{orgData.activeOperators}</p>
                  <p className="text-sm text-muted-foreground">Operatori Attivi</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Building className="h-5 w-5 text-familu-green" />
                <div>
                  <p className="text-2xl font-bold">{orgData.totalClients}</p>
                  <p className="text-sm text-muted-foreground">Clienti Totali</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">€{orgData.monthlyRevenue.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Ricavi Mensili</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-2xl font-bold">{orgData.clientSatisfaction}%</p>
                  <p className="text-sm text-muted-foreground">Soddisfazione</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts Section */}
        {orgData.recentAlerts.length > 0 && (
          <Card className="mb-8 border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-orange-800">
                <AlertTriangle className="h-5 w-5" />
                <span>Avvisi Recenti</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {orgData.recentAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-2 bg-white rounded">
                    <span className="text-sm">{alert.message}</span>
                    <span className="text-xs text-muted-foreground">{alert.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Panoramica</TabsTrigger>
            <TabsTrigger value="operators">Operatori</TabsTrigger>
            <TabsTrigger value="clients">Clienti</TabsTrigger>
            <TabsTrigger value="assignments">Assegnazioni</TabsTrigger>
            <TabsTrigger value="reports">Report</TabsTrigger>
            <TabsTrigger value="settings">Impostazioni</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Today's Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5" />
                    <span>Situazione Oggi</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-familu-light-blue rounded-lg">
                      <p className="text-2xl font-bold text-familu-blue">{orgData.todayStats.activeOperators}</p>
                      <p className="text-sm text-muted-foreground">Operatori in Servizio</p>
                    </div>
                    <div className="text-center p-4 bg-familu-light-green rounded-lg">
                      <p className="text-2xl font-bold text-familu-green">{orgData.todayStats.scheduledSessions}</p>
                      <p className="text-sm text-muted-foreground">Sessioni Programmate</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">{orgData.todayStats.completedSessions}</p>
                      <p className="text-sm text-muted-foreground">Completate</p>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <p className="text-2xl font-bold text-red-600">{orgData.todayStats.cancelledSessions}</p>
                      <p className="text-sm text-muted-foreground">Cancellate</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Top Operators */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="h-5 w-5" />
                    <span>Top Operatori</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {orgData.topOperators.map((operator, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-accent rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{operator.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{operator.name}</p>
                            <p className="text-xs text-muted-foreground">{operator.clients} clienti</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">⭐ {operator.rating}</p>
                          <p className="text-xs text-muted-foreground">{operator.hoursThisWeek}h</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Monthly Progress */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Progresso Mensile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Ore Erogate</span>
                      <span className="text-sm">{orgData.thisMonthHours}/{orgData.targetMonthlyHours}h</span>
                    </div>
                    <Progress value={(orgData.thisMonthHours / orgData.targetMonthlyHours) * 100} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Utilizzo Operatori</span>
                      <span className="text-sm">{orgData.operatorUtilization}%</span>
                    </div>
                    <Progress value={orgData.operatorUtilization} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="operators" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Gestione Operatori</CardTitle>
                <CardDescription>
                  Monitora e gestisci il tuo team di operatori
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <UserCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Team Management</h3>
                  <p className="text-muted-foreground">
                    Visualizza performance, gestisci turni e assegnazioni del personale
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="clients" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Clienti</CardTitle>
                <CardDescription>
                  Gestisci tutte le famiglie e organizzazioni clienti
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Gestione Clienti</h3>
                  <p className="text-muted-foreground">
                    Database completo con storico servizi, fatturazione e soddisfazione
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assignments" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Centro Assegnazioni</CardTitle>
                <CardDescription>
                  Gestisci l'assegnazione di operatori ai clienti
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <ClipboardList className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Sistema di Matching</h3>
                  <p className="text-muted-foreground">
                    Algoritmo intelligente per abbinare operatori e clienti basato su competenze e disponibilità
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Reportistica e Analytics</CardTitle>
                <CardDescription>
                  Analizza performance e genera report dettagliati
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Business Intelligence</h3>
                  <p className="text-muted-foreground">
                    Dashboard avanzate, KPI tracking e report personalizzabili per ottimizzare le operazioni
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Impostazioni Organizzazione</CardTitle>
                <CardDescription>
                  Configura i parametri operativi della tua organizzazione
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Nome Organizzazione</label>
                      <p className="text-sm text-muted-foreground">{orgData.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Tipo</label>
                      <p className="text-sm text-muted-foreground">{orgData.type}</p>
                    </div>
                  </div>
                  <div className="pt-4">
                    <Button variant="familu-outline">
                      Modifica Configurazione
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

export default OrganizationDashboard;