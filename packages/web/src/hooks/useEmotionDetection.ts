import { useCallback } from 'react';
import { emotionPipeline } from '../services/emotion-pipeline';

export function useEmotionDetection() {
  const startDetection = useCallback(async (videoElement: HTMLVideoElement) => {
    await emotionPipeline.start(videoElement);
  }, []);

  const stopDetection = useCallback(() => {
    emotionPipeline.stop();
  }, []);

  const pauseDetection = useCallback(() => {
    emotionPipeline.pause();
  }, []);

  return { startDetection, stopDetection, pauseDetection };
}
