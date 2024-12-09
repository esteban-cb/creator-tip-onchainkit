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
 * - NEXT_PUBLIC_COINBASE_COMMERCE_API_KEY: Your Coinbase Commerce API key
 * - NEXT_PUBLIC_COINBASE_COMMERCE_API_URL: Coinbase Commerce API endpoint
 * 
 * @param {Request} req - Request object containing amount and recipient address
 * @returns {Promise<Response>} JSON response with charge ID or error
 */
export async function POST(req: Request) {
  try {
    // Extract payment details from request body
    const { amount, recipientAddress } = await req.json();

    // Verify API key is set
    if (!process.env.NEXT_PUBLIC_COINBASE_COMMERCE_API_KEY) {
      console.error('API Key not found');
      throw new Error('Coinbase Commerce API key is not set');
    }

    // Configure Coinbase Commerce API request
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-CC-Api-Key': process.env.NEXT_PUBLIC_COINBASE_COMMERCE_API_KEY
      },
      body: JSON.stringify({
        name: 'Creator Tip',
        description: `Tip of $${amount} USDC`,
        pricing_type: 'fixed_price',
        local_price: {
          amount,
          currency: 'USD'
        },
        requested_info: [],
        payment_method_types: ['crypto'],
        // Store recipient address in metadata for reference
        metadata: {
          recipientAddress,
          orderId: Date.now().toString()
        },
        // Redirect to block explorer after payment
        redirect_url: `https://basescan.org/address/${recipientAddress}`,
        // Specify USDC recipient address
        addresses: {
          usdc: recipientAddress
        }
      }),
    };

    // Create charge with Coinbase Commerce
    const response = await fetch(process.env.NEXT_PUBLIC_COINBASE_COMMERCE_API_URL as string, options);
    
    // Handle API errors
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Coinbase API Error:', errorData);
      throw new Error(`Coinbase API error: ${response.status}`);
    }

    // Return charge ID on success
    const data = await response.json();
    return NextResponse.json({ id: data.data.id });
  } catch (error) {
    // Error handling with proper status code
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error occurred' },
      { status: 500 }
    );
  }
}