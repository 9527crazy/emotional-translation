# 情绪翻译 (Emotional Translation)

通过浏览器摄像头实时捕捉人脸情绪，将抽象情感"翻译"为可理解、可分享的多模态表达。

## 功能特性

- **实时情绪检测** — MediaPipe Face Mesh 468 关键点 + 7 种基础情绪识别
- **多模态翻译** — 情绪→色彩渐变 / Emoji 动画 / 文字描述 / 实时图表
- **情绪时间线** — 实时曲线 + 历史记录 + 趋势统计
- **情绪卡片** — 一键生成分享卡片
- **端侧优先** — 所有识别在浏览器完成，不上传面部数据

## 技术栈

| 层级 | 选型 |
|------|------|
| 框架 | React 18 + TypeScript |
| 构建 | Vite 5 |
| 包管理 | pnpm workspace (Monorepo) |
| 人脸检测 | MediaPipe Face Mesh |
| 情绪分类 | Blendshape 映射 / TensorFlow.js |
| 图表 | ECharts 5 |
| 样式 | Tailwind CSS 3 |
| 状态管理 | Zustand |

## 项目结构

```
emotional-translation/
├── docs/               # 项目文档
├── packages/
│   ├── web/            # Web 主应用
│   ├── shared/         # 共享类型与工具
│   └── ml/             # ML 相关工具
├── scripts/            # 构建脚本
├── pnpm-workspace.yaml
└── package.json
```

## 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建
pnpm build

# 测试
pnpm test
```

## 文档

- [产品需求](docs/PRD.md)
- [技术设计](docs/TECHNICAL.md)
- [UI/UX 设计规范](docs/DESIGN.md)
- [开发计划](docs/ROADMAP.md)

## 隐私声明

本产品遵循 **端侧优先** 原则：
- 情绪识别全部在浏览器端完成
- 不上传任何面部图像或视频数据
- 仅本地存储情绪标签和时间戳
- 用户可随时清除所有本地数据

## License

MIT
