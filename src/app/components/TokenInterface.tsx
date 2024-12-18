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
const TOKEN_ADDRESS = '0x7f22a42b561a6f09fd0B1b4BB8986A47778f383A';

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
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // 当提供者和合约地址可用时初始化合约
  useEffect(() => {
    if (provider && TOKEN_ADDRESS) {
      // 创建只读合约实例
      const contract = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, provider);
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
          setError('无法获取代币信息');
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
          setError('无法获取余额');
        }
      }
    };

    if (isActive) {
      fetchBalance();
    }
  }, [tokenContract, account, isActive]);

  // 处理代币转账
  const handleTransfer = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      // 验证钱包连接和输入
      if (!isActive || !account) {
        throw new Error('请先连接钱包');
      }

      if (!utils.isAddress(recipientAddress)) {
        throw new Error('无效的接收地址');
      }

      // 将输入的数量转换为 Wei
      const amountWei = utils.parseEther(amount);
      // 获取可写的合约实例
      if (!provider || !tokenContract) {
        throw new Error('Provider or token contract is not defined');
      }
      const signer = provider.getSigner();
      const tokenWithSigner = tokenContract.connect(signer);

      // 发送转账交易
      const tx = await tokenWithSigner.transfer(recipientAddress, amountWei);
      setSuccessMessage('交易已提交，等待确认...');
      
      // 等待交易被确认
      await tx.wait();
      
      // 更新余额显示
      const newBalance = await tokenContract.balanceOf(account);
      setBalance(utils.formatEther(newBalance));
      
      // 清空表单并显示成功消息
      setSuccessMessage('转账成功！');
      setAmount('');
      setRecipientAddress('');
    } catch (err) {
      console.error('转账失败:', err);
      setError(err.message || '转账失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

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