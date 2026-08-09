import React, { useState } from 'react';
import { Music, Upload, Volume2, Check, X, Disc, Play, Pause } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface MusicModalProps {
  isOpen: boolean;
  onClose: () => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export const MusicModal: React.FC<MusicModalProps> = ({
  isOpen,
  onClose,
  isPlaying,
  onTogglePlay,
}) => {
  const [selectedTrack, setSelectedTrack] = useState<string>('synth-lab');
  const [customFileName, setCustomFileName] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCustomFileName(file.name);
      setSelectedTrack('custom');
      const audioUrl = URL.createObjectURL(file);
      const audio = new Audio(audioUrl);
      audio.loop = true;
      audio.volume = 0.3;
      audio.play().catch((err) => console.log('Audio play error:', err));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="relative w-full max-w-md frame-3d p-6 text-slate-900 shadow-[6px_6px_0px_#ca8a04]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-yellow-300">
          <div className="flex items-center gap-2 text-slate-900 font-extrabold text-lg uppercase">
            <Disc className="w-6 h-6 text-yellow-700" />
            <span>Album & Nhạc Thí Nghiệm</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-700 hover:bg-yellow-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Music Options */}
        <div className="space-y-3">
          <p className="text-xs font-bold text-yellow-950 uppercase tracking-wider">
            Chọn nhạc nền thí nghiệm:
          </p>

          <div
            onClick={() => {
              setSelectedTrack('synth-lab');
              if (!isPlaying) onTogglePlay();
            }}
            className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
              selectedTrack === 'synth-lab'
                ? 'bg-yellow-200 border-yellow-500 shadow-xs'
                : 'bg-white border-yellow-200 hover:bg-yellow-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-yellow-500 text-slate-950">
                <Music className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">Phòng Thí Nghiệm Yên Bình (Synth Ambient)</p>
                <p className="text-xs text-slate-600 font-medium">Nhạc điện tử nhẹ nhàng tập trung học tập</p>
              </div>
            </div>
            {selectedTrack === 'synth-lab' && <Check className="w-5 h-5 text-yellow-800" />}
          </div>

          <div
            onClick={() => {
              setSelectedTrack('beethoven');
              soundEngine.startBackgroundMusic();
              if (!isPlaying) onTogglePlay();
            }}
            className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
              selectedTrack === 'beethoven'
                ? 'bg-yellow-200 border-yellow-500 shadow-xs'
                : 'bg-white border-yellow-200 hover:bg-yellow-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-yellow-500 text-slate-950">
                <Volume2 className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">Giai Điệu Hóa Học Tươi Vui</p>
                <p className="text-xs text-slate-600 font-medium">Nhạc hòa tấu Mozart & Beethoven sáng tạo</p>
              </div>
            </div>
            {selectedTrack === 'beethoven' && <Check className="w-5 h-5 text-yellow-800" />}
          </div>

          {/* Custom File Upload */}
          <div className="mt-4 pt-3 border-t border-yellow-300">
            <label className="block text-xs font-bold text-yellow-950 uppercase tracking-wider mb-2">
              Tải nhạc MP3 từ máy tính:
            </label>
            <label className="flex items-center justify-center gap-2 p-3 rounded-lg border-2 border-dashed border-yellow-400 bg-white hover:bg-yellow-50 cursor-pointer transition-colors text-slate-900 font-bold text-sm">
              <Upload className="w-5 h-5 text-yellow-700" />
              <span>{customFileName ? `Đã chọn: ${customFileName}` : 'Chọn tệp nhạc MP3...'}</span>
              <input type="file" accept="audio/mp3,audio/*" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex items-center justify-between pt-3 border-t border-yellow-300">
          <button
            onClick={onTogglePlay}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm border cursor-pointer transition-all ${
              isPlaying
                ? 'bg-rose-600 hover:bg-rose-700 text-white border-rose-700'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-700'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4" /> Dừng Nhạc
              </>
            ) : (
              <>
                <Play className="w-4 h-4" /> Phát Nhạc
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg font-bold text-sm bg-yellow-300 hover:bg-yellow-400 text-slate-950 border border-yellow-500 cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

