import type {
  EmotionResult,
  EmotionColor,
  EmotionEmoji,
  EmotionType,
} from '@emotional-translation/shared';
import { EMOTION_COLORS, EMOTION_LABELS } from '@emotional-translation/shared';

const EMOJI_MAP: Record<EmotionType, EmotionEmoji> = {
  happy:     { primary: '😊', secondary: ['😄', '🥰', '😁', '✨', '🌟'], animation: 'float' },
  sad:       { primary: '😢', secondary: ['😭', '🥺', '💧', '🌧️'], animation: 'fall' },
  angry:     { primary: '😠', secondary: ['😡', '🤬', '🔥', '💢'], animation: 'burst' },
  surprised: { primary: '😲', secondary: ['😮', '🤯', '⚡', '✨'], animation: 'burst' },
  fearful:   { primary: '😨', secondary: ['😰', '😱', '👻', '💀'], animation: 'float' },
  disgusted: { primary: '🤢', secondary: ['😖', '🤮', '💚', '🫠'], animation: 'fall' },
  neutral:   { primary: '😐', secondary: ['🙂', '😶', '🫥'], animation: 'pulse' },
};

const TEXT_TEMPLATES: Record<EmotionType, string[]> = {
  happy: [
    '你的微笑像春日暖阳',
    '快乐正在你脸上绽放',
    '此刻的你，光芒万丈',
    '幸福洋溢在你的眉眼间',
  ],
  sad: [
    '你的眉间藏着一片云',
    '悲伤像细雨轻轻落下',
    '此刻的心情，如秋叶飘零',
    '你的眼神里有片海',
  ],
  angry: [
    '火焰在你的眼中燃烧',
    '怒意正在积蓄力量',
    '此刻的你，如暴风将至',
    '情绪的火山即将喷发',
  ],
  surprised: [
    '世界给了你一个惊喜',
    '你的眼睛睁得好大',
    '意外让时间停了一秒',
    '不可思议写在你脸上',
  ],
  fearful: [
    '你感到了一丝不安',
    '恐惧像影子悄悄靠近',
    '此刻的心跳加速了',
    '未知让你紧张了起来',
  ],
  disgusted: [
    '你的表情说了一切',
    '不适感写在你的脸上',
    '这个味道不太好',
    '你的眉头皱了起来',
  ],
  neutral: [
    '平静如水，波澜不惊',
    '此刻的你很平和',
    '内心的湖面没有涟漪',
    '安然自在的时刻',
  ],
};

class TranslationService {
  toColor(result: EmotionResult): EmotionColor {
    const color = EMOTION_COLORS[result.dominant];

    // If confidence is low, blend with neutral
    if (result.confidence < 0.4) {
      const neutral = EMOTION_COLORS.neutral;
      return {
        primary: color.primary,
        secondary: neutral.primary,
        gradient: `linear-gradient(135deg, ${color.primary} 0%, ${neutral.primary} 100%)`,
        background: color.background,
      };
    }

    return color;
  }

  toEmoji(result: EmotionResult): EmotionEmoji {
    return EMOJI_MAP[result.dominant];
  }

  toText(result: EmotionResult): string {
    const templates = TEXT_TEMPLATES[result.dominant];
    const index = Math.floor(Math.random() * templates.length);
    return templates[index];
  }

  toLabel(result: EmotionResult): string {
    return EMOTION_LABELS[result.dominant].zh;
  }
}

export const translationService = new TranslationService();
