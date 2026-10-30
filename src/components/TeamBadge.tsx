/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { GuesserFormat, TeamScore } from '../types';
import { STRINGS } from '../texts';

interface TeamBadgeProps {
  format: GuesserFormat;
  myTeam?: TeamScore;
  nickname: string;
}

export const TeamBadge: React.FC<TeamBadgeProps> = ({ format, myTeam, nickname }) => {
  let label = STRINGS.progress.teamSolo;
  let color = '#3B82F6';

  if (format === 'pair') {
    label = STRINGS.progress.teamPair;
    color = myTeam?.color || '#06B6D4';
  } else if (format === 'teams' && myTeam) {
    label = STRINGS.progress.teamYou(myTeam.name);
    color = myTeam.color;
  } else if (format === 'solo') {
    label = `${STRINGS.progress.teamSolo} (${nickname})`;
    color = myTeam?.color || '#A855F7';
  }

  return (
    <div
      className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wide border shadow-xs transition-colors"
      style={{
        backgroundColor: `${color}18`,
        borderColor: `${color}40`,
        color: '#F9FAFB',
      }}
    >
      <span
        className="w-2.5 h-2.5 rounded-full shadow-xs shrink-0"
        style={{ backgroundColor: color }}
      />
      <span className="truncate max-w-[200px]">{label}</span>
    </div>
  );
};
