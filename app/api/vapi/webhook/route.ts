import { NextResponse } from 'next/server'

interface VapiWebhookRequest {
  action: string
  phone?: string
}

interface VapiWebhookResponse {
  success: boolean
  order_url?: string
  sms_message?: string
  error?: string
}

export async function POST(req: Request): Promise<NextResponse<VapiWebhookResponse>> {
  try {
    // Validate webhook secret
    const authHeader = req.headers.get('authorization')
    const expectedSecret = process.env.VAPI_WEBHOOK_SECRET

    if (!expectedSecret) {
      console.error('VAPI_WEBHOOK_SECRET not configured')
      return NextResponse.json(
        { success: false, error: 'Webhook secret not configured' },
        { status: 500 }
      )
    }

    if (!authHeader || authHeader !== `Bearer ${expectedSecret}`) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body: VapiWebhookRequest = await req.json()

    // Handle send_order_link action
    if (body.action === 'send_order_link') {
      // Build order URL using NEXT_PUBLIC_APP_URL (fallback to localhost for dev)
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
      const orderUrl = `${baseUrl}/#menu`

      // SMS message content
      const smsMessage = `Bonjour, voici le lien pour commander rapidement chez Pizza Club Fameck : ${orderUrl}`

      // Return success response (SMS sending not implemented, just return message)
      return NextResponse.json({
        success: true,
        order_url: orderUrl,
        sms_message: smsMessage,
      })
    }

    // Unknown action
    return NextResponse.json(
      { success: false, error: `Unknown action: ${body.action}` },
      { status: 400 }
    )
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    console.error('Vapi webhook error:', errorMessage)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
