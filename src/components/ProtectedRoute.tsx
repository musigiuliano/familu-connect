import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

// 🚨 MODALITÀ SVILUPPO - Disabilita autenticazione per la progettazione
// Impostare a false quando il sito va in produzione
const DEVELOPMENT_MODE = true;

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Durante lo sviluppo, bypassa l'autenticazione
    if (DEVELOPMENT_MODE) {
      return;
    }
    
    // In produzione, richiedi autenticazione
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  // Durante lo sviluppo, mostra sempre il contenuto
  if (DEVELOPMENT_MODE) {
    return <>{children}</>;
  }

  // In produzione, gestisci loading e autenticazione
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Caricamento...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;