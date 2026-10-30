/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculatePlaces,
  determineFormat,
  resolveVoting,
  calculateScoreDelta,
  checkTeamsUnbalanced,
} from './calculations';

test('determineFormat: assigns pair for 2, solo for 3, teams for 4+', () => {
  assert.equal(determineFormat(2), 'pair');
  assert.equal(determineFormat(3), 'solo');
  assert.equal(determineFormat(4), 'teams');
  assert.equal(determineFormat(12), 'teams');
});

test('calculatePlaces: handles tied scores and places correctly (15, 15, 9 -> 1, 1, 3)', () => {
  const teams = [
    { id: '1', name: 'Синие', score: 15, color: '#3B82F6' },
    { id: '2', name: 'Красные', score: 15, color: '#EF4444' },
    { id: '3', name: 'Зелёные', score: 9, color: '#22C55E' },
  ];

  const results = calculatePlaces(teams);
  assert.equal(results[0].place, 1);
  assert.equal(results[1].place, 1);
  assert.equal(results[2].place, 3);
});

test('resolveVoting: votesFor > votesAgainst is approved, tie or zero is tie, votesAgainst is rejected', () => {
  assert.equal(resolveVoting(5, 2), 'approved');
  assert.equal(resolveVoting(1, 4), 'rejected');
  assert.equal(resolveVoting(3, 3), 'tie');
  assert.equal(resolveVoting(0, 0), 'tie');
});

test('calculateScoreDelta: soft mode awards only guess, hard mode awards next team on failure', () => {
  // Soft mode
  assert.deepEqual(calculateScoreDelta('guess', 'soft', 0, 3), { awardedTeamIndex: 0, delta: 1 });
  assert.equal(calculateScoreDelta('skip', 'soft', 0, 3), null);
  assert.equal(calculateScoreDelta('timeout', 'soft', 0, 3), null);

  // Hard mode
  assert.deepEqual(calculateScoreDelta('guess', 'hard', 1, 3), { awardedTeamIndex: 1, delta: 1 });
  assert.deepEqual(calculateScoreDelta('skip', 'hard', 1, 3), { awardedTeamIndex: 2, delta: 1 });
  assert.deepEqual(calculateScoreDelta('timeout', 'hard', 2, 3), { awardedTeamIndex: 0, delta: 1 });
});

test('checkTeamsUnbalanced: recognizes balanced vs unbalanced teams', () => {
  assert.equal(checkTeamsUnbalanced([3, 3, 3]), false);
  assert.equal(checkTeamsUnbalanced([3, 4, 3]), false);
  assert.equal(checkTeamsUnbalanced([2, 4, 3]), true);
  assert.equal(checkTeamsUnbalanced([1, 4]), true);
});
