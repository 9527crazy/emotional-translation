import ReactECharts from 'echarts-for-react';
import type { EmotionResult } from '@emotional-translation/shared';
import { EMOTION_LIST, EMOTION_LABELS, EMOTION_COLORS } from '@emotional-translation/shared';

interface EmotionChartProps {
  data: EmotionResult[];
  height?: number;
}

export default function EmotionChart({ data, height = 300 }: EmotionChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center text-gray-400" style={{ height }}>
        暂无数据
      </div>
    );
  }

  // Show top 3 emotions
  const topEmotions = (() => {
    const totals: Record<string, number> = {};
    for (const e of EMOTION_LIST) totals[e] = 0;
    for (const r of data) {
      for (const e of EMOTION_LIST) totals[e] += r.emotions[e];
    }
    return [...EMOTION_LIST].sort((a, b) => totals[b] - totals[a]).slice(0, 3);
  })();

  const times = data.map((r) => {
    const d = new Date(r.timestamp);
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;
  });

  const option = {
    tooltip: {
      trigger: 'axis' as const,
      formatter: (params: any[]) => {
        let html = `<strong>${params[0].axisValue}</strong><br/>`;
        for (const p of params) {
          html += `${p.marker} ${p.seriesName}: ${Math.round(p.value * 100)}%<br/>`;
        }
        return html;
      },
    },
    legend: {
      data: topEmotions.map((e) => EMOTION_LABELS[e].zh),
      bottom: 0,
      textStyle: { fontSize: 11 },
    },
    grid: { left: 40, right: 16, top: 10, bottom: 40 },
    xAxis: {
      type: 'category' as const,
      data: times,
      axisLabel: { fontSize: 10, interval: 'auto' },
    },
    yAxis: {
      type: 'value' as const,
      max: 1,
      axisLabel: { formatter: (v: number) => `${Math.round(v * 100)}%`, fontSize: 10 },
      splitLine: { lineStyle: { color: '#f0f0f0' } },
    },
    series: topEmotions.map((emotion) => ({
      name: EMOTION_LABELS[emotion].zh,
      type: 'line',
      smooth: true,
      data: data.map((r) => r.emotions[emotion]),
      lineStyle: { width: 2, color: EMOTION_COLORS[emotion].primary },
      itemStyle: { color: EMOTION_COLORS[emotion].primary },
      areaStyle: { color: `${EMOTION_COLORS[emotion].primary}15` },
      symbol: 'none',
    })),
    animationDuration: 300,
  };

  return <ReactECharts option={option} style={{ width: '100%', height }} />;
}
