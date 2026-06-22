import Button from '../common/Button';
import { Camera, CameraOff, MousePointerClick } from 'lucide-react';
import type { CameraError } from '@emotional-translation/shared';

interface CameraPermissionProps {
  error: CameraError | null;
  onRequestPermission: () => void;
  onManualSelect: () => void;
}

export default function CameraPermission({
  error,
  onRequestPermission,
  onManualSelect,
}: CameraPermissionProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 text-center px-4">
      <div className="w-20 h-20 rounded-full bg-brand/10 flex items-center justify-center">
        {error ? (
          <CameraOff className="w-10 h-10 text-red-400" />
        ) : (
          <Camera className="w-10 h-10 text-brand" />
        )}
      </div>

      {error ? (
        <>
          <h2 className="text-xl font-semibold">无法访问摄像头</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-sm">
            {error.type === 'PermissionDenied'
              ? '请在浏览器地址栏左侧的权限设置中允许摄像头访问'
              : error.type === 'NotFound'
                ? '未检测到摄像头设备，请检查是否已连接'
                : '摄像头暂时不可用，请稍后重试'}
          </p>
          <div className="flex gap-3">
            <Button onClick={onRequestPermission}>重试</Button>
            <Button variant="secondary" onClick={onManualSelect}>
              <MousePointerClick className="w-4 h-4 mr-1.5" />
              手动选择情绪
            </Button>
          </div>
        </>
      ) : (
        <>
          <h2 className="text-xl font-semibold">需要摄像头权限</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-sm">
            情绪翻译需要使用摄像头来检测你的面部表情。所有处理都在本地完成，不会上传任何数据。
          </p>
          <div className="flex gap-3">
            <Button onClick={onRequestPermission}>
              <Camera className="w-4 h-4 mr-1.5" />
              开启摄像头
            </Button>
            <Button variant="secondary" onClick={onManualSelect}>
              手动选择情绪
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
