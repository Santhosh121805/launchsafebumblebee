import { createContext } from 'react';
import { WalletState } from '@/hooks/useWallet';

export interface WalletContextType extends WalletState {
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  formatAddress: (address: string) => string;
  isMetaMaskInstalled: () => boolean;
}

export const WalletContext = createContext<WalletContextType | undefined>(undefined);
