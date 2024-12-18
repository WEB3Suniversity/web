import { useState } from 'react';
import { ethers } from 'ethers';
import { hooks } from '@/app/providers/Web3Provider';

const TOKEN_ABI = [
  "function transfer(address to, uint256 amount) returns (bool)",
];

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  tokenSymbol: string;
}

export default function TransferModal({ isOpen, onClose, onSuccess, tokenSymbol }: TransferModalProps) {
  const { useProvider, useAccounts } = hooks;
  const provider = useProvider();
  const accounts = useAccounts();
  const account = accounts?.[0];

  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!provider || !account) {
      setError('请先连接钱包');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        '0x7f22a42b561a6f09fd0B1b4BB8986A47778f383A',
        TOKEN_ABI,
        signer
      );

      const amountWei = ethers.utils.parseEther(amount);
      const tx = await contract.transfer(recipientAddress, amountWei);
      await tx.wait();

      onSuccess();
      onClose();
      setAmount('');
      setRecipientAddress('');
    } catch (err: any) {
      console.error('转账失败:', err);
      setError(err.message || '转账失败');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg max-w-lg w-full mx-4">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-xl font-semibold text-gray-900">转账 {tokenSymbol}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleTransfer} className="p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                接收地址
              </label>
              <input
                type="text"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="0x..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                转账数量
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="0.0"
                step="0.000000000000000001"
                required
              />
            </div>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="mt-6 flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
              disabled={loading}
            >
              取消
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded-lg text-white ${
                loading
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
              disabled={loading}
            >
              {loading ? '转账中...' : '确认转账'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}