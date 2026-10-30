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
import { VisualStyle, getActiveTeamFullBackground } from '../theme/tokens';

interface VotingScreenProps {
  view: GuesserPlayerView;
  send: (cmd: GuesserCommand) => void;
  onOpenRules: () => void;
  visualStyle?: VisualStyle;
  isLightMode?: boolean;
}

export const VotingScreen: React.FC<VotingScreenProps> = ({
  view,
  send,
  onOpenRules,
  visualStyle = 'fiesta',
  isLightMode = false,
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

  // Requirement 2: Screen flooded with the active team's color!
  const teamBg = getActiveTeamFullBackground(currentTeam?.color, isLightMode);

  const cardBorder =
    visualStyle === 'arcade'
      ? 'border-4 border-neutral-950 bg-white shadow-[6px_6px_0px_#000000] rounded-3xl text-neutral-950'
      : visualStyle === 'glass'
      ? 'bg-white/95 dark:bg-black/50 backdrop-blur-2xl border border-white/40 shadow-2xl rounded-3xl text-neutral-900 dark:text-white'
      : 'bg-white dark:bg-neutral-900 border border-white/20 dark:border-neutral-800 shadow-2xl rounded-3xl text-neutral-900 dark:text-white';

  return (
    <div
      data-testid="guesser-phase-voting"
      className="flex flex-col flex-1 px-4 pb-6 space-y-4 max-w-md mx-auto w-full justify-between transition-colors min-h-[92vh] rounded-3xl p-2"
      style={{
        backgroundColor: teamBg.background,
        color: teamBg.color,
      }}
    >
      <div className="space-y-3.5">
        {/* Header row */}
        <div className="flex items-center justify-between pt-1">
          <TeamBadge format={view.format} myTeam={myTeam} nickname={view.me.nickname} isLightMode={isLightMode} />
          <button
            onClick={onOpenRules}
            className="w-9 h-9 rounded-full bg-black/30 hover:bg-black/50 text-white font-black text-sm flex items-center justify-center border border-white/30"
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
          isLightMode={isLightMode}
        />

        {/* Scoreboard */}
        <Scoreboard
          teams={view.teams}
          players={view.players}
          myTeamId={view.me.teamId}
          currentTeamId={view.currentTeamId}
          isLightMode={isLightMode}
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
        <div className={`p-6 text-center space-y-3 ${cardBorder}`}>
          <div className="w-14 h-14 rounded-3xl bg-amber-500/20 text-amber-500 mx-auto flex items-center justify-center shadow-md">
            <Scale className="w-7 h-7" />
          </div>

          <div className="text-base font-black leading-snug">
            {STRINGS.voting.question(wordText, currentTeam?.name)}
          </div>

          <div className="text-3xl sm:text-4xl font-black text-rose-500 tracking-tight break-words uppercase">
            «{wordText}»
          </div>

          {/* Voting stats progress */}
          {votingData && (
            <div className="bg-slate-100 dark:bg-neutral-950/70 rounded-2xl p-3.5 border border-slate-200 dark:border-neutral-800 space-y-2 text-neutral-900 dark:text-neutral-100">
              <div className="text-[13px] font-black">
                {STRINGS.voting.status(
                  votingData.votesFor,
                  votingData.votesAgainst,
                  votingData.totalVoters,
                  view.players.length
                )}
              </div>

              {/* Bar visualization */}
              <div className="w-full h-3 bg-neutral-300 dark:bg-neutral-800 rounded-full overflow-hidden flex shadow-inner">
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
                  className="h-full bg-rose-500 transition-all duration-300"
                  style={{
                    width: `${
                      votingData.totalVoters > 0
                        ? (votingData.votesAgainst / votingData.totalVoters) * 100
                        : 50
                    }%`,
                  }}
                />
              </div>

              <div className="flex justify-between text-[13px] font-mono font-bold">
                <span className="text-emerald-600 dark:text-emerald-400">За: {votingData.votesFor}</span>
                <span className="text-rose-600 dark:text-rose-400">Против: {votingData.votesAgainst}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Voting Actions */}
      <div className="pt-2">
        {canVote ? (
          <div className="grid grid-cols-2 gap-3.5">
            <button
              data-testid="guesser-vote-yes"
              onClick={handleVoteYes}
              className={`py-4 px-4 rounded-2xl font-black text-base flex items-center justify-center gap-2 shadow-2xl active:scale-[0.98] transition-all cursor-pointer min-h-[58px] ${
                visualStyle === 'arcade'
                  ? 'bg-emerald-500 text-white border-3 border-neutral-950 shadow-[4px_4px_0px_#000000]'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-emerald-500/30'
              }`}
            >
              <ThumbsUp className="w-6 h-6 fill-current" />
              <span>{STRINGS.voting.voteYes}</span>
            </button>

            <button
              data-testid="guesser-vote-no"
              onClick={handleVoteNo}
              className={`py-4 px-4 rounded-2xl font-black text-base flex items-center justify-center gap-2 shadow-2xl active:scale-[0.98] transition-all cursor-pointer min-h-[58px] ${
                visualStyle === 'arcade'
                  ? 'bg-rose-600 text-white border-3 border-neutral-950 shadow-[4px_4px_0px_#000000]'
                  : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
              }`}
            >
              <ThumbsDown className="w-6 h-6 fill-current" />
              <span>{STRINGS.voting.voteNo}</span>
            </button>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-black/40 backdrop-blur-md border border-white/20 text-center text-[13px] font-bold text-white flex items-center justify-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{STRINGS.voting.votedWaiting}</span>
          </div>
        )}
      </div>
    </div>
  );
};
