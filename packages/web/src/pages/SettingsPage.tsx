import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { storageService } from '../services/storage.service';
import { useSettingsStore } from '../stores/settings.store';
import { ArrowLeft, Trash2, Moon, Sun, Info, Shield } from 'lucide-react';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { theme, updateSettings } = useSettingsStore();

  const handleClearData = async () => {
    if (confirm('确定要清除所有本地数据吗？此操作不可恢复。')) {
      await storageService.clearAll();
      alert('数据已清除');
    }
  };

  const handleThemeToggle = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    updateSettings({ theme: newTheme });
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center gap-2 px-4 h-14 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
        <Button variant="ghost" size="sm" onClick={() => navigate('/detect')}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <span className="text-lg font-semibold">设置</span>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Appearance */}
        <Card>
          <h3 className="text-sm font-medium text-gray-500 mb-3">外观</h3>
          <button
            onClick={handleThemeToggle}
            className="flex items-center justify-between w-full py-2"
          >
            <div className="flex items-center gap-2">
              {theme === 'dark' ? (
                <Moon className="w-4 h-4 text-brand" />
              ) : (
                <Sun className="w-4 h-4 text-brand" />
              )}
              <span className="text-sm">深色模式</span>
            </div>
            <div
              className={`w-10 h-6 rounded-full transition-colors ${
                theme === 'dark' ? 'bg-brand' : 'bg-gray-300'
              } relative`}
            >
              <div
                className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  theme === 'dark' ? 'translate-x-5' : 'translate-x-1'
                }`}
              />
            </div>
          </button>
        </Card>

        {/* Privacy */}
        <Card>
          <h3 className="text-sm font-medium text-gray-500 mb-3">隐私与数据</h3>
          <div className="flex items-start gap-2 p-3 text-xs text-gray-500 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800 mb-3">
            <Shield className="w-4 h-4 mt-0.5 text-green-500 flex-shrink-0" />
            <span>
              所有情绪识别均在浏览器本地完成。不上传面部图像或视频。仅本地存储情绪标签。
            </span>
          </div>
          <Button variant="danger" size="sm" onClick={handleClearData}>
            <Trash2 className="w-4 h-4 mr-1.5" />
            清除所有本地数据
          </Button>
        </Card>

        {/* About */}
        <Card>
          <h3 className="text-sm font-medium text-gray-500 mb-3">关于</h3>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-brand" />
              <span>情绪翻译 v0.1.0</span>
            </div>
            <p className="text-xs text-gray-400">
              通过摄像头实时捕捉人脸情绪，将情感翻译为多模态表达。基于 MediaPipe Face Mesh 和情绪分类模型。
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
