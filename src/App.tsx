/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useMemo } from 'react';
import { GuesserCommand, GuesserPlayerView } from './types';
import { MockAdapter } from './api/MockAdapter';
import { FIXTURES, FixtureMeta } from './fixtures';
import { PlatformHeaderStub } from './components/PlatformHeaderStub';
import { VoteResultBanner } from './components/VoteResultBanner';
import { RulesSheet } from './components/RulesSheet';
import { ScreenArchitectureGuide } from './components/ScreenArchitectureGuide';
import { ProposalsModal } from './components/ProposalsModal';
import { DevPanel } from './components/DevPanel';

// Screens
import { LobbyScreen } from './screens/LobbyScreen';
import { SeatingScreen } from './screens/SeatingScreen';
import { WaitingTurnScreen } from './screens/WaitingTurnScreen';
import { ActiveTurnScreen } from './screens/ActiveTurnScreen';
import { DisputeWindowScreen } from './screens/DisputeWindowScreen';
import { VotingScreen } from './screens/VotingScreen';
import { FinishedScreen } from './screens/FinishedScreen';

export default function App() {
  // Initialize mock adapter
  const mockAdapter = useMemo(() => new MockAdapter(6), []);

  // Current view provided by adapter or active fixture
  const [currentView, setCurrentView] = useState<GuesserPlayerView>(() => mockAdapter.getView());
  const [isLiveMock, setIsLiveMock] = useState<boolean>(true);

  // Modals & Panels state
  const [isRulesOpen, setIsRulesOpen] = useState<boolean>(false);
  const [isArchitectureGuideOpen, setIsArchitectureGuideOpen] = useState<boolean>(false);
  const [isProposalsOpen, setIsProposalsOpen] = useState<boolean>(false);

  // Environment & theme state
  const [showPlatformHeader, setShowPlatformHeader] = useState<boolean>(true);
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(true);

  // Subscribe to live mock updates when live mode is active
  useEffect(() => {
    if (!isLiveMock) return;
    const unsubscribe = mockAdapter.subscribe((updatedView) => {
      setCurrentView(updatedView);
    });
    return () => unsubscribe();
  }, [mockAdapter, isLiveMock]);

  // Sync dark class on document element
  useEffect(() => {
    if (isDarkTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkTheme]);

  // Command dispatcher
  const handleSend = (cmd: GuesserCommand) => {
    if (isLiveMock) {
      mockAdapter.send(cmd);
    } else {
      // In fixture mode, forward command to mock adapter and return to live simulation
      mockAdapter.setCustomView(currentView);
      mockAdapter.send(cmd);
      setIsLiveMock(true);
    }
  };

  // Switch to static fixture
  const handleApplyFixture = (fixture: FixtureMeta) => {
    setIsLiveMock(false);
    setCurrentView(fixture.view);
  };

  // Switch back to live mock party
  const handleSwitchToLiveMock = (playerCount?: number) => {
    if (playerCount) {
      mockAdapter.resetParty(playerCount);
    }
    setIsLiveMock(true);
    setCurrentView(mockAdapter.getView());
  };

  return (
    <div
      className={`min-h-screen w-full flex flex-col items-center justify-start transition-colors duration-200 select-none ${
        isDarkTheme ? 'bg-[#0a0a0d] text-neutral-100' : 'bg-neutral-100 text-neutral-900'
      }`}
    >
      {/* Phone container frame: 320px - 430px */}
      <div className="w-full max-w-[430px] min-h-screen flex flex-col relative shadow-2xl bg-neutral-950 border-x border-neutral-900/60 pb-16">
        {/* Top ~56px platform area (stub toggleable in DevPanel) */}
        <PlatformHeaderStub showPlaceholderBar={showPlatformHeader} />

        {/* Temporary Vote Result banner overlay (3s) */}
        <VoteResultBanner voteResult={currentView.voteResult} />

        {/* Phase Screen Routing */}
        <main className="flex-1 flex flex-col w-full">
          {currentView.phase === 'lobby' && (
            <LobbyScreen
              view={currentView}
              send={handleSend}
              onOpenRules={() => setIsRulesOpen(true)}
            />
          )}

          {currentView.phase === 'seating' && (
            <SeatingScreen
              view={currentView}
              send={handleSend}
              onOpenRules={() => setIsRulesOpen(true)}
            />
          )}

          {currentView.phase === 'waiting_turn' && (
            <WaitingTurnScreen
              view={currentView}
              send={handleSend}
              onOpenRules={() => setIsRulesOpen(true)}
            />
          )}

          {currentView.phase === 'active_turn' && (
            <ActiveTurnScreen
              view={currentView}
              send={handleSend}
              onOpenRules={() => setIsRulesOpen(true)}
            />
          )}

          {currentView.phase === 'dispute_window' && (
            <DisputeWindowScreen
              view={currentView}
              send={handleSend}
              onOpenRules={() => setIsRulesOpen(true)}
            />
          )}

          {currentView.phase === 'voting' && (
            <VotingScreen
              view={currentView}
              send={handleSend}
              onOpenRules={() => setIsRulesOpen(true)}
            />
          )}

          {currentView.phase === 'finished' && (
            <FinishedScreen
              view={currentView}
              send={handleSend}
              onOpenRules={() => setIsRulesOpen(true)}
            />
          )}
        </main>

        {/* Rules Sheet Modal */}
        <RulesSheet
          isOpen={isRulesOpen}
          onClose={() => setIsRulesOpen(false)}
          format={currentView.format}
          mode={currentView.mode}
          scoreMode={currentView.scoreMode}
        />

        {/* Screen Architecture Guide Matrix */}
        <ScreenArchitectureGuide
          isOpen={isArchitectureGuideOpen}
          onClose={() => setIsArchitectureGuideOpen(false)}
          onSelectFixture={handleApplyFixture}
          currentView={currentView}
        />

        {/* Proposals Modal (Section 9) */}
        <ProposalsModal
          isOpen={isProposalsOpen}
          onClose={() => setIsProposalsOpen(false)}
        />

        {/* Collapsible DevPanel */}
        <DevPanel
          currentView={currentView}
          mockAdapter={mockAdapter}
          onApplyFixture={handleApplyFixture}
          onSwitchToLiveMock={handleSwitchToLiveMock}
          isLiveMock={isLiveMock}
          showPlatformHeader={showPlatformHeader}
          onTogglePlatformHeader={() => setShowPlatformHeader(!showPlatformHeader)}
          isDarkTheme={isDarkTheme}
          onToggleTheme={() => setIsDarkTheme(!isDarkTheme)}
          onOpenArchitectureGuide={() => setIsArchitectureGuideOpen(true)}
          onOpenProposals={() => setIsProposalsOpen(true)}
        />
      </div>
    </div>
  );
}
