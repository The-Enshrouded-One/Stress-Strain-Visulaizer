import { useState, useRef, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DownloadIcon, GridIcon } from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceDot,
  ReferenceArea,
  ReferenceLine,
  Legend
} from "recharts";
import { type Material } from "@/lib/materialData";

interface StressStrainChartProps {
  material: Material | null;
  isLoading: boolean;
}

export default function StressStrainChart({ material, isLoading }: StressStrainChartProps) {
  const [showGrid, setShowGrid] = useState(true);
  const chartRef = useRef<HTMLDivElement>(null);

  const toggleGrid = () => {
    setShowGrid(!showGrid);
  };

  const downloadChart = useCallback(() => {
    if (!chartRef.current || !material) return;
    
    // This is a simplified version - in a real app we'd use a library like html2canvas
    // or capture the SVG directly for proper export
    
    try {
      const svgElement = chartRef.current.querySelector('svg');
      if (!svgElement) return;
      
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);
      
      const downloadLink = document.createElement('a');
      downloadLink.href = svgUrl;
      downloadLink.download = `${material.name.replace(/\s+/g, '-').toLowerCase()}-stress-strain.svg`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(svgUrl);
    } catch (error) {
      console.error('Error exporting chart:', error);
    }
  }, [material]);

  if (isLoading) {
    return <StressStrainChartSkeleton />;
  }

  if (!material || !material.curveData) {
    return (
      <Card className="h-full">
        <CardContent className="pt-6 h-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Stress-Strain Graph</h2>
          </div>
          <div className="h-[400px] w-full flex items-center justify-center text-gray-500">
            Select a material to view its stress-strain graph
          </div>
        </CardContent>
      </Card>
    );
  }

  const { curveData, keyPoints, regions, color } = material;

  // Calculate appropriate Y-axis domain based on ultimate strength
  const maxStress = Math.ceil(material.ultimateStrength * 1.1 / 50) * 50;

  // Calculate appropriate X-axis domain for the strain
  const maxStrain = Math.max(...curveData.map(point => point.x));
  const roundedMaxStrain = Math.ceil(maxStrain / 5) * 5;

  return (
    <Card className="h-full">
      <CardContent className="pt-6 h-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Stress-Strain Graph</h2>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={downloadChart}
              className="flex items-center"
            >
              <DownloadIcon className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={toggleGrid}
              className="flex items-center"
            >
              <GridIcon className="mr-2 h-4 w-4" />
              Grid
            </Button>
          </div>
        </div>
        
        <div className="chart-container h-[400px]" ref={chartRef}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={curveData}
              margin={{ top: 5, right: 20, left: 20, bottom: 25 }}
            >
              {showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis 
                dataKey="x" 
                label={{ 
                  value: 'Strain (%)', 
                  position: 'insideBottom', 
                  offset: -10 
                }} 
                domain={[0, roundedMaxStrain]} 
              />
              <YAxis 
                label={{ 
                  value: 'Stress (MPa)', 
                  angle: -90, 
                  position: 'insideLeft' 
                }} 
                domain={[0, maxStress]} 
              />
              <Tooltip 
                formatter={(value: number) => [`${value.toFixed(1)} MPa`, 'Stress']}
                labelFormatter={(value: number) => `Strain: ${value.toFixed(2)}%`}
                cursor={{ strokeDasharray: '3 3' }}
              />
              <Legend />
              
              {/* Reference areas for regions */}
              {regions && regions.map((region, index) => {
                console.log('Processing region:', region.name, 'for material:', material.name);
                console.log('Available key points:', keyPoints);
                
                // Define region bounds more accurately based on material type
                let startX = 0;
                let endX = 0;
                
                // Get all key points for better debugging
                const elasticLimit = keyPoints?.find(p => p.label === "Elastic Limit");
                const yieldPoint = keyPoints?.find(p => p.label === "Yield Point");
                const ultimate = keyPoints?.find(p => p.label === "Ultimate");
                
                console.log('Elastic Limit point:', elasticLimit);
                console.log('Yield Point:', yieldPoint);
                console.log('Ultimate point:', ultimate);
                
                if (region.name === "Elastic Region") {
                  startX = 0;
                  // End at elastic limit
                  endX = elasticLimit ? elasticLimit.x : 0.1;
                  console.log('Elastic Region bounds:', startX, 'to', endX);
                } else if (region.name === "Plastic Region") {
                  // Start from elastic limit
                  startX = elasticLimit ? elasticLimit.x : 0.1;
                  // End at ultimate
                  endX = ultimate ? ultimate.x : maxStrain * 0.7;
                  console.log('Plastic Region bounds:', startX, 'to', endX);
                } else if (region.name === "Strain Hardening") {
                  // Start from yield point
                  startX = yieldPoint ? yieldPoint.x : (elasticLimit ? elasticLimit.x * 1.2 : 0.2);
                  // End at ultimate
                  endX = ultimate ? ultimate.x : maxStrain * 0.7;
                  console.log('Strain Hardening bounds:', startX, 'to', endX);
                } else {
                  // Fallback with simple calculation
                  startX = index === 0 ? 0 : maxStrain * 0.25 * index;
                  endX = maxStrain * 0.25 * (index + 1);
                  console.log('Fallback region bounds:', startX, 'to', endX);
                }
                
                return (
                  <ReferenceArea 
                    key={region.name}
                    x1={startX} 
                    x2={endX}
                    y1={0}
                    y2={maxStress}
                    fill={
                      region.name === "Elastic Region" ? "rgba(34, 197, 94, 0.2)" :
                      region.name === "Plastic Region" ? "rgba(234, 179, 8, 0.2)" :
                      region.name === "Strain Hardening" ? "rgba(239, 68, 68, 0.2)" :
                      region.color
                    }
                    fillOpacity={0.5}
                    strokeWidth={1.5}
                    stroke={
                      region.name === "Elastic Region" ? "rgba(34, 197, 94, 0.8)" :
                      region.name === "Plastic Region" ? "rgba(234, 179, 8, 0.8)" :
                      region.name === "Strain Hardening" ? "rgba(239, 68, 68, 0.8)" :
                      region.color
                    }
                    label={{
                      value: region.name,
                      position: region.name === "Elastic Region" ? 'insideTopLeft' : 
                               region.name === "Plastic Region" ? 'insideTop' : 'insideTopRight',
                      fill: region.name === "Elastic Region" ? "rgba(34, 197, 94, 1)" :
                             region.name === "Plastic Region" ? "rgba(234, 179, 8, 1)" :
                             "rgba(239, 68, 68, 1)",
                      fontSize: 13,
                      fontWeight: 'bold',
                      offset: 15
                    }}
                  />
                );
              })}
              
              {/* The curve line with much slower animation */}
              <Line 
                type="monotone" 
                dataKey="y" 
                name={material.name}
                stroke={color} 
                strokeWidth={3}
                dot={false}
                isAnimationActive={true}
                animationDuration={4500}
                animationEasing="ease-in-out"
                activeDot={{ 
                  r: 8, 
                  fill: color,
                  stroke: '#fff',
                  strokeWidth: 2,
                  onMouseOver: (props: any) => console.log('Active point:', props)
                }}
              />
              
              {/* Key reference points with labels */}
              {keyPoints && keyPoints.map((point) => (
                <ReferenceDot
                  key={point.label}
                  x={point.x}
                  y={point.y}
                  r={8}
                  fill={
                    point.label === "Elastic Limit" ? "#3B82F6" : 
                    point.label === "Yield Point" ? "#F59E0B" : 
                    point.label === "Ultimate" ? "#EF4444" : color
                  }
                  stroke="#fff"
                  strokeWidth={3}
                  isFront={true}
                  label={{
                    value: point.label,
                    position: 'top',
                    fill: '#333',
                    fontSize: 12,
                    fontWeight: 'bold',
                    offset: 15
                  }}
                />
              ))}
              
              {/* Visualize the key points more prominently */}
              {keyPoints && keyPoints.map((point) => {
                const pointColor = 
                  point.label === "Elastic Limit" ? "#3B82F6" : 
                  point.label === "Yield Point" ? "#F59E0B" : 
                  point.label === "Ultimate" ? "#EF4444" : color;
                
                return (
                  <ReferenceLine
                    key={`line-${point.label}`}
                    x={point.x}
                    stroke={pointColor}
                    strokeDasharray="3 3"
                    strokeWidth={1.5}
                    label={{
                      value: `${point.x.toFixed(2)}%`,
                      position: 'bottom',
                      fill: '#666',
                      fontSize: 10
                    }}
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
            <h3 className="font-medium text-gray-700 mb-2">Key Points</h3>
            <ul className="space-y-2 text-sm">
              {keyPoints && keyPoints.map((point) => (
                <li key={point.label} className="flex items-center">
                  <span 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: point.label === "Elastic Limit" ? "#3B82F6" : 
                             point.label === "Yield Point" ? "#F59E0B" : 
                             point.label === "Ultimate" ? "#EF4444" : color }}
                  ></span>
                  <span>
                    {point.label}: <span className="font-medium">{point.y} MPa, {point.x.toFixed(3)}%</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
            <h3 className="font-medium text-gray-700 mb-2">Regions</h3>
            <ul className="space-y-2 text-sm">
              {regions && regions.map((region) => (
                <li key={region.name} className="flex items-center">
                  <span 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: region.color }}
                  ></span>
                  <span>{region.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StressStrainChartSkeleton() {
  return (
    <Card className="h-full">
      <CardContent className="pt-6 h-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Stress-Strain Graph</h2>
          <div className="flex space-x-2">
            <div className="w-24 h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
        
        <div className="h-[400px] w-full bg-gray-100 rounded-lg animate-pulse"></div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-md p-4 bg-gray-50 h-32 animate-pulse"></div>
          <div className="border border-gray-200 rounded-md p-4 bg-gray-50 h-32 animate-pulse"></div>
        </div>
      </CardContent>
    </Card>
  );
}
