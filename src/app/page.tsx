'use client'
import dynamic from 'next/dynamic'
import TokenInterface from '@/app/components/TokenInterface'
import CourseInterface from '@/app/components/CourseInterface'

const WalletConnect = dynamic(
  () => import('@/app/components/WalletConnect'),
  { ssr: false }
)

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4 space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Web3大学课程平台</h1>
        
        {/* 钱包连接 */}
        <WalletConnect />
        
        {/* 代币信息 */}
        <TokenInterface />
        
        {/* 课程列表 */}
        <CourseInterface />
      </div>
    </main>
  );
}