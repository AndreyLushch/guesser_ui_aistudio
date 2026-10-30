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
}

export const PhaseTimer: React.FC<PhaseTimerProps> = ({
  secondsLeft,
  isPaused = false,
  isSpeaker = false,
  label,
  maxSeconds = 60,
}) => {
  if (secondsLeft === undefined && !isPaused) return null;

  const currentSec = secondsLeft ?? 0;
  const isDanger = currentSec <= 5 && currentSec > 0 && !isPaused;

  useEffect(() => {
    if (isDanger && isSpeaker) {
      haptic('warning');
    }
  }, [currentSec, isDanger, isSpeaker]);

  const percentage = Math.min(100, Math.max(0, (currentSec / Math.max(1, maxSeconds)) * 100));

  return (
    <div
      data-testid="guesser-timer"
      className={`relative inline-flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-300 ${
        isDanger
          ? 'bg-red-950/40 border-red-500/80 shadow-lg shadow-red-500/20 scale-105 animate-pulse'
          : isPaused
          ? 'bg-amber-950/30 border-amber-500/50'
          : 'bg-neutral-900/80 border-neutral-800'
      }`}
    >
      <div className="flex items-center gap-2">
        {isPaused ? (
          <div className="flex items-center gap-1.5 text-amber-400 font-bold text-lg tracking-wider">
            <Pause className="w-5 h-5 animate-pulse" />
            <span>ПАУЗА</span>
          </div>
        ) : (
          <div
            className={`font-mono font-black text-4xl sm:text-5xl tracking-tighter ${
              isDanger ? 'text-red-400' : 'text-neutral-100'
            }`}
          >
            {currentSec}
            <span className="text-xs font-sans font-semibold text-neutral-400 ml-1">сек</span>
          </div>
        )}
      </div>

      {label && (
        <span className="text-[11px] font-medium text-neutral-400 mt-0.5 tracking-wide uppercase">
          {label}
        </span>
      )}

      {/* Mini circular or linear indicator */}
      {!isPaused && (
        <div className="w-20 h-1 bg-neutral-800 rounded-full mt-2 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 rounded-full ${
              isDanger ? 'bg-red-500' : 'bg-amber-500'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}
    </div>
  );
};
