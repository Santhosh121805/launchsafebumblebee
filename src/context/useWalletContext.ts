import React from 'react';
import { WalletContext, WalletContextType } from './createWalletContext';

export const useWalletContext = (): WalletContextType => {
  const context = React.useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWalletContext must be used within a WalletProvider');
  }
  return context;
};
