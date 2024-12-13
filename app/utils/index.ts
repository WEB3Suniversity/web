// utils.ts

interface DebounceOptions {
  leading?: boolean; // 是否在延迟开始前调用
  trailing?: boolean; // 是否在延迟结束后调用
  maxWait?: number; // 最大等待时间
}

export const shortenAddress = (address: string | undefined) => {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number,
  options: DebounceOptions = {}
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  let timeoutId: NodeJS.Timeout | undefined;
  let lastCallTime: number | undefined;
  let lastArgs: Parameters<T> | undefined;
  const { leading = false, trailing = true, maxWait } = options;

  return function (...args: Parameters<T>): Promise<ReturnType<T>> {
    const now = Date.now();

    return new Promise((resolve) => {
      // 如果是第一次调用并且设置了 leading
      if (!lastCallTime && leading) {
        lastCallTime = now;
        resolve(func.apply(this, args));
        return;
      }

      // 清除之前的定时器
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // 保存最后一次调用的参数
      lastArgs = args;

      // 检查是否超过最大等待时间
      if (maxWait && lastCallTime && now - lastCallTime >= maxWait) {
        lastCallTime = now;
        resolve(func.apply(this, args));
        return;
      }

      // 设置新的定时器
      timeoutId = setTimeout(() => {
        if (trailing && lastArgs) {
          lastCallTime = Date.now();
          resolve(func.apply(this, lastArgs));
          lastArgs = undefined;
        }
      }, delay);
    });
  };
}
