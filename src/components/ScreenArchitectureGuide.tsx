/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Layers, Smartphone, Eye } from 'lucide-react';
import { FIXTURES, FixtureMeta } from '../fixtures';
import { GuesserPlayerView } from '../types';

interface ScreenArchitectureGuideProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFixture: (fixture: FixtureMeta) => void;
  currentView: GuesserPlayerView;
}

export const ScreenArchitectureGuide: React.FC<ScreenArchitectureGuideProps> = ({
  isOpen,
  onClose,
  onSelectFixture,
  currentView,
}) => {
  if (!isOpen) return null;

  const categories = ['Phases', 'Perspectives', 'Formats', 'Modes', 'Edge Cases'] as const;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl max-h-[90vh] bg-neutral-900 border border-neutral-800 rounded-3xl p-5 sm:p-6 overflow-y-auto shadow-2xl flex flex-col space-y-4 text-neutral-100"
        style={{ paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Screen Architecture Guide</h2>
              <p className="text-xs text-neutral-400">
                Карта экранов игры «Угадайка» (Фаза × Точка зрения)
              </p>
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

        {/* Matrix grid grouped by category */}
        <div className="space-y-6">
          {categories.map((cat) => {
            const catFixtures = FIXTURES.filter((f) => f.category === cat);
            if (catFixtures.length === 0) return null;

            return (
              <div key={cat} className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-wider text-amber-400">
                    {cat === 'Phases'
                      ? '1. Основные фазы партии'
                      : cat === 'Perspectives'
                      ? '2. Точки зрения игроков'
                      : cat === 'Formats'
                      ? '3. Форматы (Команды / Solo / Pair)'
                      : cat === 'Modes'
                      ? '4. Режимы (Шаг / Спринт)'
                      : '5. Крайние случаи и граничные условия'}
                  </h3>
                  <span className="text-[11px] font-mono text-neutral-500">
                    {catFixtures.length} экранов
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {catFixtures.map((fix) => {
                    const isCurrent =
                      currentView.phase === fix.view.phase &&
                      currentView.me.isCurrentSpeaker === fix.view.me.isCurrentSpeaker &&
                      currentView.me.isHost === fix.view.me.isHost;

                    return (
                      <button
                        key={fix.id}
                        onClick={() => {
                          onSelectFixture(fix);
                          onClose();
                        }}
                        className={`p-3 rounded-2xl border text-left transition-all group flex flex-col justify-between ${
                          isCurrent
                            ? 'bg-amber-950/30 border-amber-500/80 ring-1 ring-amber-500/40'
                            : 'bg-neutral-950/60 border-neutral-800/80 hover:border-neutral-700 hover:bg-neutral-800/50'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                              {fix.title}
                            </span>
                            <span className="px-1.5 py-0.5 rounded-md text-[10px] font-mono bg-neutral-900 border border-neutral-800 text-neutral-400">
                              {fix.view.phase}
                            </span>
                          </div>
                          <p className="text-[11px] text-neutral-400 leading-snug">
                            {fix.description}
                          </p>
                        </div>

                        <div className="mt-2.5 pt-2 border-t border-neutral-800/60 flex items-center justify-between text-[10px] text-neutral-500">
                          <span className="flex items-center gap-1">
                            <Smartphone className="w-3 h-3 text-neutral-400" />
                            <span>
                              {fix.view.me.isCurrentSpeaker
                                ? 'Объясняющий'
                                : fix.view.me.isHost
                                ? 'Ведущий'
                                : 'Слушатель'}
                            </span>
                          </span>
                          <span className="flex items-center gap-1 font-semibold text-neutral-300 group-hover:text-amber-400">
                            <Eye className="w-3 h-3" />
                            <span>Открыть</span>
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
