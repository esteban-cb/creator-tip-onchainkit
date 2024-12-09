'use client';

import { Checkout, CheckoutButton, CheckoutStatus } from '@coinbase/onchainkit/checkout';
import { useAccount } from 'wagmi';
import { useState } from 'react';
import { isAddress } from 'viem';

// Props interface for the TipCreator component
interface TipCreatorProps {
  hideTitle?: boolean; // Optional prop to hide the main title
}

export default function TipCreator({ hideTitle = false }: TipCreatorProps) {
  // Get wallet connection status from wagmi
  const { isConnected } = useAccount();
  
  // State management for form inputs and validation
  const [recipientAddress, setRecipientAddress] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [isValidAddress, setIsValidAddress] = useState(false);

  // Validate Ethereum address format when input changes
  const handleAddressChange = (address: string) => {
    setRecipientAddress(address);
    setIsValidAddress(isAddress(address));
  };

  // Handle payment status changes
  const handleStatus = (status: any) => {
    if (status.statusName === 'success') {
      setCustomAmount(''); // Clear custom amount after successful payment
    }
  };

  // Create a Coinbase Commerce charge for the payment
  const createChargeHandler = (amount: string) => async () => {
    try {
      const response = await fetch('/api/createCharge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, recipientAddress }),
      });
      
      if (!response.ok) throw new Error('Failed to create charge');
      const { id } = await response.json();
      return id;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };

  // Show connect wallet message if wallet is not connected
  if (!isConnected) {
    return (
      <div className="text-center p-8 rounded-3xl bg-white dark:bg-gray-900 shadow-xl">
        <div className="text-4xl mb-4">👋</div>
        <div className="font-medium mb-6">Connect your wallet to support creators</div>
      </div>
    );
  }

  // Predefined tip amounts with emojis and labels
  const fixedAmounts = [
    { amount: 5, emoji: '☕️', label: 'Coffee' },
    { amount: 10, emoji: '🍕', label: 'Pizza' },
    { amount: 20, emoji: '🎉', label: 'Party' }
  ];

  return (
    <div className="mx-auto max-w-2xl">
      {!hideTitle && (
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold mb-2">Support Creators ✨</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Buy them a coffee, pizza, or make their day!
          </p>
        </div>
      )}

      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Creator's Address</label>
            <input
              type="text"
              value={recipientAddress}
              onChange={(e) => handleAddressChange(e.target.value)}
              placeholder="0x..."
              className="w-full p-3 border border-gray-200 dark:border-gray-800 rounded-xl bg-gray-50 dark:bg-gray-800/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          </div>

          {isValidAddress && (
            <>
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4">
                <div className="flex flex-col gap-2">
                  <div className="text-sm font-medium text-purple-600 dark:text-purple-400">
                    Verified Creator Address
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      {recipientAddress.slice(0, 8)}...{recipientAddress.slice(-6)}
                    </div>
                    <a
                      href={`https://basescan.org/address/${recipientAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400"
                    >
                      View on Basescan
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              <div className="grid gap-4">
                {fixedAmounts.map(({ amount, emoji, label }) => (
                  <div 
                    key={amount} 
                    className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{emoji}</div>
                        <div className="font-medium">{label}</div>
                      </div>
                      <div className="text-purple-600 dark:text-purple-400 font-bold text-lg">
                        {amount} USDC
                      </div>
                    </div>
                    <Checkout 
                      chargeHandler={createChargeHandler(amount.toString())}
                      onStatus={handleStatus}
                    >
                      <CheckoutButton
                        text={`Buy ${label} for ${amount} USDC`}
                        coinbaseBranded
                        className="w-full !bg-purple-600 hover:!bg-purple-700"
                      />
                      <CheckoutStatus />
                    </Checkout>
                  </div>
                ))}
                
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-3">
                    <div className="font-medium">Custom Amount</div>
                    <input
                      type="number"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      placeholder="0"
                      min="0"
                      className="w-32 p-2 text-right border border-gray-200 dark:border-gray-800 rounded-lg bg-white/50 dark:bg-black/20 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                  </div>
                  {customAmount && Number(customAmount) > 0 && (
                    <Checkout 
                      chargeHandler={createChargeHandler(customAmount)}
                      onStatus={handleStatus}
                    >
                      <CheckoutButton 
                        text={`Support with ${customAmount} USDC`}
                        coinbaseBranded
                        className="w-full !bg-purple-600 hover:!bg-purple-700"
                      />
                      <CheckoutStatus />
                    </Checkout>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}