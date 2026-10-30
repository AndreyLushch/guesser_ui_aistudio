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

export const TEAM_PALETTE: Array<{ name: string; color: string; id: string }> = [
  { id: 'team-red', name: 'Красные', color: '#EF4444' },
  { id: 'team-blue', name: 'Синие', color: '#3B82F6' },
  { id: 'team-green', name: 'Зелёные', color: '#22C55E' },
  { id: 'team-yellow', name: 'Жёлтые', color: '#EAB308' },
  { id: 'team-purple', name: 'Фиолетовые', color: '#A855F7' },
  { id: 'team-orange', name: 'Оранжевые', color: '#F97316' },
];

export const PAIR_TEAM = {
  id: 'team-pair',
  name: 'Вдвоём',
  color: '#06B6D4',
};

/**
 * Returns color opacity or solid with contrast considerations.
 */
export function getTeamBadgeStyles(colorHex: string, isLightMode = false) {
  return {
    borderColor: colorHex,
    backgroundColor: isLightMode ? `${colorHex}15` : `${colorHex}22`,
    color: isLightMode && colorHex === '#EAB308' ? '#854D0E' : isLightMode ? colorHex : '#F3F4F6',
  };
}

export const THEME_STORAGE_KEY = 'guesser_theme_mode';
