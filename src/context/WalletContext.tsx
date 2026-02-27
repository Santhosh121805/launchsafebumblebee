import React, { ReactNode } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { WalletContext, WalletContextType } from './createWalletContext';

export type { WalletContextType };

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const wallet = useWallet();

  return (
    <WalletContext.Provider value={wallet}>
      {children}
    </WalletContext.Provider>
  );
};
