# 猜历史人物 - 多人实时问答游戏

一个由 AI 驱动的多人实时问答游戏。AI 随机想一个中国古代人物，玩家通过提问逐步缩小范围，最终猜出人物名称。

## 功能特性

- 🎮 **实时多人游戏** - 所有玩家看到同一个当前人物和问答记录
- 🤖 **AI 智能回答** - 使用 Claude API 生成人物并回答问题
- 💬 **实时同步** - WebSocket + 轮询双重机制确保消息不丢失
- 🎨 **现代化 UI** - 使用 Tailwind CSS 浅黄色主题，移动端优先设计
- 📱 **响应式布局** - 完美支持桌面端和移动端

## 快速开始

### 环境要求

- Node.js 18+
- npm 或 yarn

### 安装

```bash
git clone <repository>
cd guess-history
npm install
```

### 配置环境变量

复制 `.env.example` 创建 `.env.local` 文件：

```bash
cp .env.example .env.local
```

编辑 `.env.local` 并设置 Anthropic API Key：

```
ANTHROPIC_API_KEY=your_api_key_here
DATABASE_URL=file:./prisma/dev.db
```

### 启动开发服务器

```bash
npm run dev
```

打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 游戏流程

1. **入场** - 选择 emoji 头像和输入昵称
2. **主页** - 查看游戏统计和已猜出的人物列表
3. **提问** - 点击"?"卡片进入问答页，提出问题
4. **AI 回答** - AI 只能回复：是 / 不是 / 不确定 / 无关 / 猜对了
5. **猜对** - 当猜对后，弹窗显示结果，可以选择继续或返回主页

## 项目结构

```
.
├── app/
│   ├── api/              # API 路由
│   │   ├── init/         # 初始化端点
│   │   ├── game/         # 游戏状态端点
│   │   ├── question/     # 提交问题端点
│   │   ├── history/      # 历史记录端点
│   │   └── ws/           # WebSocket 端点
│   ├── components/       # React 组件
│   ├── page.tsx          # 主页
│   ├── game/page.tsx     # 游戏页面
│   └── layout.tsx        # 布局
├── lib/
│   ├── ai.ts            # Claude AI 集成
│   ├── store.ts         # Zustand 状态管理
│   ├── api.ts           # API 调用工具
│   ├── ws-client.ts     # WebSocket 客户端
│   ├── polling.ts       # 轮询容错
│   └── ...
├── prisma/
│   ├── schema.prisma    # 数据库 schema
│   └── migrations/      # 数据库迁移
└── public/              # 静态文件
```

## 技术栈

- **前端**: Next.js 14, React 19, TypeScript, Tailwind CSS
- **状态管理**: Zustand
- **后端**: Next.js API Routes
- **数据库**: SQLite + Prisma ORM
- **AI**: Anthropic Claude API
- **实时通信**: WebSocket + 轮询

## 开发指南

### 构建生产版本

```bash
npm run build
npm start
```

### 运行类型检查

```bash
npm run type-check
```

### 重置数据库

```bash
npx prisma migrate reset
```

## API 端点

- `POST /api/init` - 初始化玩家和游戏状态
- `GET /api/game/state?gameId=<id>` - 获取当前游戏状态
- `POST /api/question` - 提交问题并获取 AI 回复
- `GET /api/history` - 获取历史人物和问答记录
- `GET /api/ws` - WebSocket 连接端点

## 性能优化

- 使用 Zustand 管理状态，避免不必要的重新渲染
- WebSocket + 轮询混合机制确保可靠的实时更新
- 使用 Next.js 内置的代码分割和懒加载
- 轻量级依赖，无重型状态管理库

## 部署

### 部署到 Vercel

```bash
npm i -g vercel
vercel
```

### 环境变量

在 Vercel 项目设置中添加：
- `ANTHROPIC_API_KEY` - Anthropic API Key

## 常见问题

**Q: AI 没有回答我的问题？**
A: 确保 ANTHROPIC_API_KEY 已正确设置在环境变量中。

**Q: 多个浏览器窗口之间是否实时同步？**
A: 是的，使用 WebSocket + 轮询机制确保实时同步。

**Q: 可以修改 AI 的行为吗？**
A: 可以在 `lib/ai.ts` 中修改 `SYSTEM_PROMPT` 来定制 AI 的行为。

## 许可证

MIT

## 贡献

欢迎提交 Issue 和 Pull Request！

