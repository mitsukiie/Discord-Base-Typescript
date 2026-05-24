/**
 * Applies shared select fields to a Discord builder.
 *
 * @param builder Target builder.
 * @param select Normalized select descriptor.
 * @returns The same builder instance for chaining.
 */
export function applySelectBase<
  T extends {
    setCustomId(id: string): T;
    setPlaceholder(placeholder: string): T;
    setMinValues(minValues: number): T;
    setMaxValues(maxValues: number): T;
    setDisabled(disabled?: boolean): T;
  },
>(
  builder: T,
  select: {
    id: string;
    placeholder?: string;
    minValues?: number;
    maxValues?: number;
    disabled?: boolean;
  },
) {
  builder.setCustomId(select.id);

  if (select.placeholder) builder.setPlaceholder(select.placeholder);
  if (typeof select.minValues === 'number') builder.setMinValues(select.minValues);
  if (typeof select.maxValues === 'number') builder.setMaxValues(select.maxValues);
  if (typeof select.disabled === 'boolean') builder.setDisabled(select.disabled);

  return builder;
}
