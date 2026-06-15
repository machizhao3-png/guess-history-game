# 部署指南

## Vercel 部署步骤

### 1. 配置 Supabase 数据库

1. 登录 [Supabase Dashboard](https://app.supabase.com/)
2. 进入你的项目 `hkeeqtktvskpubhczgdv`
3. 进入 **SQL Editor**，执行 `prisma/migrations/supabase-init.sql` 中的 SQL 创建表结构

### 2. 获取数据库连接字符串

1. 在 Supabase Dashboard 中：**Project Settings** → **Database** → **Connection string**
2. 选择 **Transaction pooling** 模式（用于 `DATABASE_URL`）
   - 格式：`postgresql://postgres.xxx:[YOUR-PASSWORD]@xxx.pooler.supabase.com:6543/postgres?pgbouncer=true`
3. 选择 **Session pooling** 模式（用于 `DIRECT_URL`）
   - 格式：`postgresql://postgres.xxx:[YOUR-PASSWORD]@xxx.pooler.supabase.com:5432/postgres`

### 3. 在 Vercel 中配置环境变量

在 [Vercel Dashboard](https://vercel.com/) 的项目设置中添加以下环境变量：

```bash
# OpenRouter API Key
OPENROUTER_API_KEY=sk-or-v1-xxx...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://hkeeqtktvskpubhczgdv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...

# Database (从 Supabase Dashboard 获取，替换 [YOUR-PASSWORD])
DATABASE_URL=postgresql://postgres.hkeeqtktvskpubhczgdv:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.hkeeqtktvskpubhczgdv:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres
```

### 4. 部署

```bash
git add .
git commit -m "Switch from SQLite to PostgreSQL for Vercel deployment"
git push origin main
```

Vercel 会自动触发部署。

## 本地开发

如果想在本地也使用 Supabase：

1. 复制 `.env.example` 为 `.env.local`
2. 填入正确的 Supabase 连接信息
3. 运行 `npx prisma generate`
4. 运行 `npm run dev`

如果想用本地 SQLite 开发（不推荐），需要手动修改 `prisma/schema.prisma` 的 `provider` 为 `sqlite`。
