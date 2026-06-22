import { useEffect, useRef } from 'react';
import { useEmotionStore } from '../../stores/emotion.store';
import { EMOTION_COLORS } from '@emotional-translation/shared';

interface FaceOverlayProps {
  width: number;
  height: number;
}

export default function FaceOverlay({ width, height }: FaceOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const smoothed = useEmotionStore((s) => s.smoothed);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !smoothed) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    // Draw a subtle color ring around the face area
    const color = EMOTION_COLORS[smoothed.dominant];
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.35;

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = color.primary;
    ctx.lineWidth = 3;
    ctx.globalAlpha = 0.4 + smoothed.confidence * 0.4;
    ctx.stroke();
    ctx.globalAlpha = 1;
  }, [smoothed, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="absolute inset-0 w-full h-full pointer-events-none camera-mirror"
    />
  );
}
