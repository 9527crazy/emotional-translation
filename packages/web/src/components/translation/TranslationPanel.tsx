import { useUiStore } from '../../stores/ui.store';
import ColorTranslation from './ColorTranslation';
import EmojiTranslation from './EmojiTranslation';
import TextTranslation from './TextTranslation';
import DataTranslation from './DataTranslation';
import { Palette, Smile, Type, BarChart3 } from 'lucide-react';

const TABS = [
  { id: 'color' as const, label: '色彩', icon: Palette },
  { id: 'emoji' as const, label: 'Emoji', icon: Smile },
  { id: 'text' as const, label: '文字', icon: Type },
  { id: 'chart' as const, label: '图表', icon: BarChart3 },
];

const CONTENT_MAP = {
  color: ColorTranslation,
  emoji: EmojiTranslation,
  text: TextTranslation,
  chart: DataTranslation,
};

export default function TranslationPanel() {
  const { activeTranslationTab, setActiveTranslationTab } = useUiStore();
  const Content = CONTENT_MAP[activeTranslationTab];

  return (
    <div className="flex flex-col h-full">
      {/* Tab bar */}
      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl mb-3">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTranslationTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTranslationTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium rounded-lg transition-all duration-150 ${
                isActive
                  ? 'bg-white dark:bg-gray-700 shadow-sm text-brand'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0">
        <Content />
      </div>
    </div>
  );
}
