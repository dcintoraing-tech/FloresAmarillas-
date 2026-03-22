export interface FlowerParams {
  speed: number;
  density: number;
  swayMagnitude: number;
  driftDirection: 'none' | 'left' | 'right' | 'up' | 'down' | 'random';
  driftSpeed: number;
  pulseEffect: number;
}

export interface BackgroundConfig {
  type: 'solid' | 'gradient';
  color1: string;
  color2?: string;
}

export const BACKGROUND_OPTIONS: BackgroundConfig[] = [
  { type: 'solid', color1: '#FDFAF5' },
  { type: 'gradient', color1: '#FDFAF5', color2: '#FFF9E3' },
  { type: 'gradient', color1: '#FFF9E3', color2: '#EBCE47' },
  { type: 'solid', color1: '#FEF3C7' },
];
