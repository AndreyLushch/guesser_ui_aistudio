/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Lightbulb, ListChecks, Flame, Sparkles, StopCircle, Volume2 } from 'lucide-react';

interface ProposalsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PROPOSALS = [
  {
    id: 'turn-summary-screen',
    title: '1. Экран «Итог хода» (Turn Recap Screen)',
    icon: ListChecks,
    why: 'По правилам спринта игрок успевает объяснить 3–8 слов. Команде и столу очень важно увидеть полный список слов хода с бейджами (угадано / пропуск / отменено) и итоговое «+N очков».',
    contractChanges: {
      viewField: 'turnSummary?: { words: Array<{ text: string; status: "guessed" | "skipped" | "disputed" }>; scoreDelta: number; nextTeamName: string }',
      command: 'ACK_TURN_SUMMARY or auto-dismiss in 6s',
    },
  },
  {
    id: 'challenge-word-tags',
    title: '2. Челленджи и сложность слов (Word Challenges)',
    icon: Flame,
    why: 'Слова разной сложности (1, 2, 3 очка) или спец-условия («объяснять только глаголами», «без жестов», «спиной к команде»). Делает партию в разы веселее на корпоративах.',
    contractChanges: {
      viewField: 'currentTask?: { id: string; text: string; difficulty?: 1 | 2 | 3; challengeText?: string; bonusPoints?: number }',
      command: 'none (server provides tags in task)',
    },
  },
  {
    id: 'topic-deck-selector',
    title: '3. Выбор темы колоды в лобби (Deck Theme Selector)',
    icon: Sparkles,
    why: 'Возможность играть разными наборами: «Кино и сериалы», «ИТ и мемы», «Для детей», «18+», «Классический Алиас».',
    contractChanges: {
      viewField: 'availableDecks?: Array<{ id: string; name: string; wordsCount: number }>; selectedDeckId?: string',
      command: 'SELECT_DECK: { deckId: string } in lobby',
    },
  },
  {
    id: 'host-emergency-stop',
    title: '4. Досрочное завершение партии ведущим (Host Early Finish)',
    icon: StopCircle,
    why: 'Если компании нужно срочно прервать игру или кто-то уходит, ведущий должен иметь возможность подвести итоги на текущем счёте без сбоя.',
    contractChanges: {
      viewField: 'canEndGameEarly: boolean (only when me.isHost)',
      command: 'END_GAME_EARLY: {}',
    },
  },
  {
    id: 'web-audio-soundscape',
    title: '5. Опциональные звуковые эффекты (Web Audio Synthesizer)',
    icon: Volume2,
    why: 'Лёгкие синтезированные щелчки таймера последних секунд, звон победы на табло и звук гонга смены хода с тумблером вкл/выкл.',
    contractChanges: {
      viewField: 'none (client side audio option in user settings)',
      command: 'none',
    },
  },
];

export const ProposalsModal: React.FC<ProposalsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl max-h-[88vh] bg-neutral-900 border border-neutral-800 rounded-3xl p-5 sm:p-6 overflow-y-auto shadow-2xl flex flex-col space-y-4 text-neutral-100"
        style={{ paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Предложения сверх контракта</h2>
              <p className="text-xs text-neutral-400">Идеи расширения механики и данных (Раздел 9 ТЗ)</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
            aria-label="Закрыть"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Proposals list */}
        <div className="space-y-4 text-xs">
          {PROPOSALS.map((prop) => {
            const Icon = prop.icon;
            return (
              <div
                key={prop.id}
                className="p-4 rounded-2xl bg-neutral-950/70 border border-neutral-800 space-y-2"
              >
                <div className="flex items-center gap-2 text-sm font-bold text-amber-400">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{prop.title}</span>
                </div>

                <p className="text-neutral-300 leading-relaxed">{prop.why}</p>

                <div className="pt-1.5 space-y-1 font-mono text-[11px] bg-neutral-900 p-2.5 rounded-xl border border-neutral-800/80 text-neutral-400">
                  <div>
                    <strong className="text-neutral-300">Поле вида:</strong>{' '}
                    <span className="text-emerald-400">{prop.contractChanges.viewField}</span>
                  </div>
                  <div>
                    <strong className="text-neutral-300">Команда:</strong>{' '}
                    <span className="text-cyan-400">{prop.contractChanges.command}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
