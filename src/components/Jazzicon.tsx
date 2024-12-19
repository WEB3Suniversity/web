import React from "react";
import jazzicon from "jazzicon";

const Avatar = ({ address, size = 20 }) => {
  const iconRef = React.useRef(null);

  React.useEffect(() => {
    if (address && iconRef.current) {
      // 使用 ethereum 地址生成头像
      const icon = jazzicon(100, parseInt(address.slice(2, 10), 16));
      iconRef.current.innerHTML = "";
      iconRef.current.appendChild(icon);
      // 设置生成的 SVG 尺寸
      icon.style.width = `${size}px`;
      icon.style.height = `${size}px`;
    }
  }, [address]);

  return <div ref={iconRef}></div>;
};

export default Avatar;
