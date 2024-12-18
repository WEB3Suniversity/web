在 Next.js 中使用环境变量不需要安装 dotenv，Next.js 已经内置了环境变量的支持。我来解释具体的实施方案：

1. 基本使用方法：
```bash
# .env.local
DB_HOST=localhost
API_KEY=your_api_key
```

2. 命名规则：
- 必须以 `NEXT_PUBLIC_` 开头的环境变量可以在浏览器端使用
- 不带 `NEXT_PUBLIC_` 前缀的只能在服务器端使用

```bash
# .env.local
# 服务器端可用
SECRET_KEY=xxxxxx

# 浏览器端也可用
NEXT_PUBLIC_API_URL=https://api.example.com
```

3. 在代码中使用：

```javascript
// 服务器端组件中
export default function ServerComponent() {
  // ✅ 可以访问所有环境变量
  console.log(process.env.SECRET_KEY)
  console.log(process.env.NEXT_PUBLIC_API_URL)
}

// 客户端组件中
'use client'
export default function ClientComponent() {
  // ✅ 只能访问 NEXT_PUBLIC_ 开头的变量
  console.log(process.env.NEXT_PUBLIC_API_URL)
  // ❌ 无法访问 SECRET_KEY
}
```

4. 环境变量文件优先级：
```
.env.development.local
.env.local
.env.development
.env
```

5. 不同环境的配置：
```bash
# 开发环境 (.env.development)
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# 生产环境 (.env.production)
NEXT_PUBLIC_API_URL=https://api.yoursite.com
```

实用建议：
1. 将 `.env.local` 添加到 `.gitignore` 中，避免敏感信息泄露
2. 提供一个 `.env.example` 作为模板
3. 重要的敏感信息（如密钥）只放在服务器端使用
4. 部署时记得在服务器或托管平台上配置环境变量

示例 `.env.example`:
```bash
# API Keys (Server-only)
SECRET_KEY=your_secret_key_here

# Public Variables
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_GA_ID=your_ga_id_here
```