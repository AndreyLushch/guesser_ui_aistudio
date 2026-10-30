/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Wrench,
  ChevronDown,
  ChevronUp,
  Layers,
  Lightbulb,
  Play,
  Smartphone,
  Sun,
  Moon,
  Users,
  AlertTriangle,
  Palette,
} from 'lucide-react';
import { GuesserPlayerView } from '../types';
import { FIXTURES, FixtureMeta } from '../fixtures';
import { MockAdapter } from '../api/MockAdapter';
import { VisualStyle } from '../theme/tokens';

interface DevPanelProps {
  currentView: GuesserPlayerView;
  mockAdapter: MockAdapter;
  onApplyFixture: (fixture: FixtureMeta) => void;
  onSwitchToLiveMock: (playerCount?: number) => void;
  isLiveMock: boolean;
  showPlatformHeader: boolean;
  onTogglePlatformHeader: () => void;
  isDarkTheme: boolean;
  onToggleTheme: () => void;
  onOpenArchitectureGuide: () => void;
  onOpenProposals: () => void;
  visualStyle: VisualStyle;
  onSelectVisualStyle: (style: VisualStyle) => void;
}

export const DevPanel: React.FC<DevPanelProps> = ({
  currentView,
  mockAdapter,
  onApplyFixture,
  onSwitchToLiveMock,
  isLiveMock,
  showPlatformHeader,
  onTogglePlatformHeader,
  isDarkTheme,
  onToggleTheme,
  onOpenArchitectureGuide,
  onOpenProposals,
  visualStyle,
  onSelectVisualStyle,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Switch perspective in live mock
  const handlePerspectiveChange = (perspective: 'host' | 'speaker' | 'teammate' | 'opponent') => {
    if (perspective === 'host') {
      const host = currentView.players.find((p) => p.isHost) || currentView.players[0];
      mockAdapter.setActiveViewer(host.id);
    } else if (perspective === 'speaker') {
      if (currentView.currentSpeakerId) {
        mockAdapter.setActiveViewer(currentView.currentSpeakerId);
      } else {
        mockAdapter.setActiveViewer(currentView.players[0].id);
      }
    } else if (perspective === 'teammate') {
      const teammate = currentView.players.find(
        (p) => p.teamId === currentView.currentTeamId && p.id !== currentView.currentSpeakerId
      );
      if (teammate) mockAdapter.setActiveViewer(teammate.id);
    } else if (perspective === 'opponent') {
      const opponent = currentView.players.find(
        (p) => p.teamId !== currentView.currentTeamId
      );
      if (opponent) mockAdapter.setActiveViewer(opponent.id);
    }
  };

  const handleToggleOfflineActivePlayer = () => {
    const isOffline = !currentView.me ? false : currentView.players.find(p => p.id === currentView.me.playerId)?.isOffline;
    mockAdapter.setPlayerOffline(currentView.me.playerId, !isOffline);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 flex flex-col items-center pointer-events-none">
      {/* Minimized bar toggle */}
      <div className="pointer-events-auto">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="mb-2 px-4 py-2 rounded-full bg-neutral-900/95 hover:bg-neutral-800 text-white border border-neutral-700/80 shadow-2xl flex items-center gap-2 text-[13px] font-bold backdrop-blur-md transition-all active:scale-95 cursor-pointer"
        >
          <Wrench className="w-4 h-4 text-rose-400" />
          <span>DevPanel</span>
          <span className="text-[13px] px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 font-mono font-bold">
            {isLiveMock ? 'Live Mock' : 'Fixture'}
          </span>
          {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
      </div>

      {/* Expanded bottom sheet */}
      {isOpen && (
        <div
          className="pointer-events-auto w-full max-w-lg bg-neutral-950/95 dark:bg-neutral-950/95 border-t border-neutral-800 rounded-t-3xl p-4 sm:p-5 shadow-2xl backdrop-blur-xl text-neutral-100 space-y-3.5 max-h-[75vh] overflow-y-auto"
          style={{ paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))' }}
        >
          {/* Header row */}
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[13px] font-black uppercase tracking-wider text-white">
                Панель тестирования
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onOpenArchitectureGuide}
                className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-[13px] font-black flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Layers className="w-4 h-4" />
                <span>Карта экранов</span>
              </button>

              <button
                onClick={onOpenProposals}
                className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-[13px] font-black flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Lightbulb className="w-4 h-4" />
                <span>Предложения</span>
              </button>
            </div>
          </div>

          {/* Requirement 1: 3 Visual Styles Switcher */}
          <div className="space-y-1.5 p-3 rounded-2xl bg-neutral-900 border border-neutral-800">
            <div className="flex items-center gap-1.5 text-[13px] font-black text-rose-400">
              <Palette className="w-4 h-4" />
              <span>Стиль оформления (3 варианта):</span>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-1">
              <button
                onClick={() => onSelectVisualStyle('fiesta')}
                className={`py-2 px-2 rounded-xl text-[13px] font-black border transition-all cursor-pointer ${
                  visualStyle === 'fiesta'
                    ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white border-white shadow-md'
                    : 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:text-white'
                }`}
              >
                🎉 Fiesta
              </button>
              <button
                onClick={() => onSelectVisualStyle('arcade')}
                className={`py-2 px-2 rounded-xl text-[13px] font-black border-2 transition-all cursor-pointer ${
                  visualStyle === 'arcade'
                    ? 'bg-amber-400 text-neutral-950 border-white shadow-[2px_2px_0px_#FFFFFF]'
                    : 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:text-white'
                }`}
              >
                🕹️ Arcade
              </button>
              <button
                onClick={() => onSelectVisualStyle('glass')}
                className={`py-2 px-2 rounded-xl text-[13px] font-black border transition-all cursor-pointer ${
                  visualStyle === 'glass'
                    ? 'bg-white/20 backdrop-blur-md text-white border-cyan-400 shadow-md'
                    : 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:text-white'
                }`}
              >
                ✨ Glass
              </button>
            </div>
          </div>

          {/* Mode Switch: Live Mock vs Fixtures */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onSwitchToLiveMock()}
              className={`py-2.5 px-3 rounded-xl border text-[13px] font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isLiveMock
                  ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white border-rose-400 shadow-md'
                  : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
              }`}
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Живая партия (Мок)</span>
            </button>

            <button
              onClick={() => onApplyFixture(FIXTURES[0])}
              className={`py-2.5 px-3 rounded-xl border text-[13px] font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                !isLiveMock
                  ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white border-rose-400 shadow-md'
                  : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Режим фикстур ({FIXTURES.length})</span>
            </button>
          </div>

          {/* Quick Perspective Switcher */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[13px] text-neutral-400">
              <span className="font-bold">Точка зрения (глазами кого):</span>
              <span className="font-mono text-[13px] text-rose-400 font-bold truncate max-w-[190px]">
                {currentView.me.nickname}{' '}
                {currentView.me.isCurrentSpeaker
                  ? '· Объясняет'
                  : currentView.me.isHost
                  ? '· Ведущий'
                  : ''}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => handlePerspectiveChange('host')}
                className={`py-2 rounded-xl border text-[13px] font-bold transition-all cursor-pointer ${
                  currentView.me.isHost
                    ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                Ведущий
              </button>

              <button
                onClick={() => handlePerspectiveChange('speaker')}
                className={`py-2 rounded-xl border text-[13px] font-bold transition-all cursor-pointer ${
                  currentView.me.isCurrentSpeaker
                    ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                Объясняющий
              </button>

              <button
                onClick={() => handlePerspectiveChange('teammate')}
                className={`py-2 rounded-xl border text-[13px] font-bold transition-all cursor-pointer ${
                  !currentView.me.isCurrentSpeaker &&
                  currentView.me.teamId === currentView.currentTeamId
                    ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                Своя ком.
              </button>

              <button
                onClick={() => handlePerspectiveChange('opponent')}
                className={`py-2 rounded-xl border text-[13px] font-bold transition-all cursor-pointer ${
                  currentView.me.teamId !== currentView.currentTeamId
                    ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                Соперник
              </button>
            </div>
          </div>

          {/* Fixture Selector dropdown */}
          <div className="space-y-1.5">
            <label className="text-[13px] text-neutral-300 font-bold block">
              Быстрый выбор фикстуры ({FIXTURES.length} вариантов):
            </label>
            <select
              value={FIXTURES.find((f) => f.view.phase === currentView.phase)?.id || ''}
              onChange={(e) => {
                const target = FIXTURES.find((f) => f.id === e.target.value);
                if (target) onApplyFixture(target);
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-neutral-900 border border-neutral-700 text-[13px] font-bold text-white focus:outline-hidden focus:border-rose-500"
            >
              {FIXTURES.map((f) => (
                <option key={f.id} value={f.id}>
                  [{f.category}] {f.title}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Party presets */}
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-neutral-800">
            <div className="flex items-center gap-1 text-[13px] text-neutral-400 font-bold">
              <Users className="w-4 h-4" />
              <span>Формат:</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onSwitchToLiveMock(2)}
                className="px-2.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-[13px] font-bold text-cyan-300 border border-cyan-800 cursor-pointer"
              >
                2 (Pair)
              </button>
              <button
                onClick={() => onSwitchToLiveMock(3)}
                className="px-2.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-[13px] font-bold text-purple-300 border border-purple-800 cursor-pointer"
              >
                3 (Solo)
              </button>
              <button
                onClick={() => onSwitchToLiveMock(6)}
                className="px-2.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-[13px] font-bold text-amber-300 border border-amber-800 cursor-pointer"
              >
                6 (Teams)
              </button>
              <button
                onClick={() => onSwitchToLiveMock(30)}
                className="px-2.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-[13px] font-bold text-emerald-300 border border-emerald-800 cursor-pointer"
              >
                30 (Max)
              </button>
            </div>
          </div>

          {/* Environment Toggles: Platform Header, Theme, Sound */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-neutral-800">
            {/* Platform 56px Header Stub Toggle */}
            <button
              onClick={onTogglePlatformHeader}
              className={`py-2 px-2.5 rounded-xl border text-[13px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                showPlatformHeader
                  ? 'bg-neutral-800 border-neutral-500 text-white'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Шапка: {showPlatformHeader ? 'Вкл' : 'Выкл'}</span>
            </button>

            {/* Dark/Light Theme Toggle */}
            <button
              onClick={onToggleTheme}
              className={`py-2 px-2.5 rounded-xl border text-[13px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                !isDarkTheme
                  ? 'bg-neutral-100 border-neutral-300 text-neutral-950 font-black'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              {isDarkTheme ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-500" />}
              <span>{isDarkTheme ? 'Тёмная' : 'Светлая'}</span>
            </button>

            {/* Offline toggle for active viewer */}
            <button
              onClick={handleToggleOfflineActivePlayer}
              className="py-2 px-2.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-300 text-[13px] font-bold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>Сеть</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
