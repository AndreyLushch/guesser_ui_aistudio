/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  GuesserCommand,
  GuesserFormat,
  GuesserMode,
  GuesserPlayerView,
  Player,
  ScoreMode,
  TeamScore,
} from '../types';
import { GameAdapter } from './GameAdapter';
import { calculatePlaces, determineFormat, resolveVoting } from '../engine/calculations';
import { PAIR_TEAM, TEAM_PALETTE } from '../theme/tokens';

const WORD_BANK = [
  'КОСМОНАВТ',
  'БАЛЕТ',
  'ЭЛЕКТРОСАМОКАТ',
  'ДОСТОПРИМЕЧАТЕЛЬНОСТЬ',
  'ЧЕЛОВЕК-ПАУК',
  'ПЫЛЕСОС',
  'БУМЕРАНГ',
  'СНЕГОВИК',
  'АТТРАКЦИОН',
  'СИНХРОФАЗОТРОН',
  'ПИАНИНО',
  'ТЕЛЕСКОП',
  'ПАРАШЮТ',
  'КЕНГУРУ',
  'МОЛНИЯ',
  'ДИРИЖАБЛЬ',
  'ШАУРМА',
  'ФОКУСНИК',
  'БУДИЛЬНИК',
  'ПИНГВИН',
  'МАРМЕЛАД',
  'СУПЕРГЕРОЙ',
  'ХОЛОДИЛЬНИК',
  'ВОДОЛАЗ',
  'ПРИКЛЮЧЕНИЕ',
];

interface MockInternalState {
  gameId: 'guesser';
  phase: GuesserPlayerView['phase'];
  format: GuesserFormat;
  teamsCount: number;
  maxTeams: number;
  teamsUnbalanced: boolean;
  mode: GuesserMode;
  scoreMode: ScoreMode;
  currentCircle: number;
  maxCircles: number;
  totalWordsInitial: number;
  wordsDeck: string[];
  wordsLeft: number;
  teams: TeamScore[];
  players: Player[];
  currentTeamId?: string;
  currentSpeakerId?: string;
  timers: {
    roundSecondsLeft?: number;
    secondarySecondsLeft?: number;
  };
  currentWordText?: string;
  taskRevealed: boolean;
  voting?: GuesserPlayerView['voting'];
  voteResult?: GuesserPlayerView['voteResult'];
  disputeWindow?: GuesserPlayerView['disputeWindow'];
  speakerClaim?: GuesserPlayerView['speakerClaim'];
  finishedSummary?: GuesserPlayerView['finishedSummary'];
  wordsGuessedThisTurn: number;
  pendingClaim?: {
    wordText: string;
    teamId?: string;
    guessedById?: string;
    speakerId?: string;
    format: GuesserFormat;
  };
  // Which player is currently viewing
  activeViewerId: string;
}

export class MockAdapter implements GameAdapter {
  private state: MockInternalState;
  private subscribers: Array<(view: GuesserPlayerView) => void> = [];
  private tickerInterval: NodeJS.Timeout | null = null;
  private isPaused = false;

  constructor(initialPlayersCount = 6) {
    this.state = this.buildInitialState(initialPlayersCount);
    this.startTicker();
  }

  private buildInitialState(playerCount: number): MockInternalState {
    const format = determineFormat(playerCount);
    const wordsDeck = [...WORD_BANK];

    const players: Player[] = [];
    const names = [
      'Алексей (ты)',
      'Екатерина',
      'Михаил',
      'Анна',
      'Дмитрий',
      'Ольга',
      'Сергей',
      'Елена',
      'Артем',
      'Полина',
      'Иван',
      'Мария',
    ];

    for (let i = 0; i < playerCount; i++) {
      players.push({
        id: `p-${i + 1}`,
        nickname: names[i] || `Игрок ${i + 1}`,
        isHost: i === 0,
        isOffline: false,
      });
    }

    let teams: TeamScore[] = [];
    let teamsCount = 2;

    if (format === 'pair') {
      teams = [
        {
          id: PAIR_TEAM.id,
          name: PAIR_TEAM.name,
          score: 0,
          color: PAIR_TEAM.color,
        },
      ];
      players.forEach((p) => (p.teamId = PAIR_TEAM.id));
      teamsCount = 1;
    } else if (format === 'solo') {
      teams = players.map((p, idx) => ({
        id: `team-solo-${p.id}`,
        name: p.nickname,
        score: 0,
        color: TEAM_PALETTE[idx % TEAM_PALETTE.length].color,
        soloPlayerId: p.id,
      }));
      players.forEach((p, idx) => {
        p.teamId = teams[idx].id;
      });
      teamsCount = players.length;
    } else {
      teamsCount = Math.min(6, Math.max(2, Math.floor(playerCount / 2)));
      teams = TEAM_PALETTE.slice(0, teamsCount).map((t) => ({
        id: t.id,
        name: t.name,
        score: 0,
        color: t.color,
      }));
      // Distribute players
      players.forEach((p, idx) => {
        p.teamId = teams[idx % teamsCount].id;
      });
    }

    return {
      gameId: 'guesser',
      phase: 'lobby',
      format,
      teamsCount: teams.length,
      maxTeams: format === 'teams' ? Math.min(6, Math.floor(playerCount / 2)) : teams.length,
      teamsUnbalanced: false,
      mode: 'step',
      scoreMode: 'soft',
      currentCircle: 1,
      maxCircles: 3,
      totalWordsInitial: 40,
      wordsDeck,
      wordsLeft: 40,
      teams,
      players,
      timers: {},
      taskRevealed: false,
      wordsGuessedThisTurn: 0,
      activeViewerId: players[0].id,
    };
  }

  private startTicker() {
    if (this.tickerInterval) clearInterval(this.tickerInterval);
    this.tickerInterval = setInterval(() => {
      this.tick();
    }, 1000);
  }

  public stopTicker() {
    if (this.tickerInterval) {
      clearInterval(this.tickerInterval);
      this.tickerInterval = null;
    }
  }

  public setPaused(paused: boolean) {
    this.isPaused = paused;
  }

  private tick() {
    if (this.isPaused) return;

    let changed = false;

    // Tick dispute window
    if (this.state.disputeWindow && this.state.disputeWindow.secondsLeft > 0) {
      const nextSec = this.state.disputeWindow.secondsLeft - 1;
      if (nextSec <= 0) {
        // Dispute window closed with no dispute raised -> word is approved, award point now!
        this.awardPendingClaimPoints();
        this.state.disputeWindow = undefined;
        // In step mode, advance to next turn
        if (this.state.mode === 'step' && this.state.phase === 'dispute_window') {
          this.advanceToNextTurn();
        }
      } else {
        this.state.disputeWindow = {
          ...this.state.disputeWindow,
          secondsLeft: nextSec,
        };
      }
      changed = true;
    }

    // Tick speaker claim in sprint
    if (this.state.speakerClaim && this.state.speakerClaim.secondsLeft > 0) {
      const nextSec = this.state.speakerClaim.secondsLeft - 1;
      if (nextSec <= 0) {
        this.state.speakerClaim = undefined;
      } else {
        this.state.speakerClaim = {
          ...this.state.speakerClaim,
          secondsLeft: nextSec,
        };
      }
      changed = true;
    }

    // Tick voting
    if (this.state.phase === 'voting' && this.state.timers.secondarySecondsLeft !== undefined) {
      const secLeft = this.state.timers.secondarySecondsLeft - 1;
      if (secLeft <= 0) {
        // Resolve voting automatically
        this.finalizeVoting();
      } else {
        this.state.timers.secondarySecondsLeft = secLeft;
        // Simulate other players voting occasionally
        if (this.state.voting && this.state.voting.totalVoters < this.state.players.length) {
          if (Math.random() > 0.4) {
            const voteFor = Math.random() > 0.4;
            this.state.voting = {
              ...this.state.voting,
              votesFor: this.state.voting.votesFor + (voteFor ? 1 : 0),
              votesAgainst: this.state.voting.votesAgainst + (!voteFor ? 1 : 0),
              totalVoters: this.state.voting.totalVoters + 1,
            };
          }
        }
      }
      changed = true;
    }

    // Tick voteResult banner
    if (this.state.voteResult && this.state.voteResult.secondsLeft > 0) {
      const nextSec = this.state.voteResult.secondsLeft - 1;
      if (nextSec <= 0) {
        this.state.voteResult = undefined;
        if (this.state.mode === 'step') {
          this.advanceToNextTurn();
        } else {
          // In sprint, resume active_turn
          this.state.phase = 'active_turn';
        }
      } else {
        this.state.voteResult = {
          ...this.state.voteResult,
          secondsLeft: nextSec,
        };
      }
      changed = true;
    }

    // Tick roundSecondsLeft during active_turn
    if (
      this.state.phase === 'active_turn' &&
      this.state.timers.roundSecondsLeft !== undefined &&
      !this.state.voting // Timer is paused during voting
    ) {
      const roundSec = this.state.timers.roundSecondsLeft - 1;
      if (roundSec <= 0) {
        // Time is up!
        this.state.timers.roundSecondsLeft = 0;
        this.handleTimeUp();
      } else {
        this.state.timers.roundSecondsLeft = roundSec;
      }
      changed = true;
    }

    if (changed) {
      this.notify();
    }
  }

  private handleTimeUp() {
    // Current word not guessed -> put back in deck
    if (this.state.currentWordText) {
      this.state.wordsDeck.push(this.state.currentWordText);
    }

    // Hard scoring penalty to next team
    if (this.state.scoreMode === 'hard' && this.state.currentTeamId) {
      const currentIdx = this.state.teams.findIndex((t) => t.id === this.state.currentTeamId);
      if (currentIdx !== -1 && this.state.teams.length > 1) {
        const nextIdx = (currentIdx + 1) % this.state.teams.length;
        this.state.teams[nextIdx].score += 1;
      }
    }

    this.advanceToNextTurn();
  }

  private advanceToNextTurn() {
    this.state.currentWordText = undefined;
    this.state.taskRevealed = false;
    this.state.wordsGuessedThisTurn = 0;
    this.state.disputeWindow = undefined;
    this.state.speakerClaim = undefined;
    this.state.voting = undefined;
    this.state.timers = {};

    // Check if finished by words
    if (this.state.wordsLeft <= 0 || this.state.wordsDeck.length === 0) {
      this.finishGame();
      return;
    }

    // Pick next team by circle
    const currentTeamIdx = this.state.currentTeamId
      ? this.state.teams.findIndex((t) => t.id === this.state.currentTeamId)
      : -1;
    const nextTeamIdx = (currentTeamIdx + 1) % this.state.teams.length;

    // If wrapped around to 0, advance circle
    if (nextTeamIdx === 0 && currentTeamIdx !== -1) {
      this.state.currentCircle += 1;
      if (this.state.currentCircle > this.state.maxCircles) {
        this.finishGame();
        return;
      }
    }

    const nextTeam = this.state.teams[nextTeamIdx];
    this.state.currentTeamId = nextTeam.id;

    // Pick speaker from this team who is online
    const teamPlayers = this.state.players.filter((p) => p.teamId === nextTeam.id);
    const onlinePlayers = teamPlayers.filter((p) => !p.isOffline);

    if (onlinePlayers.length === 0) {
      // Entire team offline! Skip to next
      return;
    }

    // Rotate speaker
    const currentSpeakerIdx = onlinePlayers.findIndex((p) => p.id === this.state.currentSpeakerId);
    const nextSpeaker = onlinePlayers[(currentSpeakerIdx + 1) % onlinePlayers.length];
    this.state.currentSpeakerId = nextSpeaker.id;

    this.state.phase = 'waiting_turn';
    this.notify();
  }

  private finishGame() {
    this.state.phase = 'finished';
    this.state.timers = {};
    const sorted = calculatePlaces(this.state.teams);
    this.state.finishedSummary = {
      teamsSorted: sorted,
    };
    this.notify();
  }

  private awardPendingClaimPoints() {
    if (!this.state.pendingClaim) return;
    const { format, teamId, guessedById, speakerId } = this.state.pendingClaim;
    if (format === 'solo') {
      if (speakerId) {
        const speakerTeam = this.state.teams.find((t) => t.soloPlayerId === speakerId);
        if (speakerTeam) speakerTeam.score += 1;
      }
      if (guessedById) {
        const guessedTeam = this.state.teams.find((t) => t.soloPlayerId === guessedById);
        if (guessedTeam) guessedTeam.score += 1;
      }
    } else if (teamId) {
      const team = this.state.teams.find((t) => t.id === teamId);
      if (team) team.score += 1;
    }
    this.state.pendingClaim = undefined;
  }

  private finalizeVoting() {
    if (!this.state.voting) return;

    const { votesFor, votesAgainst, wordText } = this.state.voting;
    const decision = resolveVoting(votesFor, votesAgainst);

    this.state.voteResult = {
      wordText,
      votesFor,
      votesAgainst,
      decision,
      secondsLeft: 3,
    };

    if (decision === 'approved' || decision === 'tie') {
      // Award point only now after vote approval
      this.awardPendingClaimPoints();
    } else {
      // Rejected: pending claim discarded
      this.state.pendingClaim = undefined;
      // Under hard mode, award point to next team
      if (this.state.scoreMode === 'hard' && this.state.currentTeamId) {
        const currentIdx = this.state.teams.findIndex((t) => t.id === this.state.currentTeamId);
        if (currentIdx !== -1 && this.state.teams.length > 1) {
          const nextIdx = (currentIdx + 1) % this.state.teams.length;
          this.state.teams[nextIdx].score += 1;
        }
      }
    }

    this.state.voting = undefined;
    this.state.timers.secondarySecondsLeft = undefined;

    this.notify();
  }

  public getView(): GuesserPlayerView {
    const mePlayer =
      this.state.players.find((p) => p.id === this.state.activeViewerId) || this.state.players[0];
    const isCurrentSpeaker = mePlayer.id === this.state.currentSpeakerId;
    const currentSpeaker = this.state.players.find((p) => p.id === this.state.currentSpeakerId);

    // Only speaker can see task when active
    let currentTask: { id: string; text: string } | undefined = undefined;
    if (isCurrentSpeaker && this.state.currentWordText) {
      currentTask = {
        id: `w-${this.state.currentWordText}`,
        text: this.state.currentWordText,
      };
    }

    return {
      gameId: 'guesser',
      phase: this.state.phase,
      format: this.state.format,
      teamsCount: this.state.teamsCount,
      maxTeams: this.state.maxTeams,
      teamsUnbalanced: this.state.teamsUnbalanced,
      mode: this.state.mode,
      scoreMode: this.state.scoreMode,
      currentCircle: this.state.currentCircle,
      maxCircles: this.state.maxCircles,
      totalWordsInitial: this.state.totalWordsInitial,
      wordsLeft: this.state.wordsLeft,
      teams: this.state.teams.map((t) => ({ ...t })),
      players: this.state.players.map((p) => ({ ...p })),
      currentTeamId: this.state.currentTeamId,
      currentSpeakerId: this.state.currentSpeakerId,
      currentSpeakerName: currentSpeaker?.nickname,
      me: {
        playerId: mePlayer.id,
        nickname: mePlayer.nickname,
        teamId: mePlayer.teamId,
        isHost: mePlayer.isHost,
        isCurrentSpeaker,
      },
      timers: { ...this.state.timers },
      currentTask,
      taskRevealed: this.state.taskRevealed,
      voting: this.state.voting ? { ...this.state.voting } : undefined,
      voteResult: this.state.voteResult ? { ...this.state.voteResult } : undefined,
      disputeWindow: this.state.disputeWindow ? { ...this.state.disputeWindow } : undefined,
      speakerClaim: this.state.speakerClaim ? { ...this.state.speakerClaim } : undefined,
      finishedSummary: this.state.finishedSummary
        ? {
            teamsSorted: [...this.state.finishedSummary.teamsSorted],
          }
        : undefined,
    };
  }

  public subscribe(cb: (view: GuesserPlayerView) => void): () => void {
    this.subscribers.push(cb);
    cb(this.getView());
    return () => {
      this.subscribers = this.subscribers.filter((s) => s !== cb);
    };
  }

  private notify() {
    const view = this.getView();
    this.subscribers.forEach((cb) => cb(view));
  }

  public send(cmd: GuesserCommand): void {
    switch (cmd.type) {
      case 'START_GAME': {
        if (cmd.settings) {
          if (cmd.settings.mode) this.state.mode = cmd.settings.mode;
          if (cmd.settings.scoreMode) this.state.scoreMode = cmd.settings.scoreMode;
          if (cmd.settings.maxCircles) this.state.maxCircles = cmd.settings.maxCircles;
          if (cmd.settings.totalWordsInitial) {
            this.state.totalWordsInitial = cmd.settings.totalWordsInitial;
            this.state.wordsLeft = cmd.settings.totalWordsInitial;
          }
        }
        this.state.phase = 'seating';
        this.notify();
        break;
      }

      case 'SET_TEAMS_COUNT': {
        const count = Math.max(2, Math.min(this.state.maxTeams, cmd.count));
        this.state.teamsCount = count;
        this.state.teams = TEAM_PALETTE.slice(0, count).map((t) => ({
          id: t.id,
          name: t.name,
          score: 0,
          color: t.color,
        }));
        this.state.players.forEach((p, idx) => {
          p.teamId = this.state.teams[idx % count].id;
        });
        this.notify();
        break;
      }

      case 'SHUFFLE_TEAMS': {
        const shuffled = [...this.state.players].sort(() => Math.random() - 0.5);
        const teamCount = this.state.teams.length;
        shuffled.forEach((p, idx) => {
          const target = this.state.players.find((orig) => orig.id === p.id);
          if (target) {
            target.teamId = this.state.teams[idx % teamCount].id;
          }
        });
        this.state.teamsUnbalanced = false;
        this.notify();
        break;
      }

      case 'BEGIN_PLAY': {
        // Move from seating to waiting_turn
        this.state.currentCircle = 1;
        this.state.currentTeamId = this.state.teams[0].id;
        const teamPlayers = this.state.players.filter((p) => p.teamId === this.state.teams[0].id);
        const onlineTeamPlayers = teamPlayers.filter((p) => !p.isOffline);
        this.state.currentSpeakerId = onlineTeamPlayers[0]?.id || teamPlayers[0]?.id;
        this.state.phase = 'waiting_turn';
        this.notify();
        break;
      }

      case 'SHOW_TASK': {
        // Draw word
        const word = this.state.wordsDeck.shift() || 'СИНХРОФАЗОТРОН';
        this.state.currentWordText = word;
        this.state.wordsLeft = Math.max(0, this.state.wordsLeft - 1);
        this.state.taskRevealed = true;
        this.state.phase = 'active_turn';
        this.state.timers.roundSecondsLeft = this.state.mode === 'step' ? 20 : 60;
        this.notify();
        break;
      }

      case 'MARK_GUESSED': {
        const wordGuessed = this.state.currentWordText || 'КОСМОНАВТ';
        this.state.wordsGuessedThisTurn += 1;

        // Pending claim: Point is only awarded after confirmation (window timeout or vote approval)!
        this.state.pendingClaim = {
          wordText: wordGuessed,
          teamId: this.state.currentTeamId,
          guessedById: cmd.guessedBy,
          speakerId: this.state.currentSpeakerId,
          format: this.state.format,
        };

        if (this.state.mode === 'sprint') {
          // Sprint: keep active_turn, show speakerClaim to speaker and disputeWindow to others
          this.state.speakerClaim = {
            wordText: wordGuessed,
            canDispute: true,
            secondsLeft: 5,
          };
          this.state.disputeWindow = {
            wordText: wordGuessed,
            canDispute: true,
            secondsLeft: 5,
            guessedById: cmd.guessedBy,
          };
          // Immediately serve next word!
          const nextWord = this.state.wordsDeck.shift() || 'АТТРАКЦИОН';
          this.state.currentWordText = nextWord;
          this.state.wordsLeft = Math.max(0, this.state.wordsLeft - 1);
        } else {
          // Step: open dispute_window for all
          this.state.phase = 'dispute_window';
          this.state.disputeWindow = {
            wordText: wordGuessed,
            canDispute: true,
            secondsLeft: 5,
            guessedById: cmd.guessedBy,
          };
        }

        this.notify();
        break;
      }

      case 'SKIP_TASK': {
        if (this.state.currentWordText) {
          this.state.wordsDeck.push(this.state.currentWordText);
        }

        // Hard mode penalty to next team
        if (this.state.scoreMode === 'hard' && this.state.currentTeamId) {
          const currentIdx = this.state.teams.findIndex((t) => t.id === this.state.currentTeamId);
          if (currentIdx !== -1 && this.state.teams.length > 1) {
            const nextIdx = (currentIdx + 1) % this.state.teams.length;
            this.state.teams[nextIdx].score += 1;
          }
        }

        if (this.state.mode === 'step') {
          this.advanceToNextTurn();
        } else {
          // Sprint: next word immediately, keep turn going
          const nextWord = this.state.wordsDeck.shift() || 'БАЛЕТ';
          this.state.currentWordText = nextWord;
          this.state.wordsLeft = Math.max(0, this.state.wordsLeft - 1);
          this.notify();
        }
        break;
      }

      case 'RAISE_DISPUTE': {
        const disputedWord = this.state.disputeWindow?.wordText || this.state.speakerClaim?.wordText || 'СЛОВО';

        this.state.disputeWindow = undefined;
        this.state.speakerClaim = undefined;

        if (this.state.format === 'pair') {
          // Pair: simply cancelled, no voting! Pending claim discarded
          this.state.pendingClaim = undefined;
          this.state.voteResult = {
            wordText: disputedWord,
            votesFor: 0,
            votesAgainst: 1,
            decision: 'rejected',
            secondsLeft: 3,
          };
          if (this.state.mode === 'step') {
            this.state.phase = 'dispute_window';
          }
          this.notify();
          return;
        }

        // Open voting
        this.state.phase = 'voting';
        this.state.timers.secondarySecondsLeft = 12;
        this.state.voting = {
          wordText: disputedWord,
          canVote: true,
          hasVoted: false,
          votesFor: 1,
          votesAgainst: 1,
          totalVoters: 2,
        };
        this.notify();
        break;
      }

      case 'VOTE_YES': {
        if (!this.state.voting || this.state.voting.hasVoted) return;
        this.state.voting = {
          ...this.state.voting,
          hasVoted: true,
          canVote: false,
          votesFor: this.state.voting.votesFor + 1,
          totalVoters: this.state.voting.totalVoters + 1,
        };
        this.notify();
        break;
      }

      case 'VOTE_NO': {
        if (!this.state.voting || this.state.voting.hasVoted) return;
        this.state.voting = {
          ...this.state.voting,
          hasVoted: true,
          canVote: false,
          votesAgainst: this.state.voting.votesAgainst + 1,
          totalVoters: this.state.voting.totalVoters + 1,
        };
        this.notify();
        break;
      }

      case 'NEXT_TURN': {
        // Sprint early finish or manual advance
        this.advanceToNextTurn();
        break;
      }
    }
  }

  // Dev helpers for inspection and testing
  public setActiveViewer(playerId: string) {
    this.state.activeViewerId = playerId;
    this.notify();
  }

  public setCustomView(customView: GuesserPlayerView) {
    this.state = {
      gameId: 'guesser',
      phase: customView.phase,
      format: customView.format,
      teamsCount: customView.teamsCount,
      maxTeams: customView.maxTeams,
      teamsUnbalanced: customView.teamsUnbalanced,
      mode: customView.mode,
      scoreMode: customView.scoreMode,
      currentCircle: customView.currentCircle,
      maxCircles: customView.maxCircles,
      totalWordsInitial: customView.totalWordsInitial,
      wordsDeck: [...WORD_BANK],
      wordsLeft: customView.wordsLeft,
      teams: customView.teams.map((t) => ({ ...t })),
      players: customView.players.map((p) => ({ ...p })),
      currentTeamId: customView.currentTeamId,
      currentSpeakerId: customView.currentSpeakerId,
      timers: { ...customView.timers },
      currentWordText: customView.currentTask?.text,
      taskRevealed: customView.taskRevealed,
      voting: customView.voting ? { ...customView.voting } : undefined,
      voteResult: customView.voteResult ? { ...customView.voteResult } : undefined,
      disputeWindow: customView.disputeWindow ? { ...customView.disputeWindow } : undefined,
      speakerClaim: customView.speakerClaim ? { ...customView.speakerClaim } : undefined,
      wordsGuessedThisTurn: 0,
      activeViewerId: customView.me.playerId,
    };
    this.notify();
  }

  public setPlayerOffline(playerId: string, isOffline: boolean) {
    const p = this.state.players.find((player) => player.id === playerId);
    if (p) {
      p.isOffline = isOffline;
      this.notify();
    }
  }

  public resetParty(playerCount = 6) {
    this.state = this.buildInitialState(playerCount);
    this.notify();
  }
}
