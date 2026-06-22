import type { EmotionType, EmotionScores } from '../types/emotion.types';

export const EMOTION_LIST: EmotionType[] = [
  'happy', 'sad', 'angry', 'surprised', 'fearful', 'disgusted', 'neutral',
];

export const EMOTION_LABELS: Record<EmotionType, { zh: string; emoji: string }> = {
  happy:    { zh: '快乐', emoji: '😊' },
  sad:      { zh: '悲伤', emoji: '😢' },
  angry:    { zh: '愤怒', emoji: '😠' },
  surprised:{ zh: '惊讶', emoji: '😲' },
  fearful:  { zh: '恐惧', emoji: '😨' },
  disgusted:{ zh: '厌恶', emoji: '🤢' },
  neutral:  { zh: '中性', emoji: '😐' },
};

export const EMPTY_SCORES: EmotionScores = {
  happy: 0, sad: 0, angry: 0, surprised: 0,
  fearful: 0, disgusted: 0, neutral: 1,
};
