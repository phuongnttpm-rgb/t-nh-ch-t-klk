import React, { useState } from 'react';
import { Volume2, VolumeX, FolderOpen, FlaskConical, TestTube2, Flame, Zap } from 'lucide-react';
import { soundEngine } from '../utils/audio';
import { MusicModal } from './MusicModal';

interface AudioControlsProps {
  onOpenMusicModal?: () => void;
  onOpenFlameTest: () => void;
  onOpenOxygenChlorineTest: () => void;
}

export const AudioControls: React.FC<AudioControlsProps> = ({
  onOpenMusicModal,
  onOpenFlameTest,
  onOpenOxygenChlorineTest,
}) => {
  const [isMuted, setIsMuted] = useState<boolean>(soundEngine.getIsMuted());
  const [isPlaying, setIsPlaying] = useState<boolean>(soundEngine.getIsBgMusicPlaying());
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleToggleMute = () => {
    const playingState = soundEngine.toggleBackgroundMusic();
    setIsPlaying(playingState);
    const mutedState = soundEngine.getIsMuted();
    setIsMuted(mutedState);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    if (onOpenMusicModal) onOpenMusicModal();
  };

  return (
    <div className="w-full flex flex-col gap-2 mb-3">
      {/* Row 1: Audio Controls + Prominent Experiment Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {/* Toggle Play/Mute Button */}
          <button
            onClick={handleToggleMute}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold text-xs md:text-sm cursor-pointer transition-all ${
              isPlaying
                ? 'bg-yellow-300 border-2 border-yellow-600 shadow-[3px_3px_0px_#ca8a04] text-slate-950'
                : 'bg-yellow-50 border-2 border-yellow-500 shadow-[3px_3px_0px_#ca8a04] text-slate-900 hover:bg-yellow-100'
            }`}
            title="Bật/tắt phát nhạc nền thí nghiệm"
          >
            {isPlaying && !isMuted ? (
              <>
                <Volume2 className="w-4 h-4 text-yellow-800 animate-pulse" />
                <span>Tắt Nhạc</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-slate-700" />
                <span>Bật Nhạc</span>
              </>
            )}
          </button>

          {/* Music Folder Button */}
          <button
            onClick={handleOpenModal}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold text-xs md:text-sm bg-yellow-50 hover:bg-yellow-100 text-slate-900 border-2 border-yellow-500 shadow-[3px_3px_0px_#ca8a04] cursor-pointer transition-all"
            title="Mở thư mục chứa album nhạc thí nghiệm"
          >
            <FolderOpen className="w-4 h-4 text-yellow-700" />
            <span>Mở Nhạc</span>
          </button>
        </div>
      </div>

      {/* Row 2: Title 1 with chemistry icons */}
      <div className="w-full frame-3d py-2 px-4 text-center flex items-center justify-center gap-3 text-slate-900 font-extrabold tracking-wide text-base md:text-lg uppercase">
        <FlaskConical className="w-6 h-6 text-yellow-700" />
        <h1>KHÁM PHÁ TÍNH CHẤT HÓA HỌC CỦA KIM LOẠI KIỀM</h1>
        <FlaskConical className="w-6 h-6 text-yellow-700" />
      </div>

      {/* Row 3: Subtitle / Current Main View Navigation */}
      <div className="w-full flex flex-col md:flex-row items-center justify-between gap-2 bg-yellow-100/90 p-2 px-3 rounded-xl border border-yellow-400">
        <div className="flex items-center gap-2 text-cyan-800 font-bold text-xs md:text-sm uppercase">
          <TestTube2 className="w-5 h-5 text-cyan-600" />
          <span>Thí nghiệm 1: KIM LOẠI KIỀM TÁC DỤNG VỚI NƯỚC</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenFlameTest}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-black text-xs uppercase shadow-2xs cursor-pointer"
          >
            <Flame className="w-3.5 h-3.5 text-yellow-300" />
            <span>Thí nghiệm 2: Đốt ngọn lửa</span>
          </button>

          <button
            onClick={onOpenOxygenChlorineTest}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs uppercase shadow-2xs cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-yellow-300" />
            <span>Thí nghiệm 3: Tác dụng O₂ & Cl₂</span>
          </button>
        </div>
      </div>

      {/* Music Modal */}
      <MusicModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isPlaying={isPlaying}
        onTogglePlay={handleToggleMute}
      />
    </div>
  );
};



