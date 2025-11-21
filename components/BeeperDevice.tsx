import React, { useState, useRef } from 'react';
import { Printer, Sparkles, Trash2, Battery, Signal } from 'lucide-react';
import { generateWittyMessage } from '../services/geminiService';

interface BeeperDeviceProps {
  onPrint: (text: string) => void;
}

export const BeeperDevice: React.FC<BeeperDeviceProps> = ({ onPrint }) => {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handlePrint = () => {
    if (!inputText.trim()) return;
    onPrint(inputText);
    setInputText('');
  };

  const handleClear = () => {
    setInputText('');
    textareaRef.current?.focus();
  };

  const handleAutoGenerate = async () => {
    setIsLoading(true);
    const text = await generateWittyMessage();
    setInputText(text);
    setIsLoading(false);
  };

  return (
    <div className="relative z-50 w-full max-w-md mx-auto transform transition-transform duration-300">
      {/* Device Casing */}
      <div className="bg-[#8CC63F] rounded-[3rem] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.3),0_10px_20px_rgba(140,198,63,0.4)] border-b-8 border-[#7ab52f] relative">
        
        {/* Top Accent/Antenna bump */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-32 h-8 bg-[#1a1a1a] rounded-t-2xl shadow-lg"></div>

        {/* Screen Area */}
        <div className="bg-[#111] rounded-xl p-4 mb-6 shadow-inner border-4 border-[#7ab52f]/50 relative overflow-hidden">
            {/* Screen Glare/Reflection */}
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-white/5 to-transparent pointer-events-none"></div>
            
            {/* Status Bar */}
            <div className="flex justify-between items-center mb-2 text-[#4ade80] text-xs font-['Share_Tech_Mono'] opacity-80">
                <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-[#4ade80] rounded-full animate-pulse"></span>
                    COMPOSE_MODE
                </div>
                <div className="flex items-center gap-2">
                    <Signal size={14} />
                    <Battery size={14} />
                </div>
            </div>

            {/* Input Field */}
            <textarea
                ref={textareaRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={isLoading ? "RECEIVING SIGNAL..." : "TYPE MESSAGE HERE..."}
                disabled={isLoading}
                className={`w-full h-32 bg-transparent text-[#4ade80] font-['VT323'] text-2xl tracking-wide border-none outline-none resize-none placeholder-[#4ade80]/30 scrollbar-hide uppercase ${isLoading ? 'animate-pulse' : ''}`}
                spellCheck={false}
            />
        </div>

        {/* Controls Area */}
        <div className="flex items-center justify-between gap-4 px-2">
            
            <div className="flex gap-3">
                {/* Magic/Generate Button */}
                <button
                    onClick={handleAutoGenerate}
                    disabled={isLoading}
                    className="group w-14 h-14 rounded-full bg-[#333] border-b-4 border-black flex items-center justify-center active:border-b-0 active:translate-y-1 transition-all hover:bg-[#444]"
                    title="Auto-Generate (Gemini AI)"
                >
                    <Sparkles className={`text-gray-400 group-hover:text-yellow-400 transition-colors ${isLoading ? 'animate-spin' : ''}`} size={20} />
                </button>

                {/* Clear Button */}
                <button
                    onClick={handleClear}
                    className="group w-14 h-14 rounded-full bg-[#333] border-b-4 border-black flex items-center justify-center active:border-b-0 active:translate-y-1 transition-all hover:bg-[#444]"
                    title="Clear Text"
                >
                    <Trash2 className="text-gray-400 group-hover:text-red-400 transition-colors" size={20} />
                </button>
            </div>

            {/* Vent styling */}
            <div className="flex-1 flex justify-center gap-1 opacity-20">
                 <div className="w-1 h-8 bg-black rounded-full"></div>
                 <div className="w-1 h-8 bg-black rounded-full"></div>
                 <div className="w-1 h-8 bg-black rounded-full"></div>
                 <div className="w-1 h-8 bg-black rounded-full"></div>
            </div>

            {/* Print Button */}
            <button
                onClick={handlePrint}
                className="h-14 px-8 bg-[#FF5722] rounded-xl border-b-4 border-[#c43c12] flex items-center justify-center gap-2 active:border-b-0 active:translate-y-1 transition-all hover:bg-[#ff6a3c] text-black font-bold font-['Share_Tech_Mono'] tracking-wider shadow-lg"
            >
                PRINT <Printer size={20} />
            </button>
        </div>

        {/* Branding */}
        <div className="text-center mt-4">
             <span className="bg-black text-[#8CC63F] text-[10px] font-bold px-2 py-0.5 rounded font-sans tracking-widest">MOTOROLA</span>
        </div>
      </div>
    </div>
  );
};
