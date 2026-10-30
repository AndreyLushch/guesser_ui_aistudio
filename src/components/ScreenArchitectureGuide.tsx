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
  isLightMode?: boolean;
}

export const ScreenArchitectureGuide: React.FC<ScreenArchitectureGuideProps> = ({
  isOpen,
  onClose,
  onSelectFixture,
  currentView,
  isLightMode = false,
}) => {
  if (!isOpen) return null;

  const categories = ['Phases', 'Perspectives', 'Formats', 'Modes', 'Edge Cases'] as const;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`w-full max-w-2xl max-h-[90vh] rounded-3xl p-5 sm:p-6 overflow-y-auto shadow-2xl flex flex-col space-y-4 border ${
          isLightMode
            ? 'bg-white border-neutral-200 text-neutral-900'
            : 'bg-neutral-900 border-neutral-800 text-neutral-100'
        }`}
        style={{ paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))' }}
      >
        {/* Header */}
        <div className={`flex items-center justify-between border-b pb-3 ${isLightMode ? 'border-neutral-200' : 'border-neutral-800'}`}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-500">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Screen Architecture Guide</h2>
              <p className={`text-[13px] ${isLightMode ? 'text-neutral-600' : 'text-neutral-400'}`}>
                Карта экранов игры «Угадайка» (Фаза × Точка зрения)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-full transition-colors ${
              isLightMode ? 'hover:bg-neutral-100 text-neutral-500 hover:text-black' : 'hover:bg-neutral-800 text-neutral-400 hover:text-white'
            }`}
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
                  <h3 className="text-[13px] font-black uppercase tracking-wider text-amber-500">
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
                  <span className={`text-[13px] font-mono ${isLightMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
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
                        className={`p-3.5 rounded-2xl border text-left transition-all group flex flex-col justify-between ${
                          isCurrent
                            ? isLightMode
                              ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-500/30'
                              : 'bg-amber-950/40 border-amber-500 ring-1 ring-amber-500/40'
                            : isLightMode
                            ? 'bg-neutral-50 border-neutral-200 hover:border-amber-400 hover:bg-neutral-100/70'
                            : 'bg-neutral-950/60 border-neutral-800/80 hover:border-neutral-700 hover:bg-neutral-800/50'
                        }`}
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[14px] font-bold group-hover:text-amber-500 transition-colors">
                              {fix.title}
                            </span>
                            <span className={`px-2 py-0.5 rounded-md text-[13px] font-mono shrink-0 border ${
                              isLightMode ? 'bg-white border-neutral-300 text-neutral-600' : 'bg-neutral-900 border-neutral-800 text-neutral-300'
                            }`}>
                              {fix.view.phase}
                            </span>
                          </div>
                          <p className={`text-[13px] leading-snug ${isLightMode ? 'text-neutral-600' : 'text-neutral-400'}`}>
                            {fix.description}
                          </p>
                        </div>

                        <div className={`mt-3 pt-2.5 border-t flex items-center justify-between text-[13px] ${
                          isLightMode ? 'border-neutral-200 text-neutral-600' : 'border-neutral-800 text-neutral-400'
                        }`}>
                          <span className="flex items-center gap-1.5 font-medium">
                            <Smartphone className="w-3.5 h-3.5" />
                            <span>
                              {fix.view.me.isCurrentSpeaker
                                ? 'Объясняющий'
                                : fix.view.me.isHost
                                ? 'Ведущий'
                                : 'Слушатель'}
                            </span>
                          </span>
                          <span className="flex items-center gap-1 font-bold text-amber-500">
                            <Eye className="w-3.5 h-3.5" />
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
