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
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">代币与课程管理</h1>
      <WalletConnect />
      <div className="mt-8">
        <TokenInterface />
      </div>
      <div className="mt-8">
        <CourseInterface />
      </div>
    </main>
  )
}