import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

interface ExchangeModalProps {
  onClose: () => void;
  ydTokenContract: ethers.Contract | null;
  signer: ethers.JsonRpcSigner | null;
  account: string | null;
}

const ExchangeModal: React.FC<ExchangeModalProps> = ({
  onClose,
  ydTokenContract,
  signer,
  account,
}) => {
  const [webaiBalance, setWebaiBalance] = useState<string>("0");
  const [ethBalance, setEthBalance] = useState<string>("0");
  const [exchangeAmount, setExchangeAmount] = useState<string>("");

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
    } catch (error: any) {
      console.error("兑换失败:", error.message);
      alert("兑换失败: " + error.message);
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
