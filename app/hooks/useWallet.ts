// hooks/useWallet.ts
import { useCallback } from 'react';
import { useConnect } from 'wagmi';

export const useWallet = () => {
  const { connectAsync, connectors } = useConnect();

  const handleConnect = useCallback(async () => {
    try {
      const connector = connectors[0]; // 通常第一个是 injected connector (MetaMask)
      await connectAsync({ connector });
    } catch (error) {
      console.error('Failed to connect:', error);
    }
  }, [connectAsync, connectors]);

  return { handleConnect };
};