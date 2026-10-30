/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type GuesserMode = 'step' | 'sprint';
export type ScoreMode = 'soft' | 'hard';
export type GuesserPhase =
  | 'lobby'
  | 'seating'
  | 'waiting_turn'
  | 'active_turn'
  | 'dispute_window'
  | 'voting'
  | 'finished';
export type GuesserFormat = 'teams' | 'solo' | 'pair';

export interface TeamScore {
  id: string;
  name: string;
  score: number;
  color: string;          // hex из таблицы раздела 3.1
  soloPlayerId?: string;  // формат solo: «команда» одного игрока, показывать его имя
}

export interface Player {
  id: string;
  nickname: string;
  teamId?: string;
  isHost: boolean;
  isOffline?: boolean;    // только в идущей партии
}

export interface GuesserPlayerView {
  gameId: 'guesser';
  phase: GuesserPhase;
  format: GuesserFormat;
  teamsCount: number;
  maxTeams: number;
  teamsUnbalanced: boolean;
  mode: GuesserMode;
  scoreMode: ScoreMode;
  currentCircle: number;
  maxCircles: number;
  totalWordsInitial: number;
  wordsLeft: number;
  teams: TeamScore[];
  players: Player[];
  currentTeamId?: string;
  currentSpeakerId?: string;
  currentSpeakerName?: string;
  me: {
    playerId: string;
    nickname: string;
    teamId?: string;
    isHost: boolean;
    isCurrentSpeaker: boolean;
  };
  timers: {
    roundSecondsLeft?: number;     // таймер слова (step) или хода (sprint)
    secondarySecondsLeft?: number; // окно отмены / голосования
  };
  currentTask?: { id: string; text: string }; // только у объясняющего
  taskRevealed: boolean;
  voting?: {
    wordText: string;
    canVote: boolean;
    hasVoted: boolean;
    votesFor: number;
    votesAgainst: number;
    totalVoters: number;
  };
  voteResult?: {
    wordText: string;
    votesFor: number;
    votesAgainst: number;
    decision: 'approved' | 'rejected' | 'tie';
    secondsLeft: number;
  };
  disputeWindow?: {
    wordText: string;
    canDispute: boolean;
    secondsLeft: number;
    guessedById?: string;
  };
  speakerClaim?: {
    wordText: string;
    canDispute: boolean;
    secondsLeft: number;
  };
  finishedSummary?: {
    teamsSorted: Array<TeamScore & { place: number }>;
  };
}

export type GuesserCommand =
  | {
      type: 'START_GAME';
      settings?: Partial<{
        mode: GuesserMode;
        scoreMode: ScoreMode;
        maxCircles: number;
        totalWordsInitial: number;
        roundDurationSec: number;
      }>;
    }
  | { type: 'SET_TEAMS_COUNT'; count: number }
  | { type: 'SHUFFLE_TEAMS' }
  | { type: 'BEGIN_PLAY' }
  | { type: 'SHOW_TASK' }
  | { type: 'MARK_GUESSED'; guessedBy?: string } // guessedBy — формат solo
  | { type: 'SKIP_TASK' }
  | { type: 'RAISE_DISPUTE' }
  | { type: 'VOTE_YES' }
  | { type: 'VOTE_NO' }
  | { type: 'NEXT_TURN' };                        // спринт: закончить ход досрочно
