import { useRef, useCallback, useState } from 'react';
import { cameraService } from '../services/camera.service';
import { useCameraStore } from '../stores/camera.store';
import type { CameraError } from '@emotional-translation/shared';

export function useCamera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<CameraError | null>(null);
  const { setState } = useCameraStore();

  const start = useCallback(async () => {
    if (!videoRef.current) return;
    try {
      setState('requesting');
      setError(null);
      await cameraService.start(videoRef.current);
      setState('streaming');
    } catch (err) {
      const cameraError = err as CameraError;
      setError(cameraError);
      setState('error');
    }
  }, [setState]);

  const stop = useCallback(() => {
    cameraService.stop();
    setState('idle');
  }, [setState]);

  return { videoRef, start, stop, error };
}
