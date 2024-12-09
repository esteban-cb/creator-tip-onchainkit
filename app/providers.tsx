'use client';

import { base } from 'wagmi/chains';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import type { ReactNode } from 'react';

/**
 * Providers Component
 * Configures the OnchainKit provider with:
 * - Base network support
 * - Automatic dark/light mode detection
 * - Wallet connection capabilities
 * 
 * Required Environment Variables:
 * - NEXT_PUBLIC_ONCHAINKIT_API_KEY: API key for OnchainKit services
 */
export function Providers(props: { children: ReactNode }) {
  return (
    <OnchainKitProvider
      apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
      chain={base}
      config={{ 
        appearance: { 
          mode: 'auto',
        }
      }}
    >
      {props.children}
    </OnchainKitProvider>
  );
}

