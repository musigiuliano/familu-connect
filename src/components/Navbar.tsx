import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Heart, Search, User, Users, Building } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-border shadow-[var(--shadow-soft)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/33195e00-6787-46f5-ad3c-c9e98b9b6a0e.png" 
              alt="FamiLu - Home, Care, Community" 
              className="h-8 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/search" className="flex items-center space-x-1 text-foreground hover:text-primary transition-colors">
              <Search className="h-4 w-4" />
              <span>Trova Assistenza</span>
            </Link>
            <Link to="/pricing" className="text-foreground hover:text-primary transition-colors">
              Prezzi
            </Link>
            <Link to="/resources" className="text-foreground hover:text-primary transition-colors">
              Risorse
            </Link>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Button 
              variant="familu-outline" 
              size="sm"
              onClick={() => navigate("/login")}
            >
              Accedi
            </Button>
            <Button 
              variant="familu" 
              size="sm"
              onClick={() => navigate("/register")}
            >
              Registrati
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleMenu}
              aria-label="Menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-border">
              <Link 
                to="/search" 
                className="flex items-center space-x-2 block px-3 py-2 text-foreground hover:text-primary hover:bg-accent rounded-md transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Search className="h-4 w-4" />
                <span>Trova Assistenza</span>
              </Link>
              <Link 
                to="/pricing" 
                className="block px-3 py-2 text-foreground hover:text-primary hover:bg-accent rounded-md transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Prezzi
              </Link>
              <Link 
                to="/resources" 
                className="block px-3 py-2 text-foreground hover:text-primary hover:bg-accent rounded-md transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Risorse
              </Link>
              <div className="flex flex-col space-y-2 px-3 pt-4">
                <Button 
                  variant="familu-outline" 
                  size="sm"
                  onClick={() => {
                    navigate("/login");
                    setIsOpen(false);
                  }}
                >
                  Accedi
                </Button>
                <Button 
                  variant="familu" 
                  size="sm"
                  onClick={() => {
                    navigate("/register");
                    setIsOpen(false);
                  }}
                >
                  Registrati
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;