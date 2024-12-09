'use client';

// Import required components from OnchainKit for wallet connection and identity
import { 
  ConnectWallet, 
  Wallet, 
  WalletDropdown,
  WalletDropdownDisconnect,
  WalletDropdownBasename,
  WalletDropdownLink
} from '@coinbase/onchainkit/wallet';
import { Avatar, Name, Address, Identity } from '@coinbase/onchainkit/identity';
import TipCreator from './components/TipCreator';
import { useAccount } from 'wagmi';

/**
 * Main App Component
 * Provides wallet connection functionality and layout structure
 * Features:
 * - Wallet connection button
 * - User identity display
 * - Wallet management dropdown
 * - Links to explore wallet on Base network
 */
export default function App() {
  const { isConnected, address } = useAccount();

  return (
    <div className="flex flex-col min-h-screen font-sans dark:bg-background dark:text-white bg-white text-black">
      <header className="p-4">
        <div className="flex justify-end">
          <Wallet>
            <ConnectWallet>
              <Avatar className="h-6 w-6" />
              <Name />
            </ConnectWallet>
            {isConnected && (
              <WalletDropdown>
                <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                  <Avatar />
                  <Name />
                  <Address />
                </Identity>
                <WalletDropdownBasename />
                <WalletDropdownLink 
                  icon="wallet" 
                  href={`https://wallet.coinbase.com/settings/manage-wallets`}
                >
                  View Wallet
                </WalletDropdownLink>
                <WalletDropdownLink 
                  icon="wallet" 
                  href={`https://basescan.org/address/${address}`}
                >
                  View on Explorer
                </WalletDropdownLink>
                <WalletDropdownDisconnect />
              </WalletDropdown>
            )}
          </Wallet>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-4">
       
          
          <TipCreator />
        
      </main>
    </div>
  );
}
