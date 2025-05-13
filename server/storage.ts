import { materials, type Material, type InsertMaterial, type StrainPoint } from "@shared/schema";

// Custom types for stress-strain data
export interface KeyPoint {
  x: number; // strain percentage
  y: number; // stress MPa
  label: string;
}

export interface RegionInfo {
  name: string;
  color: string;
  description: string;
}

export interface MaterialWithCurveData extends Material {
  curveData: Array<{ x: number; y: number }>;
  keyPoints: KeyPoint[];
  regions: RegionInfo[];
}

export interface IStorage {
  getUser(id: number): Promise<any | undefined>;
  getUserByUsername(username: string): Promise<any | undefined>;
  createUser(user: any): Promise<any>;
  
  // Material methods
  getAllMaterials(): Promise<Material[]>;
  getMaterialById(id: number): Promise<MaterialWithCurveData | undefined>;
  getMaterialByName(name: string): Promise<MaterialWithCurveData | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, any>;
  private materials: Map<number, MaterialWithCurveData>;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.materials = new Map();
    this.currentId = 1;
    
    // Initialize with predefined materials
    this.initializeMaterials();
  }

  async getUser(id: number): Promise<any | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<any | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: any): Promise<any> {
    const id = this.currentId++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllMaterials(): Promise<Material[]> {
    return Array.from(this.materials.values()).map(({ curveData, keyPoints, regions, ...material }) => material);
  }

  async getMaterialById(id: number): Promise<MaterialWithCurveData | undefined> {
    return this.materials.get(id);
  }

  async getMaterialByName(name: string): Promise<MaterialWithCurveData | undefined> {
    return Array.from(this.materials.values()).find(
      (material) => material.name.toLowerCase() === name.toLowerCase(),
    );
  }

  private initializeMaterials() {
    // Structural Steel
    this.materials.set(1, {
      id: 1,
      name: "Structural Steel",
      color: "#6B7280",
      youngsModulus: 200,
      yieldStrength: 250,
      ultimateStrength: 400,
      density: 7850,
      curveData: this.generateSteelData(),
      keyPoints: [
        { x: 0.125, y: 250, label: "Yield Point" },
        { x: 0.105, y: 210, label: "Elastic Limit" },
        { x: 20, y: 400, label: "Ultimate" }
      ],
      regions: [
        { name: "Elastic Region", color: "rgba(34, 197, 94, 0.1)", description: "Material returns to original shape when force is removed" },
        { name: "Plastic Region", color: "rgba(234, 179, 8, 0.1)", description: "Material permanently deforms and doesn't return to original shape" },
        { name: "Strain Hardening", color: "rgba(239, 68, 68, 0.1)", description: "Region where additional stress is required for continued deformation" }
      ]
    });

    // Aluminum Alloy
    this.materials.set(2, {
      id: 2,
      name: "Aluminum Alloy",
      color: "#60A5FA",
      youngsModulus: 70,
      yieldStrength: 95,
      ultimateStrength: 110,
      density: 2700,
      curveData: this.generateAluminumData(),
      keyPoints: [
        { x: 0.14, y: 95, label: "Yield Point" },
        { x: 0.11, y: 77, label: "Elastic Limit" },
        { x: 12, y: 110, label: "Ultimate" }
      ],
      regions: [
        { name: "Elastic Region", color: "rgba(34, 197, 94, 0.1)", description: "Material returns to original shape when force is removed" },
        { name: "Plastic Region", color: "rgba(234, 179, 8, 0.1)", description: "Material permanently deforms and doesn't return to original shape" },
        { name: "Strain Hardening", color: "rgba(239, 68, 68, 0.1)", description: "Region where additional stress is required for continued deformation" }
      ]
    });

    // Copper
    this.materials.set(3, {
      id: 3,
      name: "Copper",
      color: "#F59E0B",
      youngsModulus: 110,
      yieldStrength: 70,
      ultimateStrength: 220,
      density: 8960,
      curveData: this.generateCopperData(),
      keyPoints: [
        { x: 0.065, y: 70, label: "Yield Point" },
        { x: 0.05, y: 55, label: "Elastic Limit" },
        { x: 30, y: 220, label: "Ultimate" }
      ],
      regions: [
        { name: "Elastic Region", color: "rgba(34, 197, 94, 0.1)", description: "Material returns to original shape when force is removed" },
        { name: "Plastic Region", color: "rgba(234, 179, 8, 0.1)", description: "Material permanently deforms and doesn't return to original shape" },
        { name: "Strain Hardening", color: "rgba(239, 68, 68, 0.1)", description: "Region where additional stress is required for continued deformation" }
      ]
    });

    // Titanium Alloy
    this.materials.set(4, {
      id: 4,
      name: "Titanium Alloy",
      color: "#8B5CF6",
      youngsModulus: 116,
      yieldStrength: 825,
      ultimateStrength: 900,
      density: 4500,
      curveData: this.generateTitaniumData(),
      keyPoints: [
        { x: 0.71, y: 825, label: "Yield Point" },
        { x: 0.65, y: 750, label: "Elastic Limit" },
        { x: 10, y: 900, label: "Ultimate" }
      ],
      regions: [
        { name: "Elastic Region", color: "rgba(34, 197, 94, 0.1)", description: "Material returns to original shape when force is removed" },
        { name: "Plastic Region", color: "rgba(234, 179, 8, 0.1)", description: "Material permanently deforms and doesn't return to original shape" },
        { name: "Strain Hardening", color: "rgba(239, 68, 68, 0.1)", description: "Region where additional stress is required for continued deformation" }
      ]
    });
  }

  // Generate stress-strain curve data for different materials
  private generateSteelData(): Array<{x: number, y: number}> {
    const elasticLimit = 0.0012; // 0.12% strain
    const yieldPoint = 0.002; // 0.2% strain
    const ultimatePoint = 0.2; // 20% strain
    const breakPoint = 0.3; // 30% strain
    
    const youngsModulus = 200000; // 200 GPa in MPa
    const yieldStrength = 250; // MPa
    const ultimateStrength = 400; // MPa
    
    let data = [];
    
    // Elastic region (linear)
    for (let strain = 0; strain <= elasticLimit; strain += 0.0001) {
      data.push({
        x: strain * 100, // Convert to percentage
        y: youngsModulus * strain
      });
    }
    
    // Yield region (slightly curved)
    for (let strain = elasticLimit + 0.0001; strain <= yieldPoint; strain += 0.0001) {
      const stressIncrement = (yieldStrength - (youngsModulus * elasticLimit)) * 
        (strain - elasticLimit) / (yieldPoint - elasticLimit);
      data.push({
        x: strain * 100, // Convert to percentage
        y: (youngsModulus * elasticLimit) + stressIncrement
      });
    }
    
    // Plastic region (strain hardening)
    for (let strain = yieldPoint + 0.001; strain <= ultimatePoint; strain += 0.005) {
      const progress = (strain - yieldPoint) / (ultimatePoint - yieldPoint);
      const stressIncrement = (ultimateStrength - yieldStrength) * Math.pow(progress, 0.5);
      data.push({
        x: strain * 100, // Convert to percentage
        y: yieldStrength + stressIncrement
      });
    }
    
    // Necking region (decreasing stress)
    for (let strain = ultimatePoint + 0.01; strain <= breakPoint; strain += 0.01) {
      const progress = (strain - ultimatePoint) / (breakPoint - ultimatePoint);
      const stressDecrement = (ultimateStrength - yieldStrength) * 0.8 * progress;
      data.push({
        x: strain * 100, // Convert to percentage
        y: ultimateStrength - stressDecrement
      });
    }
    
    return data;
  }

  private generateAluminumData(): Array<{x: number, y: number}> {
    const elasticLimit = 0.0011; // 0.11% strain
    const yieldPoint = 0.0014; // 0.14% strain
    const ultimatePoint = 0.12; // 12% strain
    const breakPoint = 0.18; // 18% strain
    
    const youngsModulus = 70000; // 70 GPa in MPa
    const yieldStrength = 95; // MPa
    const ultimateStrength = 110; // MPa
    
    let data = [];
    
    // Elastic region (linear)
    for (let strain = 0; strain <= elasticLimit; strain += 0.0001) {
      data.push({
        x: strain * 100, // Convert to percentage
        y: youngsModulus * strain
      });
    }
    
    // Yield region
    for (let strain = elasticLimit + 0.0001; strain <= yieldPoint; strain += 0.0001) {
      const stressIncrement = (yieldStrength - (youngsModulus * elasticLimit)) * 
        (strain - elasticLimit) / (yieldPoint - elasticLimit);
      data.push({
        x: strain * 100,
        y: (youngsModulus * elasticLimit) + stressIncrement
      });
    }
    
    // Plastic region (strain hardening)
    for (let strain = yieldPoint + 0.001; strain <= ultimatePoint; strain += 0.002) {
      const progress = (strain - yieldPoint) / (ultimatePoint - yieldPoint);
      const stressIncrement = (ultimateStrength - yieldStrength) * Math.pow(progress, 0.7);
      data.push({
        x: strain * 100,
        y: yieldStrength + stressIncrement
      });
    }
    
    // Necking region
    for (let strain = ultimatePoint + 0.01; strain <= breakPoint; strain += 0.01) {
      const progress = (strain - ultimatePoint) / (breakPoint - ultimatePoint);
      const stressDecrement = (ultimateStrength - yieldStrength) * 0.6 * progress;
      data.push({
        x: strain * 100,
        y: ultimateStrength - stressDecrement
      });
    }
    
    return data;
  }

  private generateCopperData(): Array<{x: number, y: number}> {
    const elasticLimit = 0.0005; // 0.05% strain
    const yieldPoint = 0.00065; // 0.065% strain
    const ultimatePoint = 0.3; // 30% strain
    const breakPoint = 0.45; // 45% strain
    
    const youngsModulus = 110000; // 110 GPa in MPa
    const yieldStrength = 70; // MPa
    const ultimateStrength = 220; // MPa
    
    let data = [];
    
    // Elastic region (linear)
    for (let strain = 0; strain <= elasticLimit; strain += 0.0001) {
      data.push({
        x: strain * 100,
        y: youngsModulus * strain
      });
    }
    
    // Yield region
    for (let strain = elasticLimit + 0.0001; strain <= yieldPoint; strain += 0.0001) {
      const stressIncrement = (yieldStrength - (youngsModulus * elasticLimit)) * 
        (strain - elasticLimit) / (yieldPoint - elasticLimit);
      data.push({
        x: strain * 100,
        y: (youngsModulus * elasticLimit) + stressIncrement
      });
    }
    
    // Plastic region (significant strain hardening - copper has a pronounced strain hardening)
    for (let strain = yieldPoint + 0.001; strain <= ultimatePoint; strain += 0.01) {
      const progress = (strain - yieldPoint) / (ultimatePoint - yieldPoint);
      const stressIncrement = (ultimateStrength - yieldStrength) * Math.pow(progress, 0.4);
      data.push({
        x: strain * 100,
        y: yieldStrength + stressIncrement
      });
    }
    
    // Necking region
    for (let strain = ultimatePoint + 0.01; strain <= breakPoint; strain += 0.01) {
      const progress = (strain - ultimatePoint) / (breakPoint - ultimatePoint);
      const stressDecrement = (ultimateStrength - yieldStrength) * 0.5 * progress;
      data.push({
        x: strain * 100,
        y: ultimateStrength - stressDecrement
      });
    }
    
    return data;
  }

  private generateTitaniumData(): Array<{x: number, y: number}> {
    const elasticLimit = 0.0065; // 0.65% strain
    const yieldPoint = 0.0071; // 0.71% strain
    const ultimatePoint = 0.1; // 10% strain
    const breakPoint = 0.15; // 15% strain
    
    const youngsModulus = 116000; // 116 GPa in MPa
    const yieldStrength = 825; // MPa
    const ultimateStrength = 900; // MPa
    
    let data = [];
    
    // Elastic region (linear)
    for (let strain = 0; strain <= elasticLimit; strain += 0.0002) {
      data.push({
        x: strain * 100,
        y: youngsModulus * strain
      });
    }
    
    // Yield region
    for (let strain = elasticLimit + 0.0001; strain <= yieldPoint; strain += 0.0001) {
      const stressIncrement = (yieldStrength - (youngsModulus * elasticLimit)) * 
        (strain - elasticLimit) / (yieldPoint - elasticLimit);
      data.push({
        x: strain * 100,
        y: (youngsModulus * elasticLimit) + stressIncrement
      });
    }
    
    // Plastic region (titanium has less strain hardening than steel)
    for (let strain = yieldPoint + 0.001; strain <= ultimatePoint; strain += 0.002) {
      const progress = (strain - yieldPoint) / (ultimatePoint - yieldPoint);
      const stressIncrement = (ultimateStrength - yieldStrength) * Math.pow(progress, 0.6);
      data.push({
        x: strain * 100,
        y: yieldStrength + stressIncrement
      });
    }
    
    // Necking region
    for (let strain = ultimatePoint + 0.005; strain <= breakPoint; strain += 0.005) {
      const progress = (strain - ultimatePoint) / (breakPoint - ultimatePoint);
      const stressDecrement = (ultimateStrength - yieldStrength) * 0.7 * progress;
      data.push({
        x: strain * 100,
        y: ultimateStrength - stressDecrement
      });
    }
    
    return data;
  }
}

export const storage = new MemStorage();
