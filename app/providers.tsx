'use client';

import { base } from 'wagmi/chains';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';

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
  const [apiKey, setApiKey] = useState<string>('');

  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (data.apiKey) {
          setApiKey(data.apiKey);
        }
      })
      .catch(error => console.error('Failed to fetch API key:', error));
  }, []);

  if (!apiKey) {
    return null; // or a loading state
  }

  return (
    <OnchainKitProvider
      apiKey={apiKey}
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

