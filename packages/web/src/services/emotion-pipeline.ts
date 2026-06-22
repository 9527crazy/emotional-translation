import type { EmotionResult, EmotionScores } from '@emotional-translation/shared';
import { exponentialMovingAverage } from '@emotional-translation/shared';
import { cameraService } from './camera.service';
import { faceDetectionService } from './face-detection.service';
import { emotionService } from './emotion.service';
import { storageService } from './storage.service';
import { useEmotionStore } from '../stores/emotion.store';
import { useCameraStore } from '../stores/camera.store';

export class EmotionPipeline {
  private rafId: number | null = null;
  private lastInferenceTime = 0;
  private inferenceInterval = 66; // ~15 FPS inference
  private lastSaveTime = 0;
  private saveInterval = 2000; // Save to DB every 2s
  private previousScores: EmotionScores | null = null;

  async start(videoElement: HTMLVideoElement): Promise<void> {
    // Init face detection
    await faceDetectionService.init();

    // Start camera
    await cameraService.start(videoElement);
    useCameraStore.getState().setState('streaming');
    useEmotionStore.getState().setDetecting(true);

    // Start detection loop
    this.loop(performance.now());
  }

  private loop = (timestamp: number): void => {
    this.rafId = requestAnimationFrame(this.loop);

    // Throttle inference
    if (timestamp - this.lastInferenceTime < this.inferenceInterval) return;
    this.lastInferenceTime = timestamp;

    const video = document.querySelector('video') as HTMLVideoElement;
    if (!video || video.readyState < 2) return;

    // Detect face
    const faceResult = faceDetectionService.detect(video, timestamp);
    if (!faceResult) return;

    // Classify emotion
    const rawResult = emotionService.classify(faceResult);

    // Smooth
    const smoothedScores = exponentialMovingAverage(
      rawResult.emotions,
      this.previousScores,
      0.3,
    );
    this.previousScores = smoothedScores;

    const smoothedResult: EmotionResult = {
      ...rawResult,
      emotions: smoothedScores,
    };

    // Update store
    const store = useEmotionStore.getState();
    store.updateEmotion(rawResult);
    store.setSmoothed(smoothedResult);

    // Save to DB (throttled)
    const now = Date.now();
    if (now - this.lastSaveTime > this.saveInterval) {
      this.lastSaveTime = now;
      storageService.saveRecord(smoothedResult).catch(console.error);
    }
  };

  stop(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    cameraService.stop();
    faceDetectionService.dispose();
    useCameraStore.getState().setState('idle');
    useEmotionStore.getState().setDetecting(false);
    this.previousScores = null;
  }

  pause(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    useCameraStore.getState().setState('paused');
    useEmotionStore.getState().setDetecting(false);
  }
}

export const emotionPipeline = new EmotionPipeline();
