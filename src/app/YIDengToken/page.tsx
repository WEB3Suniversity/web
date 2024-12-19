"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { YD_TOKEN_ABI } from "@/utils/YiDengToKen_ABI";
import { CONTRACT_ADDRESS, getEthereumProvider, isClient } from "@/utils";

interface ContractData {
  MAX_SUPPLY?: string;
  SYMBOL?: string;
  TOKENS_PER_ETH?: string;
  allowance?: string;
  balanceOf?: string;
  communityAllocation?: string;
  decimals?: string;
  initialDistributionDone?: string;
  marketingAllocation?: string;
  name?: string;
  owner?: string;
  remainingMintableSupply?: string;
  symbol?: string;
}

export default function YIDengToken() {
  const [readOnlyContract, setReadOnlyContract] =
    useState<ethers.Contract | null>(null);
  const [account] = useState<string | null>(null);
  const [data, setData] = useState<ContractData>({});

  useEffect(() => {
    if (isClient() && window.ethereum) {
      const ethProvider = getEthereumProvider();
      if (!ethProvider) return;

      const readOnly = new ethers.Contract(
        CONTRACT_ADDRESS,
        YD_TOKEN_ABI,
        ethProvider
      );
      setReadOnlyContract(readOnly);
    } else if (!window.ethereum) {
      console.error("请安装MetaMask");
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!readOnlyContract || !account) return;

      try {
        const [
          MAX_SUPPLY,
          SYMBOL,
          TOKENS_PER_ETH,
          communityAllocation,
          decimals,
          initialDistributionDone,
          marketingAllocation,
          name,
          owner,
          remainingMintableSupply,
          symbol,
        ] = await Promise.all([
          readOnlyContract.MAX_SUPPLY?.().catch(() => null),
          readOnlyContract.SYMBOL?.().catch(() => null),
          readOnlyContract.TOKENS_PER_ETH?.().catch(() => null),
          readOnlyContract.communityAllocation?.().catch(() => null),
          readOnlyContract.decimals?.().catch(() => null),
          readOnlyContract.initialDistributionDone?.().catch(() => null),
          readOnlyContract.marketingAllocation?.().catch(() => null),
          readOnlyContract.name?.().catch(() => null),
          readOnlyContract.owner?.().catch(() => null),
          readOnlyContract.remainingMintableSupply?.().catch(() => null),
          readOnlyContract.symbol?.().catch(() => null),
        ]);

        const balanceOf = account
          ? await readOnlyContract.balanceOf(account).catch(() => null)
          : null;

        const allowance =
          account && owner
            ? await readOnlyContract.allowance(account, owner).catch(() => null)
            : null;

        setData({
          MAX_SUPPLY: MAX_SUPPLY?.toString(),
          SYMBOL: SYMBOL?.toString(),
          TOKENS_PER_ETH: TOKENS_PER_ETH?.toString(),
          allowance: allowance?.toString(),
          balanceOf: balanceOf?.toString(),
          communityAllocation: communityAllocation?.toString(),
          decimals: decimals?.toString(),
          initialDistributionDone: initialDistributionDone?.toString(),
          marketingAllocation: marketingAllocation?.toString(),
          name: name?.toString(),
          owner: owner?.toString(),
          remainingMintableSupply: remainingMintableSupply?.toString(),
          symbol: symbol?.toString(),
        });
      } catch (error) {
        console.error("获取合约数据失败：", error);
      }
    };

    fetchData();
  }, [readOnlyContract, account]);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-4">合约方法调用结果</h1>
        {account ? (
          <p className="mb-6">当前账户：{account}</p>
        ) : (
          <p className="mb-6">请连接您的钱包</p>
        )}
        <div className="overflow-x-auto">
          <table className="w-full table-auto border border-gray-300 rounded-lg bg-white text-black">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-4 border-b border-gray-300">
                  方法名
                </th>
                <th className="text-left p-4 border-b border-gray-300">
                  返回值
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(data).map(([methodName, value], index) => (
                <tr
                  key={methodName}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="p-4 border-b border-gray-300 text-gray-800 font-medium">
                    {methodName}
                  </td>
                  <td className="p-4 border-b border-gray-300 text-gray-700">
                    {value !== undefined && value !== null ? value : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
