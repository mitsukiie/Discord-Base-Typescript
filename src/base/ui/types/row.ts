import type { Button } from './button';
import type { SelectMenu } from './select';

/** Component allowed inside a row. */
export type RowComponent = Button | SelectMenu;

/** Public row descriptor used by `ui.row(...)`. */
export type Row = {
  type: 'row';
  components: readonly RowComponent[];
};
