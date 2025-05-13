import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import MaterialSelector from "@/components/MaterialSelector";
import MaterialProperties from "@/components/MaterialProperties";
import StressStrainChart from "@/components/StressStrainChart";
import InfoSection from "@/components/InfoSection";
import { type Material } from "@/lib/materialData";
import { getQueryFn } from "@/lib/queryClient";

export default function Home() {
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);

  const { 
    data: materials = [] as Material[], 
    isLoading: isMaterialsLoading,
    isError: isMaterialsError
  } = useQuery<Material[]>({
    queryKey: ['/api/materials'],
  });

  const { 
    data: materialDetails,
    isLoading: isMaterialDetailsLoading,
    isError: isMaterialDetailsError
  } = useQuery<Material>({
    queryKey: ['/api/materials', selectedMaterial?.id],
    enabled: !!selectedMaterial,
    queryFn: getQueryFn<Material>({ on401: "throw" }),
  });

  // Set the first material as selected on initial load
  useEffect(() => {
    if (!selectedMaterial && materials && materials.length > 0) {
      setSelectedMaterial(materials[0]);
    }
  }, [materials, selectedMaterial]);

  const handleSelectMaterial = (material: Material) => {
    setSelectedMaterial(material);
  };

  const isLoading = isMaterialsLoading || isMaterialDetailsLoading;
  const isError = isMaterialsError || isMaterialDetailsError;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-800 mb-2">Stress-Strain Graph Simulator</h1>
        <p className="text-gray-600">Visualize material properties and stress-strain relationships</p>
      </header>

      {isError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>Error loading data. Please try refreshing the page.</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6 lg:col-span-1">
          <MaterialSelector 
            materials={materials} 
            selectedMaterial={selectedMaterial}
            onSelectMaterial={handleSelectMaterial}
            isLoading={isMaterialsLoading}
          />
          
          <MaterialProperties 
            material={(materialDetails as Material | null) || selectedMaterial}
            isLoading={isLoading}
          />
        </div>

        <div className="lg:col-span-2">
          <StressStrainChart 
            material={materialDetails ? materialDetails : null}
            isLoading={isLoading || !materialDetails}
          />
        </div>
      </div>

      <InfoSection />
    </div>
  );
}
