import { useState } from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { type Material } from "@/lib/materialData";

interface MaterialSelectorProps {
  materials: Material[];
  selectedMaterial: Material | null;
  onSelectMaterial: (material: Material) => void;
  isLoading: boolean;
}

export default function MaterialSelector({ 
  materials, 
  selectedMaterial, 
  onSelectMaterial,
  isLoading
}: MaterialSelectorProps) {
  const handleMaterialChange = (value: string) => {
    const material = materials.find(m => m.id.toString() === value);
    if (material) {
      onSelectMaterial(material);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Select Material</h2>
        
        {isLoading ? (
          <div className="w-full py-3 px-4 border border-gray-300 rounded-md flex items-center">
            <div className="w-3 h-3 rounded-full bg-gray-300 animate-pulse mr-3"></div>
            <span className="text-gray-400">Loading materials...</span>
          </div>
        ) : (
          <Select
            value={selectedMaterial?.id.toString() || ""}
            onValueChange={handleMaterialChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select material" />
            </SelectTrigger>
            <SelectContent>
              {materials.map((material) => (
                <SelectItem key={material.id} value={material.id.toString()}>
                  <div className="flex items-center">
                    <span 
                      className="w-3 h-3 rounded-full mr-3" 
                      style={{ backgroundColor: material.color }}
                    ></span>
                    <span>{material.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </CardContent>
    </Card>
  );
}
