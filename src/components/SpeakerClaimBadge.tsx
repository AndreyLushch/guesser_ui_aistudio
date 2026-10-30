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
    <div className="w-full bg-emerald-950/80 border border-emerald-500/50 rounded-2xl px-3.5 py-2 flex items-center justify-between gap-3 shadow-md backdrop-blur-xs animate-in fade-in duration-200">
      <div className="flex items-center gap-2 min-w-0">
        <span className="p-1 rounded-full bg-emerald-500/20 text-emerald-400 shrink-0">
          <Check className="w-3.5 h-3.5" />
        </span>
        <span className="text-xs font-semibold text-emerald-200 truncate">
          {STRINGS.speakerClaim.claimed(wordText, secondsLeft)}
        </span>
      </div>

      {canDispute && (
        <button
          onClick={onCancel}
          data-testid="guesser-speaker-claim-cancel"
          className="px-2.5 py-1 rounded-lg bg-red-900/40 hover:bg-red-800/60 border border-red-500/40 text-red-300 text-xs font-medium flex items-center gap-1 transition-colors shrink-0"
        >
          <X className="w-3 h-3" />
          <span>{STRINGS.speakerClaim.cancelBtn}</span>
        </button>
      )}
    </div>
  );
};
