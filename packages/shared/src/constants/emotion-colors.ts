import type { EmotionType, EmotionColor } from '../types/emotion.types';

export const EMOTION_COLORS: Record<EmotionType, EmotionColor> = {
  happy: {
    primary: '#FFD93D',
    secondary: '#FF9800',
    gradient: 'linear-gradient(135deg, #FFD93D 0%, #FF9800 100%)',
    background: '#FFF8E1',
  },
  sad: {
    primary: '#6B9BD2',
    secondary: '#1565C0',
    gradient: 'linear-gradient(135deg, #6B9BD2 0%, #1565C0 100%)',
    background: '#E3F2FD',
  },
  angry: {
    primary: '#FF6B6B',
    secondary: '#C62828',
    gradient: 'linear-gradient(135deg, #FF6B6B 0%, #C62828 100%)',
    background: '#FFEBEE',
  },
  surprised: {
    primary: '#FF9800',
    secondary: '#E65100',
    gradient: 'linear-gradient(135deg, #FF9800 0%, #E65100 100%)',
    background: '#FFF3E0',
  },
  fearful: {
    primary: '#9C27B0',
    secondary: '#6A1B9A',
    gradient: 'linear-gradient(135deg, #9C27B0 0%, #6A1B9A 100%)',
    background: '#F3E5F5',
  },
  disgusted: {
    primary: '#66BB6A',
    secondary: '#2E7D32',
    gradient: 'linear-gradient(135deg, #66BB6A 0%, #2E7D32 100%)',
    background: '#E8F5E9',
  },
  neutral: {
    primary: '#90A4AE',
    secondary: '#546E7A',
    gradient: 'linear-gradient(135deg, #90A4AE 0%, #546E7A 100%)',
    background: '#ECEFF1',
  },
};

export const DARK_EMOTION_COLORS: Record<EmotionType, string> = {
  happy: '#FFD54F',
  sad: '#90CAF9',
  angry: '#EF9A9A',
  surprised: '#FFB74D',
  fearful: '#CE93D8',
  disgusted: '#A5D6A7',
  neutral: '#B0BEC5',
};
