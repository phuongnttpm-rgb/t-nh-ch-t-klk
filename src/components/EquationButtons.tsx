import React from 'react';
import { METALS_DATA } from '../data/metals';
import { Sparkles, ArrowRight } from 'lucide-react';

interface EquationButtonsProps {
  selectedBasinIndex: number;
  onSelectBasin: (index: number) => void;
}

export const EquationButtons: React.FC<EquationButtonsProps> = ({
  selectedBasinIndex,
  onSelectBasin,
}) => {
  // Distinct styling for 5 buttons matching Geometric Balance theme
  const buttonConfigs = [
    {
      label: 'Phản ứng chậu 1',
      bgClass: 'bg-amber-500 hover:bg-amber-600 text-white shadow-[2px_2px_0px_#b45309]',
    },
    {
      label: 'Phản ứng chậu 2',
      bgClass: 'bg-yellow-500 hover:bg-yellow-600 text-slate-950 shadow-[2px_2px_0px_#ca8a04]',
    },
    {
      label: 'Phản ứng chậu 3',
      bgClass: 'bg-purple-500 hover:bg-purple-600 text-white shadow-[2px_2px_0px_#7e22ce]',
    },
    {
      label: 'Phản ứng chậu 4',
      bgClass: 'bg-pink-500 hover:bg-pink-600 text-white shadow-[2px_2px_0px_#be185d]',
    },
    {
      label: 'Phản ứng chậu 5',
      bgClass: 'bg-blue-500 hover:bg-blue-600 text-white shadow-[2px_2px_0px_#1d4ed8]',
    },
  ];

  return (
    <div className="w-full h-full frame-3d p-4 flex flex-col justify-between text-slate-900">
      <div className="text-center mb-2 pb-2 border-b border-yellow-300">
        <h3 className="font-extrabold text-yellow-950 text-xs md:text-sm uppercase tracking-wider flex items-center justify-center gap-1.5">
          <Sparkles className="w-4 h-4 text-yellow-600" />
          <span>NÚT PHƯƠNG TRÌNH</span>
        </h3>
        <p className="text-[11px] font-semibold text-yellow-800">Nhấp để chọn hiển thị phương trình</p>
      </div>

      <div className="flex flex-col gap-2.5 my-auto">
        {buttonConfigs.map((cfg, idx) => {
          const isSelected = selectedBasinIndex === idx;
          const metal = METALS_DATA[idx];

          return (
            <button
              key={idx}
              onClick={() => onSelectBasin(idx)}
              className={`w-full relative flex items-center justify-between px-3 py-2.5 rounded-lg border border-slate-700/20 font-bold text-xs md:text-sm transition-all transform active:translate-y-0.5 ${
                cfg.bgClass
              } ${isSelected ? 'ring-2 ring-amber-900 ring-offset-1 font-black scale-[1.02]' : 'opacity-95 hover:opacity-100'}`}
            >
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-black/20 text-xs font-black">
                  {idx + 1}
                </span>
                <span>{cfg.label}</span>
              </div>

              <div className="flex items-center gap-1 font-extrabold text-[11px]">
                <span className="opacity-90">{metal.id}</span>
                {isSelected && <ArrowRight className="w-4 h-4 animate-pulse" />}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-2 pt-2 border-t border-yellow-300 text-center">
        <span className="text-[10px] font-bold text-yellow-900 bg-yellow-200/80 px-2.5 py-1 rounded-md border border-yellow-400">
          Dạng 2M + 2H₂O ⭢ 2MOH + H₂
        </span>
      </div>
    </div>
  );
};

