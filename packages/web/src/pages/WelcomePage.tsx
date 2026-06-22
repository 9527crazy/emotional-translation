import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import { Camera, Shield, Zap, Sparkles } from 'lucide-react';

const features = [
  { icon: Camera, title: '实时检测', desc: '通过摄像头捕捉面部表情' },
  { icon: Sparkles, title: '情绪翻译', desc: '将情绪转化为色彩、Emoji、文字' },
  { icon: Shield, title: '隐私安全', desc: '所有处理在本地完成，不上传数据' },
  { icon: Zap, title: '零安装', desc: '浏览器打开即用，无需下载' },
];

export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-full px-4 py-8 bg-gradient-to-b from-brand/5 to-transparent">
      <div className="max-w-lg w-full text-center">
        {/* Logo */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-brand/10 flex items-center justify-center text-4xl">
          🎭
        </div>

        <h1 className="text-3xl font-bold mb-2">情绪翻译</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          通过摄像头实时捕捉人脸情绪，将情感翻译为多模态表达
        </p>

        {/* Features */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700"
            >
              <Icon className="w-6 h-6 text-brand" />
              <span className="text-sm font-medium">{title}</span>
              <span className="text-xs text-gray-400 text-center">{desc}</span>
            </div>
          ))}
        </div>

        {/* Privacy notice */}
        <div className="flex items-start gap-2 p-3 mb-6 text-xs text-left text-gray-500 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
          <Shield className="w-4 h-4 mt-0.5 text-amber-500 flex-shrink-0" />
          <span>
            本应用所有情绪识别均在浏览器本地完成，不会上传任何面部图像或视频数据到服务器。仅在本地存储情绪标签和时间戳。
          </span>
        </div>

        <Button size="lg" className="w-full" onClick={() => navigate('/detect')}>
          <Camera className="w-5 h-5 mr-2" />
          开始情绪翻译
        </Button>
      </div>
    </div>
  );
}
