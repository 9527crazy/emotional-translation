import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import EmotionChart from '../components/timeline/EmotionChart';
import DailySummary from '../components/timeline/DailySummary';
import { storageService } from '../services/storage.service';
import { ArrowLeft, Trash2 } from 'lucide-react';
import type { EmotionResult, EmotionScores } from '@emotional-translation/shared';

export default function TimelinePage() {
  const navigate = useNavigate();
  const [records, setRecords] = useState<EmotionResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    setLoading(true);
    try {
      const todayRecords = await storageService.getTodayRecords();
      setRecords(
        todayRecords.map((r) => ({
          emotions: r.emotions as EmotionScores,
          dominant: r.dominant as EmotionResult['dominant'],
          confidence: r.confidence,
          timestamp: r.timestamp,
        })),
      );
    } catch (err) {
      console.error('Failed to load records:', err);
    }
    setLoading(false);
  };

  const handleClear = async () => {
    if (confirm('确定要清除所有情绪记录吗？')) {
      await storageService.clearAll();
      setRecords([]);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center justify-between px-4 h-14 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate('/detect')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <span className="text-lg font-semibold">情绪时间线</span>
        </div>
        <Button variant="ghost" size="sm" onClick={handleClear}>
          <Trash2 className="w-4 h-4" />
        </Button>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-12 text-gray-400">加载中...</div>
        ) : records.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400 gap-2">
            <span className="text-4xl">📊</span>
            <span>还没有情绪记录</span>
            <Button variant="secondary" size="sm" onClick={() => navigate('/detect')}>
              开始检测
            </Button>
          </div>
        ) : (
          <>
            <Card>
              <DailySummary data={records} />
            </Card>
            <Card>
              <h3 className="text-sm font-medium mb-2 text-gray-600 dark:text-gray-300">
                情绪变化曲线
              </h3>
              <EmotionChart data={records} height={250} />
            </Card>
            <Card>
              <h3 className="text-sm font-medium mb-2 text-gray-600 dark:text-gray-300">
                记录详情 ({records.length} 条)
              </h3>
              <div className="space-y-1.5 max-h-60 overflow-y-auto">
                {records.slice(-20).reverse().map((r, i) => {
                  const time = new Date(r.timestamp);
                  return (
                    <div key={i} className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="font-mono w-16">
                        {time.getHours().toString().padStart(2, '0')}:
                        {time.getMinutes().toString().padStart(2, '0')}:
                        {time.getSeconds().toString().padStart(2, '0')}
                      </span>
                      <span className="flex-1">{r.dominant}</span>
                      <span className="font-mono w-10 text-right">
                        {Math.round(r.confidence * 100)}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
