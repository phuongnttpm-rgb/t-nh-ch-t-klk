import React, { useState, useRef, useEffect } from 'react';
import { X, Flame, Sparkles, RefreshCw, Eye, Zap, Info, ShieldCheck } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface FlameTestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MetalFlameSample {
  id: string;
  name: string;
  vietnameseName: string;
  formula: string;
  flameName: string;
  flameColorHex: string;
  flameGlowHex: string;
  description: string;
  cobaltGlassEffect?: string;
}

const FLAME_SAMPLES: MetalFlameSample[] = [
  {
    id: 'Li',
    name: 'Lithium',
    vietnameseName: 'Lithium',
    formula: 'LiCl / Li',
    flameName: 'Màu Đỏ Thắm (Đỏ đồng / Crimson)',
    flameColorHex: '#ff1744',
    flameGlowHex: 'rgba(255, 23, 68, 0.85)',
    description: 'Đưa mẫu Lithium hoặc muối Lithium vào ngọn lửa đèn khí không màu làm ngọn lửa chuyển sang màu đỏ thắm (Crimson) rất đặc trưng.',
  },
  {
    id: 'Na',
    name: 'Sodium',
    vietnameseName: 'Sodium',
    formula: 'NaCl / Na',
    flameName: 'Màu Vàng Tươi (Vàng đặc trưng / Golden Yellow)',
    flameColorHex: '#ffcc00',
    flameGlowHex: 'rgba(255, 204, 0, 0.9)',
    description: 'Đưa mẫu Sodium hoặc muối Sodium vào ngọn lửa đèn khí không màu làm ngọn lửa bùng lên màu vàng tươi vô cùng chói lọi.',
  },
  {
    id: 'K',
    name: 'Potassium',
    vietnameseName: 'Potassium',
    formula: 'KCl / K',
    flameName: 'Màu Tím Nhạt (Lilac / Pale Violet)',
    flameColorHex: '#d8b4fe',
    flameGlowHex: 'rgba(192, 132, 252, 0.85)',
    description: 'Đưa mẫu Potassium hoặc muối Potassium vào ngọn lửa đèn khí không màu làm ngọn lửa chuyển sang màu tím nhạt. Quan sát qua kính coban sẽ thấy rõ màu tím quyến rũ.',
    cobaltGlassEffect: 'Kính thủy tinh Coban lọc bỏ ánh sáng vàng của vết tạp chất Sodium, giúp thấy rõ ngọn lửa màu Tím hoa tạ (Lilac).',
  },
  {
    id: 'Rb',
    name: 'Rubidium',
    vietnameseName: 'Rubidium',
    formula: 'RbCl / Rb',
    flameName: 'Màu Đỏ Tím / Tím Hồng (Đỏ pha Tím / Reddish Violet)',
    flameColorHex: '#f42a78',
    flameGlowHex: 'rgba(244, 42, 120, 0.88)',
    description: 'Đưa mẫu Rubidium vào ngọn lửa đèn khí không màu làm ngọn lửa bốc cháy ngả tông màu Đỏ Tím (Đỏ pha chút Tím Hồng, phân biệt rõ với màu đỏ thắm của Lithium).',
  },
  {
    id: 'Cs',
    name: 'Cesium',
    vietnameseName: 'Cesium',
    formula: 'CsCl / Cs',
    flameName: 'Màu Xanh Lam (Xanh Tím / Sky Blue)',
    flameColorHex: '#38bdf8',
    flameGlowHex: 'rgba(56, 189, 248, 0.85)',
    description: 'Đưa mẫu Cesium vào ngọn lửa đèn khí không màu làm ngọn lửa có màu xanh lam nhạt pha tím tuyệt đẹp.',
  },
];

export const FlameTestModal: React.FC<FlameTestModalProps> = ({ isOpen, onClose }) => {
  const [selectedMetalId, setSelectedMetalId] = useState<string>('Li');
  const [isBurning, setIsBurning] = useState<boolean>(false);
  const [isGasOn, setIsGasOn] = useState<boolean>(true);
  const [useCobaltGlass, setUseCobaltGlass] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const activeSample = FLAME_SAMPLES.find((s) => s.id === selectedMetalId) || FLAME_SAMPLES[0];

  // Start burning test trigger
  const handleBurnSample = (metalId: string) => {
    setSelectedMetalId(metalId);
    setIsBurning(true);
    soundEngine.playFlamePop();

    setTimeout(() => {
      soundEngine.playFlamePop();
    }, 600);
  };

  const handleStopBurn = () => {
    setIsBurning(false);
  };

  // Canvas flame rendering loop
  useEffect(() => {
    let animationFrameId: number;
    let frame = 0;

    const render = () => {
      frame++;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw Bunsen Burner Base
      const burnerX = width / 2;
      const burnerBaseY = height - 25;
      const burnerTopY = height - 120;

      // Heavy metal base
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.ellipse(burnerX, burnerBaseY + 10, 45, 12, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Metal column
      const colGrad = ctx.createLinearGradient(burnerX - 12, 0, burnerX + 12, 0);
      colGrad.addColorStop(0, '#475569');
      colGrad.addColorStop(0.5, '#94a3b8');
      colGrad.addColorStop(1, '#334155');
      ctx.fillStyle = colGrad;
      ctx.fillRect(burnerX - 10, burnerTopY, 20, burnerBaseY - burnerTopY + 10);

      // Gas air ring valve
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(burnerX - 12, burnerBaseY - 20, 24, 12);
      ctx.fillStyle = '#cbd5e1';
      ctx.beginPath();
      ctx.arc(burnerX - 6, burnerBaseY - 14, 3, 0, Math.PI * 2);
      ctx.fill();

      // Gas tube nozzle rim
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(burnerX - 12, burnerTopY - 4, 24, 6);

      // 2. Draw Gas Flame if gas is ON
      if (isGasOn) {
        const flameBaseY = burnerTopY - 4;

        // Determine flame color characteristics
        let targetColorHex = 'rgba(186, 230, 253, 0.45)'; // Colorless / faint pale blue
        let outerGlowHex = 'rgba(147, 197, 253, 0.2)';

        if (isBurning) {
          targetColorHex = activeSample.flameColorHex;
          outerGlowHex = activeSample.flameGlowHex;
        }

        // Apply Cobalt Glass Filter view if enabled
        if (useCobaltGlass && isBurning) {
          if (selectedMetalId === 'K') {
            targetColorHex = '#c084fc';
            outerGlowHex = 'rgba(192, 132, 252, 0.95)';
          } else if (selectedMetalId === 'Na') {
            // Cobalt glass absorbs yellow
            targetColorHex = 'rgba(148, 163, 184, 0.2)';
            outerGlowHex = 'rgba(100, 116, 139, 0.1)';
          }
        }

        // Flame height flicker
        const flameHeight = isBurning ? 110 + Math.sin(frame * 0.2) * 8 : 65 + Math.sin(frame * 0.15) * 4;
        const flameWidth = isBurning ? 34 + Math.cos(frame * 0.18) * 4 : 18;

        // Outer Flame Cone
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(burnerX - flameWidth / 2, flameBaseY);
        ctx.quadraticCurveTo(
          burnerX - flameWidth * 0.8,
          flameBaseY - flameHeight * 0.5,
          burnerX + (Math.sin(frame * 0.2) * 4),
          flameBaseY - flameHeight
        );
        ctx.quadraticCurveTo(
          burnerX + flameWidth * 0.8,
          flameBaseY - flameHeight * 0.5,
          burnerX + flameWidth / 2,
          flameBaseY
        );
        ctx.closePath();

        const flameGrad = ctx.createRadialGradient(
          burnerX,
          flameBaseY - flameHeight * 0.4,
          2,
          burnerX,
          flameBaseY - flameHeight * 0.4,
          flameHeight * 0.6
        );

        if (isBurning) {
          flameGrad.addColorStop(0, '#ffffff');
          flameGrad.addColorStop(0.3, targetColorHex);
          flameGrad.addColorStop(1, outerGlowHex);
        } else {
          // Colorless pale gas flame
          flameGrad.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
          flameGrad.addColorStop(0.4, 'rgba(186, 230, 253, 0.4)');
          flameGrad.addColorStop(1, 'transparent');
        }

        ctx.fillStyle = flameGrad;
        ctx.shadowColor = targetColorHex;
        ctx.shadowBlur = isBurning ? 35 : 10;
        ctx.fill();
        ctx.restore();

        // Inner Hot Blue Core
        ctx.beginPath();
        ctx.moveTo(burnerX - 8, flameBaseY);
        ctx.quadraticCurveTo(
          burnerX,
          flameBaseY - 35 + Math.sin(frame * 0.3) * 2,
          burnerX + 8,
          flameBaseY
        );
        ctx.closePath();
        ctx.fillStyle = 'rgba(56, 189, 248, 0.8)';
        ctx.fill();

        // 3. Draw Platinum Wire Loop with Metal Sample
        const wireStartX = width - 40;
        const wireStartY = height - 40;
        const loopTargetX = isBurning ? burnerX : burnerX + 80;
        const loopTargetY = flameBaseY - 45;

        // Wire handle
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(wireStartX, wireStartY);
        ctx.lineTo(loopTargetX + 20, loopTargetY + 10);
        ctx.stroke();

        // Thin platinum loop
        ctx.strokeStyle = isBurning ? '#f87171' : '#cbd5e1';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(loopTargetX + 20, loopTargetY + 10);
        ctx.lineTo(loopTargetX + 8, loopTargetY);
        ctx.arc(loopTargetX, loopTargetY, 8, 0, Math.PI * 2);
        ctx.stroke();

        // Glowing sample bead inside loop
        if (isBurning) {
          ctx.beginPath();
          ctx.arc(loopTargetX, loopTargetY, 5, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = targetColorHex;
          ctx.shadowBlur = 20;
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(loopTargetX, loopTargetY, 4, 0, Math.PI * 2);
          ctx.fillStyle = '#e2e8f0';
          ctx.fill();
        }

        // Sparkle particles when burning
        if (isBurning) {
          for (let p = 0; p < 6; p++) {
            const px = burnerX + (Math.random() - 0.5) * flameWidth * 1.5;
            const py = flameBaseY - Math.random() * flameHeight;
            const pSize = Math.random() * 3 + 1;
            ctx.fillStyle = targetColorHex;
            ctx.beginPath();
            ctx.arc(px, py, pSize, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // Cobalt Glass overlay tint on entire canvas if toggled
      if (useCobaltGlass) {
        ctx.fillStyle = 'rgba(30, 58, 138, 0.45)';
        ctx.fillRect(0, 0, width, height);

        // Cobalt Glass frame indicator border
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 4;
        ctx.strokeRect(4, 4, width - 8, height - 8);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText('KÍNH THỦY TINH COBAN (COBALT GLASS FILTER)', 12, 22);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [selectedMetalId, isBurning, isGasOn, useCobaltGlass, activeSample]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-3 md:p-5 overflow-y-auto">
      <div className="relative w-full max-w-4xl frame-3d p-4 md:p-6 text-slate-900 shadow-[8px_8px_0px_#ca8a04] bg-amber-50 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-yellow-400">
          <div className="flex items-center gap-2.5 text-yellow-950 font-black text-base md:text-xl uppercase tracking-wider">
            <Flame className="w-7 h-7 text-yellow-600 animate-pulse" />
            <span>THÍ NGHIỆM VỀ PHẢN ỨNG THỬ MÀU NGỌN LỬA KIM LOẠI KIỀM</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-yellow-200 hover:bg-yellow-300 text-slate-900 border border-yellow-500 cursor-pointer transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Top Controls & Explanation Banner */}
        <div className="bg-yellow-100/90 p-3 rounded-xl border border-yellow-300 mb-4 flex flex-col md:flex-row items-center justify-between gap-3 text-xs md:text-sm text-slate-800">
          <div className="flex items-start gap-2">
            <Info className="w-5 h-5 text-yellow-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold text-yellow-950 block">Nguyên tắc thí nghiệm:</span>
              <span>
                Đưa mẫu kim loại kiềm hoặc muối của chúng vào <strong>ngọn lửa đèn khí không màu</strong>. Ngọn lửa sẽ chuyển ngay sang màu sắc đặc trưng của kim loại đó.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setUseCobaltGlass(!useCobaltGlass)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-bold text-xs cursor-pointer transition-all ${
                useCobaltGlass
                  ? 'bg-blue-600 text-white border-blue-800 shadow-xs'
                  : 'bg-white text-blue-900 border-blue-300 hover:bg-blue-50'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>{useCobaltGlass ? 'Bỏ kính Coban' : 'Nhìn qua Kính Coban'}</span>
            </button>
          </div>
        </div>

        {/* Main Interactive Stage: Flame Canvas + Control Sidebar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch mb-4">
          {/* Flame Canvas Box */}
          <div className="md:col-span-7 bg-slate-950 rounded-2xl border-4 border-yellow-500 p-3 flex flex-col items-center justify-center relative overflow-hidden shadow-inner min-h-[280px]">
            <canvas
              ref={canvasRef}
              width={380}
              height={260}
              className="w-full h-auto object-contain max-h-[280px]"
            />

            {/* Status Indicator Tag */}
            <div className="absolute top-3 left-3 bg-slate-900/90 text-yellow-300 px-3 py-1 rounded-md border border-yellow-500/50 text-xs font-mono font-bold">
              {isBurning ? (
                <span className="text-rose-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" /> Đang thử: {activeSample.vietnameseName} ({activeSample.id})
                </span>
              ) : (
                <span className="text-cyan-300 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-cyan-400" /> Ngọn lửa đèn khí không màu
                </span>
              )}
            </div>

            {/* Action buttons overlay */}
            <div className="absolute bottom-3 right-3 flex items-center gap-2">
              <button
                onClick={() => setIsGasOn(!isGasOn)}
                className="px-2.5 py-1 rounded bg-slate-800 text-slate-200 border border-slate-600 text-[11px] font-bold hover:bg-slate-700 cursor-pointer"
              >
                {isGasOn ? 'Tắt Đèn Khí' : 'Bật Đèn Khí'}
              </button>
              {isBurning && (
                <button
                  onClick={handleStopBurn}
                  className="px-2.5 py-1 rounded bg-rose-600 text-white border border-rose-700 text-[11px] font-bold hover:bg-rose-700 cursor-pointer"
                >
                  Rút dây ra
                </button>
              )}
            </div>
          </div>

          {/* Metal Select Buttons */}
          <div className="md:col-span-5 flex flex-col justify-between gap-2.5 bg-white/90 p-3.5 rounded-2xl border-2 border-yellow-300 shadow-xs">
            <div>
              <h4 className="font-extrabold text-slate-900 text-xs md:text-sm uppercase tracking-wide mb-2 flex items-center gap-1.5 border-b border-yellow-200 pb-1.5">
                <Zap className="w-4 h-4 text-yellow-600" />
                <span>CHỌN MAU THỬ KIM LOẠI KIỀM:</span>
              </h4>

              <div className="space-y-2">
                {FLAME_SAMPLES.map((sample) => {
                  const isSelected = selectedMetalId === sample.id;
                  return (
                    <button
                      key={sample.id}
                      onClick={() => handleBurnSample(sample.id)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl border-2 font-bold text-xs transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-yellow-200 border-yellow-600 shadow-xs scale-[1.02]'
                          : 'bg-yellow-50/60 border-yellow-200 hover:bg-yellow-100'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-5 h-5 rounded-full border border-slate-700 shadow-inner flex items-center justify-center text-[10px] text-white font-black"
                          style={{ backgroundColor: sample.flameColorHex }}
                        >
                          {sample.id}
                        </span>
                        <div className="text-left">
                          <div className="font-black text-slate-900">
                            {sample.vietnameseName} ({sample.id})
                          </div>
                          <div className="text-[10px] text-slate-600 font-semibold">
                            {sample.flameName}
                          </div>
                        </div>
                      </div>

                      <span className="text-[10px] font-black px-2 py-0.5 rounded bg-yellow-400 text-slate-950 border border-yellow-600 shadow-2xs">
                        Đốt thử
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Burn Phenomenon Output */}
            <div className="p-3 rounded-xl bg-yellow-100/90 border border-yellow-300 text-xs text-slate-900 mt-2">
              <span className="font-extrabold text-yellow-950 block mb-1 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-yellow-700" /> Hiện tượng quan sát ({activeSample.vietnameseName}):
              </span>
              <p className="leading-snug">{activeSample.description}</p>
              {activeSample.cobaltGlassEffect && (
                <p className="mt-1 text-[11px] text-blue-900 font-medium bg-blue-100/80 p-1.5 rounded border border-blue-200">
                  💡 {activeSample.cobaltGlassEffect}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Summary Table: Chemistry Theory for Flame Color Reactions */}
        <div className="p-4 rounded-xl bg-white border-2 border-yellow-300 text-xs text-slate-800">
          <h4 className="font-extrabold text-slate-900 uppercase tracking-wide mb-2 flex items-center gap-2 text-xs md:text-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>BẢNG TỔNG HỢP MÀU NGỌN LỬA ĐẶC TRƯNG CỦA KIM LOẠI KIỀM</span>
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center font-bold">
            <div className="p-2 rounded bg-rose-100 border border-rose-300 text-rose-950">
              <div className="font-black text-sm">Lithium (Li)</div>
              <div className="text-[11px] text-rose-700 mt-0.5">Màu Đỏ Thắm</div>
            </div>

            <div className="p-2 rounded bg-amber-100 border border-amber-300 text-amber-950">
              <div className="font-black text-sm">Sodium (Na)</div>
              <div className="text-[11px] text-amber-800 mt-0.5">Màu Vàng Tươi</div>
            </div>

            <div className="p-2 rounded bg-purple-100 border border-purple-300 text-purple-950">
              <div className="font-black text-sm">Potassium (K)</div>
              <div className="text-[11px] text-purple-800 mt-0.5">Màu Tím Nhạt</div>
            </div>

            <div className="p-2 rounded bg-rose-100 border border-rose-300 text-rose-950">
              <div className="font-black text-sm">Rubidium (Rb)</div>
              <div className="text-[11px] text-rose-800 mt-0.5">Màu Đỏ Tím (Tím Hồng)</div>
            </div>

            <div className="p-2 rounded bg-sky-100 border border-sky-300 text-sky-950">
              <div className="font-black text-sm">Cesium (Cs)</div>
              <div className="text-[11px] text-sky-800 mt-0.5">Màu Xanh Lam</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-yellow-300 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-slate-950 font-bold text-sm border-2 border-yellow-600 shadow-xs cursor-pointer transition-all"
          >
            Đóng Thí Nghiệm
          </button>
        </div>
      </div>
    </div>
  );
};
