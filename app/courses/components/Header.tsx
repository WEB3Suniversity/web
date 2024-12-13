"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { getChainId, readContract, writeContract } from "@wagmi/core";
import { config } from "@/config/wagmi";
import WalletConnect from "./wallet/WalletConnect";
import { useWallet } from "@/hooks/useWallet";
import Button from "./ui/Button";
import * as abiJson from "@/abi/YiDengToken.json";

const MARKET_WALLET_ADDRESS = '0x0D68A437e3b621C43BDd6AfF301a17c17Cfc858B';
const COMMUNITY_WALLET_ADDRESS = '0xF36905d7C047BB8619c8276C1f04C743526acca0';
const ownerAddr = "0xaab2a91977380E12b57940dc6A5864776e909F8a";

// 0xaab2a91977380E12b57940dc6A5864776e909F8a
// 0xaab2a91977380E12b57940dc6A5864776e909F8a

const Header = () => {
  const { abi, networks } = abiJson;
  const { address: accountArress, isConnected } = useAccount();
  const chainId = getChainId(config);

  const { handleConnect } = useWallet();
  const [showDistributeBtn, setShowDistributeBtn] = useState(false);

  useEffect(() => {
    isConnected && setShowDistributeBtn(accountArress === ownerAddr);
  }, [accountArress, isConnected]);

  const DistributeBtn = () => {
    const handleDistributeInitalTokens = async () => {
      try {
        // 使用wagmi 操作abi种合约
        const address = networks[chainId].address;

        const owner = await readContract(config, {
          address,
          abi: abi,
          functionName: 'owner'
        })
        console.log("Current owner:", owner);

        const result = await writeContract(config, {
          abi,
          address,
          functionName: "distributeInitialTokens",
          args: [accountArress, MARKET_WALLET_ADDRESS, COMMUNITY_WALLET_ADDRESS]
        });
        console.log("distributeInitialTokens:", result.toString());
      } catch (err) {
        console.error("Error reading contract", err);
      }
    };
    return (
      <Button
        onClick={handleDistributeInitalTokens}
        className="
          px-4 py-2 rounded-full font-medium text-sm text-white
          bg-gradient-to-r from-[#2563EB] to-[#7C3AED]
          transition-all duration-200 hover:opacity-90
        "
      >
        Distribute Initial Tokens
      </Button>
    );
  };

  return (
    <header className="border-b border-gray-100 py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
            Web3 Academy
          </span>
          <nav className="hidden md:flex gap-6">
            <a href="#" className="text-gray-600 hover:text-gray-900">
              Courses
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900">
              Tutorials
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900">
              Community
            </a>
          </nav>
        </div>
        {showDistributeBtn && <DistributeBtn />}

        <div className="flex items-center gap-4">
          <input
            type="search"
            placeholder="Search courses..."
            className="px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <WalletConnect onConnect={handleConnect} />
        </div>
      </div>
    </header>
  );
};

// components/layout/HeroSection.tsx
export const HeroSection = () => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 py-20 rounded-3xl mb-12">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
          Learn Web3 Development
        </h1>
        <p className="text-xl text-gray-600">
          Master blockchain development with hands-on courses and earn NFT
          certificates
        </p>
      </div>
    </div>
  );
};

export default Header;
