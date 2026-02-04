export interface StyleAttribute {
  category: string;
  title: string;
  description: string;
  tags: string[];
}

export interface PosterAnalysis {
  id: string;
  imageUrl: string;
  attributes: StyleAttribute[];
  colorPalette: string[];
  basePrompt: string;
}

export enum GenerationStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface GeneratedImage {
  url: string;
  prompt: string;
  timestamp: number;
}
