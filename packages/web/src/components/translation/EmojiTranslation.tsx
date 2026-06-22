import { useEffect, useRef, useCallback } from 'react';
import { useEmotionStore } from '../../stores/emotion.store';
import { translationService } from '../../services/translation.service';
import { EMOTION_COLORS, percent } from '@emotional-translation/shared';

interface FloatingEmoji {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  emoji: string;
  life: number;
  maxLife: number;
}

export default function EmojiTranslation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const emojisRef = useRef<FloatingEmoji[]>([]);
  const smoothed = useEmotionStore((s) => s.smoothed);
  const frameRef = useRef<number>(0);
  const spawnTimerRef = useRef<number>(0);

  const spawnEmoji = useCallback((canvas: HTMLCanvasElement, primary: string, secondary: string[]) => {
    const allEmojis = [primary, ...secondary];
    const emoji = allEmojis[Math.floor(Math.random() * allEmojis.length)];
    const maxLife = 120 + Math.random() * 120;

    emojisRef.current.push({
      x: Math.random() * canvas.width,
      y: canvas.height + 20,
      vx: (Math.random() - 0.5) * 1.5,
      vy: -(1 + Math.random() * 2),
      size: 24 + Math.random() * 24,
      opacity: 1,
      emoji,
      life: 0,
      maxLife,
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        canvas.width = rect.width;
        canvas.height = rect.height;
      }
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!smoothed) return;

      const emojiData = translationService.toEmoji(smoothed);
      const intensity = smoothed.emotions[smoothed.dominant];

      // Spawn based on intensity
      spawnTimerRef.current++;
      const spawnRate = Math.max(5, 30 - intensity * 25);
      if (spawnTimerRef.current >= spawnRate) {
        spawnTimerRef.current = 0;
        spawnEmoji(canvas, emojiData.primary, emojiData.secondary);
      }

      // Update and draw
      emojisRef.current = emojisRef.current.filter((e) => {
        e.life++;
        e.x += e.vx;
        e.y += e.vy;
        e.opacity = Math.max(0, 1 - e.life / e.maxLife);

        ctx.save();
        ctx.globalAlpha = e.opacity;
        ctx.font = `${e.size}px serif`;
        ctx.textAlign = 'center';
        ctx.fillText(e.emoji, e.x, e.y);
        ctx.restore();

        return e.life < e.maxLife;
      });
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [smoothed, spawnEmoji]);

  const color = smoothed ? EMOTION_COLORS[smoothed.dominant] : EMOTION_COLORS.neutral;

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden" style={{ backgroundColor: `${color.primary}15` }}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      {smoothed && (
        <div className="absolute bottom-4 left-4 right-4 text-center">
          <span className="text-sm font-medium px-3 py-1.5 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            {translationService.toEmoji(smoothed).primary} {translationService.toLabel(smoothed)} {percent(smoothed.emotions[smoothed.dominant])}%
          </span>
        </div>
      )}
    </div>
  );
}
