# Creator Tip App

A decentralized tipping application built with Next.js and OnchainKit that allows users to support creators with cryptocurrency payments on Base network.

## Features

- Connect with Coinbase Wallet
- Send USDC tips to any Ethereum address
- Predefined tip amounts (Coffee ☕️, Pizza 🍕, Party 🎉)
- Custom tip amounts
- Dark/Light mode support
- Mobile responsive
- Direct payments to creator's wallet
- Transaction verification on Basescan

## Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- A Coinbase Commerce account and API key (get it from [Coinbase Commerce](https://commerce.coinbase.com))
- An OnchainKit API key (get it from [OnchainKit](https://onchainkit.com))
- Coinbase Wallet with USDC on Base network

## Environment Variables

Create a `.env.local` file in the root directory with:

```bash
NEXT_PUBLIC_COINBASE_COMMERCE_API_KEY=your_api_key_here
NEXT_PUBLIC_COINBASE_COMMERCE_API_URL=https://api.commerce.coinbase.com/charges
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_api_key
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/onchain-checkout-app.git
cd onchain-checkout-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser

## Usage

1. Connect your wallet using the "Connect Wallet" button
2. Enter the recipient's Ethereum address (Base network)
3. Verify the address is correct on Basescan
4. Choose a predefined amount (Coffee ☕️, Pizza 🍕, Party 🎉) or enter a custom amount
5. Complete the payment through Coinbase Commerce
6. Transaction will be viewable on Basescan

## Tech Stack

- Next.js 14 (App Router)
- OnchainKit (Wallet Connection & UI Components)
- Wagmi (Ethereum Hooks)
- TailwindCSS (Styling)
- Coinbase Commerce API (Payments)
- TypeScript (Type Safety)

## Network Support

Currently supports the Base network. The app uses USDC for payments. Make sure your wallet has USDC on Base network.

## Security

- All payments are processed through Coinbase Commerce
- Direct wallet-to-wallet transfers
- No storage of sensitive data
- All transactions are verifiable on-chain

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)