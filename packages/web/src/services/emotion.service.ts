import type {
  EmotionResult,
  EmotionScores,
  EmotionType,
  FaceDetectionResult,
} from '@emotional-translation/shared';
import { EMOTION_LIST } from '@emotional-translation/shared';
import { normalizeScores } from '@emotional-translation/shared';

/**
 * Blendshape → Emotion mapping weights.
 * MediaPipe outputs 52 blendshapes in range 0~1.
 * Weights tuned for sensitivity to subtle expressions.
 */
const BLENDSHAPE_WEIGHTS: Record<string, Partial<EmotionScores>> = {
  // ── Mouth ──
  'mouthSmileLeft':    { happy: 0.9 },
  'mouthSmileRight':   { happy: 0.9 },
  'mouthFrownLeft':    { sad: 0.6 },
  'mouthFrownRight':   { sad: 0.6 },
  'mouthOpen':         { surprised: 0.4, fearful: 0.2 },
  'mouthPucker':       { disgusted: 0.4 },
  'mouthDimpleLeft':   { happy: 0.3 },
  'mouthDimpleRight':  { happy: 0.3 },
  'mouthPressLeft':    { angry: 0.3 },
  'mouthPressRight':   { angry: 0.3 },
  'mouthShrugLower':   { disgusted: 0.4 },
  'mouthFunnel':       { surprised: 0.3 },
  'mouthRollLower':    { angry: 0.1, disgusted: 0.1 },
  'mouthRollUpper':    { angry: 0.1, disgusted: 0.1 },
  'mouthStretchLeft':  { fearful: 0.2, surprised: 0.1 },
  'mouthStretchRight': { fearful: 0.2, surprised: 0.1 },
  // ── Brows ──
  'browInnerUp':       { surprised: 0.5, fearful: 0.3 },
  'browDownLeft':      { angry: 0.5, fearful: 0.2 },
  'browDownRight':     { angry: 0.5, fearful: 0.2 },
  'browOuterUpLeft':   { surprised: 0.2, sad: 0.15 },
  'browOuterUpRight':  { surprised: 0.2, sad: 0.15 },
  // ── Eyes ──
  'eyeWideLeft':       { surprised: 0.4, fearful: 0.3 },
  'eyeWideRight':      { surprised: 0.4, fearful: 0.3 },
  'eyeSquintLeft':     { happy: 0.3, angry: 0.15 },
  'eyeSquintRight':    { happy: 0.3, angry: 0.15 },
  'eyeBlinkLeft':      { neutral: 0.05 },
  'eyeBlinkRight':     { neutral: 0.05 },
  // ── Nose ──
  'noseSneerLeft':     { disgusted: 0.5, angry: 0.15 },
  'noseSneerRight':    { disgusted: 0.5, angry: 0.15 },
  // ── Jaw ──
  'jawForward':        { angry: 0.3 },
  'jawLeft':           { disgusted: 0.15 },
  'jawRight':          { disgusted: 0.15 },
  'jawOpen':           { surprised: 0.3, fearful: 0.2 },
  // ── Cheek ──
  'cheekPuff':         { angry: 0.2, disgusted: 0.1 },
  'cheekSquintLeft':   { happy: 0.2 },
  'cheekSquintRight':  { happy: 0.2 },
  // ── Tongue ──
  'tongueOut':         { disgusted: 0.3, surprised: 0.1 },
};

const NOISE_THRESHOLD = 0.02;
const NEUTRAL_THRESHOLD = 0.08;

export class EmotionService {
  classify(faceResult: FaceDetectionResult): EmotionResult {
    const scores: EmotionScores = {
      happy: 0, sad: 0, angry: 0, surprised: 0,
      fearful: 0, disgusted: 0, neutral: 0,
    };

    const blendshapeMap = new Map<string, number>();
    for (const bs of faceResult.blendshapes) {
      blendshapeMap.set(bs.categoryName, bs.score);
    }

    for (const [shapeName, weights] of Object.entries(BLENDSHAPE_WEIGHTS)) {
      const value = blendshapeMap.get(shapeName) ?? 0;
      if (value < NOISE_THRESHOLD) continue;
      for (const [emotion, weight] of Object.entries(weights)) {
        scores[emotion as EmotionType] += value * (weight as number);
      }
    }

    // Find max non-neutral score
    let maxRaw = 0;
    for (const emotion of EMOTION_LIST) {
      if (emotion === 'neutral') continue;
      if (scores[emotion] > maxRaw) {
        maxRaw = scores[emotion];
      }
    }

    // If no emotion is strong enough → neutral
    if (maxRaw < NEUTRAL_THRESHOLD) {
      scores.neutral = 1;
      const normalized = normalizeScores(scores);
      return {
        emotions: normalized,
        dominant: 'neutral',
        confidence: normalized.neutral,
        timestamp: Date.now(),
      };
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

    return { emotions: normalized, dominant, confidence: maxScore, timestamp: Date.now() };
  }
}

export const emotionService = new EmotionService();
