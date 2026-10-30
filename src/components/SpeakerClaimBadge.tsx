/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { STRINGS } from '../texts';
import { X, Check } from 'lucide-react';

interface SpeakerClaimBadgeProps {
  wordText: string;
  secondsLeft: number;
  canDispute: boolean;
  onCancel: () => void;
}

export const SpeakerClaimBadge: React.FC<SpeakerClaimBadgeProps> = ({
  wordText,
  secondsLeft,
  canDispute,
  onCancel,
}) => {
  return (
    <div className="w-full bg-emerald-500/20 border border-emerald-400/60 rounded-2xl px-4 py-2.5 flex items-center justify-between gap-3 shadow-md backdrop-blur-md animate-in fade-in duration-200 text-white">
      <div className="flex items-center gap-2 min-w-0">
        <span className="p-1 rounded-full bg-emerald-400 text-neutral-950 shrink-0">
          <Check className="w-3.5 h-3.5 stroke-[3]" />
        </span>
        <span className="text-[13px] font-black truncate text-emerald-100">
          {STRINGS.speakerClaim.claimed(wordText, secondsLeft)}
        </span>
      </div>

      {canDispute && (
        <button
          onClick={onCancel}
          data-testid="guesser-speaker-claim-cancel"
          className="px-3 py-1.5 rounded-xl bg-rose-600/80 hover:bg-rose-500 border border-rose-400 text-white text-[13px] font-bold flex items-center gap-1.5 transition-colors shrink-0 shadow-sm"
        >
          <X className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>{STRINGS.speakerClaim.cancelBtn}</span>
        </button>
      )}
    </div>
  );
};
