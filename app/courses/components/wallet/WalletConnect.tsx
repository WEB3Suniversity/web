'use client';

// components/wallet/WalletConnect.tsx
import { useState } from 'react';
import { useAccount, useBalance, useDisconnect, useEnsName } from 'wagmi';
import { shortenAddress } from '@/utils'; // 需要创建这个工具函数
import Button from '../ui/Button';

interface WalletConnectProps {
  onConnect?: () => void;
}

const WalletConnect = ({ onConnect }: WalletConnectProps) => {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });
  const { data: ensName } = useEnsName({ address });
  const { disconnect } = useDisconnect();
  const [isOpen, setIsOpen] = useState(false);

  if (!isConnected) {
    return (
      <Button
        onClick={onConnect}
        className="
          px-4 py-2 rounded-full font-medium text-sm text-white
          bg-gradient-to-r from-[#2563EB] to-[#7C3AED]
          transition-all duration-200 hover:opacity-90
        "
      >
        Connect Wallet
      </Button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          flex items-center gap-2 px-3 py-1.5 rounded-full
          bg-gray-100 hover:bg-gray-200 transition-colors
          text-sm font-medium
        "
      >
        {/* Balance */}
        <span className="px-2 py-1 rounded-full bg-white">
          {balance?.formatted.slice(0, 6)} {balance?.symbol}
        </span>

        {/* Address/ENS */}
        <span className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          {ensName || shortenAddress(address)}
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="
          absolute right-0 mt-2 w-72 rounded-xl shadow-lg
          bg-white border border-gray-100
          z-50
        ">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-600">Connected with MetaMask</span>
              <button
                onClick={() => disconnect()}
                className="text-sm text-red-500 hover:text-red-600"
              >
                Disconnect
              </button>
            </div>

            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
              <div>
                <div className="font-medium">{ensName || shortenAddress(address)}</div>
                <div className="text-sm text-gray-500">
                  {balance?.formatted.slice(0, 6)} {balance?.symbol}
                </div>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(address || '');
                  setIsOpen(false);
                }}
                className="
                  flex-1 px-3 py-2 text-sm font-medium text-gray-700
                  bg-gray-100 rounded-lg hover:bg-gray-200
                  transition-colors
                "
              >
                Copy Address
              </button>
              <a
                href={`https://etherscan.io/address/${address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  flex-1 px-3 py-2 text-sm font-medium text-gray-700
                  bg-gray-100 rounded-lg hover:bg-gray-200
                  transition-colors text-center
                "
              >
                View on Explorer
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletConnect;