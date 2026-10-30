/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, BookOpen, CheckCircle2, ShieldAlert } from 'lucide-react';
import { STRINGS } from '../texts';
import { GuesserFormat, GuesserMode, ScoreMode } from '../types';

interface RulesSheetProps {
  isOpen: boolean;
  onClose: () => void;
  format?: GuesserFormat;
  mode?: GuesserMode;
  scoreMode?: ScoreMode;
}

export const RulesSheet: React.FC<RulesSheetProps> = ({
  isOpen,
  onClose,
  format = 'teams',
  mode = 'step',
  scoreMode = 'soft',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg max-h-[85vh] bg-neutral-900 border border-neutral-800 rounded-t-3xl sm:rounded-3xl p-5 overflow-y-auto shadow-2xl flex flex-col space-y-4"
        style={{ paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-100">{STRINGS.rules.title}</h2>
              <p className="text-xs text-neutral-400">Краткий справочник правил</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
            aria-label="Закрыть правила"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current match badges */}
        <div className="bg-neutral-950/80 rounded-2xl p-3 border border-neutral-800 space-y-1.5">
          <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
            Текущие настройки партии
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-neutral-800 text-neutral-200 font-medium">
              Формат: <strong>{STRINGS.formats[format]}</strong>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-neutral-800 text-neutral-200 font-medium">
              Режим: <strong>{STRINGS.modes[mode]}</strong>
            </span>
            {format !== 'pair' && (
              <span className="px-2.5 py-1 rounded-lg bg-neutral-800 text-neutral-200 font-medium">
                Очки: <strong>{STRINGS.scoreModes[scoreMode]}</strong>
              </span>
            )}
          </div>
        </div>

        {/* Content sections */}
        <div className="space-y-4 text-xs text-neutral-300 leading-relaxed">
          {/* Main Idea */}
          <div>
            <h3 className="text-sm font-bold text-white mb-1">Главная цель</h3>
            <p>
              Один игрок команды — <strong>объясняющий</strong> — видит слово и объясняет его вслух своей
              команде, не называя самого слова и однокоренных. Команда выкрикивает версии!
            </p>
          </div>

          {/* Formats */}
          <div>
            <h3 className="text-sm font-bold text-white mb-1.5">{STRINGS.rules.formatsHeading}</h3>
            <ul className="space-y-2">
              <li className={`p-2 rounded-xl ${format === 'pair' ? 'bg-cyan-950/40 border border-cyan-800' : 'bg-neutral-950/40'}`}>
                <span className="font-bold text-cyan-400">Вдвоём (2 игрока):</span>
                <p className="mt-0.5 text-neutral-300">
                  Общая команда против времени и колоды слов. При нажатии «Отмена» слово сразу сгорает без голосования.
                </p>
              </li>
              <li className={`p-2 rounded-xl ${format === 'solo' ? 'bg-purple-950/40 border border-purple-800' : 'bg-neutral-950/40'}`}>
                <span className="font-bold text-purple-400">Каждый сам за себя (3 игрока):</span>
                <p className="mt-0.5 text-neutral-300">
                  У каждого свой личный счёт. После кнопки «Угадали» объясняющий выбирает, кто именно назвал слово первым: очко получают <strong>и объяснивший, и угадавший</strong>!
                </p>
              </li>
              <li className={`p-2 rounded-xl ${format === 'teams' ? 'bg-amber-950/40 border border-amber-800' : 'bg-neutral-950/40'}`}>
                <span className="font-bold text-amber-400">Команды (от 4 игроков):</span>
                <p className="mt-0.5 text-neutral-300">
                  От 2 до 6 цветных команд по 2+ человека. Объясняющие меняются по кругу внутри своей команды.
                </p>
              </li>
            </ul>
          </div>

          {/* Turn Modes */}
          <div>
            <h3 className="text-sm font-bold text-white mb-1.5">{STRINGS.rules.modesHeading}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="p-2.5 rounded-xl bg-neutral-950/50 border border-neutral-800">
                <div className="font-bold text-white">Один шаг</div>
                <div className="text-[11px] text-neutral-400 mt-0.5">
                  1 слово на ход (20 с). Угадали, пропустили или вышло время — ход сразу переходит следующей команде.
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-neutral-950/50 border border-neutral-800">
                <div className="font-bold text-white">Спринт</div>
                <div className="text-[11px] text-neutral-400 mt-0.5">
                  60 с на весь ход. Слова идут потоком: угадали — сразу выпадает следующее, пока тикает таймер хода!
                </div>
              </div>
            </div>
          </div>

          {/* Scoring */}
          <div>
            <h3 className="text-sm font-bold text-white mb-1.5">{STRINGS.rules.scoringHeading}</h3>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong>Мягкий:</strong> +1 очко ходящей команде за угаданное слово. Пропуски и отмены — 0 очков.
                </div>
              </div>
              <div className="flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong>Жёсткий:</strong> +1 очко ходящей за угадывание. Любой пропуск, неуспех по времени или отмена спором даёт <strong>+1 следующей команде по кругу</strong>!
                </div>
              </div>
            </div>
          </div>

          {/* Dispute */}
          <div>
            <h3 className="text-sm font-bold text-white mb-1">{STRINGS.rules.disputeHeading}</h3>
            <p>
              После нажатия «Угадали» у всех есть 5 секунд на кнопку «Отмена». Если нажали — начинается общее
              голосование (12 с). Ничья или отсутствие голосов считается в пользу угадывания.
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-sm tracking-wide transition-colors"
        >
          {STRINGS.rules.close}
        </button>
      </div>
    </div>
  );
};
