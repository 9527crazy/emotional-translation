import { useEmotionStore } from '../../stores/emotion.store';
import { EMOTION_LIST } from '@emotional-translation/shared';
import EmotionBadge from './EmotionBadge';

export default function EmotionDashboard() {
  const smoothed = useEmotionStore((s) => s.smoothed);
  const isDetecting = useEmotionStore((s) => s.isDetecting);

  if (!isDetecting || !smoothed) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm">
        等待检测...
      </div>
    );
  }

  const sortedEmotions = [...EMOTION_LIST].sort(
    (a, b) => smoothed.emotions[b] - smoothed.emotions[a],
  );

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Primary emotion */}
      <div className="flex justify-center">
        <EmotionBadge
          emotion={smoothed.dominant}
          score={smoothed.emotions[smoothed.dominant]}
          isPrimary
        />
      </div>

      {/* All emotions */}
      <div className="flex flex-col gap-2">
        {sortedEmotions.map((emotion) => (
          <EmotionBadge
            key={emotion}
            emotion={emotion}
            score={smoothed.emotions[emotion]}
          />
        ))}
      </div>
    </div>
  );
}
