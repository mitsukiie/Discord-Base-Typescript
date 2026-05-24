import { RENDERED } from '../constants';

import type { DisplayComponent } from './container';

/** Rendered display components with internal metadata. */
export type RenderedComponents = readonly DisplayComponent[] & {
  readonly [RENDERED]: true;
};
