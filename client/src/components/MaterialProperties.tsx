import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";
import { type Material, formatters, propertyDescriptions, propertyLabels } from "@/lib/materialData";

interface MaterialPropertiesProps {
  material: Material | null;
  isLoading: boolean;
}

export default function MaterialProperties({ material, isLoading }: MaterialPropertiesProps) {
  if (isLoading) {
    return <MaterialPropertiesSkeleton />;
  }

  if (!material) {
    return (
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Material Properties</h2>
          <div className="p-8 text-center text-gray-500">
            Select a material to view its properties
          </div>
        </CardContent>
      </Card>
    );
  }

  // Properties to display
  const properties = [
    { key: 'youngsModulus', value: material.youngsModulus },
    { key: 'yieldStrength', value: material.yieldStrength },
    { key: 'ultimateStrength', value: material.ultimateStrength },
    { key: 'density', value: material.density }
  ];

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Material Properties</h2>
          <span 
            className="px-3 py-1 text-white text-sm rounded-full"
            style={{ backgroundColor: material.color }}
          >
            {material.name}
          </span>
        </div>
        
        <div className="space-y-4">
          {properties.map(({ key, value }) => (
            <div key={key} className="border border-gray-200 rounded-md p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <h3 className="font-medium text-gray-700">
                    {propertyLabels[key as keyof typeof propertyLabels]?.label}
                  </h3>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="ml-2 text-gray-400 hover:text-gray-600">
                          <InfoIcon size={16} />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          {propertyDescriptions[key as keyof typeof propertyDescriptions]}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <span className="text-xl font-semibold text-gray-900">
                  {formatters[key as keyof typeof formatters](value)}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {propertyLabels[key as keyof typeof propertyLabels]?.description}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function MaterialPropertiesSkeleton() {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Material Properties</h2>
          <div className="w-16 h-6 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
        
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="border border-gray-200 rounded-md p-4">
              <div className="flex justify-between items-center">
                <div className="w-32 h-5 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-20 h-7 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="w-40 h-4 bg-gray-100 rounded mt-2 animate-pulse"></div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
