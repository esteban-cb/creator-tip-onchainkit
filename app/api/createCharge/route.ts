// app/api/createCharge/route.ts
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function POST(req: Request) {
  try {
    const { amount, recipientAddress } = await req.json();
    const headersList = headers();
    const host = headersList.get('host');
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const origin = `${protocol}://${host}`;

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-CC-Api-Key': process.env.COINBASE_COMMERCE_API_KEY as string,
        'X-CC-Version': '2018-03-22'
      },
      body: JSON.stringify({
        name: 'Creator Tip',
        description: `Tip of ${amount} USDC`,
        pricing_type: 'fixed_price',
        local_price: {
          amount: amount.toString(),
          currency: 'USDC'
        },
        metadata: {
          recipientAddress,
          orderId: Date.now().toString()
        },
        redirect_url: `${origin}/success`,
        cancel_url: `${origin}/cancel`,
      }),
    };

    const response = await fetch('https://api.commerce.coinbase.com/charges', options);
    
    if (!response.ok) {
      throw new Error(`Coinbase API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Charge created:', data);

    // Return just the necessary data
    return NextResponse.json({ data: { id: data.data.id } });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error occurred' },
      { status: 500 }
    );
  }
}