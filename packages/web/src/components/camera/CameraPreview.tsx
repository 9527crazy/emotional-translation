import { forwardRef } from 'react';

interface CameraPreviewProps {
  className?: string;
}

const CameraPreview = forwardRef<HTMLVideoElement, CameraPreviewProps>(
  ({ className }, ref) => (
    <video
      ref={ref}
      className={`camera-mirror w-full h-full object-cover rounded-2xl ${className ?? ''}`}
      autoPlay
      playsInline
      muted
    />
  ),
);

CameraPreview.displayName = 'CameraPreview';
export default CameraPreview;
