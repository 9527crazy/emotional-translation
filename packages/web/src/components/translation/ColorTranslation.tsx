import { useEmotionStore } from '../../stores/emotion.store';
import { translationService } from '../../services/translation.service';
import { EMOTION_LABELS, percent } from '@emotional-translation/shared';

export default function ColorTranslation() {
  const smoothed = useEmotionStore((s) => s.smoothed);

  if (!smoothed) {
    return <div className="w-full h-full bg-gray-100 dark:bg-gray-800 rounded-2xl" />;
  }

  const color = translationService.toColor(smoothed);
  const label = EMOTION_LABELS[smoothed.dominant];

  return (
    <div
      className="w-full h-full rounded-2xl flex flex-col items-center justify-center emotion-transition overflow-hidden relative"
      style={{ background: color.gradient }}
    >
      {/* Overlay text */}
      <div className="text-center text-white drop-shadow-lg z-10 px-4">
        <div className="text-5xl mb-4 animate-pulse-slow">{label.emoji}</div>
        <div className="text-2xl font-bold mb-2">{label.zh}</div>
        <div className="text-lg opacity-80">{percent(smoothed.emotions[smoothed.dominant])}%</div>
      </div>

      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.3),transparent_70%)]" />
    </div>
  );
}
