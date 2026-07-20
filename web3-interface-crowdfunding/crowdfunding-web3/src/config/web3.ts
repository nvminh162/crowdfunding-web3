import { createAppKit } from '@reown/appkit/react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { sepolia, type AppKitNetwork } from '@reown/appkit/networks';
import { http } from 'viem';

// 1. Reown Project ID từ environment variable (.env)
export const projectId = import.meta.env.VITE_PROJECT_ID || '';

// 2. Alchemy Sepolia RPC URL từ environment variable (.env)
export const ALCHEMY_SEPOLIA_RPC_URL = import.meta.env.VITE_ALCHEMY_SEPOLIA_RPC_URL || '';

// 3. Danh sách mạng Sepolia Testnet
export const networks: [AppKitNetwork, ...AppKitNetwork[]] = [sepolia];

// 4. Khởi tạo Wagmi Adapter
export const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks,
  transports: {
    [sepolia.id]: http(ALCHEMY_SEPOLIA_RPC_URL),
  },
});

// 5. Khởi tạo Reown AppKit Modal
export const modal = createAppKit({
  adapters: [wagmiAdapter],
  networks,
  defaultNetwork: sepolia,
  projectId,
  metadata: {
    name: 'Crowdfunding dApp',
    description: 'Crowdfunding Web3 Interface',
    url: 'http://localhost:5173',
    icons: ['https://assets.reown.com/reown-profile-pic.png'],
  },
  themeMode: 'light',
});
