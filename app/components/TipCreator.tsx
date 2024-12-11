'use client';

import { Checkout, CheckoutButton, CheckoutStatus } from '@coinbase/onchainkit/checkout';
import { IdentityCard } from '@coinbase/onchainkit/identity';
import { useAccount } from 'wagmi';
import { useState } from 'react';
import { isAddress } from 'viem';
import { toast } from 'react-hot-toast';
import { base } from 'wagmi/chains';

interface TipCreatorProps {
  hideTitle?: boolean;
}

function CreatorInfo({ address }: { address: `0x${string}` }) {
  return (
    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4">
      <IdentityCard 
        address={address}
        chain={base}
      />
    </div>
  );
}

// Utility functions for name resolution
const resolveEnsName = async (name: string) => {
  try {
    const response = await fetch(`https://api.ensideas.com/ens/resolve/${name}`);
    const data = await response.json();
    console.log('ENS Resolution:', data);
    return data?.address;
  } catch (error) {
    console.error('ENS resolution error:', error);
    return null;
  }
};

const resolveBaseName = async (name: string) => {
  try {
    const response = await fetch(`https://api.web3.bio/profile/${name}`);
    const data = await response.json();
    console.log('Base Resolution:', data);
    return data?.address;
  } catch (error) {
    console.error('Base resolution error:', error);
    return null;
  }
};

export default function TipCreator({ hideTitle = false }: TipCreatorProps) {
  const { isConnected } = useAccount();
  const [originalInput, setOriginalInput] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [isValidAddress, setIsValidAddress] = useState(false);
  const [isResolving, setIsResolving] = useState(false);

  const handleAddressChange = async (input: string) => {
    console.log('Input changed:', input);
    setOriginalInput(input);
    setIsValidAddress(false);
    setRecipientAddress('');
    setIsResolving(true);
    
    try {
      if (!input) {
        return;
      }

      // Check if it's already a valid Ethereum address
      if (isAddress(input)) {
        setRecipientAddress(input as `0x${string}`);
        setIsValidAddress(true);
        return;
      }

      // Handle .base.eth names
      if (input.endsWith('.base.eth')) {
        const address = await resolveBaseName(input);
        if (address && isAddress(address)) {
          setRecipientAddress(address as `0x${string}`);
          setIsValidAddress(true);
          return;
        }
      }

      // Handle .eth names
      if (input.endsWith('.eth')) {
        const address = await resolveEnsName(input);
        if (address && isAddress(address)) {
          setRecipientAddress(address as `0x${string}`);
          setIsValidAddress(true);
          return;
        }
      }
    } catch (error) {
      console.error('Resolution error:', error);
    } finally {
      setIsResolving(false);
    }
  };

  const handleStatus = (status: { statusName: string; statusData?: any }) => {
    if (status.statusName === 'success') {
      setCustomAmount('');
      toast.custom((t) => (
        <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} 
          max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg pointer-events-auto 
          flex flex-col items-center p-6`}>
          <div className="text-4xl mb-4">🎉</div>
          <div className="text-xl font-medium mb-2 dark:text-white">Payment Successful!</div>
          <div className="text-gray-600 dark:text-gray-400 text-center">
            Thank you for supporting {originalInput || 'the creator'}
          </div>
          <a
            href={`https://basescan.org/address/${recipientAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 text-purple-600 hover:text-purple-700 dark:text-purple-400 text-sm flex items-center gap-1"
          >
            View on Basescan
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
            </svg>
          </a>
        </div>
      ), {
        duration: 5000,
        position: 'top-center',
      });
    } else if (status.statusName === 'error') {
      toast.error('Payment failed. Please try again.');
    }
  };

  const createChargeHandler = (amount: string) => async () => {
    try {
      const response = await fetch('/api/createCharge', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          amount: Number(amount), 
          recipientAddress,
          recipientName: originalInput 
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create charge');
      }
  
      const data = await response.json();
      return data.data.id;
    } catch (error) {
      console.error('Error creating charge:', error);
      toast.error('Failed to create payment. Please try again.');
      throw error;
    }
  };

  if (!isConnected) {
    return (
      <div className="text-center p-8 rounded-3xl bg-white dark:bg-gray-900 shadow-xl">
        <div className="text-4xl mb-4">👋</div>
        <div className="font-medium mb-6">Connect your wallet to support creators</div>
      </div>
    );
  }

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
            <label className="block text-sm font-medium mb-2">
              Creator&apos;s Address or Name
            </label>
            <div className="relative">
              <input
                type="text"
                value={originalInput}
                onChange={(e) => handleAddressChange(e.target.value)}
                placeholder="0x... or name.eth or name.base.eth"
                className="w-full p-3 border border-gray-200 dark:border-gray-800 rounded-xl 
                  bg-gray-50 dark:bg-gray-800/50 focus:ring-2 focus:ring-purple-500 
                  focus:border-transparent transition-all"
              />
              {isResolving && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="animate-spin h-5 w-5 border-2 border-purple-500 rounded-full border-t-transparent"></div>
                </div>
              )}
            </div>
          </div>

          {isValidAddress && recipientAddress && (
            <>
              <CreatorInfo address={recipientAddress as `0x${string}`} />
              <div className="grid gap-4">
                {fixedAmounts.map(({ amount, emoji, label }) => (
                  <div key={amount} className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
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