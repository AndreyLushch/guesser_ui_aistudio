/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { GuesserCommand, GuesserPlayerView } from '../types';
import { STRINGS } from '../texts';
import { ProgressBar } from '../components/ProgressBar';
import { TeamBadge } from '../components/TeamBadge';
import { Scoreboard } from '../components/Scoreboard';
import { PhaseTimer } from '../components/PhaseTimer';
import { ThumbsUp, ThumbsDown, Scale } from 'lucide-react';
import { haptic } from '../utils/haptics';

interface VotingScreenProps {
  view: GuesserPlayerView;
  send: (cmd: GuesserCommand) => void;
  onOpenRules: () => void;
}

export const VotingScreen: React.FC<VotingScreenProps> = ({
  view,
  send,
  onOpenRules,
}) => {
  const myTeam = view.teams.find((t) => t.id === view.me.teamId);
  const currentTeam = view.teams.find((t) => t.id === view.currentTeamId);

  const votingData = view.voting;
  const wordText = votingData?.wordText || 'СЛОВО';
  const hasVoted = votingData?.hasVoted ?? false;
  const canVote = votingData?.canVote ?? !hasVoted;

  const secondsLeft = view.timers.secondarySecondsLeft ?? 12;

  const handleVoteYes = () => {
    haptic('success');
    send({ type: 'VOTE_YES' });
  };

  const handleVoteNo = () => {
    haptic('warning');
    send({ type: 'VOTE_NO' });
  };

  return (
    <div
      data-testid="guesser-phase-voting"
      className="flex flex-col flex-1 px-4 pb-6 space-y-4 max-w-md mx-auto w-full justify-between"
    >
      <div className="space-y-3.5">
        {/* Header row */}
        <div className="flex items-center justify-between pt-1">
          <TeamBadge format={view.format} myTeam={myTeam} nickname={view.me.nickname} />
          <button
            onClick={onOpenRules}
            className="w-8 h-8 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-300 font-bold text-xs flex items-center justify-center border border-neutral-800"
          >
            ?
          </button>
        </div>

        {/* Progress bar */}
        <ProgressBar
          currentCircle={view.currentCircle}
          maxCircles={view.maxCircles}
          wordsLeft={view.wordsLeft}
          totalWordsInitial={view.totalWordsInitial}
        />

        {/* Scoreboard */}
        <Scoreboard
          teams={view.teams}
          players={view.players}
          myTeamId={view.me.teamId}
          currentTeamId={view.currentTeamId}
        />

        {/* Timers row: Round timer on PAUSE + Voting countdown */}
        <div className="flex items-center justify-center gap-3 pt-1">
          <PhaseTimer isPaused={true} label="Ход на паузе" />
          <PhaseTimer
            secondsLeft={secondsLeft}
            maxSeconds={12}
            label="Голосование"
          />
        </div>

        {/* Voting Question Card */}
        <div className="rounded-3xl p-5 border border-amber-500/40 bg-neutral-900 text-center shadow-xl space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center">
            <Scale className="w-6 h-6" />
          </div>

          <div className="text-sm font-bold text-neutral-300 leading-snug">
            {STRINGS.voting.question(wordText, currentTeam?.name)}
          </div>

          <div className="text-2xl font-black text-amber-400 tracking-tight break-words">
            «{wordText}»
          </div>

          {/* Voting stats progress */}
          {votingData && (
            <div className="bg-neutral-950/70 rounded-2xl p-3 border border-neutral-800/80 space-y-2">
              <div className="text-xs font-semibold text-neutral-300">
                {STRINGS.voting.status(
                  votingData.votesFor,
                  votingData.votesAgainst,
                  votingData.totalVoters,
                  view.players.length
                )}
              </div>

              {/* Bar visualization */}
              <div className="w-full h-2.5 bg-neutral-800 rounded-full overflow-hidden flex">
                <div
                  className="h-full bg-emerald-500 transition-all duration-300"
                  style={{
                    width: `${
                      votingData.totalVoters > 0
                        ? (votingData.votesFor / votingData.totalVoters) * 100
                        : 50
                    }%`,
                  }}
                />
                <div
                  className="h-full bg-red-500 transition-all duration-300"
                  style={{
                    width: `${
                      votingData.totalVoters > 0
                        ? (votingData.votesAgainst / votingData.totalVoters) * 100
                        : 50
                    }%`,
                  }}
                />
              </div>

              <div className="flex justify-between text-[11px] text-neutral-400 font-mono">
                <span>За: {votingData.votesFor}</span>
                <span>Против: {votingData.votesAgainst}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Voting Actions */}
      <div className="pt-2">
        {canVote ? (
          <div className="grid grid-cols-2 gap-3">
            <button
              data-testid="guesser-vote-yes"
              onClick={handleVoteYes}
              className="py-4 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-neutral-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 transition-all cursor-pointer min-h-[56px]"
            >
              <ThumbsUp className="w-5 h-5 fill-current" />
              <span>{STRINGS.voting.voteYes}</span>
            </button>

            <button
              data-testid="guesser-vote-no"
              onClick={handleVoteNo}
              className="py-4 px-4 rounded-2xl bg-red-600 hover:bg-red-500 active:scale-[0.98] text-white font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-red-600/20 transition-all cursor-pointer min-h-[56px]"
            >
              <ThumbsDown className="w-5 h-5 fill-current" />
              <span>{STRINGS.voting.voteNo}</span>
            </button>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 text-center text-xs text-neutral-400 flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{STRINGS.voting.votedWaiting}</span>
          </div>
        )}
      </div>
    </div>
  );
};
