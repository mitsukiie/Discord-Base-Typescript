import {
  ChannelSelectMenuBuilder,
  MentionableSelectMenuBuilder,
  RoleSelectMenuBuilder,
  StringSelectMenuBuilder,
  UserSelectMenuBuilder,
} from 'discord.js';

import type {
  ChannelSelect,
  SelectBase,
  SelectMenu,
  StringSelect,
  StringSelectOption,
} from '../types';
import { applySelectBase } from '../utils';
import { validateSelect } from '../validators';

function baseSelect<
  TBuilder extends {
    setCustomId(id: string): TBuilder;
    setPlaceholder(placeholder: string): TBuilder;
    setMinValues(minValues: number): TBuilder;
    setMaxValues(maxValues: number): TBuilder;
    setDisabled(disabled?: boolean): TBuilder;
  },
>(type: SelectMenu['type'], select: SelectBase, builder: TBuilder) {
  validateSelect({ type, ...select } as SelectMenu);
  return applySelectBase(builder, select);
}

function withChannelTypes(
  builder: ChannelSelectMenuBuilder,
  channelTypes?: readonly import('discord.js').ChannelType[],
) {
  if (channelTypes?.length) builder.setChannelTypes(...channelTypes);
  return builder;
}

function toStringOptions(select: StringSelect) {
  return select.options.map((option: StringSelectOption) => ({
    label: option.label,
    value: option.value,
    description: option.description,
    default: option.default,
  }));
}

/**
 * Creates a Discord user select builder from a public descriptor.
 *
 * @param select User select descriptor.
 * @returns Discord user select builder.
 */
export function normalizeUserSelect(select: SelectBase) {
  return baseSelect('select.user', select, new UserSelectMenuBuilder());
}

/**
 * Creates a Discord role select builder from a public descriptor.
 *
 * @param select Role select descriptor.
 * @returns Discord role select builder.
 */
export function normalizeRoleSelect(select: SelectBase) {
  return baseSelect('select.role', select, new RoleSelectMenuBuilder());
}

/**
 * Creates a Discord mentionable select builder from a public descriptor.
 *
 * @param select Mentionable select descriptor.
 * @returns Discord mentionable select builder.
 */
export function normalizeMentionableSelect(select: SelectBase) {
  return baseSelect('select.mentionable', select, new MentionableSelectMenuBuilder());
}

/**
 * Creates a Discord channel select builder from a public descriptor.
 *
 * @param select Channel select descriptor.
 * @returns Discord channel select builder.
 */
export function normalizeChannelSelect(select: ChannelSelect) {
  validateSelect(select);
  return applySelectBase(
    withChannelTypes(new ChannelSelectMenuBuilder(), select.channelTypes),
    select,
  );
}

/**
 * Creates a Discord string select builder from a public descriptor.
 *
 * @param select String select descriptor.
 * @returns Discord string select builder.
 */
export function normalizeStringSelect(select: StringSelect) {
  validateSelect(select);

  const builder = applySelectBase(new StringSelectMenuBuilder(), select);
  builder.setOptions(...toStringOptions(select));

  return builder;
}

/**
 * Creates the matching Discord select builder for a public select descriptor.
 *
 * @param select Select descriptor.
 * @returns Discord select builder.
 */
export function normalizeSelect(select: SelectMenu) {
  switch (select.type) {
    case 'select.user':
      return normalizeUserSelect(select);

    case 'select.role':
      return normalizeRoleSelect(select);

    case 'select.mentionable':
      return normalizeMentionableSelect(select);

    case 'select.channel':
      return normalizeChannelSelect(select);

    case 'select.string':
      return normalizeStringSelect(select);

    default:
      throw new Error('Unknown select type');
  }
}
