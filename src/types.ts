export interface MetalInfo {
  id: 'Li' | 'Na' | 'K' | 'Rb' | 'Cs';
  basinIndex: number; // 0 to 4 (corresponding to Basin 1 to 5)
  name: string;
  vietnameseName: string;
  atomicNumber: number;
  colorName: string;
  iconBgClass: string;
  iconBorderColor: string;
  flameColor: string;
  flameDescription: string;
  flameHex: string;
  pinkColorHex: string; // Color intensity for PP indicator
  equation: string;
  equationHtml: string;
  reactionDescription: string;
  isExplosive: boolean;
}

export interface BasinState {
  index: number; // 0 to 4
  hasWater: boolean;
  waterLevel: number; // 0 to 100
  hasPP: boolean; // Has Phenolphthalein
  ppDrops: number;
  metal: MetalInfo | null;
  reactionProgress: number; // 0 to 100
  isReacting: boolean;
  isExploded: boolean;
  solutionColor: string; // CSS color string (transparent, light pink, deep pink)
  pHLevel: number; // 7 (neutral) up to 14
  temperature: number; // In Celsius
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  url?: string;
  type: 'preset' | 'custom' | 'synth';
}
