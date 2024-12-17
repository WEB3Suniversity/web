"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function UserPage() {
  const [userAccount, setUserAccount] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const account = localStorage.getItem("user_account");
      if (!account) {
        router.push("/");
      } else {
        setUserAccount(account);
      }
    }
  }, [router]);

  // 下面是伪数据，可根据需要替换为真实API数据
  const nftList = [
    {
      id: 1,
      image: "https://via.placeholder.com/300x200.png?text=NFT+1",
      title: "My First NFT",
      desc: "Collected on Jan 1, 2024",
    },
    {
      id: 2,
      image: "https://via.placeholder.com/300x200.png?text=NFT+2",
      title: "Rare Artwork",
      desc: "Collected on Feb 10, 2024",
    },
    {
      id: 3,
      image: "https://via.placeholder.com/300x200.png?text=NFT+3",
      title: "Exclusive Edition",
      desc: "Collected on Mar 20, 2024",
    },
  ];

  if (!userAccount) {
    return (
      <p className="text-white bg-[#0f172a] min-h-screen p-6">正在跳转...</p>
    );
  }

  return (
    <div className="text-white bg-[#0f172a] min-h-screen px-6 py-10">
      {/* 用户信息区 */}
      <div className="max-w-3xl mx-auto flex flex-col items-center text-center space-y-4">
        <img
          src="https://via.placeholder.com/100x100.png?text=User"
          alt="User Avatar"
          className="w-24 h-24 rounded-full border-2 border-blue-500"
        />
        <h1 className="text-2xl font-semibold">
          {userAccount.slice(0, 6)}...{userAccount.slice(-4)}
        </h1>
        <p className="text-gray-300">
          欢迎来到您的个人空间。这里展示您的NFT收藏和基本资料。
        </p>
      </div>

      {/* 分割线 */}
      <div className="border-b border-gray-600 my-10 max-w-3xl mx-auto"></div>

      {/* 内容区，例如NFT列表 */}
      <div className="max-w-5xl mx-auto">
        <h2 className="text-xl font-semibold mb-6">我的收藏 (NFTs)</h2>
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {nftList.map((nft) => (
            <div
              key={nft.id}
              className="bg-[#1e293b] rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow"
            >
              <img
                src={nft.image}
                alt={nft.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-bold mb-2 text-white">
                  {nft.title}
                </h3>
                <p className="text-gray-400">{nft.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 更多内容... 可以是用户文章列表或其它信息 */}
      {/* <div className="max-w-5xl mx-auto mt-10">
        <h2 className="text-xl font-semibold mb-6">我的文章</h2>
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-3">
          <div className="bg-[#1e293b] rounded-lg p-4">
            <h3 className="text-lg font-bold text-white mb-2">文章标题</h3>
            <p className="text-gray-400 text-sm">文章摘要介绍...</p>
          </div>
          ... 更多文章卡片
        </div>
      </div> */}
    </div>
  );
}
