import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CameraPreview from '../components/camera/CameraPreview';
import CameraPermission from '../components/camera/CameraPermission';
import FaceOverlay from '../components/camera/FaceOverlay';
import EmotionDashboard from '../components/emotion/EmotionDashboard';
import EmotionRing from '../components/emotion/EmotionRing';
import TranslationPanel from '../components/translation/TranslationPanel';
import Button from '../components/common/Button';
import { useCamera } from '../hooks/useCamera';
import { useEmotionDetection } from '../hooks/useEmotionDetection';
import { useCameraStore } from '../stores/camera.store';
import { useEmotionStore } from '../stores/emotion.store';
import {
  Play,
  Pause,
  Settings,
  Clock,
  Camera,
  Download,
  Hand,
} from 'lucide-react';
import { EMOTION_LABELS, EMOTION_COLORS, percent } from '@emotional-translation/shared';
import { translationService } from '../services/translation.service';

export default function DetectionPage() {
  const navigate = useNavigate();
  const { videoRef, start, stop, error } = useCamera();
  const { startDetection, stopDetection, pauseDetection } = useEmotionDetection();
  const cameraState = useCameraStore((s) => s.state);
  const smoothed = useEmotionStore((s) => s.smoothed);
  const isDetecting = useEmotionStore((s) => s.isDetecting);
  const [manualMode, setManualMode] = useState(false);

  const handleStart = useCallback(async () => {
    try {
      await start();
      // Wait for video to be ready
      const video = videoRef.current;
      if (video) {
        video.onloadeddata = async () => {
          await startDetection(video);
        };
      }
    } catch {
      // Error handled in useCamera
    }
  }, [start, startDetection, videoRef]);

  const handleStop = useCallback(() => {
    stopDetection();
    stop();
  }, [stopDetection, stop]);

  const handlePause = useCallback(() => {
    pauseDetection();
  }, [pauseDetection]);

  const handleManualSelect = useCallback(() => {
    setManualMode(true);
  }, []);

  const handleManualEmotion = useCallback((emotion: string) => {
    // Manually set emotion for demo
    const now = Date.now();
    const scores = {
      happy: 0, sad: 0, angry: 0, surprised: 0,
      fearful: 0, disgusted: 0, neutral: 0,
    };
    (scores as any)[emotion] = 0.8;
    scores.neutral = 0.2;

    useEmotionStore.getState().updateEmotion({
      emotions: scores,
      dominant: emotion as any,
      confidence: 0.8,
      timestamp: now,
    });
    useEmotionStore.getState().setSmoothed({
      emotions: scores,
      dominant: emotion as any,
      confidence: 0.8,
      timestamp: now,
    });
    useEmotionStore.getState().setDetecting(true);
    setManualMode(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      handleStop();
    };
  }, []);

  const handleScreenshot = useCallback(() => {
    if (!smoothed) return;
    // Create a simple card canvas
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 560;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const color = EMOTION_COLORS[smoothed.dominant];
    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, 400, 560);
    grad.addColorStop(0, color.primary);
    grad.addColorStop(1, color.secondary);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 400, 560);

    // Emoji
    ctx.font = '80px serif';
    ctx.textAlign = 'center';
    ctx.fillText(EMOTION_LABELS[smoothed.dominant].emoji, 200, 200);

    // Text
    ctx.font = 'bold 24px sans-serif';
    ctx.fillStyle = '#fff';
    ctx.fillText(EMOTION_LABELS[smoothed.dominant].zh, 200, 280);

    // Percentage
    ctx.font = '18px sans-serif';
    ctx.fillText(`${percent(smoothed.emotions[smoothed.dominant])}%`, 200, 320);

    // Translation text
    const text = translationService.toText(smoothed);
    ctx.font = '16px sans-serif';
    ctx.fillText(`"${text}"`, 200, 380);

    // Branding
    ctx.font = '12px sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.fillText('情绪翻译 · 2026', 200, 520);

    // Download
    const link = document.createElement('a');
    link.download = `emotion-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, [smoothed]);

  // Manual emotion selection overlay
  if (manualMode) {
    const emotions = ['happy', 'sad', 'angry', 'surprised', 'fearful', 'disgusted', 'neutral'] as const;
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 p-4">
        <h2 className="text-lg font-semibold">选择你当前的情绪</h2>
        <div className="grid grid-cols-4 gap-3">
          {emotions.map((e) => (
            <button
              key={e}
              onClick={() => handleManualEmotion(e)}
              className="flex flex-col items-center gap-1.5 p-4 rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              <span className="text-3xl">{EMOTION_LABELS[e].emoji}</span>
              <span className="text-xs">{EMOTION_LABELS[e].zh}</span>
            </button>
          ))}
        </div>
        <Button variant="ghost" onClick={() => setManualMode(false)}>
          返回
        </Button>
      </div>
    );
  }

  // Permission screen
  if (cameraState === 'idle' || cameraState === 'error') {
    return (
      <div className="flex flex-col h-full">
        <header className="flex items-center justify-between px-4 h-14 border-b border-gray-100 dark:border-gray-800">
          <span className="text-lg font-semibold">🎭 情绪翻译</span>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={() => navigate('/timeline')}>
              <Clock className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate('/settings')}>
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </header>
        <div className="flex-1">
          <CameraPermission
            error={error}
            onRequestPermission={handleStart}
            onManualSelect={handleManualSelect}
          />
        </div>
      </div>
    );
  }

  // Main detection UI
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="flex items-center justify-between px-4 h-14 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
        <span className="text-lg font-semibold">🎭 情绪翻译</span>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={() => navigate('/timeline')}>
            <Clock className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigate('/settings')}>
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        {/* Left: Camera + Controls */}
        <div className="flex flex-col flex-1 min-h-0">
          {/* Camera area */}
          <div className="relative flex-1 min-h-0 bg-black">
            <CameraPreview ref={videoRef} className="absolute inset-0" />
            {isDetecting && smoothed && (
              <FaceOverlay width={640} height={480} />
            )}
            {/* Overlay: Ring in corner */}
            {isDetecting && (
              <div className="absolute top-3 right-3">
                <EmotionRing size={80} />
              </div>
            )}
          </div>

          {/* Controls bar */}
          <div className="flex items-center justify-center gap-3 px-4 py-3 border-t border-gray-100 dark:border-gray-800 flex-shrink-0">
            {isDetecting ? (
              <Button variant="ghost" size="sm" onClick={handlePause}>
                <Pause className="w-4 h-4 mr-1.5" />
                暂停
              </Button>
            ) : (
              <Button variant="primary" size="sm" onClick={handleStart}>
                <Play className="w-4 h-4 mr-1.5" />
                恢复
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={handleStop}>
              <Camera className="w-4 h-4 mr-1.5" />
              停止
            </Button>
            <Button variant="ghost" size="sm" onClick={handleManualSelect}>
              <Hand className="w-4 h-4 mr-1.5" />
              手动
            </Button>
            <div className="flex-1" />
            <Button variant="ghost" size="sm" onClick={handleScreenshot} disabled={!smoothed}>
              <Download className="w-4 h-4 mr-1.5" />
              保存卡片
            </Button>
          </div>
        </div>

        {/* Right: Dashboard + Translation */}
        <div className="flex flex-col w-full lg:w-80 xl:w-96 border-l border-gray-100 dark:border-gray-800 min-h-0 flex-shrink-0">
          {/* Emotion dashboard */}
          <div className="flex-shrink-0 max-h-72 overflow-y-auto border-b border-gray-100 dark:border-gray-800">
            <EmotionDashboard />
          </div>

          {/* Translation panel */}
          <div className="flex-1 min-h-0 p-3 overflow-hidden">
            <TranslationPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
