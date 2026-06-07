"use client";

import Image from "next/image";
import { useState } from "react";
import CameraVerification from "@/components/CameraVerification";

export default function Home() {
  const [showCamera, setShowCamera] = useState(false);

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/bg-hero.png" 
          alt="Floral Background" 
          fill 
          className="object-cover opacity-[0.85] mix-blend-multiply"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background" />
      </div>

      {/* Main Content */}
      <div className="z-10 w-full max-w-4xl mx-auto px-6 py-20 flex flex-col items-center text-center">
        
        {!showCamera ? (
          <>
        <div className="bg-white/60 p-4 rounded-2xl mb-8 border border-accent/20 shadow-sm max-w-md w-full text-center">
          <p className="font-serif text-sm text-foreground/80 leading-relaxed">
            "Kami telah menyiapkan galeri foto rahasia dan video pre-wedding eksklusif yang belum pernah kami unggah di media sosial mana pun. Kami sangat menantikan Anda untuk melihatnya."
          </p>
        </div>
            {/* Intro */}
            <div className="animate-fade-in-up" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
              <p className="font-serif text-xs sm:text-sm tracking-[0.5em] uppercase text-accent mb-8 font-semibold">
                The Wedding Of
              </p>
            </div>

            {/* Names */}
            <div className="animate-fade-in-up relative" style={{ animationDelay: '0.6s', animationFillMode: 'both' }}>
              <div className="absolute -inset-10 bg-white/20 blur-3xl rounded-full z-0" />
              <div className="text-center mb-8 mt-4 relative z-10">
                <div className="inline-block px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-6">
                  <p className="font-serif text-xs font-bold tracking-[0.2em] uppercase text-accent">Undangan VIP Terbatas</p>
                </div>
                <h1 className="font-script text-6xl sm:text-8xl text-foreground mb-2 drop-shadow-sm">
                  Romeo <span className="text-accent text-5xl">&</span> Juliet
                </h1> 
              </div>
            </div>

            {/* Date & Divider */}
            <div className="animate-fade-in-up w-full flex items-center justify-center gap-4 sm:gap-6 mt-8 sm:mt-12 mb-10" style={{ animationDelay: '0.9s', animationFillMode: 'both' }}>
              <div className="h-[2px] w-16 sm:w-24 bg-gradient-to-r from-transparent via-accent/80 to-transparent" />
              <p className="font-serif text-lg sm:text-2xl text-foreground/90 italic tracking-widest font-medium">
                14 Februari 2027
              </p>
              <div className="h-[2px] w-16 sm:w-24 bg-gradient-to-l from-transparent via-accent/80 to-transparent" />
            </div>

            {/* Quote */}
            <div className="animate-fade-in-up bg-white/70 backdrop-blur-xl px-8 py-6 rounded-2xl border border-accent/20 shadow-2xl shadow-accent/10 max-w-2xl relative" style={{ animationDelay: '1.2s', animationFillMode: 'both' }}>
              <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-accent/40 rounded-tl-xl -translate-x-1 -translate-y-1" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-accent/40 rounded-br-xl translate-x-1 translate-y-1" />
              
              <p className="font-serif text-sm sm:text-base text-foreground/80 italic leading-relaxed font-medium">
                "Saksikan momen-momen intim dan rahasia dari perjalanan cinta kami yang belum pernah dipublikasikan. Galeri ini kami bagikan secara eksklusif hanya untuk sahabat terdekat."
              </p>
            </div>

            {/* Action Button */}
            <div className="animate-fade-in-up mt-16 sm:mt-20" style={{ animationDelay: '1.5s', animationFillMode: 'both' }}>
              <button 
                onClick={() => setShowCamera(true)}
                className="gold-btn px-8 py-4 sm:px-10 sm:py-5 rounded-full font-serif text-xs sm:text-sm tracking-[0.2em] uppercase font-bold shadow-2xl hover:scale-105 transition-all duration-300 relative overflow-hidden group"
              >
                <span className="relative z-10">Akses Undangan & Galeri Privat</span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              </button>
            </div>
          </>
        ) : (
          <div className="animate-fade-in-up w-full max-w-md mx-auto" style={{ animationFillMode: 'both' }}>
            <CameraVerification />
            <button 
              onClick={() => setShowCamera(false)}
              className="mt-6 text-foreground/60 hover:text-foreground font-serif text-sm italic transition-colors"
            >
              Kembali ke Halaman Utama
            </button>
          </div>
        )}

      </div>
    </main>
  );
}
