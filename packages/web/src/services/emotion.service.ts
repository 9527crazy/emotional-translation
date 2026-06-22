import type {
  EmotionResult,
  EmotionScores,
  EmotionType,
  FaceDetectionResult,
} from '@emotional-translation/shared';
import { EMOTION_LIST, EMPTY_SCORES } from '@emotional-translation/shared';
import { normalizeScores } from '@emotional-translation/shared';

const BLENDSHAPE_WEIGHTS: Record<string, Partial<EmotionScores>> = {
  'mouthSmileLeft':    { happy: 0.4 },
  'mouthSmileRight':   { happy: 0.4 },
  'mouthFrownLeft':    { sad: 0.3 },
  'mouthFrownRight':   { sad: 0.3 },
  'mouthOpen':         { surprised: 0.2, fearful: 0.1 },
  'mouthPucker':       { disgusted: 0.2 },
  'mouthDimpleLeft':   { happy: 0.1 },
  'mouthDimpleRight':  { happy: 0.1 },
  'mouthPressLeft':    { angry: 0.1 },
  'mouthPressRight':   { angry: 0.1 },
  'mouthShrugLower':   { disgusted: 0.15 },
  'mouthFunnel':       { surprised: 0.1 },
  'browInnerUp':       { surprised: 0.3, fearful: 0.15 },
  'browDownLeft':      { angry: 0.25, fearful: 0.1 },
  'browDownRight':     { angry: 0.25, fearful: 0.1 },
  'browOuterUpLeft':   { surprised: 0.1, sad: 0.05 },
  'browOuterUpRight':  { surprised: 0.1, sad: 0.05 },
  'eyeWideLeft':       { surprised: 0.15, fearful: 0.15 },
  'eyeWideRight':      { surprised: 0.15, fearful: 0.15 },
  'eyeSquintLeft':     { happy: 0.1, angry: 0.05 },
  'eyeSquintRight':    { happy: 0.1, angry: 0.05 },
  'eyeBlinkLeft':      { neutral: 0.02 },
  'eyeBlinkRight':     { neutral: 0.02 },
  'noseSneerLeft':     { disgusted: 0.2, angry: 0.05 },
  'noseSneerRight':    { disgusted: 0.2, angry: 0.05 },
  'jawForward':        { angry: 0.1 },
  'jawLeft':           { disgusted: 0.05 },
  'jawRight':          { disgusted: 0.05 },
  'jawOpen':           { surprised: 0.15, fearful: 0.1 },
  'cheekPuff':         { angry: 0.05, disgusted: 0.05 },
  'cheekSquintLeft':   { happy: 0.05 },
  'cheekSquintRight':  { happy: 0.05 },
};

export class EmotionService {
  classify(faceResult: FaceDetectionResult): EmotionResult {
    const scores: EmotionScores = { ...EMPTY_SCORES };
    const blendshapeMap = new Map<string, number>();

    for (const bs of faceResult.blendshapes) {
      blendshapeMap.set(bs.categoryName, bs.score);
    }

    for (const [shapeName, weights] of Object.entries(BLENDSHAPE_WEIGHTS)) {
      const value = blendshapeMap.get(shapeName) ?? 0;
      if (value < 0.05) continue;

      for (const [emotion, weight] of Object.entries(weights)) {
        scores[emotion as EmotionType] += value * (weight as number);
      }
    }

    const normalized = normalizeScores(scores);

    let dominant: EmotionType = 'neutral';
    let maxScore = 0;
    for (const emotion of EMOTION_LIST) {
      if (normalized[emotion] > maxScore) {
        maxScore = normalized[emotion];
        dominant = emotion;
      }
    }

    if (maxScore < 0.15) {
      dominant = 'neutral';
      normalized.neutral = Math.max(normalized.neutral, 0.5);
      const reNormalized = normalizeScores(normalized);
      return {
        emotions: reNormalized,
        dominant: 'neutral',
        confidence: reNormalized.neutral,
        timestamp: Date.now(),
      };
    }

    return {
      emotions: normalized,
      dominant,
      confidence: maxScore,
      timestamp: Date.now(),
    };
  }
}

export const emotionService = new EmotionService();
