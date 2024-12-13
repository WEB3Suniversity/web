const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export", // 添加这行来启用静态导出
  trailingSlash: true, // 添加尾部斜杠，有助于解决路径问题
  swcMinify: true,
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
  images: {
    unoptimized: true, // S3 静态部署需要此配置
  },
  experimental: {
    serverComponentsExternalPackages: ["next/server"],
  },
  webpack: (config, isServer) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "./app"),
    };
    // 处理 wasm 文件
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };
    // 忽略类型检查相关的代码
    if (isServer) {
      // 忽略导致 __dirname 问题的依赖
      config.externals = [...config.externals, "ua-parser-js"];
    }
    return config;
  },
};


module.exports = nextConfig;
