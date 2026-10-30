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
        className={`p-4 rounded-3xl border shadow-2xl backdrop-blur-xl flex items-center justify-between gap-3 ${
          isApproved || isTie
            ? 'bg-emerald-600 text-white border-emerald-400 shadow-emerald-500/30'
            : 'bg-rose-600 text-white border-rose-400 shadow-rose-500/30'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`p-2.5 rounded-2xl shrink-0 ${
              isApproved || isTie ? 'bg-white/20 text-white' : 'bg-white/20 text-white'
            }`}
          >
            {isApproved ? (
              <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
            ) : isTie ? (
              <Scale className="w-6 h-6 stroke-[2.5]" />
            ) : (
              <XCircle className="w-6 h-6 stroke-[2.5]" />
            )}
          </div>
          <div>
            <div className="text-base font-black tracking-tight">{title}</div>
            <div className="text-[13px] opacity-90 mt-0.5 font-medium">
              «{voteResult.wordText}» · {STRINGS.voteResult.scoreDetails(voteResult.votesFor, voteResult.votesAgainst)}
            </div>
          </div>
        </div>
        <div className="text-[13px] font-mono font-black px-2.5 py-1 rounded-xl bg-black/30 shrink-0">
          {voteResult.secondsLeft}с
        </div>
      </div>
    </div>
  );
};
