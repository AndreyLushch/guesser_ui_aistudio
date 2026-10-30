/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GuesserFormat, ScoreMode, TeamScore } from '../types';

/**
 * Calculates standings and handles ties correctly:
 * e.g. scores [15, 15, 9] -> places [1, 1, 3].
 */
export function calculatePlaces(teams: TeamScore[]): Array<TeamScore & { place: number }> {
  const sorted = [...teams].sort((a, b) => b.score - a.score);
  const result: Array<TeamScore & { place: number }> = [];

  for (let i = 0; i < sorted.length; i++) {
    if (i === 0) {
      result.push({ ...sorted[i], place: 1 });
    } else {
      const prev = sorted[i - 1];
      const prevCalculated = result[i - 1];
      if (sorted[i].score === prev.score) {
        result.push({ ...sorted[i], place: prevCalculated.place });
      } else {
        result.push({ ...sorted[i], place: i + 1 });
      }
    }
  }

  return result;
}

/**
 * Automatically determines format based on player count.
 * 2 -> pair
 * 3 -> solo
 * 4+ -> teams
 */
export function determineFormat(playerCount: number): GuesserFormat {
  if (playerCount <= 2) return 'pair';
  if (playerCount === 3) return 'solo';
  return 'teams';
}

/**
 * Resolves community vote according to section 3.3:
 * Ничья или нет голосов — слово засчитано.
 */
export function resolveVoting(votesFor: number, votesAgainst: number): 'approved' | 'rejected' | 'tie' {
  if (votesFor > votesAgainst) return 'approved';
  if (votesAgainst > votesFor) return 'rejected';
  return 'tie';
}

/**
 * Calculates score delta for events under soft vs hard scoring.
 */
export function calculateScoreDelta(
  event: 'guess' | 'skip' | 'timeout' | 'dispute_rejected',
  scoreMode: ScoreMode,
  currentTeamIndex: number,
  totalTeams: number
): { awardedTeamIndex: number; delta: number } | null {
  if (event === 'guess') {
    return { awardedTeamIndex: currentTeamIndex, delta: 1 };
  }

  // Under soft scoring, errors yield 0 points
  if (scoreMode === 'soft') {
    return null;
  }

  // Under hard scoring, skip/timeout/dispute gives +1 to next team by circle
  const nextTeamIndex = (currentTeamIndex + 1) % Math.max(1, totalTeams);
  return { awardedTeamIndex: nextTeamIndex, delta: 1 };
}

/**
 * Checks whether team sizes are unbalanced (differ by more than 1).
 */
export function checkTeamsUnbalanced(teamSizes: number[]): boolean {
  if (teamSizes.length <= 1) return false;
  const min = Math.min(...teamSizes);
  const max = Math.max(...teamSizes);
  return max - min > 1;
}
