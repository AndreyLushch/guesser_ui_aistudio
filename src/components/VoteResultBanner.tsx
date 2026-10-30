/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { STRINGS } from '../texts';
import { CheckCircle2, XCircle, Scale } from 'lucide-react';

interface VoteResultBannerProps {
  voteResult?: {
    wordText: string;
    votesFor: number;
    votesAgainst: number;
    decision: 'approved' | 'rejected' | 'tie';
    secondsLeft: number;
  };
}

export const VoteResultBanner: React.FC<VoteResultBannerProps> = ({ voteResult }) => {
  if (!voteResult) return null;

  const isApproved = voteResult.decision === 'approved';
  const isTie = voteResult.decision === 'tie';

  const title = isApproved
    ? STRINGS.voteResult.approved
    : isTie
    ? STRINGS.voteResult.tie
    : STRINGS.voteResult.rejected;

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-sm animate-in slide-in-from-top-4 duration-300">
      <div
        className={`p-3.5 rounded-2xl border shadow-xl backdrop-blur-md flex items-center justify-between gap-3 ${
          isApproved || isTie
            ? 'bg-emerald-950/90 border-emerald-500/70 text-emerald-100'
            : 'bg-red-950/90 border-red-500/70 text-red-100'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-xl shrink-0 ${
              isApproved || isTie ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
            }`}
          >
            {isApproved ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : isTie ? (
              <Scale className="w-5 h-5" />
            ) : (
              <XCircle className="w-5 h-5" />
            )}
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight">{title}</div>
            <div className="text-xs opacity-80 mt-0.5">
              «{voteResult.wordText}» · {STRINGS.voteResult.scoreDetails(voteResult.votesFor, voteResult.votesAgainst)}
            </div>
          </div>
        </div>
        <div className="text-xs font-mono font-bold px-2 py-1 rounded-md bg-black/40 shrink-0">
          {voteResult.secondsLeft}с
        </div>
      </div>
    </div>
  );
};
