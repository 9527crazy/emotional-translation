import type { CameraError, CameraErrorType } from '@emotional-translation/shared';

export class CameraService {
  private stream: MediaStream | null = null;
  private videoElement: HTMLVideoElement | null = null;

  async start(
    videoElement: HTMLVideoElement,
    constraints?: MediaStreamConstraints,
  ): Promise<void> {
    this.videoElement = videoElement;

    const defaultConstraints: MediaStreamConstraints = {
      video: {
        width: { ideal: 640 },
        height: { ideal: 480 },
        facingMode: 'user',
      },
      audio: false,
    };

    try {
      this.stream = await navigator.mediaDevices.getUserMedia(
        constraints ?? defaultConstraints,
      );
      videoElement.srcObject = this.stream;
      await videoElement.play();
    } catch (err) {
      throw this.handleError(err);
    }
  }

  stop(): void {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
    if (this.videoElement) {
      this.videoElement.srcObject = null;
      this.videoElement = null;
    }
  }

  captureFrame(): ImageData | null {
    if (!this.videoElement || this.videoElement.readyState < 2) return null;

    const canvas = document.createElement('canvas');
    canvas.width = this.videoElement.videoWidth;
    canvas.height = this.videoElement.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.drawImage(this.videoElement, 0, 0);
    return ctx.getImageData(0, 0, canvas.width, canvas.height);
  }

  private handleError(err: unknown): CameraError {
    const name = err instanceof DOMException ? err.name : 'Unknown';
    const typeMap: Record<string, CameraErrorType> = {
      NotAllowedError: 'PermissionDenied',
      NotFoundError: 'NotFound',
      NotReadableError: 'NotReadable',
      OverconstrainedError: 'Overconstrained',
    };
    return {
      type: typeMap[name] ?? 'Unknown',
      message: err instanceof Error ? err.message : 'Unknown camera error',
    };
  }
}

export const cameraService = new CameraService();
