"use client";

import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
// import { useRouter } from "next/navigation";
import Image from "next/image";

import { NFT_ABI } from "@/utils/NFT_ABI";
import {
  getEthereumProvider,
  isClient,
  NFT_CONTRACT_ADDRESS,
  parseDataToJson,
} from "@/utils";
import dynamic from "next/dynamic";

const Avatar = dynamic(() => import("@/components/Jazzicon"), { ssr: false });

interface CustomDeferredTopicFilter {
  address?: string;
  fromBlock?: number;
  toBlock?: number;
  topics?: Array<string | null>;
}

export default function UserPage() {
  const [userAccount, setUserAccount] = useState<string | null>(null);
  const [nftList, setNftList] = useState<{ id: number; uri: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 获取用户账号
  const fetchUserAccount = async () => {
    if (!isClient()) return;

    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(
          window.ethereum as ethers.providers.ExternalProvider
        );
        const signer = await provider.getSigner();
        const account = await signer.getAddress();
        setUserAccount(account);
        fetchNFTs(account); // 获取NFT列表
      } catch (err) {
        setError("无法连接到钱包");
        console.error(err);
      }
    } else {
      setError("未安装钱包扩展");
    }
  };

  useEffect(() => {
    fetchUserAccount();
  }, []);

  // 获取用户NFT
  const fetchNFTs = async (account: string) => {
    if (!isClient()) {
      return;
    }

    setLoading(true);
    setError(null); // 清除之前的错误

    try {
      const provider = getEthereumProvider();

      if (!provider) throw new Error("Provider initialization failed");

      const contract = new ethers.Contract(
        NFT_CONTRACT_ADDRESS,
        NFT_ABI,
        provider
      );
      if (!contract) throw new Error("Contract initialization failed");

      console.log("Fetching logs for account:", account);

      // 获取 Transfer 事件日志
      const transferFilter = contract.filters.Transfer(
        null,
        account
      ) as CustomDeferredTopicFilter;
      const transferFilterObj = {
        address: NFT_CONTRACT_ADDRESS,
        fromBlock: 0,
        toBlock: "latest",
        topics: transferFilter.topics,
      };
      const logs = await provider.getLogs(transferFilterObj);

      const nftList: { id: number; uri: string }[] = [];
      const uniqueTokenIds = new Set<number>();

      for (const log of logs) {
        const parsedLog = contract.interface.parseLog(log);

        if (!parsedLog?.args?.tokenId) {
          console.warn("TokenId is undefined in log:", log);
          continue;
        }

        const tokenId = parsedLog.args.tokenId;

        if (!uniqueTokenIds.has(Number(tokenId))) {
          uniqueTokenIds.add(Number(tokenId));

          const tokenURI = await contract.tokenURI(tokenId);

          if (tokenURI) {
            console.log(tokenURI);
            const obj = parseDataToJson(tokenURI);
            console.log(obj, "obj-obj");
            nftList.push({ id: Number(tokenId), uri: tokenURI });
          }
        }
      }

      setNftList(nftList);
    } catch (error) {
      setError("获取NFT失败");
      console.error("Failed to fetch NFTs:", error);
    } finally {
      setLoading(false);
    }
  };

  // 如果未连接钱包，显示连接提示
  if (!userAccount) {
    return (
      <div className="text-white bg-[#0f172a] min-h-screen flex justify-center items-center">
        <p className="text-white bg-[#0f172a] min-h-screen p-6">
          正在跳转或连接钱包...
        </p>
      </div>
    );
  }

  // 如果正在加载，显示加载动画
  if (loading) {
    return (
      <div className="text-white bg-[#0f172a] min-h-screen flex justify-center items-center">
        <p className="text-white">正在加载您的NFT...</p>
      </div>
    );
  }

  // 如果有错误，显示错误信息
  if (error) {
    return (
      <div className="text-white bg-[#0f172a] min-h-screen flex justify-center items-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="text-white bg-[#0f172a] min-h-screen px-6 py-10">
      {/* 用户信息区 */}
      <div className="max-w-3xl mx-auto flex flex-col items-center text-center space-y-4">
        <div>
          <Avatar address={userAccount} size={60} />
        </div>

        <h1 className="text-2xl font-semibold mt-10">
          {userAccount.slice(0, 6)}...{userAccount.slice(-4)}
        </h1>
        <p className="text-gray-300">
          欢迎来到您的个人空间。这里展示您的NFT收藏和基本资料。
        </p>
      </div>

      {/* 分割线 */}
      <div className="border-b border-gray-600 my-10 max-w-3xl mx-auto"></div>

      {/* NFT列表 */}
      <div className="max-w-5xl mx-auto">
        <h2 className="text-xl font-semibold mb-6">我的收藏 (NFTs)</h2>
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {nftList.length > 0 ? (
            nftList.map((nft) => (
              <div
                key={nft.id}
                className="bg-[#1e293b] rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow"
              >
                <Image
                  src={`https://picsum.photos/400/300?random=${Math.random()}`}
                  alt={`NFT ${nft.id}`}
                  className="w-full h-48 object-cover"
                  width={400}
                  height={300}
                  style={{
                    width: "100%",
                    height: "auto",
                    objectFit: "cover", // 替代旧的布局方式
                  }}
                />
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-2 text-white">
                    NFT #{nft.id}
                  </h3>
                  <p className="text-gray-400">Token URI: {nft.uri}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400">您还没有任何NFT。</p>
          )}
        </div>
      </div>
    </div>
  );
}
