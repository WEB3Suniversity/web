'use client'
import { Web3ReactProvider, initializeConnector } from '@web3-react/core'
import { MetaMask } from '@web3-react/metamask'
import { type ReactNode } from 'react'

// 初始化 MetaMask 连接器
export const [metaMask, hooks] = initializeConnector<MetaMask>(
  (actions) => new MetaMask({ actions })
)

// Web3 提供者包装组件
export function Web3ProviderWrapper({ children }: { children: ReactNode }) {
  return (
    <Web3ReactProvider connectors={[[metaMask, hooks]]}>
      {children}
    </Web3ReactProvider>
  )
}