import React from 'react';
import { METALS_DATA } from '../data/metals';
import { BasinState } from '../types';
import { Flame, Info } from 'lucide-react';

interface EquationPanelProps {
  selectedBasinIndex: number;
  basins: BasinState[];
}

export const EquationPanel: React.FC<EquationPanelProps> = ({
  selectedBasinIndex,
  basins,
}) => {
  const selectedMetal = METALS_DATA[selectedBasinIndex];
  const activeBasin = basins[selectedBasinIndex];

  return (
    <div className="w-full frame-3d p-4 text-slate-800 flex flex-col gap-3">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-2 border-b border-yellow-300">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-yellow-500 text-slate-950 font-black text-xs">
            {selectedBasinIndex + 1}
          </span>
          <h3 className="font-extrabold text-slate-900 text-sm md:text-base uppercase tracking-wide">
            PHƯƠNG TRÌNH PHẢN ỨNG HÓA HỌC CHẬU {selectedBasinIndex + 1} ({selectedMetal.name})
          </h3>
        </div>

        <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-yellow-200 text-yellow-950 border border-yellow-400">
          {selectedMetal.vietnameseName} ({selectedMetal.id})
        </span>
      </div>

      {/* Main Single-Line Equation Display Bar */}
      <div className="w-full bg-slate-900 text-yellow-300 py-3 px-3 md:px-4 rounded-xl border-2 border-yellow-500 shadow-inner flex items-center justify-center overflow-x-auto">
        <div className="font-mono font-bold text-base sm:text-lg md:text-xl lg:text-2xl tracking-normal text-center whitespace-nowrap">
          <span className="text-amber-400">{selectedMetal.id === 'Li' ? '2Li' : selectedMetal.id === 'Na' ? '2Na' : selectedMetal.id === 'K' ? '2K' : selectedMetal.id === 'Rb' ? '2Rb' : '2Cs'}</span>
          <span className="text-slate-400 mx-1 md:mx-1.5">+</span>
          <span className="text-cyan-300">
            2H<sub className="text-xs sm:text-sm md:text-base">2</sub>O
          </span>
          <span className="text-yellow-400 font-sans mx-1.5 md:mx-2">&rarr;</span>
          <span className="text-emerald-400">
            2{selectedMetal.id}OH
          </span>
          <span className="text-slate-400 mx-1 md:mx-1.5">+</span>
          <span className="text-rose-400">
            H<sub className="text-xs sm:text-sm md:text-base">2</sub>&uarr;
          </span>
        </div>
      </div>

      {/* Detailed Phenomenon & Properties */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
        {/* Phenomenon description */}
        <div className="md:col-span-2 bg-white/90 p-3 rounded-lg border border-yellow-200 flex items-start gap-2.5 text-xs md:text-sm text-slate-800 shadow-xs">
          <Info className="w-5 h-5 text-yellow-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-yellow-950 block mb-0.5">Hiện tượng quan sát:</span>
            <span>{selectedMetal.reactionDescription}</span>
          </div>
        </div>

        {/* Flame & Indicator status */}
        <div className="bg-yellow-100/80 p-3 rounded-lg border border-yellow-300 flex flex-col justify-between gap-1.5 text-xs text-slate-900">
          <div className="flex items-center justify-between">
            <span className="font-bold flex items-center gap-1 text-slate-800">
              <Flame className="w-4 h-4 text-rose-500" /> Ngọn lửa:
            </span>
            <span className="font-extrabold px-2 py-0.5 rounded bg-white text-slate-900 border border-yellow-300">
              {selectedMetal.flameColor}
            </span>
          </div>

          <div className="flex items-center justify-between pt-1.5 border-t border-yellow-300/60">
            <span className="font-bold">Màu Phenolphthalein:</span>
            <span
              className={`font-extrabold ${
                activeBasin.hasPP && activeBasin.metal ? 'text-pink-700' : 'text-slate-600'
              }`}
            >
              {!activeBasin.hasPP
                ? 'Chưa nhỏ PP'
                : !activeBasin.metal
                ? 'Không màu (Nước H₂O trung tính)'
                : `Màu hồng (Base ${selectedMetal.id}OH)`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

