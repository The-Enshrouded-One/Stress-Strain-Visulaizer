// Material data types
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

export interface Material {
  id: number;
  name: string;
  color: string;
  youngsModulus: number; // GPa
  yieldStrength: number; // MPa
  ultimateStrength: number; // MPa
  density: number; // kg/m³
  curveData?: Array<{ x: number; y: number }>;
  keyPoints?: KeyPoint[];
  regions?: RegionInfo[];
}

// Define formatter functions for property values
export const formatters = {
  youngsModulus: (value: number) => `${value} GPa`,
  yieldStrength: (value: number) => `${value} MPa`,
  ultimateStrength: (value: number) => `${value} MPa`,
  density: (value: number) => `${value} kg/m³`
};

// Property descriptions for tooltips
export const propertyDescriptions = {
  youngsModulus: "Young's Modulus represents the stiffness of a material. It is the ratio of stress to strain in the elastic region of the stress-strain curve.",
  yieldStrength: "Yield Strength is the stress at which a material begins to deform plastically. Before the yield point, the material will return to its original shape when the load is removed.",
  ultimateStrength: "Ultimate Strength (or Tensile Strength) is the maximum stress that a material can withstand before failing or breaking.",
  density: "Density is the mass per unit volume of a material, typically measured in kilograms per cubic meter (kg/m³)."
};

// Property labels with descriptions for display
export const propertyLabels = {
  youngsModulus: { label: "Young's Modulus", description: "Measure of stiffness" },
  yieldStrength: { label: "Yield Strength", description: "Stress at yield point" },
  ultimateStrength: { label: "Ultimate Strength", description: "Maximum stress before fracture" },
  density: { label: "Density", description: "Mass per unit volume" }
};
