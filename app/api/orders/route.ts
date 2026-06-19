import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // Only include fields that definitely exist
    const orderData: any = {}
    if (body.customer_name) orderData.customer_name = body.customer_name
    if (body.phone) orderData.phone = body.phone
    // Don't assume any other columns exist

    const { data, error } = await supabase
      .from('orders')
      .insert([orderData])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ order: data })
  } catch (err: any) {
    console.error('Orders POST error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ orders: data })
  } catch (err: any) {
    console.error('Orders API error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, status } = await req.json()

    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ order: data })
  } catch (err: any) {
    console.error('Orders API error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
