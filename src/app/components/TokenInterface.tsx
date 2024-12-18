import { useState, useEffect } from 'react';
import { ethers, utils } from 'ethers';
import { hooks } from '@/app/providers/Web3Provider';
import TokenBalanceCard from './TokenBalanceCard';

// 合约 ABI 定义了我们需要与合约交互的函数接口
const TOKEN_ABI = [
  "function balanceOf(address account) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)"
];

// 从环境变量获取代币合约地址
const NEXT_PUBLIC_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_ADDRESS || '';

export default function TokenInterface() {
  // 使用 web3-react hooks 获取必要的连接信息
  const { useProvider, useAccounts, useIsActive } = hooks;
  const provider = useProvider();
  const accounts = useAccounts();
  const isActive = useIsActive();

  // 获取当前连接的账户地址
  const account = accounts?.[0];

  // 组件状态管理
  const [tokenContract, setTokenContract] = useState<ethers.Contract | null>(null);
  const [balance, setBalance] = useState('0');
  const [tokenInfo, setTokenInfo] = useState({ name: '', symbol: '', decimals: 18 });

  // 当提供者和合约地址可用时初始化合约
  useEffect(() => {
    if (provider && NEXT_PUBLIC_TOKEN_ADDRESS) {
      // 创建只读合约实例
      const contract = new ethers.Contract(NEXT_PUBLIC_TOKEN_ADDRESS, TOKEN_ABI, provider);
      setTokenContract(contract);

      // 获取代币的基本信息
      const fetchTokenInfo = async () => {
        try {
          const [name, symbol, decimals] = await Promise.all([
            contract.name(),
            contract.symbol(),
            contract.decimals()
          ]);
          setTokenInfo({ name, symbol, decimals });
        } catch (err) {
          console.error('获取代币信息失败:', err);
        }
      };
      
      fetchTokenInfo();
    }
  }, [provider]);

  // 当账户或合约实例更改时更新余额
  useEffect(() => {
    const fetchBalance = async () => {
      if (tokenContract && account) {
        try {
          const balance = await tokenContract.balanceOf(account);
          setBalance(utils.formatEther(balance));
        } catch (err) {
          console.error('获取余额失败:', err);
        }
      }
    };

    if (isActive) {
      fetchBalance();
    }
  }, [tokenContract, account, isActive]);


  // 如果钱包未连接，显示提示信息
  if (!isActive) {
    return (
      <div className="max-w-lg mx-auto p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-700">请先连接钱包以使用代币功能</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <TokenBalanceCard
        balance={balance}
        symbol={tokenInfo.symbol}
        onTransferSuccess={async () => {
          if (tokenContract && account) {
            const newBalance = await tokenContract.balanceOf(account);
            setBalance(utils.formatEther(newBalance));
          }
        }}
      />
    </div>
  );
}