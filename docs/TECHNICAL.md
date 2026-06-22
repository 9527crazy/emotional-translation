# 技术设计文档

> v0.2 | 2026-06-22 | Web 端 Monorepo

---

## 1. Monorepo 结构

采用 pnpm workspace 管理，packages 划分如下：

```
emotional-translation/
├── docs/                           # 项目文档
│   ├── PRD.md                      # 产品需求
│   ├── TECHNICAL.md                # 技术设计（本文档）
│   ├── DESIGN.md                   # UI/UX 设计规范
│   └── ROADMAP.md                  # 开发计划
│
├── packages/
│   ├── web/                        # Web 主应用
│   │   ├── public/
│   │   │   ├── models/             # ML 模型文件
│   │   │   │   ├── face_landmarker_v2.task
│   │   │   │   └── emotion_mobilenet/
│   │   │   │       ├── model.json
│   │   │   │       └── group1-shard1of1.bin
│   │   │   └── icons/              # PWA 图标
│   │   ├── src/
│   │   │   ├── main.tsx
│   │   │   ├── App.tsx
│   │   │   ├── components/         # UI 组件
│   │   │   │   ├── common/         # 通用组件（Button, Card, Loading）
│   │   │   │   ├── camera/         # 摄像头（Preview, Overlay, Permission）
│   │   │   │   ├── emotion/        # 情绪展示（Dashboard, Badge, Ring）
│   │   │   │   ├── translation/    # 翻译展示（Color, Emoji, Text, Chart, Panel）
│   │   │   │   └── timeline/       # 时间线（Chart, Summary, View）
│   │   │   ├── pages/              # 页面组件
│   │   │   │   ├── WelcomePage.tsx
│   │   │   │   ├── DetectionPage.tsx
│   │   │   │   ├── TimelinePage.tsx
│   │   │   │   └── SettingsPage.tsx
│   │   │   ├── services/           # 核心服务（无 UI）
│   │   │   │   ├── camera.service.ts
│   │   │   │   ├── face-detection.service.ts
│   │   │   │   ├── emotion.service.ts
│   │   │   │   ├── emotion-pipeline.ts
│   │   │   │   ├── translation.service.ts
│   │   │   │   ├── storage.service.ts
│   │   │   │   └── export.service.ts
│   │   │   ├── stores/             # Zustand 状态
│   │   │   │   ├── camera.store.ts
│   │   │   │   ├── emotion.store.ts
│   │   │   │   ├── settings.store.ts
│   │   │   │   └── ui.store.ts
│   │   │   ├── hooks/              # 自定义 Hooks
│   │   │   ├── utils/              # 工具函数
│   │   │   ├── types/              # TypeScript 类型
│   │   │   └── constants/          # 常量
│   │   ├── tests/
│   │   ├── index.html
│   │   ├── vite.config.ts
│   │   └── package.json
│   │
│   ├── shared/                     # 跨包共享代码
│   │   ├── src/
│   │   │   ├── types/              # 共享类型定义
│   │   │   │   ├── emotion.types.ts
│   │   │   │   └── camera.types.ts
│   │   │   ├── constants/          # 共享常量
│   │   │   │   ├── emotions.ts
│   │   │   │   └── emotion-colors.ts
│   │   │   └── utils/              # 共享工具
│   │   │       ├── smoothing.ts
│   │   │       └── math.ts
│   │   └── package.json
│   │
│   └── ml/                         # ML 相关工具（可选）
│       ├── src/
│       │   ├── model-loader.ts     # 模型加载封装
│       │   └── preprocess.ts       # 图像预处理
│       └── package.json
│
├── scripts/                        # 构建/部署脚本
│   └── download-models.ts
│
├── pnpm-workspace.yaml
├── package.json                    # 根 package.json（scripts + devDeps）
├── tsconfig.base.json              # 基础 TS 配置
├── .eslintrc.cjs
├── .prettierrc
└── .gitignore
```

### pnpm-workspace.yaml

```yaml
packages:
  - 'packages/*'
```

### 根 package.json scripts

```json
{
  "scripts": {
    "dev": "pnpm --filter web dev",
    "build": "pnpm --filter web build",
    "test": "pnpm --filter web test",
    "lint": "eslint packages/*/src --ext .ts,.tsx",
    "format": "prettier --write packages/*/src/**/*.{ts,tsx}",
    "download-models": "ts-node scripts/download-models.ts"
  }
}
```

---

## 2. 技术栈

| 层级 | 选型 | 理由 |
|------|------|------|
| 框架 | React 18 + TypeScript | 生态最丰富，AI/ML 集成示例最多 |
| 构建 | Vite 5 | 极速 HMR，原生 ESM，大模型文件友好 |
| 包管理 | pnpm workspace | Monorepo 支持好，磁盘效率高 |
| 状态管理 | Zustand | 轻量，TypeScript 友好，适合实时数据流 |
| 路由 | React Router v6 | 标准方案，支持懒加载 |
| 样式 | Tailwind CSS 3 | 快速开发，与动态色彩系统配合好 |
| 组件库 | shadcn/ui | 可定制，无运行时，Tailwind 原生 |
| 人脸检测 | MediaPipe Face Mesh | 468 关键点，Google 维护，WASM 性能好 |
| 情绪分类 | Blendshape 映射 / TF.js CNN | 两种路径，渐进增强 |
| 图表 | ECharts 5 | 实时更新优秀，动画丰富 |
| 动画 | Framer Motion | React 生态最佳动画库 |
| 存储 | IndexedDB (Dexie.js) | 大容量结构化数据，离线支持 |

### 核心依赖

```json
{
  "dependencies": {
    "react": "^18.3",
    "react-dom": "^18.3",
    "react-router-dom": "^6.x",
    "@mediapipe/tasks-vision": "^0.10",
    "@tensorflow/tfjs": "^4.x",
    "echarts": "^5.5",
    "echarts-for-react": "^3.x",
    "dexie": "^4.x",
    "zustand": "^4.x",
    "framer-motion": "^11.x",
    "lucide-react": "^0.x"
  }
}
```

---

## 3. 系统架构

```
┌─────────────────────────────────────────────────────────┐
│                      浏览器 (Client)                     │
│                                                         │
│  ┌───────────┐   ┌───────────┐   ┌───────────────────┐ │
│  │ UI 层     │←→│ 状态管理   │←→│ 路由层            │ │
│  │ React +   │   │ Zustand    │   │ React Router v6   │ │
│  │ Tailwind  │   │ Store      │   │ (懒加载)          │ │
│  └─────┬─────┘   └─────┬─────┘   └───────────────────┘ │
│        │               │                                │
│  ┌─────┴───────────────┴──────────────────────────────┐ │
│  │                   服务层                            │ │
│  │  Camera Service → Face Detection → Emotion Engine  │ │
│  │       (WebRTC)    (MediaPipe)       (CNN/BLEND)    │ │
│  │                           ↓                        │ │
│  │                   Translation Service              │ │
│  │                   (色彩/Emoji/文字/图表)            │ │
│  └───────────────────────────┬───────────────────────┘ │
│                              │                          │
│  ┌───────────────────────────┴───────────────────────┐ │
│  │                   数据层                           │ │
│  │  IndexedDB (Dexie) | localStorage | Memory Cache  │ │
│  └───────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

## 4. 核心模块设计

### 4.1 情绪处理流水线

```
requestAnimationFrame Loop (目标 15-20 FPS 推理)

  captureFrame()       → ImageData
  detectFaces()        → Face[] (landmarks + blendshapes)
  classifyEmotion()    → EmotionResult (7 维向量)
  smoothResult()       → EmotionResult (EMA 平滑)
  updateStore()        → UI 更新
  saveRecord()         → IndexedDB (节流 2s)
```

### 4.2 两种情绪推理路径

**路径 A — Blendshape 映射（轻量，MVP 首选）**
```
MediaPipe Blendshapes (52 coefficients)
  → 规则 / 轻量 MLP 映射
  → 7 维情绪向量
  → 零额外模型加载
```

**路径 B — CNN 分类（高精度，增强方案）**
```
面部图像裁剪 → MobileNet-v3 (TF.js)
  → 7 维情绪向量
  → 模型 ~3-5MB
```

### 4.3 服务接口

```typescript
// Camera Service
interface CameraService {
  start(video: HTMLVideoElement): Promise<void>;
  stop(): void;
  captureFrame(): ImageData | null;
  getState(): 'idle' | 'requesting' | 'streaming' | 'error';
}

// Face Detection Service
interface FaceDetectionService {
  init(): Promise<void>;
  detect(video: HTMLVideoElement, timestamp: number): FaceResult | null;
  dispose(): void;
}

// Emotion Service
interface EmotionService {
  init(): Promise<void>;
  classify(face: FaceResult): EmotionResult;
  dispose(): void;
}

interface EmotionResult {
  emotions: {
    happy: number; sad: number; angry: number;
    surprised: number; fearful: number;
    disgusted: number; neutral: number;
  };
  dominant: EmotionType;
  confidence: number;
  timestamp: number;
}

// Translation Service
interface TranslationService {
  toColor(result: EmotionResult): EmotionColor;
  toEmoji(result: EmotionResult): EmotionEmoji;
  toText(result: EmotionResult): string;
  toChartData(history: EmotionResult[]): ChartData;
}
```

### 4.4 状态管理 (Zustand)

```typescript
// EmotionStore
interface EmotionStore {
  current: EmotionResult | null;
  smoothed: EmotionResult | null;
  sessionHistory: EmotionResult[];
  isDetecting: boolean;
  updateEmotion: (result: EmotionResult) => void;
  clearSession: () => void;
}

// CameraStore
interface CameraStore {
  state: 'idle' | 'requesting' | 'streaming' | 'error' | 'paused';
  error: string | null;
  setState: (state: CameraStore['state']) => void;
}
```

---

## 5. 性能优化

| 策略 | 说明 |
|------|------|
| 模型懒加载 | 用户授权摄像头后才加载 ML 模型 |
| Service Worker 缓存 | 模型文件二次访问秒开 |
| 跳帧推理 | 控制在 15-20 FPS，非每帧推理 |
| WebGL 加速 | TF.js 使用 WebGL 后端 |
| Canvas 独立层 | 翻译效果用独立 Canvas，避免重排 |
| React.memo | 仪表盘组件避免不必要重渲染 |
| 更新节流 | 情绪数据更新节流到 100ms，存储节流到 2s |
| 代码分割 | 路由级别懒加载 |

---

## 6. 安全与隐私

- 视频帧仅内存处理，不持久化
- 情绪结果本地 IndexedDB 存储
- 不上传任何面部数据到服务器
- 不使用第三方分析追踪
- 用户可一键清除所有本地数据
- 摄像头状态栏可见提示

---

## 7. 降级方案

| 场景 | 降级策略 |
|------|---------|
| 摄像头被拒 | 展示手动情绪选择入口 |
| WebGL 不可用 | TF.js 回退 CPU，降低推理频率 |
| 移动端性能不足 | 降低视频分辨率至 320×240 |
| 浏览器不支持 WebRTC | 提示使用支持的浏览器 |

---

## 8. 部署

MVP 阶段纯静态部署：

```
GitHub Actions → Vercel / Cloudflare Pages → CDN 分发
```

- 零后端服务器
- Service Worker 离线缓存
- 模型文件通过 CDN 分发
