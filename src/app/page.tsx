'use client'
import dynamic from 'next/dynamic'
import TokenInterface from '@/app/components/TokenInterface'

const WalletConnect = dynamic(
  () => import('@/app/components/WalletConnect'),
  { ssr: false }
)

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">代币管理界面</h1>
      <WalletConnect />
      <div className="mt-8">
        <TokenInterface />
      </div>
    </main>
  )
}