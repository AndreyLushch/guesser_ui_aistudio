/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ChevronLeft, MoreVertical } from 'lucide-react';

interface PlatformHeaderStubProps {
  showPlaceholderBar: boolean;
}

export const PlatformHeaderStub: React.FC<PlatformHeaderStubProps> = ({ showPlaceholderBar }) => {
  return (
    <div
      className={`w-full transition-all duration-200 select-none ${
        showPlaceholderBar
          ? 'h-14 bg-neutral-900/90 border-b border-neutral-800/80 px-4 flex items-center justify-between text-neutral-400'
          : 'h-14'
      }`}
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      {showPlaceholderBar && (
        <>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-300">
            <ChevronLeft className="w-4 h-4" />
            <span>Назад</span>
          </div>
          <div className="text-[11px] font-mono tracking-wider uppercase text-neutral-500 bg-neutral-800/60 px-2 py-0.5 rounded-sm">
            Платформа (56px)
          </div>
          <div className="p-1">
            <MoreVertical className="w-4 h-4 text-neutral-400" />
          </div>
        </>
      )}
    </div>
  );
};
