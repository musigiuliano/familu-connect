import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { X, Plus } from "lucide-react";

interface Specialization {
  id: string;
  name: string;
  description?: string;
  category?: string;
}

interface SelectedSpecialization extends Specialization {
  experience_years?: number;
  certification_level?: string;
  notes?: string;
}

interface SpecializationSelectorProps {
  selectedSpecializations: SelectedSpecialization[];
  onSpecializationsChange: (specializations: SelectedSpecialization[]) => void;
  type: "operator" | "organization";
  readOnly?: boolean;
}

const SpecializationSelector = ({
  selectedSpecializations,
  onSpecializationsChange,
  type,
  readOnly = false
}: SpecializationSelectorProps) => {
  const [availableSpecializations, setAvailableSpecializations] = useState<Specialization[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSpec, setEditingSpec] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    experience_years: "",
    certification_level: "",
    notes: ""
  });

  // Load available specializations
  useEffect(() => {
    const loadSpecializations = async () => {
      try {
        const { data, error } = await supabase
          .from('specializations')
          .select('id, name, description, category')
          .eq('active', true)
          .order('category, name');
        
        if (error) throw error;
        setAvailableSpecializations(data || []);
      } catch (error) {
        console.error('Error loading specializations:', error);
      }
    };

    loadSpecializations();
  }, []);

  const handleAddSpecialization = (spec: Specialization) => {
    if (selectedSpecializations.find(s => s.id === spec.id)) return;
    
    const newSpec: SelectedSpecialization = {
      ...spec,
      experience_years: formData.experience_years ? parseInt(formData.experience_years) : undefined,
      certification_level: formData.certification_level || undefined,
      notes: formData.notes || undefined
    };
    
    onSpecializationsChange([...selectedSpecializations, newSpec]);
    setShowAddForm(false);
    setFormData({ experience_years: "", certification_level: "", notes: "" });
  };

  const handleRemoveSpecialization = (specId: string) => {
    onSpecializationsChange(selectedSpecializations.filter(s => s.id !== specId));
  };

  const handleUpdateSpecialization = (specId: string, updates: Partial<SelectedSpecialization>) => {
    onSpecializationsChange(
      selectedSpecializations.map(s => 
        s.id === specId ? { ...s, ...updates } : s
      )
    );
    setEditingSpec(null);
    setFormData({ experience_years: "", certification_level: "", notes: "" });
  };

  const startEditing = (spec: SelectedSpecialization) => {
    setEditingSpec(spec.id);
    setFormData({
      experience_years: spec.experience_years?.toString() || "",
      certification_level: spec.certification_level || "",
      notes: spec.notes || ""
    });
  };

  const availableToAdd = availableSpecializations.filter(
    spec => !selectedSpecializations.find(s => s.id === spec.id)
  );

  // Group available specializations by category
  const groupedSpecializations = availableToAdd.reduce((acc, spec) => {
    const category = spec.category || 'Altro';
    if (!acc[category]) acc[category] = [];
    acc[category].push(spec);
    return acc;
  }, {} as Record<string, Specialization[]>);

  if (readOnly) {
    return (
      <div className="space-y-2">
        <Label className="text-sm font-medium">Specializzazioni</Label>
        <div className="flex flex-wrap gap-2">
          {selectedSpecializations.map((spec) => (
            <Badge key={spec.id} variant="secondary">
              {spec.name}
              {spec.experience_years && ` (${spec.experience_years} anni)`}
            </Badge>
          ))}
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Specializzazioni</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Selected Specializations */}
        <div className="space-y-3">
          {selectedSpecializations.map((spec) => (
            <div key={spec.id} className="p-3 border rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-medium">{spec.name}</h4>
                  {spec.experience_years && (
                    <p className="text-sm text-muted-foreground">
                      {spec.experience_years} anni di esperienza
                    </p>
                  )}
                  {spec.certification_level && (
                    <p className="text-sm text-muted-foreground">
                      Livello: {spec.certification_level}
                    </p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => startEditing(spec)}
                  >
                    Modifica
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveSpecialization(spec.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {editingSpec === spec.id && (
                <div className="space-y-3 pt-3 border-t">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="experience">Anni di esperienza</Label>
                      <Input
                        id="experience"
                        type="number"
                        value={formData.experience_years}
                        onChange={(e) => setFormData({...formData, experience_years: e.target.value})}
                        placeholder="es. 5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="certification">Livello certificazione</Label>
                      <Input
                        id="certification"
                        value={formData.certification_level}
                        onChange={(e) => setFormData({...formData, certification_level: e.target.value})}
                        placeholder="es. Avanzato"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="notes">Note aggiuntive</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      placeholder="Aggiungi note sulla tua esperienza..."
                      rows={2}
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => handleUpdateSpecialization(spec.id, {
                        experience_years: formData.experience_years ? parseInt(formData.experience_years) : undefined,
                        certification_level: formData.certification_level || undefined,
                        notes: formData.notes || undefined
                      })}
                    >
                      Salva
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingSpec(null)}
                    >
                      Annulla
                    </Button>
                  </div>
                </div>
              )}
              
              {spec.notes && editingSpec !== spec.id && (
                <p className="text-sm text-muted-foreground mt-2">{spec.notes}</p>
              )}
            </div>
          ))}
        </div>

        {/* Add New Specialization */}
        {!showAddForm ? (
          <Button
            variant="outline"
            onClick={() => setShowAddForm(true)}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Aggiungi Specializzazione
          </Button>
        ) : (
          <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Aggiungi Specializzazione</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAddForm(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Additional Details Form */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="new-experience">Anni di esperienza</Label>
                <Input
                  id="new-experience"
                  type="number"
                  value={formData.experience_years}
                  onChange={(e) => setFormData({...formData, experience_years: e.target.value})}
                  placeholder="es. 5"
                />
              </div>
              <div>
                <Label htmlFor="new-certification">Livello certificazione</Label>
                <Input
                  id="new-certification"
                  value={formData.certification_level}
                  onChange={(e) => setFormData({...formData, certification_level: e.target.value})}
                  placeholder="es. Avanzato"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="new-notes">Note aggiuntive</Label>
              <Textarea
                id="new-notes"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Aggiungi note sulla tua esperienza..."
                rows={2}
              />
            </div>
            
            {/* Available Specializations */}
            <div className="space-y-3">
              {Object.entries(groupedSpecializations).map(([category, specs]) => (
                <div key={category}>
                  <h5 className="font-medium text-sm mb-2">{category}</h5>
                  <div className="grid grid-cols-1 gap-2">
                    {specs.map((spec) => (
                      <div
                        key={spec.id}
                        className="flex items-center justify-between p-2 border rounded cursor-pointer hover:bg-muted/50"
                        onClick={() => handleAddSpecialization(spec)}
                      >
                        <div>
                          <p className="font-medium text-sm">{spec.name}</p>
                          {spec.description && (
                            <p className="text-xs text-muted-foreground">{spec.description}</p>
                          )}
                        </div>
                        <Button size="sm" variant="ghost">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SpecializationSelector;