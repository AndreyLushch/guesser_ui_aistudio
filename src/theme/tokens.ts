/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const TEAM_COLORS: Record<string, string> = {
  red: '#EF4444',     // Красные
  blue: '#3B82F6',    // Синие
  green: '#22C55E',   // Зелёные
  yellow: '#EAB308',  // Жёлтые
  purple: '#A855F7',  // Фиолетовые
  orange: '#F97316',  // Оранжевые
  pair: '#06B6D4',    // Вдвоём (формат pair)
};

export const TEAM_NAMES = [
  'Красные',
  'Синие',
  'Зелёные',
  'Жёлтые',
  'Фиолетовые',
  'Оранжевые',
] as const;

export const TEAM_PALETTE: Array<{ name: string; color: string; id: string; contrastText: string }> = [
  { id: 'team-red', name: 'Красные', color: '#EF4444', contrastText: '#FFFFFF' },
  { id: 'team-blue', name: 'Синие', color: '#3B82F6', contrastText: '#FFFFFF' },
  { id: 'team-green', name: 'Зелёные', color: '#22C55E', contrastText: '#FFFFFF' },
  { id: 'team-yellow', name: 'Жёлтые', color: '#EAB308', contrastText: '#18181B' },
  { id: 'team-purple', name: 'Фиолетовые', color: '#A855F7', contrastText: '#FFFFFF' },
  { id: 'team-orange', name: 'Оранжевые', color: '#F97316', contrastText: '#FFFFFF' },
];

export const PAIR_TEAM = {
  id: 'team-pair',
  name: 'Вдвоём',
  color: '#06B6D4',
  contrastText: '#FFFFFF',
};

export type VisualStyle = 'fiesta' | 'arcade' | 'glass';

/**
 * Returns solid background gradient and contrast styles for the active team
 * ensuring the screen is completely flooded with the team's vibrant color (Requirement 2).
 */
export function getActiveTeamFullBackground(colorHex?: string, isLightMode = false) {
  if (!colorHex) {
    return isLightMode
      ? { background: '#F8FAFC', text: '#0F172A', isDarkBackground: false }
      : { background: '#0F172A', text: '#FFFFFF', isDarkBackground: true };
  }

  // Yellow needs dark text for perfect contrast
  const isYellow = colorHex.toLowerCase() === '#eab308' || colorHex.toLowerCase() === '#eab308';
  const contrastText = isYellow ? '#18181B' : '#FFFFFF';

  return {
    background: colorHex,
    color: contrastText,
    isDarkBackground: !isYellow,
  };
}

export function getTeamBadgeStyles(colorHex: string, isLightMode = false) {
  return {
    borderColor: colorHex,
    backgroundColor: isLightMode ? `${colorHex}22` : `${colorHex}35`,
    color: isLightMode && colorHex === '#EAB308' ? '#713F12' : isLightMode ? '#0F172A' : '#FFFFFF',
  };
}
