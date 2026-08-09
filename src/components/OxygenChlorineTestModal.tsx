import React, { useState, useRef, useEffect } from 'react';
import { X, Flame, Sparkles, RefreshCw, Eye, Zap, Info, ShieldCheck, ArrowRight, TestTube, CheckCircle2 } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface OxygenChlorineTestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type GasType = 'O2' | 'Cl2';
type MetalType = 'Li' | 'Na' | 'K';

interface ReactionConfig {
  metal: MetalType;
  gas: GasType;
  metalName: string;
  gasName: string;
  flameColorHex: string;
  flameGlowHex: string;
  equation: string;
  equationHtml: string;
  productName: string;
  phenomenon: string;
}

const REACTIONS: Record<string, ReactionConfig> = {
  'Li-O2': {
    metal: 'Li',
    gas: 'O2',
    metalName: 'Lithium (Li)',
    gasName: 'Oxygen (O₂)',
    flameColorHex: '#ff1744',
    flameGlowHex: 'rgba(255, 23, 68, 0.9)',
    equation: '4Li + O2 ──(t°)──> 2Li2O',
    equationHtml: '4Li + O<sub>2</sub> &rarr; 2Li<sub>2</sub>O',
    productName: 'Lithium oxide (Li₂O - Bột màu trắng)',
    phenomenon: 'Lithium bốc cháy vừa phải trên ngọn lửa màu ĐỎ THẮM trong bình khí oxygen. Sinh ra khói trắng Lithium oxide (Li₂O) bám thành lọ.',
  },
  'Na-O2': {
    metal: 'Na',
    gas: 'O2',
    metalName: 'Sodium (Na)',
    gasName: 'Oxygen (O₂)',
    flameColorHex: '#ffcc00',
    flameGlowHex: 'rgba(255, 204, 0, 0.95)',
    equation: '2Na + O2 ──(t°)──> Na2O2',
    equationHtml: '2Na + O<sub>2</sub> &rarr; Na<sub>2</sub>O<sub>2</sub>',
    productName: 'Sodium peroxide (Na₂O₂ - Chất rắn màu xám trắng / ngả vàng)',
    phenomenon: 'Sodium nóng chảy thành giọt tròn, bốc cháy MÃNH LIỆT HƠN Lithium phát ngọn lửa màu VÀNG TƯƠI chói lọi rực rỡ. Tạo ra chất rắn Sodium peroxide (Na₂O₂).',
  },
  'K-O2': {
    metal: 'K',
    gas: 'O2',
    metalName: 'Potassium (K)',
    gasName: 'Oxygen (O₂)',
    flameColorHex: '#d8b4fe',
    flameGlowHex: 'rgba(192, 132, 252, 0.9)',
    equation: 'K + O2 ──(t°)──> KO2',
    equationHtml: 'K + O<sub>2</sub> &rarr; KO<sub>2</sub>',
    productName: 'Potassium superoxide (KO₂ - Chất rắn màu vàng da cam)',
    phenomenon: 'Potassium bốc cháy CỰC KỲ MÃNH LIỆT VÀ BÙNG NỔ RẤT NHANH (mãnh liệt nhất trong 3 kim loại) với ngọn lửa màu TÍM NHẠT chói lọi, tia lửa nổ lách tách. Phản ứng sinh ra Potassium superoxide (KO₂).',
  },
  'Li-Cl2': {
    metal: 'Li',
    gas: 'Cl2',
    metalName: 'Lithium (Li)',
    gasName: 'Chlorine (Cl₂)',
    flameColorHex: '#ff1744',
    flameGlowHex: 'rgba(255, 23, 68, 0.9)',
    equation: '2Li + Cl2 ──(t°)──> 2LiCl',
    equationHtml: '2Li + Cl<sub>2</sub> &rarr; 2LiCl',
    productName: 'Lithium chloride (LiCl - Muối trung tính)',
    phenomenon: 'Lithium bốc cháy vừa phải trong bình khí chlorine màu VÀNG LỤC với ngọn lửa màu ĐỎ THẮM. Khí chlorine màu vàng lục nhạt dần, tạo khói trắng LiCl.',
  },
  'Na-Cl2': {
    metal: 'Na',
    gas: 'Cl2',
    metalName: 'Sodium (Na)',
    gasName: 'Chlorine (Cl₂)',
    flameColorHex: '#ffcc00',
    flameGlowHex: 'rgba(255, 204, 0, 0.95)',
    equation: '2Na + Cl2 ──(t°)──> 2NaCl',
    equationHtml: '2Na + Cl<sub>2</sub> &rarr; 2NaCl',
    productName: 'Sodium chloride (NaCl - Muối ăn trung tính)',
    phenomenon: 'Sodium nóng chảy bốc cháy MÃNH LIỆT HƠN Lithium trong khí chlorine với ngọn lửa VÀNG TƯƠI chói lọi. Màu vàng lục đặc trưng của khí chlorine biến mất nhanh, tạo khói trắng tinh NaCl.',
  },
  'K-Cl2': {
    metal: 'K',
    gas: 'Cl2',
    metalName: 'Potassium (K)',
    gasName: 'Chlorine (Cl₂)',
    flameColorHex: '#d8b4fe',
    flameGlowHex: 'rgba(192, 132, 252, 0.95)',
    equation: '2K + Cl2 ──(t°)──> 2KCl',
    equationHtml: '2K + Cl<sub>2</sub> &rarr; 2KCl',
    productName: 'Potassium chloride (KCl - Muối trung tính)',
    phenomenon: 'Potassium phản ứng CỰC KỲ MÃNH LIỆT VÀ BÙNG NỔ TỨC THÌ (mãnh liệt nhất) với ngọn lửa TÍM NHẠT, tia lửa nổ lách tách dữ dội. Khí chlorine vàng lục bị tiêu thụ hoàn toàn, khói trắng KCl bao phủ.',
  },
};

export const OxygenChlorineTestModal: React.FC<OxygenChlorineTestModalProps> = ({ isOpen, onClose }) => {
  const [selectedGas, setSelectedGas] = useState<GasType>('O2');
  const [selectedMetal, setSelectedMetal] = useState<MetalType>('Na');
  const [step, setStep] = useState<number>(1); // 1: Select/Prep, 2: Heating on Burner, 3: Burning in Jar, 4: Water + Indicator Test
  const [indicatorColor, setIndicatorColor] = useState<'none' | 'pink' | 'blue' | 'neutral_pp' | 'neutral_litmus'>('none');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const activeReactionKey = `${selectedMetal}-${selectedGas}`;
  const reaction = REACTIONS[activeReactionKey] || REACTIONS['Na-O2'];

  // Step Reset when changing metal or gas
  const handleSelectGas = (gas: GasType) => {
    setSelectedGas(gas);
    setStep(1);
    setIndicatorColor('none');
  };

  const handleSelectMetal = (metal: MetalType) => {
    setSelectedMetal(metal);
    setStep(1);
    setIndicatorColor('none');
  };

  const handleReset = () => {
    setStep(1);
    setIndicatorColor('none');
  };

  // Step triggers
  const handlePrepMetal = () => {
    setStep(1);
    soundEngine.playDrip();
  };

  const handleHeatOnBurner = () => {
    setStep(2);
    soundEngine.playFlamePop();
  };

  const handleInsertIntoJar = () => {
    setStep(3);
    soundEngine.playFlamePop();
    setTimeout(() => {
      soundEngine.playFlamePop();
    }, 500);
  };

  const handleAddWaterAndIndicator = (type: 'pp' | 'litmus') => {
    if (step < 3) return;
    setStep(4);
    soundEngine.playPourWater();
    setTimeout(() => {
      soundEngine.playDrip();
      if (selectedGas === 'O2') {
        // Oxides / Peroxides form strong bases in water (LiOH, NaOH, KOH)
        setIndicatorColor(type === 'pp' ? 'pink' : 'blue');
      } else {
        // Neutral salts (LiCl, NaCl, KCl) -> DO NOT CHANGE COLOR!
        setIndicatorColor(type === 'pp' ? 'neutral_pp' : 'neutral_litmus');
      }
    }, 600);
  };

  // Canvas animation loop
  useEffect(() => {
    let animFrameId: number;
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

      // Laboratory bench surface
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, height - 30, width, 30);
      ctx.fillStyle = '#334155';
      ctx.fillRect(0, height - 30, width, 3);

      // Positions
      const burnerX = width * 0.28;
      const burnerBaseY = height - 30;
      const burnerTopY = height - 110;

      const jarX = width * 0.70;
      const jarBottomY = height - 30;
      const jarWidth = 110;
      const jarHeight = 160;
      const jarTopY = jarBottomY - jarHeight;

      // ----------------------------------------------------
      // 1. Draw Bunsen Burner
      // ----------------------------------------------------
      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.ellipse(burnerX, burnerBaseY, 35, 10, 0, 0, Math.PI * 2);
      ctx.fill();

      // Metal pipe column
      const bGrad = ctx.createLinearGradient(burnerX - 8, 0, burnerX + 8, 0);
      bGrad.addColorStop(0, '#64748b');
      bGrad.addColorStop(0.5, '#cbd5e1');
      bGrad.addColorStop(1, '#475569');
      ctx.fillStyle = bGrad;
      ctx.fillRect(burnerX - 8, burnerTopY, 16, burnerBaseY - burnerTopY);

      // Gas flame on burner
      const flameBaseY = burnerTopY;
      const isBurnerActive = step >= 2;
      if (isBurnerActive) {
        ctx.save();
        ctx.beginPath();
        const fHeight = 45 + Math.sin(frame * 0.2) * 3;
        ctx.moveTo(burnerX - 10, flameBaseY);
        ctx.quadraticCurveTo(burnerX, flameBaseY - fHeight, burnerX + 10, flameBaseY);
        ctx.closePath();
        ctx.fillStyle = 'rgba(56, 189, 248, 0.85)'; // Blue flame
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 15;
        ctx.fill();

        // Inner blue cone
        ctx.beginPath();
        ctx.moveTo(burnerX - 5, flameBaseY);
        ctx.quadraticCurveTo(burnerX, flameBaseY - 22, burnerX + 5, flameBaseY);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.restore();
      }

      // ----------------------------------------------------
      // 2. Draw Gas Jar (Bình thủy tinh chứa O₂ / Cl₂)
      // ----------------------------------------------------
      ctx.save();

      // Gas Jar Liquid or Indicator Solution if step === 4
      if (step === 4) {
        const liquidHeight = 40;
        const liquidTopY = jarBottomY - liquidHeight;

        ctx.beginPath();
        ctx.rect(jarX - jarWidth / 2 + 5, liquidTopY, jarWidth - 10, liquidHeight - 5);

        if (indicatorColor === 'pink') {
          ctx.fillStyle = 'rgba(236, 72, 153, 0.88)'; // Phenolphthalein Pink (Base)
        } else if (indicatorColor === 'blue') {
          ctx.fillStyle = 'rgba(59, 130, 246, 0.88)'; // Litmus Blue (Base)
        } else if (indicatorColor === 'neutral_litmus') {
          ctx.fillStyle = 'rgba(168, 85, 247, 0.6)'; // Litmus Purple (Neutral Unchanged)
        } else if (indicatorColor === 'neutral_pp') {
          ctx.fillStyle = 'rgba(224, 242, 254, 0.45)'; // Clear Solution (PP Unchanged)
        } else {
          ctx.fillStyle = 'rgba(224, 242, 254, 0.4)'; // Clear water
        }
        ctx.fill();

        // Surface ellipse
        ctx.beginPath();
        ctx.ellipse(jarX, liquidTopY, jarWidth / 2 - 5, 6, 0, 0, Math.PI * 2);
        ctx.fillStyle =
          indicatorColor === 'pink' ? '#f472b6' :
          indicatorColor === 'blue' ? '#60a5fa' :
          indicatorColor === 'neutral_litmus' ? '#c084fc' : '#ffffff';
        ctx.fill();
      }

      // Gas Atmosphere Color inside Jar
      let gasAlpha = selectedGas === 'Cl2' ? 0.75 : 0.5;
      if (step === 3) {
        // Cl2 gas gets consumed as reaction completes
        gasAlpha = Math.max(0.18, 0.75 - (frame % 300) * 0.003);
      } else if (step === 4) {
        // Reaction completed and water added -> Gas dissipated/dissolved
        gasAlpha = 0.08;
      }

      if (selectedGas === 'Cl2') {
        // Distinct Chlorine Gas (Màu vàng lục ngả nâu - Yellowish-Green with warm brownish/olive undertone)
        const gasGrad = ctx.createLinearGradient(0, jarTopY, 0, jarBottomY);
        gasGrad.addColorStop(0, `rgba(190, 168, 42, ${gasAlpha})`);
        gasGrad.addColorStop(0.5, `rgba(172, 148, 30, ${gasAlpha})`);
        gasGrad.addColorStop(1, `rgba(150, 128, 20, ${gasAlpha * 0.95})`);
        ctx.fillStyle = gasGrad;
      } else {
        // Oxygen gas (Transparent / slight blue halo)
        ctx.fillStyle = 'rgba(224, 242, 254, 0.12)';
      }

      // Fill Jar Body Atmosphere
      ctx.fillRect(jarX - jarWidth / 2 + 4, jarTopY + 15, jarWidth - 8, jarHeight - 20);

      // Glass Body Outer Outline
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      // Jar neck & mouth
      ctx.moveTo(jarX - 30, jarTopY);
      ctx.lineTo(jarX + 30, jarTopY);
      ctx.lineTo(jarX + 30, jarTopY + 15);
      ctx.lineTo(jarX + jarWidth / 2, jarTopY + 25);
      ctx.lineTo(jarX + jarWidth / 2, jarBottomY - 5);
      ctx.quadraticCurveTo(jarX + jarWidth / 2, jarBottomY, jarX + jarWidth / 2 - 10, jarBottomY);
      ctx.lineTo(jarX - jarWidth / 2 + 10, jarBottomY);
      ctx.quadraticCurveTo(jarX - jarWidth / 2, jarBottomY, jarX - jarWidth / 2, jarBottomY - 5);
      ctx.lineTo(jarX - jarWidth / 2, jarTopY + 25);
      ctx.lineTo(jarX - 30, jarTopY + 15);
      ctx.closePath();
      ctx.stroke();

      // Glass glare reflection
      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.beginPath();
      ctx.fillRect(jarX - jarWidth / 2 + 8, jarTopY + 30, 8, jarHeight - 45);

      // Glass Cover Plate (Nút bần / Đĩa đậy glass stopper)
      const isStopperOff = step === 3;
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(jarX - 38, isStopperOff ? jarTopY - 25 : jarTopY - 6, 76, 8);

      // Jar Label Badge
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.fillRect(jarX - 35, jarBottomY - 30, 70, 20);
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      ctx.strokeRect(jarX - 35, jarBottomY - 30, 70, 20);

      ctx.fillStyle = selectedGas === 'Cl2' ? '#eab308' : '#38bdf8';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(selectedGas === 'Cl2' ? 'Bình Cl₂' : 'Bình O₂', jarX, jarBottomY - 16);

      ctx.restore();

      // ----------------------------------------------------
      // 3. Draw Deflagrating Spoon & Metal Sample
      // ----------------------------------------------------
      let spoonX = width * 0.1;
      let spoonY = height - 45;

      if (step === 1) {
        // Spoon sitting on tray
        spoonX = width * 0.12;
        spoonY = height - 42;
      } else if (step === 2) {
        // Spoon held over Bunsen burner flame
        spoonX = burnerX;
        spoonY = flameBaseY - 30;
      } else if (step >= 3) {
        // Spoon inserted deep into gas jar
        spoonX = jarX;
        spoonY = jarTopY + 80;
      }

      // Spoon metal rod stem
      ctx.save();
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(spoonX + 60, spoonY - 100);
      ctx.lineTo(spoonX, spoonY);
      ctx.stroke();

      // Spoon cup basin
      ctx.fillStyle = '#64748b';
      ctx.beginPath();
      ctx.arc(spoonX, spoonY + 4, 10, 0, Math.PI);
      ctx.fill();

      // Metal sample lump on spoon
      if (step === 1) {
        // Unburnt solid metal piece
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.arc(spoonX, spoonY, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#475569';
        ctx.stroke();
      } else if (step === 2) {
        // Heated glowing metal lump on burner
        ctx.fillStyle = '#f97316'; // Glowing orange liquid bead
        ctx.shadowColor = '#f97316';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(spoonX, spoonY, 6, 0, Math.PI * 2);
        ctx.fill();
      } else if (step === 3) {
        // BURNING INTENSELY IN GAS JAR!
        // Metal Reactivity Progression (Li < Na < K)
        const intensity = selectedMetal === 'Li' ? 1.0 : selectedMetal === 'Na' ? 1.8 : 3.0;
        const flameColor = reaction.flameColorHex;
        const flameGlow = reaction.flameGlowHex;

        // Intense Reaction Flame Core (Radius scales with reactivity)
        const baseRadius = selectedMetal === 'Li' ? 16 : selectedMetal === 'Na' ? 25 : 36;
        const fRadius = baseRadius + Math.sin(frame * 0.2 * intensity) * (3 * intensity);

        ctx.beginPath();
        ctx.arc(spoonX, spoonY, fRadius, 0, Math.PI * 2);

        const rGrad = ctx.createRadialGradient(spoonX, spoonY, 2, spoonX, spoonY, fRadius);
        rGrad.addColorStop(0, '#ffffff');
        rGrad.addColorStop(0.35, flameColor);
        rGrad.addColorStop(1, flameGlow);

        ctx.fillStyle = rGrad;
        ctx.shadowColor = flameColor;
        ctx.shadowBlur = 20 * intensity;
        ctx.fill();

        // Flying sparks inside jar (Count and burst speed scale with reactivity)
        const sparkCount = Math.floor(6 * intensity);
        const sparkDistance = 35 * intensity;
        for (let s = 0; s < sparkCount; s++) {
          const spX = spoonX + (Math.random() - 0.5) * sparkDistance;
          const spY = spoonY + (Math.random() - 0.5) * sparkDistance;
          ctx.fillStyle = flameColor;
          ctx.beginPath();
          ctx.arc(spX, spY, Math.random() * (1.5 * intensity) + 1, 0, Math.PI * 2);
          ctx.fill();
        }

        // Explosive Shockwave Rays for Kali (K)
        if (selectedMetal === 'K') {
          for (let ray = 0; ray < 6; ray++) {
            const angle = (frame * 0.15 + ray * (Math.PI / 3));
            const rX = spoonX + Math.cos(angle) * (fRadius + 12);
            const rY = spoonY + Math.sin(angle) * (fRadius + 12);
            ctx.strokeStyle = '#f3e8ff';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(spoonX, spoonY);
            ctx.lineTo(rX, rY);
            ctx.stroke();
          }
        }

        // Thick White Smoke filling jar (Smoke speed & volume scale with reactivity)
        const smokeCount = Math.floor(8 * intensity);
        for (let sm = 0; sm < smokeCount; sm++) {
          const smX = jarX + Math.sin(frame * 0.08 * intensity + sm) * (jarWidth * 0.35);
          const smY = jarTopY + 20 + (sm * 8 + frame * 1.5 * intensity) % (jarHeight - 40);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
          ctx.beginPath();
          ctx.arc(smX, smY, (6 + Math.sin(sm) * 3) * Math.sqrt(intensity), 0, Math.PI * 2);
          ctx.fill();
        }

        // Oxide / Chloride powder precipitate on jar bottom
        ctx.fillStyle = 'rgba(248, 250, 252, 0.9)';
        ctx.beginPath();
        ctx.ellipse(jarX, jarBottomY - 8, jarWidth / 2 - 8, 8, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (step === 4) {
        // FLAME EXTINGUISHED! Metal burnt out & water added
        // Spoon has dull ash-gray burnt residue with NO flame
        ctx.fillStyle = '#64748b';
        ctx.beginPath();
        ctx.arc(spoonX, spoonY + 2, 4, 0, Math.PI * 2);
        ctx.fill();

        // Subtle faint steam rising from solution
        for (let st = 0; st < 3; st++) {
          const stX = jarX + Math.sin(frame * 0.05 + st) * 15;
          const stY = jarBottomY - 45 - ((frame * 0.8 + st * 15) % 35);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
          ctx.beginPath();
          ctx.arc(stX, stY, 3 + Math.sin(st) * 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.restore();

      animFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animFrameId);
    };
  }, [selectedGas, selectedMetal, step, indicatorColor, reaction]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-3 md:p-5 overflow-y-auto">
      <div className="relative w-full max-w-4xl frame-3d p-4 md:p-6 text-slate-900 shadow-[8px_8px_0px_#ca8a04] bg-amber-50 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-yellow-400">
          <div className="flex items-center gap-2.5 text-yellow-950 font-black text-sm md:text-xl uppercase tracking-wider">
            <Flame className="w-7 h-7 text-orange-600 animate-bounce" />
            <span>THÍ NGHIỆM 3: PHẢN ỨNG CỦA KIM LOẠI KIỀM VỚI OXYGEN (O₂) VÀ CHLORINE (Cl₂)</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-yellow-200 hover:bg-yellow-300 text-slate-900 border border-yellow-500 cursor-pointer transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Gas & Metal Selector Toolbars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          {/* Gas Selector */}
          <div className="bg-white/90 p-3 rounded-xl border-2 border-yellow-300 shadow-xs flex flex-col justify-between">
            <div className="text-xs font-extrabold text-slate-800 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <TestTube className="w-4 h-4 text-sky-600" />
              <span>1. CHỌN BÌNH KHÍ PHẢN ỨNG:</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleSelectGas('O2')}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border-2 font-black text-xs cursor-pointer transition-all ${
                  selectedGas === 'O2'
                    ? 'bg-sky-500 text-white border-sky-700 shadow-xs scale-[1.02]'
                    : 'bg-sky-50 text-sky-900 border-sky-300 hover:bg-sky-100'
                }`}
              >
                <span>Oxygen (O₂)</span>
                <span className="text-[10px] opacity-80">(Không màu)</span>
              </button>

              <button
                onClick={() => handleSelectGas('Cl2')}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border-2 font-black text-xs cursor-pointer transition-all ${
                  selectedGas === 'Cl2'
                    ? 'bg-yellow-500 text-slate-950 border-yellow-700 shadow-xs scale-[1.02]'
                    : 'bg-yellow-50 text-yellow-950 border-yellow-300 hover:bg-yellow-100'
                }`}
              >
                <span>Chlorine (Cl₂)</span>
                <span className="text-[10px] opacity-80">(Vàng lục ngả nâu)</span>
              </button>
            </div>
          </div>

          {/* Metal Selector */}
          <div className="bg-white/90 p-3 rounded-xl border-2 border-yellow-300 shadow-xs flex flex-col justify-between">
            <div className="text-xs font-extrabold text-slate-800 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-orange-600" />
              <span>2. CHỌN KIM LOẠI KIỀM:</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {(['Li', 'Na', 'K'] as MetalType[]).map((m) => {
                const isSelected = selectedMetal === m;
                return (
                  <button
                    key={m}
                    onClick={() => handleSelectMetal(m)}
                    className={`py-2 px-2 rounded-xl border-2 font-black text-xs text-center cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-orange-500 text-white border-orange-700 shadow-xs scale-[1.02]'
                        : 'bg-orange-50 text-orange-950 border-orange-200 hover:bg-orange-100'
                    }`}
                  >
                    <div>{m === 'Li' ? 'Lithium (Li)' : m === 'Na' ? 'Sodium (Na)' : 'Potassium (K)'}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Step Interactive Guidance Bar for Students */}
        <div className="bg-yellow-200/90 p-3 rounded-xl border-2 border-yellow-400 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-extrabold text-yellow-950 text-xs md:text-sm uppercase flex items-center gap-1.5">
              <Info className="w-4 h-4 text-yellow-800" />
              <span>THAO TÁC TIẾN HÀNH THÍ NGHIỆM DÀNH CHO HỌC SINH:</span>
            </span>

            <button
              onClick={handleReset}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-yellow-100 hover:bg-white text-slate-900 border border-yellow-500 text-xs font-bold cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Làm lại</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
            {/* Step 1 Button */}
            <button
              onClick={handlePrepMetal}
              className={`flex items-center gap-1.5 p-2 rounded-lg border text-left cursor-pointer transition-all ${
                step === 1
                  ? 'bg-amber-500 text-white border-amber-700 font-black shadow-xs'
                  : 'bg-white/80 text-slate-800 border-yellow-300 font-semibold hover:bg-white'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-amber-900 text-white flex items-center justify-center text-[10px] font-black shrink-0">1</span>
              <span className="text-[11px] leading-tight">Đặt kim loại lên muỗng đốt</span>
            </button>

            {/* Step 2 Button */}
            <button
              onClick={handleHeatOnBurner}
              className={`flex items-center gap-1.5 p-2 rounded-lg border text-left cursor-pointer transition-all ${
                step === 2
                  ? 'bg-orange-500 text-white border-orange-700 font-black shadow-xs'
                  : 'bg-white/80 text-slate-800 border-yellow-300 font-semibold hover:bg-white'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-orange-900 text-white flex items-center justify-center text-[10px] font-black shrink-0">2</span>
              <span className="text-[11px] leading-tight">Đốt trên ngọn lửa đèn khí</span>
            </button>

            {/* Step 3 Button */}
            <button
              onClick={handleInsertIntoJar}
              className={`flex items-center gap-1.5 p-2 rounded-lg border text-left cursor-pointer transition-all ${
                step === 3
                  ? 'bg-rose-600 text-white border-rose-800 font-black shadow-xs animate-pulse'
                  : 'bg-white/80 text-slate-800 border-yellow-300 font-semibold hover:bg-white'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-rose-950 text-white flex items-center justify-center text-[10px] font-black shrink-0">3</span>
              <span className="text-[11px] leading-tight">Đưa vào bình khí {selectedGas}</span>
            </button>

            {/* Step 4 Button */}
            <button
              onClick={() => handleAddWaterAndIndicator('pp')}
              disabled={step < 3}
              className={`flex items-center gap-1.5 p-2 rounded-lg border text-left transition-all ${
                step === 4
                  ? 'bg-pink-600 text-white border-pink-800 font-black shadow-xs'
                  : step < 3
                  ? 'bg-slate-200 text-slate-400 border-slate-300 opacity-60 cursor-not-allowed'
                  : 'bg-pink-50 text-pink-950 border-pink-300 font-bold hover:bg-pink-100 cursor-pointer'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-pink-900 text-white flex items-center justify-center text-[10px] font-black shrink-0">4</span>
              <span className="text-[11px] leading-tight">Thử sản phẩm + PP/Quỳ</span>
            </button>
          </div>
        </div>

        {/* Main Canvas + Phenomenon Explanation */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch mb-4">
          {/* Experiment Stage Canvas */}
          <div className="md:col-span-7 bg-slate-950 rounded-2xl border-4 border-yellow-500 p-3 flex flex-col items-center justify-center relative overflow-hidden shadow-inner min-h-[290px]">
            <canvas
              ref={canvasRef}
              width={400}
              height={270}
              className="w-full h-auto object-contain max-h-[290px]"
            />

            {/* Stage Status Tag */}
            <div className="absolute top-3 left-3 bg-slate-900/90 text-yellow-300 px-3 py-1 rounded-md border border-yellow-500/50 text-xs font-mono font-bold">
              {step === 1 && <span>📍 Bước 1: Mẫu {reaction.metalName} đã được thấm khô trên muỗng</span>}
              {step === 2 && <span className="text-orange-400">🔥 Bước 2: Đang nung nóng kim loại trên đèn khí...</span>}
              {step === 3 && <span className="text-rose-400 flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 animate-spin" /> Bước 3: Đang bùng cháy trong lọ khí {selectedGas}!</span>}
              {step === 4 && <span className="text-pink-300">🧪 Bước 4: Kiểm tra môi trường kiềm của sản phẩm</span>}
            </div>

            {/* Indicator Quick Action inside Canvas */}
            {step >= 3 && (
              <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
                <button
                  onClick={() => handleAddWaterAndIndicator('pp')}
                  className="px-2.5 py-1 rounded-lg bg-pink-600 hover:bg-pink-700 text-white font-extrabold text-[11px] border border-pink-800 cursor-pointer shadow-xs"
                >
                  {selectedGas === 'O2' ? 'Rót nước + Thử PP (Màu hồng)' : 'Rót nước + Thử PP (Không đổi màu)'}
                </button>
                <button
                  onClick={() => handleAddWaterAndIndicator('litmus')}
                  className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[11px] border border-indigo-800 cursor-pointer shadow-xs"
                >
                  {selectedGas === 'O2' ? 'Thử Quỳ Tím (Màu xanh)' : 'Thử Quỳ Tím (Không đổi màu)'}
                </button>
              </div>
            )}
          </div>

          {/* Reaction Results & Theory Info */}
          <div className="md:col-span-5 flex flex-col justify-between gap-3 bg-white/90 p-4 rounded-2xl border-2 border-yellow-300 shadow-xs">
            <div>
              <h4 className="font-extrabold text-slate-900 text-xs md:text-sm uppercase tracking-wide mb-2 flex items-center gap-1.5 border-b border-yellow-200 pb-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>PHƯƠNG TRÌNH HÓA HỌC & HIỆN TƯỢNG:</span>
              </h4>

              {/* Chemical Equation Badge */}
              <div className="bg-amber-100/90 border-2 border-amber-400 p-3 rounded-xl mb-3 text-center">
                <div className="text-[11px] font-bold text-amber-900 mb-1">Phương trình phản ứng:</div>
                <div
                  className="text-sm md:text-base font-black text-slate-950 font-mono tracking-wide"
                  dangerouslySetInnerHTML={{ __html: reaction.equationHtml }}
                />
              </div>

              {/* Product Info */}
              <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-300 text-xs mb-3">
                <span className="font-extrabold text-slate-900 block mb-0.5">Sản phẩm tạo thành:</span>
                <span className="font-bold text-slate-700">{reaction.productName}</span>
              </div>

              {/* Observed Phenomenon text */}
              <div className="p-3 rounded-xl bg-yellow-100/90 border border-yellow-300 text-xs text-slate-900">
                <span className="font-extrabold text-yellow-950 block mb-1 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-700" /> Hiện tượng phản ứng:
                </span>
                <p className="leading-relaxed font-medium">{reaction.phenomenon}</p>
              </div>
            </div>

            {/* Indicator explanation note */}
            {indicatorColor !== 'none' && (
              <div className={`p-2.5 rounded-xl border text-xs font-medium ${
                selectedGas === 'O2'
                  ? 'bg-pink-100 border-pink-300 text-pink-950'
                  : 'bg-emerald-50 border-emerald-300 text-emerald-950'
              }`}>
                {selectedGas === 'O2' ? (
                  <>
                    💡 <strong>Giải thích tính kiềm:</strong> Oxide/peroxide tạo thành tan trong nước sinh ra dung dịch base mạnh ({selectedMetal}OH), làm Phenolphthalein chuyển sang <strong>màu hồng</strong> (hoặc làm quỳ tím hóa <strong>xanh</strong>).
                  </>
                ) : (
                  <>
                    💡 <strong>Giải thích muối trung tính:</strong> Phản ứng giữa {reaction.metalName} với chlorine sinh ra muối chloride ({selectedMetal}Cl) là muối trung hòa (pH = 7). Khi hòa tan vào nước, dung dịch thu được trung tính nên <strong>Phenolphthalein KHÔNG đổi màu</strong> (trong suốt) và <strong>Quỳ tím KHÔNG đổi màu</strong> (giữ nguyên màu quỳ tím).
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer buttons */}
        <div className="pt-3 border-t border-yellow-300 flex items-center justify-between">
          <div className="text-xs text-slate-600 font-semibold hidden sm:block">
            * Thí nghiệm đảm bảo tuân thủ đầy đủ quy tắc an toàn phòng thí nghiệm.
          </div>

          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-slate-950 font-bold text-sm border-2 border-yellow-600 shadow-xs cursor-pointer transition-all"
          >
            Đóng Thí Nghiệm 3
          </button>
        </div>
      </div>
    </div>
  );
};
