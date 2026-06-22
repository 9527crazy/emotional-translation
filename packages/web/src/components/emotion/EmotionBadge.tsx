import { EMOTION_LABELS, EMOTION_COLORS, percent } from '@emotional-translation/shared';
import type { EmotionType } from '@emotional-translation/shared';

interface EmotionBadgeProps {
  emotion: EmotionType;
  score: number;
  isPrimary?: boolean;
}

export default function EmotionBadge({ emotion, score, isPrimary = false }: EmotionBadgeProps) {
  const label = EMOTION_LABELS[emotion];
  const color = EMOTION_COLORS[emotion];
  const pct = percent(score);

  if (isPrimary) {
    return (
      <div className="flex flex-col items-center gap-2">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-3xl animate-pulse-slow"
          style={{ backgroundColor: `${color.primary}20` }}
        >
          {label.emoji}
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold" style={{ color: color.primary }}>
            {label.zh}
          </div>
          <div className="text-sm font-mono text-gray-500">{pct}%</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 w-full">
      <span className="text-sm w-6 text-center">{label.emoji}</span>
      <span className="text-xs text-gray-500 w-8">{label.zh}</span>
      <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300 ease-out"
          style={{
            width: `${Math.max(pct, 2)}%`,
            backgroundColor: color.primary,
          }}
        />
      </div>
      <span className="text-xs font-mono text-gray-400 w-8 text-right">{pct}%</span>
    </div>
  );
}
