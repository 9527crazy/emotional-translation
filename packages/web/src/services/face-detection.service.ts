import type { FaceDetectionResult, Blendshape } from '@emotional-translation/shared';

let FaceLandmarker: any = null;
let FilesetResolver: any = null;
let faceLandmarker: any = null;

const WASM_URL = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.18/wasm';
const MODEL_URL = 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task';

export class FaceDetectionService {
  private initialized = false;

  async init(): Promise<void> {
    if (this.initialized) return;

    try {
      const vision = await import('@mediapipe/tasks-vision');
      FaceLandmarker = vision.FaceLandmarker;
      FilesetResolver = vision.FilesetResolver;

      const filesetResolver = await FilesetResolver.forVisionTasks(WASM_URL);

      faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
        baseOptions: {
          modelAssetPath: MODEL_URL,
          delegate: 'GPU',
        },
        outputFaceBlendshapes: true,
        runningMode: 'VIDEO',
        numFaces: 1,
      });

      this.initialized = true;
      console.log('[FaceDetection] Initialized successfully');
    } catch (err) {
      console.error('[FaceDetection] Init failed:', err);
      throw err;
    }
  }

  detect(video: HTMLVideoElement, timestamp: number): FaceDetectionResult | null {
    if (!faceLandmarker || !this.initialized) return null;
    if (video.readyState < 2) return null;

    try {
      const results = faceLandmarker.detectForVideo(video, timestamp);

      if (!results.faceLandmarks || results.faceLandmarks.length === 0) {
        return null;
      }

      const landmarks = results.faceLandmarks[0];
      const blendshapes: Blendshape[] = results.faceBlendshapes?.[0]?.categories?.map(
        (cat: any) => ({
          categoryName: cat.categoryName,
          score: cat.score,
        }),
      ) ?? [];

      // Calculate bounding box from landmarks
      let xMin = Infinity, yMin = Infinity, xMax = -Infinity, yMax = -Infinity;
      for (const lm of landmarks) {
        if (lm.x < xMin) xMin = lm.x;
        if (lm.y < yMin) yMin = lm.y;
        if (lm.x > xMax) xMax = lm.x;
        if (lm.y > yMax) yMax = lm.y;
      }

      return {
        faceIndex: 0,
        landmarks: landmarks.map((lm: any) => ({ x: lm.x, y: lm.y, z: lm.z })),
        blendshapes,
        boundingBox: {
          xMin: xMin * video.videoWidth,
          yMin: yMin * video.videoHeight,
          width: (xMax - xMin) * video.videoWidth,
          height: (yMax - yMin) * video.videoHeight,
        },
        confidence: 0.9,
      };
    } catch {
      return null;
    }
  }

  dispose(): void {
    if (faceLandmarker) {
      faceLandmarker.close();
      faceLandmarker = null;
    }
    this.initialized = false;
  }

  isReady(): boolean {
    return this.initialized;
  }
}

export const faceDetectionService = new FaceDetectionService();
