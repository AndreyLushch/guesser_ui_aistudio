/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ChevronLeft, MoreVertical } from 'lucide-react';

interface PlatformHeaderStubProps {
  showPlaceholderBar: boolean;
  isLightMode?: boolean;
}

export const PlatformHeaderStub: React.FC<PlatformHeaderStubProps> = ({
  showPlaceholderBar,
  isLightMode = false,
}) => {
  return (
    <div
      className={`w-full transition-all duration-200 select-none ${
        showPlaceholderBar
          ? isLightMode
            ? 'h-14 bg-white/95 border-b border-neutral-200 px-4 flex items-center justify-between text-neutral-700'
            : 'h-14 bg-neutral-950/90 border-b border-neutral-800 px-4 flex items-center justify-between text-neutral-300'
          : 'h-14'
      }`}
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      {showPlaceholderBar && (
        <>
          <div className="flex items-center gap-1.5 text-[13px] font-bold">
            <ChevronLeft className="w-4 h-4" />
            <span>Назад</span>
          </div>
          <div className="text-[13px] font-mono font-bold tracking-wider uppercase opacity-70 px-2 py-0.5 rounded-md">
            Платформа (56px)
          </div>
          <div className="p-1">
            <MoreVertical className="w-4 h-4 opacity-70" />
          </div>
        </>
      )}
    </div>
  );
};
