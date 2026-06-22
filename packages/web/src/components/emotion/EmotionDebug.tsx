import { useState } from 'react';
import { useEmotionStore } from '../../stores/emotion.store';

/**
 * Debug panel: shows raw blendshape values and emotion scores.
 * Toggle with the ⚙ button in the header.
 */
export default function EmotionDebug() {
  const current = useEmotionStore((s) => s.current);
  const smoothed = useEmotionStore((s) => s.smoothed);
  const [expanded, setExpanded] = useState(false);

  if (!current) return null;

  const sortedEmotions = Object.entries(current.emotions)
    .sort(([, a], [, b]) => b - a);

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-xs">
      <button
        onClick={() => setExpanded(!expanded)}
        className="mb-2 px-2 py-1 text-xs bg-gray-800 text-green-400 rounded font-mono"
      >
        {expanded ? '隐藏调试' : '显示调试'} ⚙
      </button>
      {expanded && (
        <div className="bg-gray-900 text-green-400 p-3 rounded-xl text-xs font-mono space-y-2 max-h-80 overflow-y-auto shadow-xl border border-gray-700">
          <div className="text-yellow-400 font-bold">Emotion Scores (raw)</div>
          {sortedEmotions.map(([emotion, score]) => (
            <div key={emotion} className="flex justify-between gap-2">
              <span>{emotion}</span>
              <div className="flex-1 bg-gray-800 rounded-full h-2 mt-1">
                <div
                  className="h-full rounded-full bg-green-500"
                  style={{ width: `${Math.min(score * 100, 100)}%` }}
                />
              </div>
              <span className="w-14 text-right">{(score * 100).toFixed(1)}%</span>
            </div>
          ))}
          <div className="text-yellow-400 font-bold mt-2">Result</div>
          <div>dominant: {current.dominant}</div>
          <div>confidence: {(current.confidence * 100).toFixed(1)}%</div>
          {smoothed && (
            <>
              <div className="text-yellow-400 font-bold mt-2">Smoothed</div>
              <div>dominant: {smoothed.dominant}</div>
              <div>confidence: {(smoothed.confidence * 100).toFixed(1)}%</div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
