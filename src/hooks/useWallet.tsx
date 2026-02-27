import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { toast } from 'sonner';

export interface WalletState {
  address: string | null;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  chainId: number | null;
  balance: string | null;
}

const BNB_TESTNET_CHAIN_ID = 97;
const BNB_TESTNET_RPC = 'https://data-seed-prebsc-1-s1.binance.org:8545/';

// Key used to track intentional disconnects across page reloads
const MANUALLY_DISCONNECTED_KEY = 'walletManuallyDisconnected';

export const useWallet = () => {
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    isConnected: false,
    isLoading: false,
    error: null,
    chainId: null,
    balance: null,
  });

  const isMetaMaskInstalled = () => {
    return typeof window !== 'undefined' && window.ethereum !== undefined;
  };

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const fetchBalance = async (walletAddress: string) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const balanceWei = await provider.getBalance(walletAddress);
      const balanceBNB = ethers.formatEther(balanceWei);
      return parseFloat(balanceBNB).toFixed(4);
    } catch (error) {
      console.error('Failed to fetch balance:', error);
      return null;
    }
  };

  const switchToBNBTestnet = async () => {
    if (!window.ethereum) throw new Error('MetaMask is not installed');

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${BNB_TESTNET_CHAIN_ID.toString(16)}` }],
      });
    } catch (switchError: unknown) {
      const error = switchError as { code?: number };
      if (error.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: `0x${BNB_TESTNET_CHAIN_ID.toString(16)}`,
              chainName: 'BNB Testnet',
              rpcUrls: [BNB_TESTNET_RPC],
              nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
              blockExplorerUrls: ['https://testnet.bscscan.com'],
            },
          ],
        });
      } else {
        throw switchError;
      }
    }
  };

  const connectWallet = async () => {
    console.log('[useWallet] connectWallet called');
    if (!isMetaMaskInstalled()) {
      console.error('[useWallet] MetaMask not installed');
      setWallet(prev => ({ ...prev, error: 'Please install MetaMask extension' }));
      return;
    }

    console.log('[useWallet] Setting loading state and clearing manually disconnected flag');
    setWallet({
      address: null,
      isConnected: false,
      isLoading: true,
      error: null,
      chainId: null,
      balance: null,
    });

    try {
      // Clear the manual disconnect flag — user is intentionally connecting now
      localStorage.removeItem(MANUALLY_DISCONNECTED_KEY);
      
      // Force MetaMask to show account picker by revoking permissions first
      console.log('[useWallet] Revoking previous permissions to force account picker...');
      try {
        await window.ethereum.request({
          method: 'wallet_revokePermissions',
          params: [{ eth_accounts: {} }],
        });
        console.log('[useWallet] Permissions revoked - account picker will show');
      } catch (revokeError) {
        console.log('[useWallet] Revoke failed (expected if no permissions) - proceeding', revokeError);
      }
      
      console.log('[useWallet] Requesting accounts from MetaMask...');

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts', // Always shows MetaMask popup
      });

      console.log('[useWallet] Got accounts:', accounts);

      if (!accounts || accounts.length === 0) throw new Error('No account selected');

      const address = accounts[0];
      console.log('[useWallet] Selected account:', address);

      const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
      const currentChainId = parseInt(chainIdHex, 16);
      console.log('[useWallet] Current chain ID:', currentChainId);

      if (currentChainId !== BNB_TESTNET_CHAIN_ID) {
        await switchToBNBTestnet();
      }

      const balance = await fetchBalance(address);

      setWallet({
        address,
        isConnected: true,
        isLoading: false,
        error: null,
        chainId: BNB_TESTNET_CHAIN_ID,
        balance,
      });

      localStorage.setItem('walletAddress', address);
      toast.success(`🐝 Connected: ${formatAddress(address)}`);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to connect wallet';
      console.error('[useWallet] Wallet connection error:', error);
      setWallet(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      toast.error(`Failed to connect: ${errorMessage}`);
    }
  };

  const disconnectWallet = () => {
    console.log('[useWallet] disconnectWallet called');
    setWallet({
      address: null,
      isConnected: false,
      isLoading: false,
      error: null,
      chainId: null,
      balance: null,
    });

    // Mark as manually disconnected so auto-reconnect won't fire on next reload
    localStorage.setItem(MANUALLY_DISCONNECTED_KEY, 'true');
    localStorage.removeItem('walletAddress');
    console.log('[useWallet] Wallet disconnected - flag set in localStorage');

    toast.success('Wallet disconnected! See you soon Autobot! 🤖');
  };

  // Auto-reconnect on page load — ONLY if user did NOT manually disconnect
  useEffect(() => {
    const autoConnect = async () => {
      if (!isMetaMaskInstalled()) {
        console.log('[useWallet] MetaMask not installed');
        return;
      }

      // If user intentionally disconnected, skip — force them to click Connect Wallet
      const manuallyDisconnected = localStorage.getItem(MANUALLY_DISCONNECTED_KEY);
      console.log('[useWallet] Auto-connect check - manually disconnected flag:', manuallyDisconnected);
      if (manuallyDisconnected === 'true') {
        console.log('[useWallet] Skipping auto-connect - user manually disconnected');
        return;
      }

      try {
        const accounts = await window.ethereum.request({
          method: 'eth_accounts', // Silent check — no popup
        });

        if (accounts.length === 0) return;

        const address = accounts[0];
        const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
        const currentChainId = parseInt(chainIdHex, 16);
        const balance = await fetchBalance(address);

        setWallet({
          address,
          isConnected: currentChainId === BNB_TESTNET_CHAIN_ID,
          isLoading: false,
          error: currentChainId !== BNB_TESTNET_CHAIN_ID ? 'Please switch to BNB Testnet' : null,
          chainId: currentChainId,
          balance,
        });

        localStorage.setItem('walletAddress', address);
      } catch (error) {
        console.log('Auto connect failed:', error);
      }
    };

    autoConnect();
  }, []);

  // Listen for account and chain changes from MetaMask
  useEffect(() => {
    if (!isMetaMaskInstalled()) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else {
        fetchBalance(accounts[0]).then(balance => {
          setWallet(prev => ({
            ...prev,
            address: accounts[0],
            isConnected: true,
            balance,
          }));
          localStorage.setItem('walletAddress', accounts[0]);
          // Remove manual disconnect flag since MetaMask is still connected
          localStorage.removeItem(MANUALLY_DISCONNECTED_KEY);
          toast.success(`✨ Switched to: ${formatAddress(accounts[0])} Bzzzt! ⚡`);
        });
      }
    };

    const handleChainChanged = (chainId: string) => {
      const newChainId = parseInt(chainId, 16);
      setWallet(prev => ({ ...prev, chainId: newChainId }));

      if (newChainId !== BNB_TESTNET_CHAIN_ID) {
        setWallet(prev => ({
          ...prev,
          error: `Please switch to BNB Testnet (Chain ID: 97). Currently on chain ${newChainId}`,
          isConnected: false,
        }));
        toast.error('⚠️ Please switch to BNB Testnet!');
      } else {
        setWallet(prev => ({ ...prev, error: null, isConnected: true }));
        toast.success('✅ Connected to BNB Testnet');
      }
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    };
  }, []);

  // Refresh balance every 30 seconds while connected
  useEffect(() => {
    if (!wallet.isConnected || !wallet.address) return;

    const interval = setInterval(() => {
      fetchBalance(wallet.address!).then(balance => {
        setWallet(prev => ({ ...prev, balance }));
      });
    }, 30000);

    return () => clearInterval(interval);
  }, [wallet.isConnected, wallet.address]);

  return {
    ...wallet,
    connectWallet,
    disconnectWallet,
    formatAddress,
    isMetaMaskInstalled,
  };
};