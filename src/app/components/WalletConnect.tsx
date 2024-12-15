'use client'
import { useCallback, useEffect, useState } from 'react'
import { hooks, metaMask } from '@/app/providers/Web3Provider'
import { type BigNumber } from '@ethersproject/bignumber'
import { formatEther } from '@ethersproject/units'

const {
  useChainId,
  useAccounts,
  useIsActivating,
  useIsActive,
  useProvider
} = hooks

export default function WalletConnect() {
  // 获取钱包状态
  const chainId = useChainId()
  const accounts = useAccounts()
  const isActivating = useIsActivating()
  const isActive = useIsActive()
  const provider = useProvider()

  const [error, setError] = useState<Error | undefined>(undefined)
  const [balance, setBalance] = useState<string>('')

  // 连接钱包
  const connect = useCallback(async () => {
    setError(undefined)
    try {
      await metaMask.activate()
    } catch (err) {
      setError(err instanceof Error ? err : new Error('钱包连接失败'))
      console.error('钱包连接错误:', err)
    }
  }, [])

  // 断开连接
  const disconnect = useCallback(async () => {
    try {
      if (metaMask?.deactivate) {
        await metaMask.deactivate()
      }
    } catch (err) {
      console.error('断开连接错误:', err)
    }
  }, [])

  // 获取余额
  useEffect(() => {
    if (isActive && provider && accounts?.[0]) {
      provider.getBalance(accounts[0])
        .then((balance: BigNumber) => {
          setBalance(formatEther(balance))
        })
        .catch((err) => {
          console.error('获取余额错误:', err)
          setBalance('')
        })
    } else {
      setBalance('')
    }
  }, [isActive, provider, accounts])

  // 重置错误状态
  useEffect(() => {
    setError(undefined)
  }, [chainId, accounts])

  return (
    <div className="p-4">
      <div className="mb-4">
        {isActive ? (
          <>
            <p className="mb-2">连接状态: 已连接</p>
            <p className="mb-2">链 ID: {chainId}</p>
            <p className="mb-2">钱包地址: {accounts?.[0]}</p>
            <p className="mb-2">ETH 余额: {balance}</p>
            <button
              onClick={disconnect}
              className="bg-red-500 text-white px-4 py-2 rounded"
              disabled={isActivating}
            >
              断开连接
            </button>
          </>
        ) : (
          <>
            <p className="mb-2">连接状态: 未连接</p>
            <button
              onClick={connect}
              className="bg-blue-500 text-white px-4 py-2 rounded"
              disabled={isActivating}
            >
              {isActivating ? '连接中...' : '连接钱包'}
            </button>
          </>
        )}
      </div>
      {error && (
        <div className="text-red-500">
          错误: {error.message}
        </div>
      )}
    </div>
  )
}