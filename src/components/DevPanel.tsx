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
  RotateCcw,
  Smartphone,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Users,
  Eye,
  AlertTriangle,
} from 'lucide-react';
import { GuesserPlayerView } from '../types';
import { FIXTURES, FixtureMeta } from '../fixtures';
import { MockAdapter } from '../api/MockAdapter';

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
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

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
          className="mb-2 px-3.5 py-1.5 rounded-full bg-neutral-900/95 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700/80 shadow-2xl flex items-center gap-2 text-xs font-semibold backdrop-blur-md transition-all active:scale-95"
        >
          <Wrench className="w-3.5 h-3.5 text-amber-400" />
          <span>DevPanel</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-neutral-800 text-amber-300 font-mono">
            {isLiveMock ? 'Live Mock' : 'Fixture'}
          </span>
          {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Expanded bottom sheet */}
      {isOpen && (
        <div
          className="pointer-events-auto w-full max-w-lg bg-neutral-950/95 border-t border-neutral-800 rounded-t-3xl p-4 sm:p-5 shadow-2xl backdrop-blur-xl text-neutral-200 space-y-3.5 max-h-[75vh] overflow-y-auto"
          style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))' }}
        >
          {/* Header row */}
          <div className="flex items-center justify-between border-b border-neutral-800/80 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-black uppercase tracking-wider text-neutral-200">
                Панель управления тестированием
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onOpenArchitectureGuide}
                className="px-2.5 py-1 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Карта экранов</span>
              </button>

              <button
                onClick={onOpenProposals}
                className="px-2.5 py-1 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>Предложения</span>
              </button>
            </div>
          </div>

          {/* Mode Switch: Live Mock vs Fixtures */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onSwitchToLiveMock()}
              className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                isLiveMock
                  ? 'bg-amber-400 text-neutral-950 border-amber-300 shadow-sm'
                  : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
              }`}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Живая партия (Мок)</span>
            </button>

            <button
              onClick={() => onApplyFixture(FIXTURES[0])}
              className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                !isLiveMock
                  ? 'bg-amber-400 text-neutral-950 border-amber-300 shadow-sm'
                  : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Режим фикстур (21 вид)</span>
            </button>
          </div>

          {/* Quick Perspective Switcher */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-neutral-400">
              <span className="font-semibold">Точка зрения (глазами кого):</span>
              <span className="font-mono text-[11px] text-amber-400">
                {currentView.me.nickname}{' '}
                {currentView.me.isCurrentSpeaker
                  ? '· Объясняет'
                  : currentView.me.isHost
                  ? '· Ведущий'
                  : ''}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-1.5">
              <button
                onClick={() => handlePerspectiveChange('host')}
                className={`py-1.5 rounded-xl border text-[11px] font-bold transition-all ${
                  currentView.me.isHost
                    ? 'bg-neutral-800 border-amber-500 text-amber-300'
                    : 'bg-neutral-900/80 border-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                Ведущий
              </button>

              <button
                onClick={() => handlePerspectiveChange('speaker')}
                className={`py-1.5 rounded-xl border text-[11px] font-bold transition-all ${
                  currentView.me.isCurrentSpeaker
                    ? 'bg-neutral-800 border-amber-500 text-amber-300'
                    : 'bg-neutral-900/80 border-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                Объясняющий
              </button>

              <button
                onClick={() => handlePerspectiveChange('teammate')}
                className={`py-1.5 rounded-xl border text-[11px] font-bold transition-all ${
                  !currentView.me.isCurrentSpeaker &&
                  currentView.me.teamId === currentView.currentTeamId
                    ? 'bg-neutral-800 border-amber-500 text-amber-300'
                    : 'bg-neutral-900/80 border-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                Своя ком.
              </button>

              <button
                onClick={() => handlePerspectiveChange('opponent')}
                className={`py-1.5 rounded-xl border text-[11px] font-bold transition-all ${
                  currentView.me.teamId !== currentView.currentTeamId
                    ? 'bg-neutral-800 border-amber-500 text-amber-300'
                    : 'bg-neutral-900/80 border-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                Соперник
              </button>
            </div>
          </div>

          {/* Fixture Selector dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs text-neutral-400 font-semibold block">
              Быстрый выбор фикстуры ({FIXTURES.length} вариантов):
            </label>
            <select
              value={FIXTURES.find((f) => f.view.phase === currentView.phase)?.id || ''}
              onChange={(e) => {
                const target = FIXTURES.find((f) => f.id === e.target.value);
                if (target) onApplyFixture(target);
              }}
              className="w-full py-2 px-3 rounded-xl bg-neutral-900 border border-neutral-700 text-xs font-medium text-white focus:outline-hidden focus:border-amber-500"
            >
              {FIXTURES.map((f) => (
                <option key={f.id} value={f.id}>
                  [{f.category}] {f.title}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Party presets */}
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-neutral-800/60">
            <div className="flex items-center gap-1 text-xs text-neutral-400">
              <Users className="w-3.5 h-3.5" />
              <span>Формат:</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onSwitchToLiveMock(2)}
                className="px-2 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-[11px] font-semibold text-cyan-300 border border-cyan-800"
              >
                2 (Pair)
              </button>
              <button
                onClick={() => onSwitchToLiveMock(3)}
                className="px-2 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-[11px] font-semibold text-purple-300 border border-purple-800"
              >
                3 (Solo)
              </button>
              <button
                onClick={() => onSwitchToLiveMock(6)}
                className="px-2 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-[11px] font-semibold text-amber-300 border border-amber-800"
              >
                6 (Teams)
              </button>
              <button
                onClick={() => onSwitchToLiveMock(30)}
                className="px-2 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-[11px] font-semibold text-emerald-300 border border-emerald-800"
              >
                30 (Max)
              </button>
            </div>
          </div>

          {/* Environment Toggles: Platform Header, Theme, Sound */}
          <div className="grid grid-cols-3 gap-2 pt-1 border-t border-neutral-800/60">
            {/* Platform 56px Header Stub Toggle */}
            <button
              onClick={onTogglePlatformHeader}
              className={`py-2 px-2.5 rounded-xl border text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                showPlatformHeader
                  ? 'bg-neutral-800 border-neutral-500 text-white'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Шапка 56px: {showPlatformHeader ? 'Вкл' : 'Выкл'}</span>
            </button>

            {/* Dark/Light Theme Toggle */}
            <button
              onClick={onToggleTheme}
              className={`py-2 px-2.5 rounded-xl border text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                !isDarkTheme
                  ? 'bg-neutral-200 border-neutral-300 text-neutral-900'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              {isDarkTheme ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
              <span>{isDarkTheme ? 'Тёмная' : 'Светлая'}</span>
            </button>

            {/* Offline toggle for active viewer */}
            <button
              onClick={handleToggleOfflineActivePlayer}
              className="py-2 px-2.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-300 text-[11px] font-semibold flex items-center justify-center gap-1.5"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
              <span>Сеть (вкл/выкл)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
