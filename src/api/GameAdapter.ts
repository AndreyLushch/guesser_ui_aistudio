/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GuesserCommand, GuesserPlayerView } from '../types';

export interface GameAdapter {
  getView(): GuesserPlayerView;
  subscribe(cb: (view: GuesserPlayerView) => void): () => void;
  send(cmd: GuesserCommand): void;
}
