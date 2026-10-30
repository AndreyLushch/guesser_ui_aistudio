/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { STRINGS } from '../texts';

interface ProgressBarProps {
  currentCircle: number;
  maxCircles: number;
  wordsLeft: number;
  totalWordsInitial: number;
  isLightMode?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentCircle,
  maxCircles,
  wordsLeft,
  totalWordsInitial,
  isLightMode = false,
}) => {
  const wordsProgressPercent = Math.min(
    100,
    Math.max(0, Math.round(((totalWordsInitial - wordsLeft) / Math.max(1, totalWordsInitial)) * 100))
  );

  return (
    <div
      className={`w-full backdrop-blur-md rounded-2xl px-4 py-2.5 flex items-center justify-between border shadow-sm transition-colors ${
        isLightMode
          ? 'bg-white/95 border-neutral-200 text-neutral-800'
          : 'bg-neutral-900/90 border-neutral-800 text-neutral-200'
      }`}
    >
      {/* Circle progress */}
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shadow-sm" />
        <span className="text-[13px] font-bold tracking-wide">
          {STRINGS.progress.circle(currentCircle, maxCircles)}
        </span>
      </div>

      {/* Words deck progress */}
      <div className="flex items-center gap-2.5">
        <div className="w-18 h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-500 transition-all duration-300 ease-out rounded-full"
            style={{ width: `${wordsProgressPercent}%` }}
          />
        </div>
        <span className="text-[13px] font-bold opacity-80 font-mono">
          {STRINGS.progress.words(wordsLeft, totalWordsInitial)}
        </span>
      </div>
    </div>
  );
};
