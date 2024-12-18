import { useState } from 'react';
import TransferModal from './TransferModal';

interface TokenBalanceCardProps {
  balance: string;
  symbol: string;
  onTransferSuccess: () => void;
}

export default function TokenBalanceCard({ balance, symbol, onTransferSuccess }: TokenBalanceCardProps) {
  const [isTransferModalOpen, setTransferModalOpen] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{symbol} 余额</h3>
          <p className="text-3xl font-bold mt-1">{balance}</p>
        </div>
        <button
          onClick={() => setTransferModalOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          转账
        </button>
      </div>

      <TransferModal
        isOpen={isTransferModalOpen}
        onClose={() => setTransferModalOpen(false)}
        onSuccess={onTransferSuccess}
        tokenSymbol={symbol}
      />
    </div>
  );
}