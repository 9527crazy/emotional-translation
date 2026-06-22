export type EmotionType = 'happy' | 'sad' | 'angry' | 'surprised' | 'fearful' | 'disgusted' | 'neutral';

export interface EmotionScores {
  happy: number;
  sad: number;
  angry: number;
  surprised: number;
  fearful: number;
  disgusted: number;
  neutral: number;
}

export interface EmotionResult {
  emotions: EmotionScores;
  dominant: EmotionType;
  confidence: number;
  timestamp: number;
}

export interface EmotionColor {
  primary: string;
  secondary: string;
  gradient: string;
  background: string;
}

export interface EmotionEmoji {
  primary: string;
  secondary: string[];
  animation: 'pulse' | 'float' | 'burst' | 'fall';
}
