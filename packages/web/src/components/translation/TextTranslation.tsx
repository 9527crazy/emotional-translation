import { useState, useEffect } from 'react';
import { useEmotionStore } from '../../stores/emotion.store';
import { translationService } from '../../services/translation.service';
import { EMOTION_COLORS, percent } from '@emotional-translation/shared';

export default function TextTranslation() {
  const smoothed = useEmotionStore((s) => s.smoothed);
  const [text, setText] = useState('等待检测...');

  useEffect(() => {
    if (!smoothed) return;
    // Regenerate text when dominant emotion changes significantly
    const newText = translationService.toText(smoothed);
    setText(newText);
  }, [smoothed?.dominant, smoothed?.confidence]);

  if (!smoothed) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        等待检测...
      </div>
    );
  }

  const color = EMOTION_COLORS[smoothed.dominant];

  return (
    <div
      className="w-full h-full rounded-2xl flex flex-col items-center justify-center emotion-transition p-6"
      style={{ backgroundColor: `${color.primary}10` }}
    >
      <div className="text-4xl mb-4">{translationService.toEmoji(smoothed).primary}</div>
      <p className="text-xl font-medium text-center leading-relaxed mb-4" style={{ color: color.secondary }}>
        "{text}"
      </p>
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span>{translationService.toLabel(smoothed)}</span>
        <span>·</span>
        <span>{percent(smoothed.emotions[smoothed.dominant])}%</span>
      </div>
    </div>
  );
}
