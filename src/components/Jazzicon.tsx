"use client";

import React from "react";
import jazzicon from "jazzicon";

interface AvatarProps {
  address: string; // Ethereum 地址，假定为字符串类型
  size?: number; // 可选，默认值为 20
}

const Avatar: React.FC<AvatarProps> = ({ address, size = 20 }) => {
  const iconRef = React.useRef<HTMLDivElement | null>(null); // 定义 useRef 的类型

  React.useEffect(() => {
    if (address && iconRef.current) {
      // 使用 ethereum 地址生成头像
      const icon = jazzicon(size, parseInt(address.slice(2, 10), 16)); // 使用 size 作为直径
      iconRef.current.innerHTML = ""; // 清空之前的内容
      iconRef.current.appendChild(icon); // 添加新的头像

      // 设置生成的 SVG 尺寸（可选）
      icon.style.width = `${size}px`;
      icon.style.height = `${size}px`;
    }
  }, [address, size]); // 依赖地址和尺寸变化时更新

  return <div ref={iconRef}></div>;
};

export default Avatar;
