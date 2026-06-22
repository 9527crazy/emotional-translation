import type { EmotionScores } from '../types/emotion.types';
import { EMOTION_LIST } from '../constants/emotions';

export function exponentialMovingAverage(
  current: EmotionScores,
  previous: EmotionScores | null,
  alpha: number = 0.3,
): EmotionScores {
  if (!previous) return { ...current };
  const result: EmotionScores = {
    happy: 0, sad: 0, angry: 0, surprised: 0,
    fearful: 0, disgusted: 0, neutral: 0,
  };
  for (const key of EMOTION_LIST) {
    result[key] = alpha * current[key] + (1 - alpha) * previous[key];
  }
  return result;
}

export function normalizeScores(scores: EmotionScores): EmotionScores {
  const sum = EMOTION_LIST.reduce((acc, k) => acc + scores[k], 0);
  if (sum === 0) return { ...scores };
  const result: EmotionScores = {
    happy: 0, sad: 0, angry: 0, surprised: 0,
    fearful: 0, disgusted: 0, neutral: 0,
  };
  for (const key of EMOTION_LIST) {
    result[key] = scores[key] / sum;
  }
  return result;
}
