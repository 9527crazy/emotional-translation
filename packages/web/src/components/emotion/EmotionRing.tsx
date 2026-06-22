import { useEmotionStore } from '../../stores/emotion.store';
import { EMOTION_LIST, EMOTION_LABELS, EMOTION_COLORS, percent } from '@emotional-translation/shared';
import type { EmotionType } from '@emotional-translation/shared';

interface Segment {
  emotion: EmotionType;
  pct: number;
  color: string;
}

export default function EmotionRing({ size = 160 }: { size?: number }) {
  const smoothed = useEmotionStore((s) => s.smoothed);
  if (!smoothed) return null;

  const r = size / 2 - 8;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;

  const segments: Segment[] = EMOTION_LIST
    .map((e: EmotionType) => ({ emotion: e, pct: smoothed.emotions[e], color: EMOTION_COLORS[e].primary }))
    .filter((s: Segment) => s.pct > 0.005)
    .sort((a: Segment, b: Segment) => b.pct - a.pct);

  let offset = 0;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {segments.map((seg: Segment) => {
          const dashLength = seg.pct * circumference;
          const el = (
            <circle
              key={seg.emotion}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={seg.color}
              strokeWidth={12}
              strokeDasharray={`${dashLength} ${circumference - dashLength}`}
              strokeDashoffset={-offset}
              strokeLinecap="round"
              className="transition-all duration-300 ease-out"
            />
          );
          offset += dashLength;
          return el;
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl">{EMOTION_LABELS[smoothed.dominant].emoji}</span>
        <span className="text-xs font-medium mt-1" style={{ color: EMOTION_COLORS[smoothed.dominant].primary }}>
          {percent(smoothed.emotions[smoothed.dominant])}%
        </span>
      </div>
    </div>
  );
}
