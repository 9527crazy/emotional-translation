# 开发计划

> v0.1 | 2026-06-22 | Web 端 | 预计 8 周

---

## 总览

```
Week 1-2          Week 3-4          Week 5-6          Week 7-8
┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│  Phase 1     │  │  Phase 2     │  │  Phase 3     │  │  Phase 4     │
│  基础搭建     │→│  核心功能     │→│  翻译与体验   │→│  打磨与发布   │
│  技术验证     │  │  情绪检测     │  │  可视化      │  │  优化部署     │
└─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘
    MVP ─────────────────────────────────────────────→ v1.0 发布
```

---

## Phase 1：基础搭建与技术验证（Week 1-2）

### M1.1 项目初始化 (Day 1-2)
- [ ] pnpm workspace Monorepo 搭建
- [ ] `packages/web` — Vite + React + TS + Tailwind + shadcn/ui
- [ ] `packages/shared` — 共享类型与工具
- [ ] ESLint + Prettier + Husky 配置
- [ ] 路由配置（Welcome / Detection / Timeline / Settings）
- [ ] Zustand store 基础搭建

### M1.2 摄像头服务 (Day 3-4)
- [ ] Camera Service — WebRTC `getUserMedia` 封装
- [ ] 权限请求与错误处理（PermissionDenied / NotFound / NotReadable）
- [ ] CameraPreview 组件 — 视频渲染 + 响应式 16:9
- [ ] CameraPermission 组件 — 权限引导 + 手动选择降级

### M1.3 MediaPipe 集成 (Day 5-7)
- [ ] Face Landmarker 模型加载（WASM + GPU delegate）
- [ ] Face Detection Service — 实时检测 + 468 关键点 + 52 Blendshapes
- [ ] FaceOverlay 组件 — Canvas 覆盖层（关键点/人脸框，调试用）

### M1.4 技术验证 (Day 8-10)
- [ ] PoC：Blendshape → 情绪映射（规则映射，验证区分度）
- [ ] PoC：CNN 情绪分类（可选，FER2013 预训练模型）
- [ ] 性能基准：延迟 / FPS / 内存

**交付**：摄像头画面 + 实时人脸检测 + 情绪分类 PoC 报告

---

## Phase 2：核心功能（Week 3-4）

### M2.1 情绪处理流水线 (Day 1-3)
- [ ] Emotion Service — Blendshape 映射 + 7 维情绪向量
- [ ] EMA 平滑算法（防抖动）
- [ ] EmotionPipeline 编排 — rAF 主循环 + 帧率控制

### M2.2 情绪仪表盘 (Day 4-5)
- [ ] EmotionDashboard — 主 Emoji + 7 色进度条
- [ ] EmotionRing — SVG 环形指示器
- [ ] EmotionBadge — 单情绪标签 + 动画

### M2.3 数据存储 (Day 6-7)
- [ ] IndexedDB (Dexie.js) — schema + CRUD + 批量写入
- [ ] Storage Service — 记录保存（节流 2s）+ 历史查询
- [ ] useEmotionHistory Hook

### M2.4 欢迎页与设置页 (Day 8-10)
- [ ] WelcomePage — 产品介绍 + 隐私说明 + 开始按钮
- [ ] SettingsPage — 主题/偏好/数据清除/关于

**交付**：完整情绪检测主界面 + 仪表盘 + 本地记录 → **MVP ✅**

---

## Phase 3：翻译与可视化（Week 5-6）

### M3.1 翻译引擎 (Day 1-3)
- [ ] Translation Service — 色彩/Emoji/文字/图表映射
- [ ] 翻译面板容器 — Tab 切换 + 移动端滑动

### M3.2 色彩翻译 (Day 4-5)
- [ ] ColorTranslation — 全屏渐变 + 平滑过渡 + 文字叠加

### M3.3 Emoji 翻译 (Day 6-7)
- [ ] EmojiTranslation — Canvas 浮动动画 + 强度控制

### M3.4 情绪时间线 (Day 8-10)
- [ ] EmotionChart — ECharts 实时曲线 + 交互
- [ ] TimelinePage — 日期选择 + 每日总结
- [ ] 分享 — Canvas 卡片生成 + 图片下载

**交付**：三种翻译模式 + 时间线 + 分享

---

## Phase 4：打磨与发布（Week 7-8）

### M4.1 性能优化 (Day 1-3)
- [ ] Service Worker 缓存模型
- [ ] 代码分割 + 路由懒加载
- [ ] Canvas 独立层 + React.memo 优化

### M4.2 体验打磨 (Day 4-6)
- [ ] 无障碍完善（ARIA + 键盘 + 对比度）
- [ ] 暗色模式全组件适配
- [ ] 移动端响应式调试
- [ ] 错误边界 + 友好提示

### M4.3 测试 (Day 7-8)
- [ ] 单元测试（情绪映射 / 平滑算法 / 翻译逻辑）
- [ ] 集成测试（流水线 / 存储）
- [ ] E2E 关键路径（授权→检测→翻译→分享）

### M4.4 部署上线 (Day 9-10)
- [ ] PWA 配置（manifest + Service Worker + 离线）
- [ ] GitHub Actions CI/CD → Vercel / Cloudflare Pages
- [ ] 多浏览器多设备验证
- [ ] README + 用户指南

**交付**：生产级 Web 应用 → **v1.0 发布 🚀**

---

## 风险预案

| 风险 | 触发条件 | 预案 | 影响 |
|------|---------|------|------|
| MediaPipe 性能不足 | 移动端 FPS < 15 | 降至 320×240 分辨率 | +1 天 |
| Blendshape 精度不够 | 准确率 < 70% | 引入 CNN 模型 | +3 天 |
| 模型加载过慢 | 首次 > 5s | 分片 + 渐进加载 | +2 天 |
| Safari 兼容问题 | 特定 bug | 浏览器特定降级 | +1-2 天 |

---

## 后续版本

- **v1.1** — LLM 文字翻译（情绪→诗意描述）
- **v1.2** — 社交功能（分享链接 / 匿名广场）
- **v1.3** — 高级可视化（WebGL 粒子 / 3D 情绪空间）
- **v2.0** — 移动端 App（Capacitor 打包）
