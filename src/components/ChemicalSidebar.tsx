import React from 'react';
import { METALS_DATA } from '../data/metals';
import { BasinState } from '../types';
import {
  Droplet,
  RotateCcw,
  Sparkles,
  Info,
  Check,
  Pipette,
  Beaker
} from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface ChemicalSidebarProps {
  basins: BasinState[];
  nextWaterIndex: number;
  nextPPIndex: number;
  onAddWater: () => void;
  onAddPP: () => void;
  onAddMetal: (metalIndex: number) => void;
  onReset: () => void;
}

export const ChemicalSidebar: React.FC<ChemicalSidebarProps> = ({
  basins,
  nextWaterIndex,
  nextPPIndex,
  onAddWater,
  onAddPP,
  onAddMetal,
  onReset,
}) => {
  return (
    <div className="w-full h-full frame-3d p-5 text-slate-900 flex flex-col justify-between">
      {/* Top Header & Reagents */}
      <div>
        {/* Row 1: Green uppercase Title */}
        <div className="flex items-center justify-center gap-2.5 pb-3 mb-4 border-b-2 border-yellow-300 text-green-700 font-extrabold text-lg uppercase tracking-wide">
          <Beaker className="w-6 h-6 text-green-700" />
          <span>HÓA CHẤT THÍ NGHIỆM</span>
        </div>

        {/* Liquids Section: Water Bottle & Phenolphthalein Bottle */}
        <div className="space-y-3 mb-5">
          <div className="grid grid-cols-2 gap-3">
            {/* Water Bottle (H2O) */}
            <button
              onClick={() => {
                soundEngine.playPourWater();
                onAddWater();
              }}
              className="relative group flex flex-col items-center justify-center p-3 bg-white rounded-xl shadow-inner border border-yellow-300 hover:border-yellow-500 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="w-12 h-14 bg-sky-100 rounded-t-lg border-2 border-sky-300 relative mb-1.5 flex flex-col items-center justify-center shadow-xs">
                <div className="absolute bottom-0 w-full h-1/2 bg-sky-400 opacity-60 rounded-b-md"></div>
                <span className="relative z-10 font-bold text-sky-900 text-xs">
                  H<sub>2</sub>O
                </span>
              </div>
              <span className="font-bold text-slate-900 text-xs">Bình nước</span>

              {/* Sequential Indicator Badge */}
              <span className="mt-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-sky-100 text-sky-800 border border-sky-200">
                {nextWaterIndex < 5 ? `Rót chậu ${nextWaterIndex + 1}` : 'Đã rót cả 5 chậu'}
              </span>
            </button>

            {/* Phenolphthalein Bottle (PP) */}
            <button
              onClick={() => {
                soundEngine.playDrip();
                onAddPP();
              }}
              className="relative group flex flex-col items-center justify-center p-3 bg-white rounded-xl shadow-inner border border-yellow-300 hover:border-yellow-500 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="w-12 h-14 bg-pink-50 rounded-t-lg border-2 border-pink-300 relative mb-1.5 flex flex-col items-center justify-center shadow-xs">
                <span className="font-bold text-pink-700 text-xs">PP</span>
              </div>
              <span className="font-bold text-slate-900 text-xs">Phenolphthalein</span>

              {/* Sequential Indicator Badge */}
              <span className="mt-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-pink-100 text-pink-800 border border-pink-200">
                {nextPPIndex < 5 ? `Nhỏ chậu ${nextPPIndex + 1}` : 'Đã nhỏ cả 5 chậu'}
              </span>
            </button>
          </div>

          {/* Phenolphthalein Property Explanation Card */}
          <div className="p-2.5 rounded-lg bg-white/90 border border-yellow-200 text-[11px] text-slate-800 space-y-1 shadow-xs">
            <div className="flex items-center gap-1.5 font-bold text-pink-800">
              <Info className="w-4 h-4 text-pink-600 shrink-0" />
              <span>Chỉ thị Phenolphthalein (PP):</span>
            </div>
            <p className="leading-relaxed">
              Dung dịch trong suốt không màu. Nhỏ vào dung dịch base sẽ chuyển sang <strong>màu hồng</strong> (base yếu màu hồng nhạt, base mạnh hơn cho màu hồng đậm hơn).
            </p>
          </div>
        </div>

        {/* 5 Alkali Metals Section */}
        <div>
          <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-yellow-600" />
            <span>KIM LOẠI KIỀM:</span>
          </h4>

          <div className="space-y-2">
            {METALS_DATA.map((m, idx) => {
              const basin = basins[idx];
              const isAdded = basin.metal !== null;

              return (
                <button
                  key={m.id}
                  onClick={() => onAddMetal(idx)}
                  className={`w-full flex items-center gap-3 p-2.5 bg-white rounded-lg shadow-xs border border-yellow-200 hover:border-yellow-400 hover:scale-[1.01] transition-transform cursor-pointer text-left ${
                    isAdded ? 'opacity-80 bg-yellow-50' : ''
                  }`}
                >
                  {/* Metal Circle Sample */}
                  <div className={`w-8 h-8 rounded-full ${m.iconBgClass} border-2 border-slate-400 flex items-center justify-center font-extrabold text-xs text-slate-900 shrink-0 shadow-inner`}>
                    {m.id}
                  </div>

                  <div className="flex-grow min-w-0">
                    <div className="font-bold text-slate-900 text-xs truncate">
                      Chậu {idx + 1}: {m.name} ({m.id})
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium">
                      {m.colorName}
                    </div>
                  </div>

                  <div>
                    {isAdded ? (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                        Đã thả
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-yellow-900 bg-yellow-200 px-2 py-0.5 rounded">
                        Thả
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Action: "Làm lại thí nghiệm" */}
      <div className="mt-5 pt-3 border-t border-yellow-300">
        <button
          onClick={onReset}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-colors text-sm uppercase tracking-wider"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Làm lại thí nghiệm</span>
        </button>
      </div>
    </div>
  );
};

