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
  isLightMode?: boolean;
}

export const TeamBadge: React.FC<TeamBadgeProps> = ({ format, myTeam, nickname, isLightMode = false }) => {
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

  const isYellow = color.toLowerCase() === '#eab308';

  return (
    <div
      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[13px] font-bold tracking-wide border shadow-sm transition-colors"
      style={{
        backgroundColor: isLightMode ? `${color}25` : `${color}30`,
        borderColor: `${color}60`,
        color: isLightMode ? (isYellow ? '#713F12' : '#0F172A') : '#FFFFFF',
      }}
    >
      <span
        className="w-3 h-3 rounded-full shadow-sm shrink-0"
        style={{ backgroundColor: color }}
      />
      <span className="truncate max-w-[220px]">{label}</span>
    </div>
  );
};
