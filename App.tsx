import React, { useState, useEffect } from 'react';
import { BeeperDevice } from './components/BeeperDevice';
import { PaperCard } from './components/PaperCard';
import { CardData } from './types';
import { Info } from 'lucide-react';

// Generate random rotation between -4 and 4 degrees
const getRandomRotation = () => Math.random() * 8 - 4;

// Generate simple ID
const generateId = () => Math.random().toString(36).substring(2, 8).toUpperCase();

const App: React.FC = () => {
  const [cards, setCards] = useState<CardData[]>([]);
  const [maxZIndex, setMaxZIndex] = useState(10);
  const [devicePosition, setDevicePosition] = useState({ x: 0, y: 0 });

  // Calculate center position on mount for the device
  useEffect(() => {
    const updateCenter = () => {
      setDevicePosition({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2
      });
    };
    updateCenter();
    window.addEventListener('resize', updateCenter);
    return () => window.removeEventListener('resize', updateCenter);
  }, []);

  const handlePrint = (text: string) => {
    const newZIndex = maxZIndex + 1;
    setMaxZIndex(newZIndex);

    // Spawn the card near the device, slightly offset
    const spawnX = window.innerWidth / 2 - 140 + (Math.random() * 40 - 20);
    const spawnY = window.innerHeight / 2 - 280; // Above the device

    const newCard: CardData = {
      id: generateId(),
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      x: spawnX,
      y: spawnY,
      rotation: getRandomRotation(),
      zIndex: newZIndex,
    };

    setCards((prev) => [...prev, newCard]);
  };

  const handleUpdateCard = (id: string, updates: Partial<CardData>) => {
    setCards((prev) => prev.map((card) => (card.id === id ? { ...card, ...updates } : card)));
  };

  const handleDeleteCard = (id: string) => {
    setCards((prev) => prev.filter((card) => card.id !== id));
  };

  const handleFocusCard = (id: string) => {
    const newZIndex = maxZIndex + 1;
    setMaxZIndex(newZIndex);
    handleUpdateCard(id, { zIndex: newZIndex });
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#e5e5e5]">
      {/* Grid Background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
            backgroundImage: `
                linear-gradient(to right, #80808012 1px, transparent 1px),
                linear-gradient(to bottom, #80808012 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
        }}
      />

      {/* Header Branding */}
      <div className="absolute top-8 left-0 right-0 flex flex-col items-center justify-center pointer-events-none z-0 opacity-50">
        <h1 className="font-['VT323'] text-4xl text-gray-600 uppercase tracking-[0.5em]">Gemini</h1>
        <div className="flex items-center gap-4 mt-2">
            <span className="h-[1px] w-12 bg-gray-400"></span>
            <span className="font-sans text-[10px] text-gray-500 tracking-widest uppercase">Fax Beeper</span>
            <span className="h-[1px] w-12 bg-gray-400"></span>
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute top-6 right-6 text-gray-400 z-0 hidden md:flex items-center gap-2">
        <span className="font-['Share_Tech_Mono'] text-xs">@Lessnoise365</span>
        <Info size={16} />
      </div>

      {/* Printed Cards Layer */}
      <div className="absolute inset-0 z-10">
        {cards.map((card) => (
          <PaperCard
            key={card.id}
            data={card}
            onUpdate={handleUpdateCard}
            onDelete={handleDeleteCard}
            onFocus={handleFocusCard}
          />
        ))}
      </div>

      {/* Device Layer (Centered) */}
      <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
        <div className="pointer-events-auto transform translate-y-32"> 
             {/* translate-y-32 pushes it down slightly so cards appear to come out top more naturally */}
            <BeeperDevice onPrint={handlePrint} />
        </div>
      </div>
    </div>
  );
};

export default App;
