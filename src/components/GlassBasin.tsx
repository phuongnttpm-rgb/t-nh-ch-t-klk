import React, { useEffect, useRef } from 'react';
import { BasinState } from '../types';
import { METALS_DATA } from '../data/metals';

interface GlassBasinProps {
  basin: BasinState;
  isSelected: boolean;
  onSelect: () => void;
  isInsideSafetyShield?: boolean;
}

export const GlassBasin: React.FC<GlassBasinProps> = ({
  basin,
  isSelected,
  onSelect,
  isInsideSafetyShield = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number | null>(null);

  const metalInfo = METALS_DATA[basin.index];

  // Particle simulation ref
  const particlesRef = useRef<{
    metalX: number;
    metalY: number;
    vx: number;
    vy: number;
    bubbles: Array<{ x: number; y: number; r: number; vy: number; alpha: number }>;
    sparks: Array<{ x: number; y: number; vx: number; vy: number; color: string; life: number }>;
    flameAngle: number;
    shockwaveRadius: number;
    flashTime: number;
  }>({
    metalX: 60,
    metalY: 55,
    vx: 1.5,
    vy: 0.5,
    bubbles: [],
    sparks: [],
    flameAngle: 0,
    shockwaveRadius: 0,
    flashTime: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frame = 0;

    const render = () => {
      frame++;
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Glass Basin Outline & Background
      const basinMargin = 8;
      const basinWidth = width - basinMargin * 2;
      const basinHeight = height - 20;
      const topY = 20;
      const bottomY = topY + basinHeight;

      // Draw Glass Basin Silhouette (3D glass bowl)
      ctx.save();
      ctx.beginPath();
      // Curved bowl bottom
      ctx.moveTo(basinMargin, topY);
      ctx.bezierCurveTo(
        basinMargin, bottomY + 10,
        width - basinMargin, bottomY + 10,
        width - basinMargin, topY
      );
      ctx.closePath();

      // Glass fill background
      const glassGradient = ctx.createLinearGradient(0, topY, 0, bottomY);
      glassGradient.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
      glassGradient.addColorStop(0.8, 'rgba(255, 255, 255, 0.02)');
      glassGradient.addColorStop(1, 'rgba(200, 230, 255, 0.15)');
      ctx.fillStyle = glassGradient;
      ctx.fill();

      // Glass border stroke
      ctx.lineWidth = 3;
      ctx.strokeStyle = isSelected ? '#f59e0b' : 'rgba(255, 255, 255, 0.6)';
      ctx.stroke();

      // Glass Highlight / Reflection
      ctx.beginPath();
      ctx.ellipse(width / 2, topY, basinWidth / 2, 8, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.restore();

      // Liquid Fill
      if (basin.hasWater && basin.waterLevel > 0) {
        ctx.save();
        ctx.beginPath();
        const liquidTopY = bottomY - (basinHeight * 0.75 * (basin.waterLevel / 100));

        // Clip to basin interior
        ctx.moveTo(basinMargin + 2, topY + 2);
        ctx.bezierCurveTo(
          basinMargin + 2, bottomY + 8,
          width - basinMargin - 2, bottomY + 8,
          width - basinMargin - 2, topY + 2
        );
        ctx.closePath();
        ctx.clip();

        // Liquid color logic
        let liquidColor = 'rgba(224, 242, 254, 0.45)'; // Clear water (colorless)
        if (basin.hasPP && basin.metal !== null) {
          liquidColor = metalInfo.pinkColorHex; // Turns pink only when base (MOH) is present
        }

        const liquidGrad = ctx.createLinearGradient(0, liquidTopY, 0, bottomY);
        liquidGrad.addColorStop(0, liquidColor);
        liquidGrad.addColorStop(1, liquidColor.replace('0.', '0.85'));

        ctx.fillStyle = liquidGrad;
        ctx.fillRect(0, liquidTopY, width, bottomY - liquidTopY + 15);

        // Water surface curve with subtle wave animation
        ctx.beginPath();
        const waveOffset = Math.sin(frame * 0.1) * 1.5;
        ctx.ellipse(width / 2, liquidTopY + waveOffset, (basinWidth - 6) / 2, 6, 0, 0, Math.PI * 2);
        ctx.fillStyle = (basin.hasPP && basin.metal !== null) ? liquidColor : 'rgba(255, 255, 255, 0.6)';
        ctx.fill();

        ctx.restore();

        // Active Metal Reaction Animations
        if (basin.isReacting && basin.metal) {
          const p = particlesRef.current;
          const waterSurfaceY = bottomY - (basinHeight * 0.75 * (basin.waterLevel / 100));

          // Skittering physics on surface
          p.metalX += p.vx;
          p.metalY = waterSurfaceY + Math.sin(frame * 0.2) * 2;

          // Bounce off basin walls
          const minX = basinMargin + 18;
          const maxX = width - basinMargin - 18;
          if (p.metalX < minX || p.metalX > maxX) {
            p.vx = -p.vx * (0.8 + Math.random() * 0.4);
            p.metalX = Math.max(minX, Math.min(maxX, p.metalX));
          }

          // Add gas bubbles
          if (frame % 2 === 0) {
            p.bubbles.push({
              x: p.metalX + (Math.random() - 0.5) * 10,
              y: p.metalY + 5,
              r: 1.5 + Math.random() * 3,
              vy: -(0.8 + Math.random() * 1.2),
              alpha: 0.9,
            });
          }

          // Render Bubbles
          for (let i = p.bubbles.length - 1; i >= 0; i--) {
            const b = p.bubbles[i];
            b.y += b.vy;
            b.alpha -= 0.02;

            if (b.alpha <= 0 || b.y < topY) {
              p.bubbles.splice(i, 1);
              continue;
            }

            ctx.save();
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${b.alpha})`;
            ctx.fill();
            ctx.strokeStyle = `rgba(186, 230, 253, ${b.alpha})`;
            ctx.stroke();
            ctx.restore();
          }

          // Render Floating Metal Chunk / Sphere
          ctx.save();
          ctx.beginPath();
          const metalRadius = basin.metal.id === 'Li' ? 7 : basin.metal.id === 'Na' ? 6 : 5;

          // Sphere gradient
          const metalGrad = ctx.createRadialGradient(
            p.metalX - 2, p.metalY - 2, 1,
            p.metalX, p.metalY, metalRadius
          );

          if (basin.metal.id === 'Cs') {
            metalGrad.addColorStop(0, '#fef08a');
            metalGrad.addColorStop(1, '#ca8a04');
          } else {
            metalGrad.addColorStop(0, '#ffffff');
            metalGrad.addColorStop(1, '#64748b');
          }

          ctx.arc(p.metalX, p.metalY, metalRadius, 0, Math.PI * 2);
          ctx.fillStyle = metalGrad;
          ctx.shadowColor = basin.metal.flameHex;
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.restore();

          // Flame FX for Na, K, Rb, Cs
          if (basin.metal.id !== 'Li') {
            ctx.save();
            const flameHeight = basin.metal.isExplosive ? 25 : 16;
            const flameColor = basin.metal.flameHex;

            // Flame particles / sparks
            for (let k = 0; k < 3; k++) {
              p.sparks.push({
                x: p.metalX + (Math.random() - 0.5) * 8,
                y: p.metalY - 2,
                vx: (Math.random() - 0.5) * 3,
                vy: -(2 + Math.random() * 3),
                color: flameColor,
                life: 1.0,
              });
            }

            // Draw Flame Cone
            ctx.beginPath();
            ctx.moveTo(p.metalX - 5, p.metalY);
            ctx.quadraticCurveTo(
              p.metalX + Math.sin(frame * 0.4) * 4, p.metalY - flameHeight,
              p.metalX + 5, p.metalY
            );
            ctx.fillStyle = flameColor;
            ctx.shadowColor = flameColor;
            ctx.shadowBlur = 15;
            ctx.fill();

            // Inner bright core
            ctx.beginPath();
            ctx.moveTo(p.metalX - 2, p.metalY);
            ctx.quadraticCurveTo(
              p.metalX, p.metalY - flameHeight * 0.6,
              p.metalX + 2, p.metalY
            );
            ctx.fillStyle = '#ffffff';
            ctx.fill();

            ctx.restore();
          }

          // Render Sparks
          for (let i = p.sparks.length - 1; i >= 0; i--) {
            const sp = p.sparks[i];
            sp.x += sp.vx;
            sp.y += sp.vy;
            sp.life -= 0.05;

            if (sp.life <= 0) {
              p.sparks.splice(i, 1);
              continue;
            }

            ctx.save();
            ctx.beginPath();
            ctx.arc(sp.x, sp.y, 1.8 * sp.life, 0, Math.PI * 2);
            ctx.fillStyle = sp.color;
            ctx.globalAlpha = sp.life;
            ctx.fill();
            ctx.restore();
          }

          // Explosion Shockwave for Rb and Cs
          if (basin.metal.isExplosive) {
            p.shockwaveRadius += 4;
            if (p.shockwaveRadius > width * 0.8) {
              p.shockwaveRadius = 5;
            }

            ctx.save();
            ctx.beginPath();
            ctx.arc(p.metalX, p.metalY - 5, p.shockwaveRadius, 0, Math.PI * 2);
            ctx.strokeStyle = basin.metal.flameHex;
            ctx.lineWidth = Math.max(1, 4 - p.shockwaveRadius / 15);
            ctx.stroke();

            // Flash effect
            ctx.fillStyle = basin.metal.flameHex;
            ctx.globalAlpha = Math.max(0, 0.4 - p.shockwaveRadius / 60);
            ctx.fillRect(0, 0, width, height);
            ctx.restore();
          }
        }
      }

      animRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [basin, isSelected, metalInfo]);

  return (
    <div
      onClick={onSelect}
      className={`relative flex flex-col items-center justify-between p-2 rounded-xl cursor-pointer transition-all duration-200 text-slate-900 ${
        isSelected
          ? 'bg-yellow-200 border-2 border-yellow-600 shadow-[3px_3px_0px_#ca8a04] scale-105 z-10'
          : 'bg-white/90 hover:bg-yellow-50 border-2 border-yellow-300 shadow-[2px_2px_0px_#eab308]'
      }`}
    >
      {/* Top Mouth Basin Label */}
      <div className="w-full flex items-center justify-center gap-1 mb-1">
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-yellow-400 text-slate-950 font-black text-xs border border-yellow-600 shadow-xs">
          {basin.index + 1}
        </span>
        {isInsideSafetyShield && (
          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-600 text-white uppercase tracking-tighter">
            An Toàn
          </span>
        )}
      </div>

      {/* Basin Canvas Box */}
      <div className="relative w-full h-32 flex items-center justify-center overflow-hidden">
        <canvas
          ref={canvasRef}
          width={120}
          height={120}
          className="w-full h-full object-contain drop-shadow-md"
        />

        {/* Empty status overlay hint */}
        {!basin.hasWater && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[11px] font-bold text-slate-500 bg-white/80 border border-slate-300 px-2 py-0.5 rounded-full">
              Chậu trống
            </span>
          </div>
        )}

        {/* Reaction Active Tag */}
        {basin.isReacting && (
          <div className="absolute top-1 right-1 px-1.5 py-0.5 rounded-full bg-yellow-400 text-slate-950 text-[10px] font-black animate-bounce shadow">
            Đang p/ứ!
          </div>
        )}
      </div>

      {/* Bottom Metal Indicator */}
      <div className="w-full mt-1 pt-1 border-t border-yellow-300 text-center">
        {basin.metal ? (
          <span className="font-extrabold text-xs text-yellow-950">
            {basin.metal.name} ({basin.metal.id})
          </span>
        ) : (
          <span className="text-[10px] text-slate-500 font-semibold">Chưa thả kim loại</span>
        )}
      </div>
    </div>
  );
};

