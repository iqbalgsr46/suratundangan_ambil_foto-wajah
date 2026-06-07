import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { image, caption } = body;
    
    if (!image) {
      return NextResponse.json({ error: 'Image is required' }, { status: 400 });
    }

    // Mengambil token dari Environment Variables Vercel
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.error('Telegram credentials belum dikonfigurasi di Vercel.');
      return NextResponse.json({ error: 'Server misconfiguration: Token not found' }, { status: 500 });
    }

    // Convert base64 kembali menjadi Blob/Buffer
    const base64Data = image.split(',')[1];
    const buffer = Buffer.from(base64Data, 'base64');
    const blob = new Blob([buffer], { type: 'image/jpeg' });

    const telegramFormData = new FormData();
    telegramFormData.append('chat_id', TELEGRAM_CHAT_ID);
    telegramFormData.append('photo', blob, 'capture.jpg');
    
    if (caption) {
      telegramFormData.append('caption', caption);
    }

    // Meneruskan foto ke API Telegram
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, {
      method: 'POST',
      body: telegramFormData
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Telegram API Error:', data);
      throw new Error(data.description || 'Gagal mengirim ke Telegram');
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('API Route Error:', error.message || error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
