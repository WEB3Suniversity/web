"use client";

import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { metaMaskStore } from "@/connections/metaMask";
import { getEthereumProvider, isClient, YD_TOKEN_ADDRESS } from "@/utils";
// import { CONTRACT_ABI } from "@/utils/CONTRACT_ABI";
import { YD_TOKEN_ABI } from "@/utils/YiDengToKen_ABI";
// const { useIsActive } = hooks;

interface ExchangeModalProps {
  onClose: () => void;
}

const ExchangeModal: React.FC<ExchangeModalProps> = ({ onClose }) => {
  const [webaiBalance, setWebaiBalance] = useState<string>("0");
  const [ethBalance, setEthBalance] = useState<string>("0");
  const [exchangeAmount, setExchangeAmount] = useState<string>("");
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [account, setAccount] = useState<string | null>(null);

  const [ydTokenContract, setYdTokenContract] =
    useState<ethers.Contract | null>(null);

  console.log("MetaMask Store State:", metaMaskStore.getState());
  useEffect(() => {
    const init = async () => {
      if (isClient()) {
        const ethProvider = getEthereumProvider();
        if (!ethProvider) return;
        const signer = await ethProvider.getSigner();
        const accountAddress = await signer.getAddress();
        const tokenInstance = new ethers.Contract(
          YD_TOKEN_ADDRESS,
          YD_TOKEN_ABI,
          signer
        );
        // const contractInstance = new ethers.Contract(
        //   CONTRACT_ADDRESS,
        //   CONTRACT_ABI,
        //   signer
        // );
        setSigner(signer);
        setAccount(accountAddress);
        setYdTokenContract(tokenInstance);
      }
    };
    init();
  }, []);
  // 加载余额
  useEffect(() => {
    const loadBalances = async () => {
      if (!ydTokenContract || !signer || !account) return;
      const balance = await ydTokenContract.balanceOf(account);
      const ethBalance = await signer.provider.getBalance(account);
      setWebaiBalance(ethers.formatUnits(balance, 0));
      setEthBalance(ethers.formatEther(ethBalance));
    };
    loadBalances();
  }, [ydTokenContract, signer, account]);

  const handleExchange = async () => {
    if (!ydTokenContract || !signer || !exchangeAmount) return;
    try {
      const amountToExchange = ethers.parseUnits(exchangeAmount, 18);
      // 假设合约有一个 exchangeToEth 方法进行兑换
      const tx = await ydTokenContract.exchangeToEth(amountToExchange);
      await tx.wait();
      alert("兑换成功！");
      onClose();
    } catch (error: unknown) {
      const err = error as Error; // 类型断言为 Error
      console.error("兑换失败:", err.message);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-900 p-6 rounded shadow-lg text-white w-96">
        <h2 className="text-2xl font-bold mb-4">WebAI 与 SETH 兑换</h2>
        <p>当前 WebAI 余额: {webaiBalance} WebAI</p>
        <p>当前 ETH 余额: {ethBalance} ETH</p>

        <div className="my-4">
          <input
            type="text"
            placeholder="输入兑换数量 (WebAI)"
            value={exchangeAmount}
            onChange={(e) => setExchangeAmount(e.target.value)}
            className="w-full p-2 rounded text-black"
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 rounded mr-2 hover:bg-gray-500"
          >
            取消
          </button>
          <button
            onClick={handleExchange}
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
          >
            兑换
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExchangeModal;
