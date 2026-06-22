export type CameraState = 'idle' | 'requesting' | 'streaming' | 'error' | 'paused';

export type CameraErrorType = 'PermissionDenied' | 'NotFound' | 'NotReadable' | 'Overconstrained' | 'Unknown';

export interface CameraError {
  type: CameraErrorType;
  message: string;
}

export interface FaceLandmark {
  x: number;
  y: number;
  z: number;
}

export interface Blendshape {
  categoryName: string;
  score: number;
}

export interface BoundingBox {
  xMin: number;
  yMin: number;
  width: number;
  height: number;
}

export interface FaceDetectionResult {
  faceIndex: number;
  landmarks: FaceLandmark[];
  blendshapes: Blendshape[];
  boundingBox: BoundingBox;
  confidence: number;
}
