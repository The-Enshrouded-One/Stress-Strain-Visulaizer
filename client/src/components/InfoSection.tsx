import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function InfoSection() {
  const [showResources, setShowResources] = useState(false);

  const toggleResources = () => {
    setShowResources(!showResources);
  };

  return (
    <Card className="mt-8">
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Understanding Stress-Strain Relationships</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-700 mb-2">What is a Stress-Strain Graph?</h3>
            <p className="text-gray-600">
              A stress-strain graph shows the relationship between the stress (force per unit area) and strain (proportional deformation) in a material. It helps engineers understand how materials respond to applied forces.
            </p>
            
            <h3 className="font-medium text-gray-700 mt-4 mb-2">Material Properties Explained</h3>
            <ul className="space-y-2 text-gray-600">
              <li><span className="font-medium">Young's Modulus</span>: The slope of the elastic region, representing material stiffness.</li>
              <li><span className="font-medium">Yield Strength</span>: The stress at which a material begins to deform plastically.</li>
              <li><span className="font-medium">Ultimate Strength</span>: The maximum stress a material can withstand before failure.</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Regions in Stress-Strain Curve</h3>
            <ul className="space-y-2 text-gray-600">
              <li><span className="font-medium">Elastic Region</span>: Material returns to original shape when force is removed.</li>
              <li><span className="font-medium">Plastic Region</span>: Material permanently deforms and doesn't return to original shape.</li>
              <li><span className="font-medium">Strain Hardening</span>: Region where additional stress is required for continued deformation.</li>
              <li><span className="font-medium">Necking</span>: Localized reduction in cross-sectional area before fracture.</li>
            </ul>
            
            <div className="mt-4">
              <button 
                className="text-blue-500 hover:text-blue-700 flex items-center"
                onClick={toggleResources}
              >
                <span>Additional Learning Resources</span>
                {showResources ? (
                  <ChevronUp className="ml-2 h-4 w-4" />
                ) : (
                  <ChevronDown className="ml-2 h-4 w-4" />
                )}
              </button>
              
              {showResources && (
                <div className="mt-2 p-4 bg-blue-50 rounded-md">
                  <ul className="space-y-2 text-gray-600 list-disc pl-5">
                    <li>
                      <a 
                        href="https://www.engineeringtoolbox.com/stress-strain-diagrams-d_938.html" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Engineering Toolbox: Stress-Strain Diagrams
                      </a>
                    </li>
                    <li>
                      <a 
                        href="https://www.nde-ed.org/EducationResources/CommunityCollege/Materials/Mechanical/StressStrain.htm" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        NDT Resource Center: Stress-Strain Relationships
                      </a>
                    </li>
                    <li>
                      <a 
                        href="https://www.sciencedirect.com/topics/engineering/stress-strain-curve" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        ScienceDirect: Stress-Strain Curve Topics
                      </a>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
