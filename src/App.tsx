import React, { useState } from 'react';
import { METALS_DATA } from './data/metals';
import { BasinState } from './types';
import { soundEngine } from './utils/audio';
import { AudioControls } from './components/AudioControls';
import { EquationButtons } from './components/EquationButtons';
import { GlassBasin } from './components/GlassBasin';
import { SafetyShield } from './components/SafetyShield';
import { EquationPanel } from './components/EquationPanel';
import { ChemicalSidebar } from './components/ChemicalSidebar';
import { FlameTestModal } from './components/FlameTestModal';
import { OxygenChlorineTestModal } from './components/OxygenChlorineTestModal';

const INITIAL_BASINS: BasinState[] = Array.from({ length: 5 }, (_, i) => ({
  index: i,
  hasWater: false,
  waterLevel: 0,
  hasPP: false,
  ppDrops: 0,
  metal: null,
  reactionProgress: 0,
  isReacting: false,
  isExploded: false,
  solutionColor: 'transparent',
  pHLevel: 7,
  temperature: 25,
}));

export default function App() {
  const [basins, setBasins] = useState<BasinState[]>(INITIAL_BASINS);
  const [selectedBasinIndex, setSelectedBasinIndex] = useState<number>(0);
  const [nextWaterIndex, setNextWaterIndex] = useState<number>(0);
  const [nextPPIndex, setNextPPIndex] = useState<number>(0);
  const [isFlameTestOpen, setIsFlameTestOpen] = useState<boolean>(false);
  const [isOxygenChlorineOpen, setIsOxygenChlorineOpen] = useState<boolean>(false);

  // Sequential Water Addition (Chậu 1 -> 2 -> 3 -> 4 -> 5)
  const handleAddWater = () => {
    if (nextWaterIndex >= 5) return;

    const targetIdx = nextWaterIndex;
    setBasins((prev) =>
      prev.map((b, idx) =>
        idx === targetIdx
          ? {
              ...b,
              hasWater: true,
              waterLevel: 80,
            }
          : b
      )
    );

    setSelectedBasinIndex(targetIdx);
    setNextWaterIndex((prev) => Math.min(5, prev + 1));
  };

  // Sequential Phenolphthalein Drop Addition (Chậu 1 -> 2 -> 3 -> 4 -> 5)
  const handleAddPP = () => {
    if (nextPPIndex >= 5) return;

    const targetIdx = nextPPIndex;
    setBasins((prev) =>
      prev.map((b, idx) =>
        idx === targetIdx
          ? {
              ...b,
              hasPP: true,
              ppDrops: b.ppDrops + 1,
            }
          : b
      )
    );

    setSelectedBasinIndex(targetIdx);
    setNextPPIndex((prev) => Math.min(5, prev + 1));
  };

  // Add Metal to its corresponding basin (0 -> Li, 1 -> Na, 2 -> K, 3 -> Rb, 4 -> Cs)
  const handleAddMetal = (metalIdx: number) => {
    const metal = METALS_DATA[metalIdx];

    // Auto add water if empty
    setBasins((prev) =>
      prev.map((b, idx) => {
        if (idx !== metalIdx) return b;

        const hasWater = b.hasWater ? true : true;
        const waterLevel = b.hasWater ? b.waterLevel : 80;

        return {
          ...b,
          hasWater,
          waterLevel,
          metal,
          isReacting: true,
          pHLevel: 13 + metalIdx * 0.2,
          temperature: 40 + metalIdx * 25,
        };
      })
    );

    setSelectedBasinIndex(metalIdx);

    // Audio effects trigger
    if (metal.isExplosive) {
      soundEngine.playFlamePop();
      setTimeout(() => {
        soundEngine.playExplosion(metal.id === 'Cs');
      }, 400);
    } else {
      soundEngine.startSizzle(metal.id, metal.id === 'K' ? 4 : 3);
      if (metal.id === 'Na' || metal.id === 'K') {
        soundEngine.playFlamePop();
      }
    }

    // Reaction duration handler
    setTimeout(() => {
      setBasins((prev) =>
        prev.map((b, idx) =>
          idx === metalIdx
            ? {
                ...b,
                isReacting: false,
                isExploded: metal.isExplosive,
              }
            : b
        )
      );
      soundEngine.stopSizzle(metal.id);
    }, 4500);
  };

  // Reset Experiment
  const handleReset = () => {
    setBasins(INITIAL_BASINS);
    setSelectedBasinIndex(0);
    setNextWaterIndex(0);
    setNextPPIndex(0);
    METALS_DATA.forEach((m) => soundEngine.stopSizzle(m.id));
  };

  return (
    <div className="min-h-screen w-full bg-slate-900/95 text-slate-100 p-3 md:p-6 font-sans relative overflow-x-hidden selection:bg-amber-400 selection:text-amber-950">
      {/* Background Laboratory Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none" />

      {/* Header Controls (Rows 1, 2, 3) */}
      <div className="relative z-10 max-w-[1600px] mx-auto mb-3 md:mb-4">
        <AudioControls
          onOpenMusicModal={() => {}}
          onOpenFlameTest={() => setIsFlameTestOpen(true)}
          onOpenOxygenChlorineTest={() => setIsOxygenChlorineOpen(true)}
        />
      </div>

      {/* Main 3-Column Grid Layout: Khung 1 (Trái - Nút PT) | Khung 2 (Giữa - Mở rộng Thí nghiệm) | Khung 3 (Phải - Hóa chất) */}
      <div className="relative z-10 max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-5 items-stretch">
        
        {/* KHUNG 1 (Trái): 5 Nút chọn phương trình - Span 3 cols */}
        <div className="lg:col-span-3 h-full">
          <EquationButtons
            selectedBasinIndex={selectedBasinIndex}
            onSelectBasin={(idx) => setSelectedBasinIndex(idx)}
          />
        </div>

        {/* KHUNG 2 (Giữa - Mở rộng cho học sinh quan sát từ cuối lớp): Giá 5 chậu thủy tinh & Bảng phương trình - Span 6 cols */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
          {/* Stand with 5 Glass Basins */}
          <div className="w-full frame-3d p-4 md:p-5 text-slate-900 flex flex-col justify-between h-full">
            <div className="text-center mb-2 pb-1 border-b border-yellow-300">
              <h3 className="font-extrabold text-slate-900 text-xs md:text-sm lg:text-base uppercase tracking-wide">
                GIÁ ĐỂ 5 CHẬU THỦY TINH THÍ NGHIỆM
              </h3>
            </div>

            {/* 5 Basins Grid */}
            <div className="grid grid-cols-5 gap-2 md:gap-3 my-auto items-end">
              {/* Basins 1, 2, 3 */}
              {basins.slice(0, 3).map((basin) => (
                <GlassBasin
                  key={basin.index}
                  basin={basin}
                  isSelected={selectedBasinIndex === basin.index}
                  onSelect={() => setSelectedBasinIndex(basin.index)}
                />
              ))}

              {/* Basins 4 & 5 inside Safety Shield */}
              <div className="col-span-2">
                <SafetyShield isTriggered={basins[3].isReacting || basins[4].isReacting}>
                  <div className="grid grid-cols-2 gap-2">
                    {basins.slice(3, 5).map((basin) => (
                      <GlassBasin
                        key={basin.index}
                        basin={basin}
                        isSelected={selectedBasinIndex === basin.index}
                        onSelect={() => setSelectedBasinIndex(basin.index)}
                        isInsideSafetyShield={true}
                      />
                    ))}
                  </div>
                </SafetyShield>
              </div>
            </div>

            {/* Wooden Stand Base Graphic */}
            <div className="w-full h-3 mt-3 rounded-md bg-amber-800 border border-amber-950 shadow-xs" />
          </div>

          {/* Equation Panel: Directly under the 5 glass basins */}
          <div className="w-full mt-2">
            <EquationPanel
              selectedBasinIndex={selectedBasinIndex}
              basins={basins}
            />
          </div>
        </div>

        {/* KHUNG 3 (Phải - Kích thước bằng Khung 1): Hóa chất & Thiết bị - Span 3 cols */}
        <div className="lg:col-span-3 h-full">
          <ChemicalSidebar
            basins={basins}
            nextWaterIndex={nextWaterIndex}
            nextPPIndex={nextPPIndex}
            onAddWater={handleAddWater}
            onAddPP={handleAddPP}
            onAddMetal={handleAddMetal}
            onReset={handleReset}
          />
        </div>

      </div>

      {/* Flame Test Experiment Modal */}
      <FlameTestModal
        isOpen={isFlameTestOpen}
        onClose={() => setIsFlameTestOpen(false)}
      />

      {/* Oxygen & Chlorine Reaction Experiment Modal */}
      <OxygenChlorineTestModal
        isOpen={isOxygenChlorineOpen}
        onClose={() => setIsOxygenChlorineOpen(false)}
      />
    </div>
  );
}

