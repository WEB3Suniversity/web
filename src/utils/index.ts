import type { Connector } from '@web3-react/types';
import { MetaMask } from '@web3-react/metamask';

/**
 * 格式化日期
 * @param date Date对象或时间戳
 * @param format 格式化模板，如 'YYYY-MM-DD HH:mm:ss'
 */
export const formatDate = (date: Date | number | string, format: string = 'YYYY-MM-DD'): string => {
  const d = new Date(date);

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');

  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
};

/**
 * 深拷贝对象
 * @param obj 要拷贝的对象
 */
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') {
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
export const debounce = <T extends (...args: number[]) => string>(fn: T, delay: number) => {
  let timer: NodeJS.Timeout | null = null;

  return function (this: unknown, ...args: Parameters<T>) {
    if (timer) clearTimeout(timer);

    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
};
export function getName(connector: Connector) {
  if (connector instanceof MetaMask) return 'MetaMask';
  return 'Unknown';
}
