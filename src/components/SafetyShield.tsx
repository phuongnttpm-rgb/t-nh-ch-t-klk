import React from 'react';
import { ShieldAlert, AlertTriangle } from 'lucide-react';

interface SafetyShieldProps {
  children: React.ReactNode;
  isTriggered?: boolean;
}

export const SafetyShield: React.FC<SafetyShieldProps> = ({ children, isTriggered = false }) => {
  return (
    <div className="relative p-2 rounded-xl bg-yellow-100 border-2 border-yellow-500 shadow-[3px_3px_0px_#ca8a04]">
      {/* Top Safety Banner */}
      <div className="w-full flex items-center justify-between px-3 py-1 mb-2 rounded-md bg-yellow-400 border border-yellow-600 text-slate-950 shadow-xs">
        <div className="flex items-center gap-1.5 font-extrabold text-xs uppercase tracking-wider">
          <ShieldAlert className="w-4 h-4 text-slate-950" />
          <span>TẤM CHẮN AN TOÀN (SAFETY SHIELD)</span>
        </div>
        <div className="flex items-center gap-1 font-bold text-[10px] bg-rose-600 text-white px-2 py-0.5 rounded">
          <AlertTriangle className="w-3 h-3" />
          <span>Phản ứng nổ</span>
        </div>
      </div>

      {/* Safety Glass Overlay Layer */}
      <div className="relative rounded-lg overflow-hidden">
        {/* Children (Basins 4 & 5) */}
        {children}

        {/* Acrylic Safety Glass Effect overlay */}
        <div className="absolute inset-0 pointer-events-none rounded-lg border border-cyan-400/40 bg-gradient-to-tr from-cyan-400/10 via-transparent to-white/10">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.2)_0%,transparent_40%,rgba(255,255,255,0.1)_100%)]" />
        </div>

        {/* Impact / Explosion Flash overlay */}
        {isTriggered && (
          <div className="absolute inset-0 pointer-events-none bg-rose-500/30 animate-pulse rounded-lg" />
        )}
      </div>

      {/* Warning caution stripes on shield base */}
      <div className="w-full h-2 mt-2 rounded-md overflow-hidden bg-[repeating-linear-gradient(45deg,#eab308,#eab308_10px,#0f172a_10px,#0f172a_20px)] border border-yellow-500" />
    </div>
  );
};

