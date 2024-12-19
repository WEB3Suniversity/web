import type { MetaMaskInpageProvider } from "@metamask/providers";

// 扩展全局的 Window 接口，确保 TS 知道 `window.ethereum` 存在
declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}
interface CustomDeferredTopicFilter extends DeferredTopicFilter {
  topics?: string[]; // 添加 topics 属性
}
