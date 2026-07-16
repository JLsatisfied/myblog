# myblog

个人博客前台，基于 React + TypeScript + Tailwind CSS 构建，对接 blogService 后端 /pc/* 公开接口。

## 技术栈

| 技术 | 说明 |
|---|---|
| React 19 | UI 框架 |
| TypeScript | 类型安全 |
| Tailwind CSS v4 | 原子化样式 |
| React Router | 路由 |
| Framer Motion | 页面动画 |
| React Markdown | Markdown 渲染 |
| remark-gfm | GFM 表格支持 |
| rehype-raw | 内联 HTML |
| rehype-slug | 标题锚点 |
| Lucide React | 图标库 |
| Axios | HTTP 请求 |

## 快速开始

```bash
npm install
npm run dev
```

默认运行在 http://localhost:5174。

代理配置：/pc/* 请求自动转发到后端（默认 localhost:5005），可在 vite.config.ts 中修改。

## 页面路由

| 路由 | 页面 | 说明 |
|---|---|---|
| / | 首页 | 个人介绍 |
| /blog | 文章列表 | 卡片网格、搜索、标签筛选 |
| /blog/:id | 文章详情 | 正文、目录、AI 功能 |
| /about | 关于我 | 简历展示 |
| * | 404 | 页面不存在 |

## 功能模块

### 文章列表

- 卡片网格布局，展示标题、简介、标签、日期、阅读时间
- 搜索框关键词过滤（标题、简介、标签）
- 标签按钮筛选
- 加载更多分页 + 防抖搜索

### 文章详情

- 标题、日期、阅读量、阅读时间等元信息
- Markdown 完整渲染（标题、列表、代码块、表格、引用、图片）
- 代码块语法高亮
- 右侧粘性目录导航（桌面端），滚动高亮当前章节
- 移动端底部浮动按钮，侧滑打开目录面板
- 上一页/下一页导航

### AI 摘要

文章加载后自动调用 AI 生成摘要，折叠卡片展示。结果缓存到 localStorage。

### AI 翻译

支持 6 种语言：英文、日文、韩文、繁体中文、法文、德文。

- 流式翻译，译文实时替换正文区域
- 翻译结果用和原文相同的 Markdown 组件渲染，格式一致
- 点击"原文"按钮一键恢复原文
- 翻译结果缓存到 localStorage

### AI 文章问答

右下角浮动按钮打开聊天面板，基于文章内容自由提问，流式返回，Markdown 渲染。

### AI 要点卡片

文章顶部展示 3 张要点卡片，每张一句话总结核心知识点。自动生成并缓存。

### 其他特点

- 暗色/亮色主题切换
- 赛博朋克霓虹风格
- 响应式布局，移动端自适应

## 项目结构

```
src/
├── components/
│   ├── blog/            # BlogCard, PostContent, TableOfContents
│   │                    # AISummary, AITranslate, AITakeaways, AIArticleChat
│   ├── effects/         # 视觉特效
│   ├── home/            # 首页组件
│   ├── layout/          # 导航栏、页脚、根布局、主题切换
│   └── ui/              # 通用 UI
├── pages/               # HomePage, BlogListPage, BlogPostPage, AboutPage, NotFoundPage
├── services/            # request.ts, api.ts, ai.ts
├── styles/              # 全局 CSS
├── types/               # TypeScript 类型
└── utils/               # 工具函数
```

## 常用命令

```bash
npm run dev       # 启动开发服务器
npm run build     # 生产构建
npm run preview   # 预览生产构建
```
