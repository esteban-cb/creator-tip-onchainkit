import { NextResponse } from 'next/server';

/**
 * Coinbase Commerce Charge Creation API
 * 
 * Creates a payment charge for tipping creators using USDC on Base network
 * 
 * Features:
 * - Fixed price charges in USD
 * - Direct USDC payments to creator's address
 * - Metadata storage for transaction reference
 * - Redirect to block explorer after payment
 * 
 * Required Environment Variables:
 * - COINBASE_COMMERCE_API_KEY: Your Coinbase Commerce API key
 * - COINBASE_COMMERCE_API_URL: Coinbase Commerce API endpoint
 * 
 * @param {Request} req - Request object containing amount and recipient address
 * @returns {Promise<Response>} JSON response with charge ID or error
 */
export async function POST(req: Request) {
  try {
    const { amount, recipientAddress } = await req.json();

    if (!process.env.COINBASE_COMMERCE_API_KEY) {
      console.error('API Key not found');
      throw new Error('Coinbase Commerce API key is not set');
    }

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-CC-Api-Key': process.env.COINBASE_COMMERCE_API_KEY
      },
      body: JSON.stringify({
        name: 'Creator Tip',
        description: `Tip of $${amount} USDC`,
        pricing_type: 'fixed_price',
        local_price: {
          amount: amount.toString(),
          currency: 'USD'
        },
        requested_info: [],
        payment_method_types: ['crypto'],
        metadata: {
          recipientAddress,
          orderId: Date.now().toString()
        },
        redirect_url: `https://basescan.org/address/${recipientAddress}`,
        addresses: {
          usdc: recipientAddress
        }
      }),
    };

    console.log('Making request to:', process.env.COINBASE_COMMERCE_API_URL);
    const response = await fetch(process.env.COINBASE_COMMERCE_API_URL as string, options);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Coinbase API error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    return NextResponse.json({ data: { id: data.data.id } });
  } catch (error) {
    console.error('Detailed error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error occurred' },
      { status: 500 }
    );
  }
}