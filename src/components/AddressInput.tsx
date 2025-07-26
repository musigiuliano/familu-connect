import { useState, useRef, useCallback, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { MapPin, Navigation } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// Extend Window interface for Google Maps
declare global {
  interface Window {
    google?: {
      maps: {
        places: {
          Autocomplete: any;
        };
      };
    };
  }
}

interface AddressInputProps {
  label: string;
  value: string;
  onChange: (address: string, coordinates?: { lat: number; lng: number }) => void;
  placeholder?: string;
  id?: string;
  disabled?: boolean;
}

const AddressInput = ({ label, value, onChange, placeholder, id, disabled }: AddressInputProps) => {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const autocompleteRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadGoogleMapsAPI = async () => {
      try {
        // Get Google Maps API key from Supabase edge function
        const { data } = await supabase.functions.invoke('get-google-maps-key');
        const apiKey = data?.key;

        if (!apiKey) {
          console.error('Google Maps API key not found');
          return;
        }

        // Check if Google Maps API is already loaded
        if (window.google?.maps) {
          initializeAutocomplete(apiKey);
          return;
        }

        // Load Google Maps API script
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.onload = () => initializeAutocomplete(apiKey);
        document.head.appendChild(script);
      } catch (error) {
        console.error('Error loading Google Maps API:', error);
      }
    };

    loadGoogleMapsAPI();
  }, []);

  const initializeAutocomplete = (apiKey: string) => {
    if (!inputRef.current || !window.google?.maps) return;

    autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ['address'],
      componentRestrictions: { country: 'IT' }
    });

    autocompleteRef.current.addListener('place_changed', () => {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry) {
        onChange(place.formatted_address, {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        });
      }
    });
  };

  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert('La geolocalizzazione non è supportata dal tuo browser');
      return;
    }

    setIsLoading(true);
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { data } = await supabase.functions.invoke('get-google-maps-key');
          const apiKey = data?.key;

          if (!apiKey) {
            throw new Error('Google Maps API key not found');
          }

          // Reverse geocoding to get address from coordinates
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&key=${apiKey}`
          );
          
          const data_geo = await response.json();
          
          if (data_geo.results && data_geo.results.length > 0) {
            const address = data_geo.results[0].formatted_address;
            onChange(address, {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
          }
        } catch (error) {
          console.error('Error getting address:', error);
          alert('Errore nel recupero dell\'indirizzo');
        } finally {
          setIsLoading(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        alert('Errore nel recupero della posizione');
        setIsLoading(false);
      }
    );
  }, [onChange]);

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex space-x-2">
        <Input
          ref={inputRef}
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1"
        />
        <Button
          type="button"
          variant="familu-outline"
          size="sm"
          onClick={getCurrentLocation}
          disabled={disabled || isLoading}
          className="flex-shrink-0"
        >
          {isLoading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          ) : (
            <Navigation className="h-4 w-4" />
          )}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        <MapPin className="h-3 w-3 inline mr-1" />
        Scrivi l'indirizzo o usa il GPS per la posizione attuale
      </p>
    </div>
  );
};

export default AddressInput;