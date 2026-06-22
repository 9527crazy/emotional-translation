import type { EmotionResult, EmotionType } from '@emotional-translation/shared';
import { EMOTION_LIST, EMOTION_LABELS, EMOTION_COLORS, percent } from '@emotional-translation/shared';

interface DailySummaryProps {
  data: EmotionResult[];
}

export default function DailySummary({ data }: DailySummaryProps) {
  if (data.length === 0) return null;

  const avgScores = EMOTION_LIST.reduce(
    (acc: Record<string, number>, e: EmotionType) => {
      acc[e] = data.reduce((sum: number, r: EmotionResult) => sum + r.emotions[e], 0) / data.length;
      return acc;
    },
    {} as Record<string, number>,
  );

  const sorted = [...EMOTION_LIST].sort((a: EmotionType, b: EmotionType) => avgScores[b] - avgScores[a]);
  const dominant = sorted[0];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <span className="text-3xl">{EMOTION_LABELS[dominant].emoji}</span>
        <div>
          <div className="font-medium" style={{ color: EMOTION_COLORS[dominant].primary }}>
            今日主要情绪：{EMOTION_LABELS[dominant].zh}
          </div>
          <div className="text-xs text-gray-500">共 {data.length} 条记录</div>
        </div>
      </div>
      <div className="flex gap-2 flex-wrap">
        {sorted.slice(0, 3).map((e: EmotionType) => (
          <div
            key={e}
            className="flex items-center gap-1.5 px-2 py-1 rounded-full text-xs"
            style={{ backgroundColor: `${EMOTION_COLORS[e].primary}20`, color: EMOTION_COLORS[e].secondary }}
          >
            {EMOTION_LABELS[e].emoji} {EMOTION_LABELS[e].zh} {percent(avgScores[e])}%
          </div>
        ))}
      </div>
    </div>
  );
}
