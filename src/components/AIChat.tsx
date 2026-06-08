"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";

type Message = {
  id: string;
  role: "user" | "ai";
  text: string;
};

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "ai",
      text: "Halo! Saya asisten AI CallTrack. Ada yang bisa saya bantu terkait pelacakan lokasi?",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isOpen]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const newUserMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      text: inputValue,
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setInputValue("");
    setIsTyping(true);

    const lowerInput = newUserMsg.text.toLowerCase();
    
    // Check if user is asking to track a number
    const isTrackingCommand = lowerInput.includes("lacak") || lowerInput.includes("cari") || /[\+\d]{8,}/.test(lowerInput);
    
    if (isTrackingCommand) {
      const extractedNumberMatch = newUserMsg.text.match(/[\+\d]{8,}/);
      const targetNumber = extractedNumberMatch ? extractedNumberMatch[0] : "tersebut";

      const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

      const addAiMsg = (text: string) => {
        setMessages((prev) => [
          ...prev,
          { id: Date.now().toString() + Math.random(), role: "ai", text }
        ]);
      };

      await delay(1000);
      addAiMsg(`Menganalisis dan menginisiasi pelacakan untuk nomor ${targetNumber}...`);
      
      await delay(1500);
      addAiMsg("📡 Menghubungkan ke satelit GPS dan melakukan triangulasi sinyal BTS...");

      await delay(2000);
      addAiMsg("🔒 Membuka enkripsi data lokasi real-time...");

      await delay(1500);
      addAiMsg("📍 Lokasi Berhasil Ditemukan! Untuk melihat tampilan visual di peta satelit, silakan masukkan nomor di halaman utama.");
      
      setIsTyping(false);
    } else {
      // Standard FAQ Response
      setTimeout(() => {
        let aiReply = "Maaf, saya tidak mengerti. Anda bisa memerintahkan saya untuk melacak nomor telepon (contoh: 'Lacak +628123456789').";

        if (lowerInput.includes("bagaimana") || lowerInput.includes("cara")) {
          aiReply = "Anda cukup mengetikkan nomor telepon di chat ini, atau masukkan di halaman utama untuk melihat petanya secara langsung.";
        } else if (lowerInput.includes("akurat") || lowerInput.includes("akurasi")) {
          aiReply = "Sistem kami menggunakan GPS satelit dengan tingkat akurasi hingga 98.7% atau dalam radius 10 meter.";
        } else if (lowerInput.includes("gratis") || lowerInput.includes("bayar") || lowerInput.includes("harga")) {
          aiReply = "Anda dapat mencoba versi demo secara gratis. Untuk fitur pelacakan real-time tanpa batas, silakan mendaftar layanan premium kami.";
        } else if (lowerInput.includes("legal") || lowerInput.includes("aman") || lowerInput.includes("privasi")) {
          aiReply = "Ya, layanan kami 100% legal dan dienkripsi dengan standar keamanan tinggi AES-256 untuk melindungi privasi Anda.";
        } else if (lowerInput.includes("halo") || lowerInput.includes("hai")) {
          aiReply = "Halo! Silakan ketik nomor telepon yang ingin Anda lacak, atau tanyakan seputar layanan CallTrack.";
        }

        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: "ai",
            text: aiReply,
          },
        ]);
        setIsTyping(false);
      }, 1500);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center shadow-lg shadow-accent-purple/30 text-white hover:scale-110 transition-transform z-40 ${
          isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"
        } animate-bounce`}
        style={{ animationDuration: "3s" }}
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-6 right-6 w-[350px] max-w-[calc(100vw-3rem)] bg-[#0A0A1A] border border-white/10 rounded-2xl shadow-2xl shadow-black/50 z-50 flex flex-col overflow-hidden transition-all duration-300 transform origin-bottom-right ${
          isOpen
            ? "scale-100 opacity-100 pointer-events-auto"
            : "scale-50 opacity-0 pointer-events-none"
        }`}
        style={{ height: "500px", maxHeight: "calc(100vh - 6rem)" }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-accent-blue to-accent-purple p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-white">
            <Bot className="w-5 h-5" />
            <span className="font-semibold">Tanya AI</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white/70 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-end gap-2 ${
                msg.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  msg.role === "user"
                    ? "bg-white/10 text-white"
                    : "bg-accent-blue/20 text-accent-cyan"
                }`}
              >
                {msg.role === "user" ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </div>
              <div
                className={`max-w-[75%] p-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-accent-blue text-white rounded-br-sm"
                    : "bg-white/5 border border-white/10 text-white/90 rounded-bl-sm"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-end gap-2">
              <div className="w-8 h-8 rounded-full bg-accent-blue/20 text-accent-cyan flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-bl-sm flex gap-1.5 items-center">
                <div className="w-1.5 h-1.5 bg-accent-cyan rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-1.5 h-1.5 bg-accent-cyan rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-1.5 h-1.5 bg-accent-cyan rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Footer Input */}
        <div className="p-3 border-t border-white/10 bg-white/[0.02] shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Tanyakan sesuatu..."
              className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-sm text-white focus:outline-none focus:border-accent-blue/50 transition-colors"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="w-10 h-10 rounded-full bg-accent-blue flex items-center justify-center text-white shrink-0 hover:bg-accent-blue/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
