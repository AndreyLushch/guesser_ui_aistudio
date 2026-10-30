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
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentCircle,
  maxCircles,
  wordsLeft,
  totalWordsInitial,
}) => {
  const wordsProgressPercent = Math.min(
    100,
    Math.max(0, Math.round(((totalWordsInitial - wordsLeft) / Math.max(1, totalWordsInitial)) * 100))
  );

  return (
    <div className="w-full bg-neutral-900/80 backdrop-blur-md border border-neutral-800/80 rounded-2xl px-3.5 py-2 flex items-center justify-between shadow-xs">
      {/* Circle progress */}
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
        <span className="text-xs font-semibold tracking-wide text-neutral-300">
          {STRINGS.progress.circle(currentCircle, maxCircles)}
        </span>
      </div>

      {/* Words deck progress */}
      <div className="flex items-center gap-2.5">
        <div className="w-16 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-500 transition-all duration-300 ease-out rounded-full"
            style={{ width: `${wordsProgressPercent}%` }}
          />
        </div>
        <span className="text-xs font-medium text-neutral-400">
          {STRINGS.progress.words(wordsLeft, totalWordsInitial)}
        </span>
      </div>
    </div>
  );
};
