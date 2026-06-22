import ReactECharts from 'echarts-for-react';
import { useEmotionStore } from '../../stores/emotion.store';
import { EMOTION_LIST, EMOTION_LABELS, EMOTION_COLORS, percent } from '@emotional-translation/shared';

export default function DataTranslation() {
  const smoothed = useEmotionStore((s) => s.smoothed);

  if (!smoothed) {
    return <div className="flex items-center justify-center h-full text-gray-400">等待检测...</div>;
  }

  const sortedEmotions = [...EMOTION_LIST].sort(
    (a, b) => smoothed.emotions[b] - smoothed.emotions[a],
  );

  const option = {
    tooltip: {
      trigger: 'axis' as const,
      axisPointer: { type: 'shadow' as const },
      formatter: (params: any[]) => {
        const item = params[0];
        return `${item.name}: ${percent(item.value)}%`;
      },
    },
    grid: { left: 50, right: 20, top: 10, bottom: 30 },
    xAxis: {
      type: 'value' as const,
      max: 1,
      axisLabel: { formatter: (v: number) => `${percent(v)}%`, fontSize: 11 },
      splitLine: { lineStyle: { color: '#f0f0f0' } },
    },
    yAxis: {
      type: 'category' as const,
      data: sortedEmotions.map((e) => EMOTION_LABELS[e].zh),
      axisLabel: { fontSize: 12 },
    },
    series: [
      {
        type: 'bar',
        data: sortedEmotions.map((e) => ({
          value: smoothed.emotions[e],
          itemStyle: { color: EMOTION_COLORS[e].primary, borderRadius: [0, 4, 4, 0] },
        })),
        barWidth: 16,
        label: {
          show: true,
          position: 'right' as const,
          formatter: (params: any) => `${percent(params.value)}%`,
          fontSize: 11,
        },
        animationDuration: 300,
        animationEasing: 'cubicOut' as const,
      },
    ],
  };

  return (
    <div className="w-full h-full rounded-2xl bg-white dark:bg-gray-800 p-2">
      <ReactECharts
        option={option}
        style={{ width: '100%', height: '100%' }}
        opts={{ renderer: 'svg' }}
      />
    </div>
  );
}
