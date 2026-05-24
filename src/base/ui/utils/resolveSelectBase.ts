import type { SelectBase } from '../types';

type SelectBuilderOptions = Omit<SelectBase, 'id'>;
type SelectBuilderInput = SelectBuilderOptions & { customId: SelectBase['id'] };

/**
 * Resolves select base fields from the public builder overloads.
 *
 * @param customIdOrOpts Custom id or full select options object.
 * @param opts Partial select options when a custom id is passed first.
 * @returns Normalized select base data.
 */
export function resolveSelectBase(
  customId: SelectBase['id'],
  opts?: SelectBuilderOptions,
): SelectBase;
export function resolveSelectBase(opts: SelectBuilderInput): SelectBase;
export function resolveSelectBase(
  customIdOrOpts: SelectBase['id'] | SelectBuilderInput,
  opts: SelectBuilderOptions = {},
): SelectBase {
  if (typeof customIdOrOpts === 'string') {
    return { id: customIdOrOpts, ...opts };
  }

  const { customId, ...select } = customIdOrOpts;
  return { id: customId, ...select };
}
