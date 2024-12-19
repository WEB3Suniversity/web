This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev


rm -rf .next
npm run build

```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


## prisma 使用 

### 生成Prisma客户端

```bash
npx prisma generate
```

###  创建 Prisma 服务

> 接下来，你需要创建一个 PrismaService，它将提供 Prisma Client 作为依赖注入到你的服务中。

```bash
nest generate service prisma

```
## 创建 Article 服务

> 创建一个 articles 服务来管理文章的增、改、删操作。

```bash
nest generate service articles

```

## 创建 Article 控制器

> 然后，创建一个 articles 控制器来暴露 API 接口：

```bash
nest generate controller articles

```

## docker 使用

```bash
docker-compose up 

sudo systemctl start docker

docker ps

docker-compose logs


docker-compose down --volumes
docker-compose up -d

mongosh "mongodb://localhost:27017/admin"

use admin;
db.createUser({
  user: "root",
  pwd: "example",
  roles: [{ role: "root", db: "admin" }]
});



docker exec -it mongodb ls /docker-entrypoint-initdb.d/


show collections;

mongosh "mongodb://localhost:27017"
mongosh "mongodb://root:example@localhost:27017"

docker exec -it mongodb mongosh "mongodb://root:example@localhost:27017"


on=true&serverSelectionTimeo ANDROID_HOME=/Users/lijinhai/Library/Android/sdk AUTOJUMP_ERROR_PATH=/Users/lijinhai/Library/autojump/errors.log
❯ docker ps

CONTAINER ID   IMAGE          COMMAND                   CREATED          STATUS          PORTS                      NAMES
9b5f1bd89a23   mongo:latest   "docker-entrypoint.s…"   35 minutes ago   Up 35 minutes   0.0.0.0:27017->27017/tcp   mongodb
❯ brew services stop mongodb-community
❯ lsof -iTCP -sTCP:LISTEN | grep 27017
─────────────────────────────────────────────── base   at 01:02:28 下午  ─╮
❯                                                                                                                                                ─╯
```