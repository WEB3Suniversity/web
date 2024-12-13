'use client';

import React from 'react';
import { useAccount, useBalance } from 'wagmi';

const AccountInfo = () => {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({
    address: address,
  });

  if (!isConnected) {
    return (
      <div className="p-4 rounded-lg bg-gray-100">
        <p className="text-gray-600">Wallet not connected</p>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-lg bg-white shadow-md">
      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-medium text-gray-700">Account Info</h3>
          
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Address:</span>
            <span className="font-mono text-sm">
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gray-600">Balance:</span>
            <span className="font-medium">
              {balance ? (
                <>
                  {parseFloat(balance?.formatted).toFixed(4)} {balance?.symbol}
                </>
              ) : (
                'Loading...'
              )}
            </span>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <a 
            href={`https://etherscan.io/address/${address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-500 hover:text-blue-600"
          >
            View on Etherscan
          </a>
        </div>
      </div>
    </div>
  );
};

export default AccountInfo;