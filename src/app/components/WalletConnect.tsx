'use client'
import { useCallback, useEffect, useState } from 'react'
import { hooks, metaMask } from '@/app/providers/Web3Provider'
import { type BigNumber } from '@ethersproject/bignumber'
import { formatEther } from '@ethersproject/units'
import { useWeb3React } from '@web3-react/core'

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
  const { connector } = useWeb3React()

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
      // 直接重置状态
      await connector.resetState()
    } catch (error) {
      console.error('断开连接失败:', error)
    }
  }, [connector])

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className={`h-3 w-3 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <h3 className="text-lg font-medium text-gray-900">
                {isActive ? '已连接' : '未连接'}
              </h3>
            </div>
            
            {isActive && (
              <div className="space-y-2">
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <span className="text-sm text-gray-500">链 ID</span>
                  <span className="font-mono text-sm">{chainId}</span>
                </div>
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <span className="text-sm text-gray-500">钱包地址</span>
                  <span className="font-mono text-sm truncate max-w-[200px]">{accounts?.[0]}</span>
                </div>
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <span className="text-sm text-gray-500">ETH 余额</span>
                  <span className="font-mono text-sm">{balance}</span>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-center md:justify-end">
            {isActive ? (
              <button
                onClick={disconnect}
                className="inline-flex items-center px-6 py-3 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors duration-200"
                disabled={isActivating}
              >
                <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                断开连接
              </button>
            ) : (
              <button
                onClick={connect}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                disabled={isActivating}
              >
                <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                {isActivating ? '连接中...' : '连接钱包'}
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="mt-4 p-4 rounded-lg bg-red-50">
            <div className="flex">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error.message}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}