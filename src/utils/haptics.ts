/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

type HapticType = 'success' | 'warning' | 'light';

export function haptic(type: HapticType): void {
  try {
    // Check Telegram Mini App HapticFeedback
    const tg = (window as unknown as { Telegram?: { WebApp?: { HapticFeedback?: { notificationOccurred: (t: string) => void; impactOccurred: (s: string) => void } } } }).Telegram?.WebApp;
    if (tg?.HapticFeedback) {
      if (type === 'success') {
        tg.HapticFeedback.notificationOccurred('success');
        return;
      }
      if (type === 'warning') {
        tg.HapticFeedback.notificationOccurred('warning');
        return;
      }
      if (type === 'light') {
        tg.HapticFeedback.impactOccurred('light');
        return;
      }
    }

    // Web vibration fallback
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      if (type === 'success') {
        navigator.vibrate([40, 60, 40]);
      } else if (type === 'warning') {
        navigator.vibrate([80, 50, 80]);
      } else {
        navigator.vibrate(25);
      }
    }
  } catch {
    // Ignore in unsupported environments
  }
}
