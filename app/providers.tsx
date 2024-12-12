'use client';

import { base } from 'wagmi/chains';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { type ReactNode, useState, useEffect } from 'react';
import { createConfig, WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http } from 'viem';
import { coinbaseWallet } from 'wagmi/connectors';

const queryClient = new QueryClient();

// Configure Base network
const baseMainnetRpc = 'https://mainnet.base.org';

const config = createConfig({
  chains: [base],
  connectors: [
    coinbaseWallet({
      appName: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME || 'Creator Tip',
      chainId: base.id,
      jsonRpcUrl: baseMainnetRpc,
    })
  ],
  transports: {
    [base.id]: http(baseMainnetRpc)
  }
});

export default function Providers({ children }: { children: ReactNode }) {
  const [apiKey, setApiKey] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (data.apiKey) {
          setApiKey(data.apiKey);
        }
      })
      .catch(console.error);
  }, []);

  if (!apiKey) return null;

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          chain={base}
          apiKey={apiKey}
          config={{
            appearance: {
              mode: 'auto',
              name: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME
            }
          }}
        >
          {children}
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}