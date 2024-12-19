import type { Connector } from "@web3-react/types";
import { MetaMask } from "@web3-react/metamask";
import {
  ExternalProvider,
  JsonRpcFetchFunc,
  Web3Provider,
} from "@ethersproject/providers";
import { ethers } from "ethers";
/**
 * 格式化日期
 * @param date Date对象或时间戳
 * @param format 格式化模板，如 'YYYY-MM-DD HH:mm:ss'
 */
export const formatDate = (
  date: Date | number | string,
  format: string = "YYYY-MM-DD"
): string => {
  const d = new Date(date);

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const seconds = String(d.getSeconds()).padStart(2, "0");

  return format
    .replace("YYYY", String(year))
    .replace("MM", month)
    .replace("DD", day)
    .replace("HH", hours)
    .replace("mm", minutes)
    .replace("ss", seconds);
};

/**
 * 深拷贝对象
 * @param obj 要拷贝的对象
 */
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item)) as T;
  }

  const clonedObj = {} as T;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      clonedObj[key] = deepClone(obj[key]);
    }
  }

  return clonedObj;
};

/**
 * 防抖函数
 * @param fn 要执行的函数
 * @param delay 延迟时间(ms)
 */
export const debounce = <T extends (...args: number[]) => string>(
  fn: T,
  delay: number
) => {
  let timer: NodeJS.Timeout | null = null;

  return function (this: unknown, ...args: Parameters<T>) {
    if (timer) clearTimeout(timer);

    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
};
export function getName(connector: Connector) {
  if (connector instanceof MetaMask) return "MetaMask";
  return "Unknown";
}

// 用于返回 Web3Provider 实例
export function getLibrary(
  provider: ExternalProvider | JsonRpcFetchFunc
): Web3Provider {
  return new Web3Provider(provider);
}
// 生成 NFT 的元数据 URI
export const generateNftMetadata = (
  courseName: string,
  account: string,
  courceId: string
): string => {
  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0];
  // 这里你可以生成一个图像 URI，或使用课程名称来生成一个唯一的图像/元数据
  // 示例：生成一个包含课程名称的图像 bafybeidd67orffzq3e5cfey27yoccqre54groadtaxarcitiyj3ldjzrdi
  const nftImage = `bafybeidd67orffzq3e5cfey27yoccqre54groadtaxarcitiyj3ldjzrdi`;
  const nftMetadata = {
    name: `${courseName} NFT`,
    description: `这是购买课程 ${courseName} 后获得的 NFT`,
    image: nftImage,
    attributes: [
      {
        trait_type: "Course Name",
        value: courseName,
      },
      {
        trait_type: "课程ID",
        value: courceId,
      },
      {
        trait_type: "学员地址",
        value: account,
      },
      {
        trait_type: "购买时间",
        value: formattedDate,
      },
    ],
  };

  // 将元数据转换为 JSON 字符串并返回
  return `data:application/json;base64,${Buffer.from(
    JSON.stringify(
      nftMetadata,
      (key, value) => (typeof value === "bigint" ? value.toString() : value) // 处理 BigInt 转字符串
    )
  ).toString("base64")}`;
};

export const getEthereumProvider = () => {
  if (typeof window !== "undefined") {
    return new ethers.BrowserProvider(
      window.ethereum as unknown as ethers.Eip1193Provider
    );
  } else {
    console.error("MetaMask 未安装");
    return null;
  }
};

export const isClient = () => typeof window !== "undefined";
export const CONTRACT_ADDRESS = "0xC926e252e31Ea9450230decd200F6538133DA0a0";

export const YD_TOKEN_ADDRESS = "0x4Ee7e7E6104451c65ecFe94B6878e1025B02ccA8";

export const NFT_CONTRACT_ADDRESS =
  "0x0245da269fB6688068c0Be3A4EC0377cf5328dB6";
