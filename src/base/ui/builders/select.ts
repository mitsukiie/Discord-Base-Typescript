import type { ChannelType } from 'discord.js';

import type {
  ChannelSelect,
  MentionableSelect,
  RoleSelect,
  SelectBase,
  StringSelect,
  StringSelectOption,
  UserSelect,
} from '../types';
import { resolveSelectBase } from '../utils';

type SelectOpts = Omit<SelectBase, 'id'>;
type SelectInput = SelectOpts & { customId: SelectBase['id'] };
type ChannelSelectInput = SelectInput & {
  channelTypes?: readonly ChannelType[];
};
type StringSelectInput = SelectInput & {
  options: readonly StringSelectOption[];
};

function mkSelect<TType extends string>(
  type: TType,
  input: SelectBase['id'] | SelectInput,
  opts?: SelectOpts,
) {
  const select =
    typeof input === 'string' ? resolveSelectBase(input, opts) : resolveSelectBase(input);

  return {
    type,
    ...select,
  } as SimpleSelect<TType & SimpleSelectType>;
}

type SimpleSelectType =
  | UserSelect['type']
  | RoleSelect['type']
  | MentionableSelect['type'];
type SimpleSelect<TType extends SimpleSelectType> = Extract<
  import('../types').SelectMenu,
  { type: TType }
>;
type SimpleSelectBuilder<TType extends SimpleSelectType> = {
  (customId: SelectBase['id'], opts?: SelectOpts): SimpleSelect<TType>;
  (opts: SelectInput): SimpleSelect<TType>;
};

function mkSimpleBuilder<TType extends SimpleSelectType>(
  type: TType,
): SimpleSelectBuilder<TType> {
  function build(customId: SelectBase['id'], opts?: SelectOpts): SimpleSelect<TType>;
  function build(opts: SelectInput): SimpleSelect<TType>;
  function build(
    input: SelectBase['id'] | SelectInput,
    opts?: SelectOpts,
  ): SimpleSelect<TType> {
    return mkSelect(type, input, opts);
  }

  return build;
}

const userSelect = mkSimpleBuilder('select.user');
const roleSelect = mkSimpleBuilder('select.role');
const mentionableSelect = mkSimpleBuilder('select.mentionable');

/**
 * Creates a public user-select descriptor.
 *
 * @param customId Custom id or full select config.
 * @param opts Optional select configuration when a custom id is provided.
 * @returns Public user-select descriptor.
 */
export function user(customId: SelectBase['id'], opts?: SelectOpts): UserSelect;
export function user(opts: SelectInput): UserSelect;
export function user(
  input: SelectBase['id'] | SelectInput,
  opts?: SelectOpts,
): UserSelect {
  return userSelect(input as never, opts);
}

/**
 * Creates a public role-select descriptor.
 *
 * @param customId Custom id or full select config.
 * @param opts Optional select configuration when a custom id is provided.
 * @returns Public role-select descriptor.
 */
export function role(customId: SelectBase['id'], opts?: SelectOpts): RoleSelect;
export function role(opts: SelectInput): RoleSelect;
export function role(
  input: SelectBase['id'] | SelectInput,
  opts?: SelectOpts,
): RoleSelect {
  return roleSelect(input as never, opts);
}

/**
 * Creates a public mentionable-select descriptor.
 *
 * @param customId Custom id or full select config.
 * @param opts Optional select configuration when a custom id is provided.
 * @returns Public mentionable-select descriptor.
 */
export function mentionable(
  customId: SelectBase['id'],
  opts?: SelectOpts,
): MentionableSelect;
export function mentionable(opts: SelectInput): MentionableSelect;
export function mentionable(
  input: SelectBase['id'] | SelectInput,
  opts?: SelectOpts,
): MentionableSelect {
  return mentionableSelect(input as never, opts);
}

/**
 * Creates a public channel-select descriptor.
 *
 * @param customId Custom id or full select config.
 * @param channelTypes Optional channel type filter list.
 * @param opts Optional select configuration when a custom id is provided.
 * @returns Public channel-select descriptor.
 */
export function channel(
  customId: SelectBase['id'],
  channelTypes?: readonly ChannelType[],
  opts?: SelectOpts,
): ChannelSelect;
export function channel(opts: ChannelSelectInput): ChannelSelect;
export function channel(
  input: SelectBase['id'] | ChannelSelectInput,
  channelTypes?: readonly ChannelType[] | SelectOpts,
  opts: SelectOpts = {},
): ChannelSelect {
  if (typeof input !== 'string') {
    const { channelTypes: chans, ...select } = input;

    return {
      type: 'select.channel' as const,
      ...resolveSelectBase(select),
      channelTypes: chans,
    };
  }

  return {
    type: 'select.channel' as const,
    ...resolveSelectBase(
      input,
      Array.isArray(channelTypes) ? opts : (channelTypes as SelectOpts | undefined),
    ),
    channelTypes: Array.isArray(channelTypes) ? channelTypes : undefined,
  };
}

/**
 * Creates a public string-select descriptor.
 *
 * @param customId Custom id or full select config.
 * @param options Select options when a custom id is provided.
 * @param opts Optional select configuration when a custom id is provided.
 * @returns Public string-select descriptor.
 */
export function string(
  customId: SelectBase['id'],
  options: readonly StringSelectOption[],
  opts?: SelectOpts,
): StringSelect;
export function string(opts: StringSelectInput): StringSelect;
export function string(
  input: SelectBase['id'] | StringSelectInput,
  options?: readonly StringSelectOption[] | SelectOpts,
  opts: SelectOpts = {},
): StringSelect {
  if (typeof input !== 'string') {
    const { options: items, ...select } = input;

    return {
      type: 'select.string' as const,
      ...resolveSelectBase(select),
      options: items,
    };
  }

  const base = Array.isArray(options) ? opts : {};

  return {
    type: 'select.string' as const,
    ...resolveSelectBase(input, base),
    options: Array.isArray(options) ? options : [],
  };
}
