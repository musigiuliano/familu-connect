import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Video, 
  Download, 
  Search, 
  Calendar, 
  Clock, 
  User,
  Heart,
  Brain,
  Shield,
  Users,
  FileText,
  Play
} from "lucide-react";
import Navbar from "@/components/Navbar";

const Resources = () => {
  const blogPosts = [
    {
      id: 1,
      title: "Guida Completa all'Assistenza Domiciliare per Anziani",
      excerpt: "Tutto quello che devi sapere per scegliere il migliore servizio di assistenza domiciliare per i tuoi cari.",
      category: "Assistenza Anziani",
      readTime: "8 min",
      date: "15 Nov 2023",
      author: "Dr. Maria Rossi",
      image: "/placeholder-blog1.jpg"
    },
    {
      id: 2,
      title: "Come Riconoscere un Operatore Qualificato",
      excerpt: "I criteri essenziali per valutare le competenze e l'affidabilità di un operatore sanitario.",
      category: "Sicurezza",
      readTime: "6 min",
      date: "12 Nov 2023",
      author: "Giuseppe Bianchi",
      image: "/placeholder-blog2.jpg"
    },
    {
      id: 3,
      title: "Fisioterapia a Domicilio: Benefici e Considerazioni",
      excerpt: "Quando scegliere la fisioterapia domiciliare e come preparare l'ambiente domestico.",
      category: "Riabilitazione",
      readTime: "10 min",
      date: "8 Nov 2023",
      author: "Dr. Andrea Verdi",
      image: "/placeholder-blog3.jpg"
    },
    {
      id: 4,
      title: "Gestire lo Stress del Caregiving Familiare",
      excerpt: "Strategie pratiche per mantenere il benessere mentale quando ci si prende cura di un familiare.",
      category: "Supporto Familiare",
      readTime: "7 min",
      date: "5 Nov 2023",
      author: "Psicologa Lisa Conti",
      image: "/placeholder-blog4.jpg"
    }
  ];

  const videos = [
    {
      id: 1,
      title: "Come Scegliere l'Assistente Perfetto",
      description: "Una guida video completa per valutare e selezionare l'operatore più adatto alle tue esigenze.",
      duration: "15:32",
      category: "Tutorial",
      views: "2.1k",
      thumbnail: "/placeholder-video1.jpg"
    },
    {
      id: 2,
      title: "Esercizi di Fisioterapia per Anziani",
      description: "Routine di esercizi sicuri che possono essere eseguiti comodamente a casa.",
      duration: "22:45",
      category: "Fisioterapia",
      views: "5.3k",
      thumbnail: "/placeholder-video2.jpg"
    },
    {
      id: 3,
      title: "Comunicazione Efficace con Operatori Sanitari",
      description: "Tecniche per costruire una relazione di fiducia e comunicare le proprie esigenze.",
      duration: "12:18",
      category: "Comunicazione",
      views: "1.8k",
      thumbnail: "/placeholder-video3.jpg"
    },
    {
      id: 4,
      title: "Sicurezza in Casa per Persone con Disabilità",
      description: "Consigli pratici per rendere l'ambiente domestico sicuro e accessibile.",
      duration: "18:50",
      category: "Sicurezza",
      views: "3.2k",
      thumbnail: "/placeholder-video4.jpg"
    }
  ];

  const downloadableResources = [
    {
      id: 1,
      title: "Checklist per la Scelta dell'Operatore",
      description: "Lista completa di domande e criteri per valutare candidati operatori.",
      type: "PDF",
      size: "2.1 MB",
      downloads: "1.2k",
      icon: FileText
    },
    {
      id: 2,
      title: "Guida alle Emergenze Mediche",
      description: "Protocolli di primo soccorso e numeri di emergenza sempre a portata di mano.",
      type: "PDF",
      size: "1.8 MB",
      downloads: "2.8k",
      icon: Shield
    },
    {
      id: 3,
      title: "Piano di Assistenza Personalizzato",
      description: "Template modificabile per creare un piano di assistenza su misura.",
      type: "DOCX",
      size: "0.5 MB",
      downloads: "950",
      icon: FileText
    },
    {
      id: 4,
      title: "Registro Quotidiano delle Cure",
      description: "Modulo per tracciare medicazioni, terapie e progressi giornalieri.",
      type: "XLSX",
      size: "0.3 MB",
      downloads: "1.5k",
      icon: FileText
    }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Assistenza Anziani": return Heart;
      case "Sicurezza": return Shield;
      case "Riabilitazione": return Brain;
      case "Supporto Familiare": return Users;
      default: return BookOpen;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Assistenza Anziani": return "bg-familu-light-blue text-familu-blue";
      case "Sicurezza": return "bg-red-100 text-red-700";
      case "Riabilitazione": return "bg-familu-light-green text-familu-green";
      case "Supporto Familiare": return "bg-purple-100 text-purple-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Centro Risorse FamiLu
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Guide, tutorial e risorse per aiutarti a navigare nel mondo dell'assistenza domiciliare 
            con sicurezza e consapevolezza.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Cerca articoli, video o guide..."
              className="pl-10 h-12 text-lg"
            />
          </div>
        </div>

        <Tabs defaultValue="blog" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="blog" className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4" />
              <span>Blog & Articoli</span>
            </TabsTrigger>
            <TabsTrigger value="videos" className="flex items-center space-x-2">
              <Video className="h-4 w-4" />
              <span>Video Tutorial</span>
            </TabsTrigger>
            <TabsTrigger value="downloads" className="flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Risorse Scaricabili</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="blog" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {blogPosts.map((post) => {
                const CategoryIcon = getCategoryIcon(post.category);
                return (
                  <Card key={post.id} className="shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-familu)] transition-shadow cursor-pointer">
                    <div className="aspect-video bg-muted rounded-t-lg flex items-center justify-center">
                      <BookOpen className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge className={getCategoryColor(post.category)}>
                          <CategoryIcon className="h-3 w-3 mr-1" />
                          {post.category}
                        </Badge>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                      <CardTitle className="text-lg hover:text-primary transition-colors">
                        {post.title}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {post.excerpt}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <User className="h-3 w-3" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{post.date}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            <div className="text-center mt-12">
              <Button variant="familu-outline" size="lg">
                Carica Altri Articoli
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="videos" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {videos.map((video) => (
                <Card key={video.id} className="shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-familu)] transition-shadow cursor-pointer">
                  <div className="relative aspect-video bg-muted rounded-t-lg flex items-center justify-center group">
                    <div className="absolute inset-0 bg-black/50 rounded-t-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Play className="h-12 w-12 text-white" />
                    </div>
                    <Video className="h-12 w-12 text-muted-foreground" />
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs">
                      {video.duration}
                    </div>
                  </div>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">{video.category}</Badge>
                      <span className="text-xs text-muted-foreground">{video.views} visualizzazioni</span>
                    </div>
                    <CardTitle className="text-lg hover:text-primary transition-colors">
                      {video.title}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {video.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Button variant="familu-outline" size="lg">
                Vedi Altri Video
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="downloads" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {downloadableResources.map((resource) => {
                const IconComponent = resource.icon;
                return (
                  <Card key={resource.id} className="shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-familu)] transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="p-3 bg-familu-light-blue rounded-lg">
                          <IconComponent className="h-6 w-6 text-familu-blue" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg mb-2">{resource.title}</h3>
                          <p className="text-sm text-muted-foreground mb-3">{resource.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                              <span className="font-medium">{resource.type}</span>
                              <span>{resource.size}</span>
                              <span>{resource.downloads} download</span>
                            </div>
                            <Button variant="familu" size="sm">
                              <Download className="h-3 w-3 mr-2" />
                              Scarica
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            <div className="text-center mt-12">
              <Button variant="familu-outline" size="lg">
                Vedi Tutte le Risorse
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* Newsletter Signup */}
        <Card className="mt-16 bg-[var(--gradient-primary)] border-0 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Rimani Aggiornato</h2>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
              Iscriviti alla nostra newsletter per ricevere guide, consigli e aggiornamenti 
              sulle migliori pratiche nell'assistenza domiciliare.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input 
                placeholder="La tua email" 
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
              />
              <Button variant="secondary" className="bg-white text-primary hover:bg-white/90">
                Iscriviti
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Resources;