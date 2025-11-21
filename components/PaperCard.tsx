import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion'; // Assuming framer-motion is available or simulated. 
// Since the instructions say "Use popular libraries", and framer-motion is standard for this. 
// However, to adhere strictly to "no mock libraries" and ensure it works without npm install in this specific context if packages aren't pre-installed, 
// I will use standard React pointer events for dragging to be safe and self-contained, 
// BUT standard React drag is clunky. I will assume standard environment capability or write a custom hook.
// Let's write a custom drag hook for maximum reliability without external heavy deps if the environment is restrictive, 
// but sticking to the prompt's "Use popular libraries", I will simulate the visual style.
// Actually, for a "Senior Engineer" output, I'll build a robust custom drag handler to ensure 0 dependencies are broken.

import { CardData } from '../types';
import { X } from 'lucide-react';

interface PaperCardProps {
  data: CardData;
  onUpdate: (id: string, updates: Partial<CardData>) => void;
  onDelete: (id: string) => void;
  onFocus: (id: string) => void;
}

export const PaperCard: React.FC<PaperCardProps> = ({ data, onUpdate, onDelete, onFocus }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Typewriter effect
  useEffect(() => {
    let i = 0;
    setDisplayedText('');
    const interval = setInterval(() => {
      if (i < data.text.length) {
        setDisplayedText((prev) => prev + data.text.charAt(i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 50); // Typing speed
    return () => clearInterval(interval);
  }, [data.text]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    onFocus(data.id);
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - data.x,
      y: e.clientY - data.y
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;
        onUpdate(data.id, { x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, data.id, onUpdate]);

  return (
    <div
      style={{
        transform: `translate(${data.x}px, ${data.y}px) rotate(${data.rotation}deg)`,
        zIndex: data.zIndex,
      }}
      className={`absolute w-64 md:w-72 transition-shadow duration-200 cursor-grab active:cursor-grabbing ${isDragging ? 'scale-[1.02] shadow-xl' : 'shadow-md'}`}
      onMouseDown={handleMouseDown}
    >
      {/* Paper Texture & Shape */}
      <div className="relative bg-[#fdfdfd] text-gray-800 p-6 pb-10 min-h-[200px] select-none">
        
        {/* Jagged Top */}
        <div className="absolute top-0 left-0 right-0 h-2 -mt-2 w-full overflow-hidden">
             <svg className="w-full h-2 text-[#fdfdfd] fill-current" viewBox="0 0 100 10" preserveAspectRatio="none">
                <polygon points="0,10 5,0 10,10 15,0 20,10 25,0 30,10 35,0 40,10 45,0 50,10 55,0 60,10 65,0 70,10 75,0 80,10 85,0 90,10 95,0 100,10" />
             </svg>
        </div>

        {/* Content */}
        <div className="flex justify-between items-start mb-4 border-b border-gray-200 pb-2">
            <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase font-sans">Pager Message</span>
                <span className="text-[10px] text-gray-400 font-mono">ID: {data.id.slice(0, 6).toUpperCase()}</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-400 font-mono">{data.timestamp}</span>
                <button 
                    onClick={(e) => { e.stopPropagation(); onDelete(data.id); }}
                    className="text-gray-300 hover:text-red-400 transition-colors"
                >
                    <X size={14} />
                </button>
            </div>
        </div>

        <p className="font-['Special_Elite'] text-sm leading-relaxed whitespace-pre-wrap break-words text-gray-800">
          {displayedText}
          <span className="animate-pulse inline-block w-2 h-4 bg-gray-400 align-middle ml-1 opacity-50"></span>
        </p>

        <div className="absolute bottom-4 right-6 text-[9px] text-gray-300 tracking-widest font-sans uppercase">
            End of Transmission
        </div>

        {/* Jagged Bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-2 -mb-2 w-full overflow-hidden transform rotate-180">
             <svg className="w-full h-2 text-[#fdfdfd] fill-current" viewBox="0 0 100 10" preserveAspectRatio="none">
                <polygon points="0,10 5,0 10,10 15,0 20,10 25,0 30,10 35,0 40,10 45,0 50,10 55,0 60,10 65,0 70,10 75,0 80,10 85,0 90,10 95,0 100,10" />
             </svg>
        </div>
      </div>
    </div>
  );
};
