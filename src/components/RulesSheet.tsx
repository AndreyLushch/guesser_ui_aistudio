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
  isLightMode?: boolean;
}

export const RulesSheet: React.FC<RulesSheetProps> = ({
  isOpen,
  onClose,
  format = 'teams',
  mode = 'step',
  scoreMode = 'soft',
  isLightMode = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`w-full max-w-lg max-h-[85vh] border rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 overflow-y-auto shadow-2xl flex flex-col space-y-4 ${
          isLightMode
            ? 'bg-white text-neutral-900 border-slate-300'
            : 'bg-neutral-900 text-neutral-100 border-neutral-800'
        }`}
        style={{ paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-rose-500/15 text-rose-500">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black">{STRINGS.rules.title}</h2>
              <p className="text-[13px] text-neutral-500 dark:text-neutral-400">Краткий справочник правил</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
            aria-label="Закрыть правила"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current match badges */}
        <div className="bg-slate-100 dark:bg-neutral-950/80 rounded-2xl p-3.5 border border-slate-200 dark:border-neutral-800 space-y-2">
          <div className="text-[13px] font-black text-rose-500 uppercase tracking-wider">
            Текущие настройки партии
          </div>
          <div className="flex flex-wrap gap-2 text-[13px]">
            <span className="px-3 py-1 rounded-xl bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-bold border border-neutral-200 dark:border-neutral-700 shadow-xs">
              Формат: <strong>{STRINGS.formats[format]}</strong>
            </span>
            <span className="px-3 py-1 rounded-xl bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-bold border border-neutral-200 dark:border-neutral-700 shadow-xs">
              Режим: <strong>{STRINGS.modes[mode]}</strong>
            </span>
            {format !== 'pair' && (
              <span className="px-3 py-1 rounded-xl bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-bold border border-neutral-200 dark:border-neutral-700 shadow-xs">
                Очки: <strong>{STRINGS.scoreModes[scoreMode]}</strong>
              </span>
            )}
          </div>
        </div>

        {/* Content sections */}
        <div className="space-y-4 text-sm leading-relaxed">
          {/* Main Idea */}
          <div>
            <h3 className="text-base font-black mb-1">Главная цель</h3>
            <p className="text-neutral-700 dark:text-neutral-300">
              Один игрок команды — <strong>объясняющий</strong> — видит слово и объясняет его вслух своей
              команде, не называя самого слова и однокоренных. Команда выкрикивает версии!
            </p>
          </div>

          {/* Formats */}
          <div>
            <h3 className="text-base font-black mb-2">{STRINGS.rules.formatsHeading}</h3>
            <ul className="space-y-2.5">
              <li className={`p-3 rounded-2xl border ${format === 'pair' ? 'bg-cyan-50 dark:bg-cyan-950/40 border-cyan-400' : 'bg-slate-50 dark:bg-neutral-950/40 border-slate-200 dark:border-neutral-800'}`}>
                <span className="font-black text-cyan-600 dark:text-cyan-400">Вдвоём (2 игрока):</span>
                <p className="mt-1 text-[13px] text-neutral-700 dark:text-neutral-300">
                  Общая команда против времени и колоды слов. При нажатии «Отмена» слово сразу сгорает без голосования.
                </p>
              </li>
              <li className={`p-3 rounded-2xl border ${format === 'solo' ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-400' : 'bg-slate-50 dark:bg-neutral-950/40 border-slate-200 dark:border-neutral-800'}`}>
                <span className="font-black text-purple-600 dark:text-purple-400">Каждый сам за себя (3 игрока):</span>
                <p className="mt-1 text-[13px] text-neutral-700 dark:text-neutral-300">
                  У каждого свой личный счёт. После кнопки «Угадали» объясняющий выбирает, кто именно назвал слово первым: очко получают <strong>и объяснивший, и угадавший</strong>!
                </p>
              </li>
              <li className={`p-3 rounded-2xl border ${format === 'teams' ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-400' : 'bg-slate-50 dark:bg-neutral-950/40 border-slate-200 dark:border-neutral-800'}`}>
                <span className="font-black text-rose-600 dark:text-rose-400">Команды (от 4 игроков):</span>
                <p className="mt-1 text-[13px] text-neutral-700 dark:text-neutral-300">
                  От 2 до 6 цветных команд по 2+ человека. Объясняющие меняются по кругу внутри своей команды.
                </p>
              </li>
            </ul>
          </div>

          {/* Turn Modes */}
          <div>
            <h3 className="text-base font-black mb-2">{STRINGS.rules.modesHeading}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-neutral-950/60 border border-slate-200 dark:border-neutral-800">
                <div className="font-black">Один шаг</div>
                <div className="text-[13px] text-neutral-600 dark:text-neutral-400 mt-1 leading-snug">
                  1 слово на ход (20 с). Угадали, пропустили или вышло время — ход сразу переходит следующей команде.
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-neutral-950/60 border border-slate-200 dark:border-neutral-800">
                <div className="font-black">Спринт</div>
                <div className="text-[13px] text-neutral-600 dark:text-neutral-400 mt-1 leading-snug">
                  60 с на весь ход. Слова идут потоком: угадали — сразу выпадает следующее, пока тикает таймер хода!
                </div>
              </div>
            </div>
          </div>

          {/* Scoring */}
          <div>
            <h3 className="text-base font-black mb-2">{STRINGS.rules.scoringHeading}</h3>
            <div className="space-y-2">
              <div className="flex items-start gap-2.5 p-2 rounded-xl">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div className="text-[13px]">
                  <strong>Мягкий:</strong> +1 очко ходящей команде за угаданное слово. Пропуски и отмены — 0 очков.
                </div>
              </div>
              <div className="flex items-start gap-2.5 p-2 rounded-xl">
                <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div className="text-[13px]">
                  <strong>Жёсткий:</strong> +1 очко ходящей за угадывание. Любой пропуск, неуспех по времени или отмена спором даёт <strong>+1 следующей команде по кругу</strong>!
                </div>
              </div>
            </div>
          </div>

          {/* Dispute */}
          <div>
            <h3 className="text-base font-black mb-1">{STRINGS.rules.disputeHeading}</h3>
            <p className="text-[13px] text-neutral-700 dark:text-neutral-300">
              После нажатия «Угадали» у всех есть 5 секунд на кнопку «Отмена». Если нажали — начинается общее
              голосование (12 с). Ничья или отсутствие голосов считается в пользу угадывания.
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-black text-base tracking-wide shadow-lg cursor-pointer transition-all"
        >
          {STRINGS.rules.close}
        </button>
      </div>
    </div>
  );
};
