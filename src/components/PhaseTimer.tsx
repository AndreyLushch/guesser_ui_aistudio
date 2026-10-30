/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { Pause } from 'lucide-react';
import { haptic } from '../utils/haptics';

interface PhaseTimerProps {
  secondsLeft?: number;
  isPaused?: boolean;
  isSpeaker?: boolean;
  label?: string;
  maxSeconds?: number;
  compact?: boolean;
}

export const PhaseTimer: React.FC<PhaseTimerProps> = ({
  secondsLeft,
  isPaused = false,
  isSpeaker = false,
  label,
  maxSeconds = 60,
  compact = false,
}) => {
  const currentSec = secondsLeft ?? 0;
  const isDanger = currentSec <= 5 && currentSec > 0 && !isPaused;

  // React Rules of Hooks: useEffect MUST be placed before any early returns!
  useEffect(() => {
    if (isDanger && isSpeaker) {
      haptic('warning');
    }
  }, [currentSec, isDanger, isSpeaker]);

  if (secondsLeft === undefined && !isPaused) {
    return null;
  }

  const percentage = Math.min(100, Math.max(0, (currentSec / Math.max(1, maxSeconds)) * 100));

  if (compact) {
    return (
      <div
        data-testid="guesser-timer"
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono font-black border transition-all ${
          isDanger
            ? 'bg-rose-600 text-white border-rose-400 animate-pulse shadow-md'
            : isPaused
            ? 'bg-amber-500 text-neutral-950 border-amber-300'
            : 'bg-white/20 text-white border-white/30 backdrop-blur-md'
        }`}
      >
        {isPaused ? (
          <>
            <Pause className="w-4 h-4" />
            <span className="text-[13px] font-sans font-bold">ПАУЗА</span>
          </>
        ) : (
          <span className="text-base tracking-tight">{currentSec}с</span>
        )}
      </div>
    );
  }

  return (
    <div
      data-testid="guesser-timer"
      className={`relative inline-flex flex-col items-center justify-center p-3.5 rounded-3xl border transition-all duration-300 ${
        isDanger
          ? 'bg-rose-600 text-white border-white shadow-xl scale-105 animate-pulse'
          : isPaused
          ? 'bg-amber-400 text-neutral-950 border-amber-300 shadow-md'
          : 'bg-white/20 text-white border-white/30 backdrop-blur-md shadow-lg'
      }`}
    >
      <div className="flex items-center gap-2">
        {isPaused ? (
          <div className="flex items-center gap-1.5 font-bold text-base tracking-wider">
            <Pause className="w-5 h-5 animate-pulse" />
            <span>ПАУЗА</span>
          </div>
        ) : (
          <div
            className={`font-mono font-black text-4xl sm:text-5xl tracking-tight ${
              isDanger ? 'text-white' : 'text-inherit'
            }`}
          >
            {currentSec}
            <span className="text-sm font-sans font-bold ml-1 opacity-80">сек</span>
          </div>
        )}
      </div>

      {label && (
        <span className="text-[13px] font-bold mt-1 tracking-wide uppercase opacity-90">
          {label}
        </span>
      )}

      {/* Linear indicator */}
      {!isPaused && (
        <div className="w-24 h-1.5 bg-black/20 rounded-full mt-2.5 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 rounded-full ${
              isDanger ? 'bg-white' : 'bg-white'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}
    </div>
  );
};
