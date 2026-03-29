import { ChannelType, ContainerBuilder, MessageFlags } from 'discord.js';

import {
  AttachmentUrlString,
  Button,
  ChannelSelect,
  MediaItem,
  MentionableSelect,
  RowComponent,
  RoleSelect,
  SelectBase,
  StringSelect,
  StringSelectOption,
  Thumbnail,
  ContainerInput,
  ContainerOptions,
  SectionOptions,
  SectionTexts,
  UserSelect,
  DisplayInput,
} from '@types';

import {
  attachContainerAttachments,
  collectAttachmentsFromContainerInputs,
  collectAttachmentsFromDisplayInputs,
  createRenderedComponents,
  getRenderedComponentsAttachments,
  isRenderedComponents,
  RenderedComponents,
  toContainerChild,
  toDisplayComponents,
} from './normalize';
import { validate } from './validate';

export { toDisplayComponents } from './normalize';

function getAttachmentName(attachment: unknown) {
  if (!attachment || typeof attachment !== 'object') {
    throw new Error('Attachment must be an object with a valid file name.');
  }

  const candidate = attachment as {
    name?: unknown;
    data?: { name?: unknown };
  };

  const name =
    typeof candidate.name === 'string'
      ? candidate.name
      : typeof candidate.data?.name === 'string'
        ? candidate.data.name
        : undefined;

  if (!name) {
    throw new Error(
      'Attachment name was not found. Define a name in AttachmentBuilder options.',
    );
  }

  return name;
}

function buildEasyFile(
  url: AttachmentUrlString,
  fileOrSpoiler?: unknown | boolean,
  spoiler = false,
) {
  const hasFile = typeof fileOrSpoiler !== 'boolean';

  return {
    type: 'file' as const,
    url,
    spoiler: hasFile ? spoiler : (fileOrSpoiler ?? false),
    attachment: hasFile ? fileOrSpoiler : undefined,
  };
}

const file = Object.assign(buildEasyFile, {
  fromAttachment(attachment: unknown, spoiler = false) {
    const name = getAttachmentName(attachment);
    return buildEasyFile(`attachment://${name}`, attachment, spoiler);
  },
});

function isContainerOptions(value: unknown): value is ContainerOptions {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }

  return 'color' in (value as Record<string, unknown>);
}

function splitContainerArgs(
  args: [ContainerOptions, ...ContainerInput[]] | ContainerInput[],
) {
  if (isContainerOptions(args[0])) {
    return {
      options: args[0],
      components: args.slice(1) as ContainerInput[],
    };
  }

  return {
    options: {} as ContainerOptions,
    components: args as ContainerInput[],
  };
}

type SelectBuilderOptions = Omit<SelectBase, 'id'>;
type SelectBuilderInput = SelectBuilderOptions & { customId: SelectBase['id'] };
type ChannelSelectBuilderInput = SelectBuilderInput & {
  channelTypes?: readonly ChannelType[];
};
type StringSelectBuilderInput = SelectBuilderInput & {
  options: readonly StringSelectOption[];
};

export type MessageSendOptions = {
  ephemeral?: boolean;
  files?: readonly unknown[];
};

export type MessageSendPayload = MessageSendOptions & {
  components: RenderedComponents;
};

export type ReplyableInteraction = {
  reply(options: unknown): Promise<unknown>;
};

type SimpleSelectType =
  | UserSelect['type']
  | RoleSelect['type']
  | MentionableSelect['type'];
type SimpleSelect<TType extends SimpleSelectType> = Extract<
  RowComponent,
  { type: TType }
>;
type SimpleSelectBuilder<TType extends SimpleSelectType> = {
  (customId: SelectBase['id'], opts?: SelectBuilderOptions): SimpleSelect<TType>;
  (opts: SelectBuilderInput): SimpleSelect<TType>;
};

function resolveSelectBase(
  customId: SelectBase['id'],
  opts?: SelectBuilderOptions,
): SelectBase;
function resolveSelectBase(opts: SelectBuilderInput): SelectBase;
function resolveSelectBase(
  customIdOrOpts: SelectBase['id'] | SelectBuilderInput,
  opts: SelectBuilderOptions = {},
): SelectBase {
  if (typeof customIdOrOpts === 'string') {
    return { id: customIdOrOpts, ...opts };
  }

  const { customId, ...selectOptions } = customIdOrOpts;
  return { id: customId, ...selectOptions };
}

function createSelect<TType extends SimpleSelectType>(
  type: TType,
  customId: SelectBase['id'],
  opts?: SelectBuilderOptions,
): SimpleSelect<TType>;
function createSelect<TType extends SimpleSelectType>(
  type: TType,
  opts: SelectBuilderInput,
): SimpleSelect<TType>;
function createSelect<TType extends SimpleSelectType>(
  type: TType,
  customIdOrOpts: SelectBase['id'] | SelectBuilderInput,
  opts?: SelectBuilderOptions,
) {
  return {
    type,
    ...(typeof customIdOrOpts === 'string'
      ? resolveSelectBase(customIdOrOpts, opts)
      : resolveSelectBase(customIdOrOpts)),
  };
}

function createSimpleSelectBuilder<TType extends SimpleSelectType>(
  type: TType,
): SimpleSelectBuilder<TType> {
  function build(
    customId: SelectBase['id'],
    opts?: SelectBuilderOptions,
  ): SimpleSelect<TType>;
  function build(opts: SelectBuilderInput): SimpleSelect<TType>;
  function build(
    customIdOrOpts: SelectBase['id'] | SelectBuilderInput,
    opts?: SelectBuilderOptions,
  ): SimpleSelect<TType> {
    return typeof customIdOrOpts === 'string'
      ? createSelect(type, customIdOrOpts, opts)
      : createSelect(type, customIdOrOpts);
  }

  return build;
}

const userSelect = createSimpleSelectBuilder('select.user');
const roleSelect = createSimpleSelectBuilder('select.role');
const mentionableSelect = createSimpleSelectBuilder('select.mentionable');

function channelSelect(
  customId: SelectBase['id'],
  channelTypes?: readonly ChannelType[],
  opts?: SelectBuilderOptions,
): ChannelSelect;
function channelSelect(opts: ChannelSelectBuilderInput): ChannelSelect;
function channelSelect(
  customIdOrOpts: SelectBase['id'] | ChannelSelectBuilderInput,
  channelTypes?: readonly ChannelType[] | SelectBuilderOptions,
  opts: SelectBuilderOptions = {},
): ChannelSelect {
  if (typeof customIdOrOpts !== 'string') {
    const { channelTypes: resolvedChannelTypes, ...select } = customIdOrOpts;
    return {
      type: 'select.channel' as const,
      ...resolveSelectBase(select),
      channelTypes: resolvedChannelTypes,
    };
  }

  const resolvedOpts = Array.isArray(channelTypes)
    ? opts
    : (channelTypes as SelectBuilderOptions | undefined);

  return {
    type: 'select.channel' as const,
    ...resolveSelectBase(customIdOrOpts, resolvedOpts),
    channelTypes: Array.isArray(channelTypes) ? channelTypes : undefined,
  };
}

function stringSelect(
  customId: SelectBase['id'],
  options: readonly StringSelectOption[],
  opts?: SelectBuilderOptions,
): StringSelect;
function stringSelect(opts: StringSelectBuilderInput): StringSelect;
function stringSelect(
  customIdOrOpts: SelectBase['id'] | StringSelectBuilderInput,
  options?: readonly StringSelectOption[] | SelectBuilderOptions,
  opts: SelectBuilderOptions = {},
): StringSelect {
  if (typeof customIdOrOpts !== 'string') {
    const { options: stringOptions, ...select } = customIdOrOpts;
    return {
      type: 'select.string' as const,
      ...resolveSelectBase(select),
      options: stringOptions,
    };
  }

  return {
    type: 'select.string' as const,
    ...resolveSelectBase(customIdOrOpts, Array.isArray(options) ? opts : {}),
    options: Array.isArray(options) ? options : [],
  };
}

export const ui = {
  text(content: string) {
    return { type: 'text' as const, content };
  },

  divider() {
    return { type: 'separator' as const };
  },

  button(options: Button): Button {
    return options;
  },

  select: {
    user: userSelect,
    string: stringSelect,
    role: roleSelect,
    channel: channelSelect,
    mentionable: mentionableSelect,
  },

  section(texts: SectionTexts, opts: SectionOptions = {}) {
    return { type: 'section' as const, texts, ...opts };
  },

  thumbnail(options: Thumbnail): Thumbnail {
    return options;
  },

  gallery(...items: MediaItem[]) {
    return { type: 'gallery' as const, items };
  },

  image(options: MediaItem): MediaItem {
    return options;
  },

  file,

  row(...components: RowComponent[]) {
    return { type: 'row' as const, components };
  },

  container(...args: [ContainerOptions, ...ContainerInput[]] | ContainerInput[]) {
    const { options, components } = splitContainerArgs(args);

    const container = new ContainerBuilder();
    container.components.push(...components.map(toContainerChild));

    if (options.color !== undefined) {
      const accentColor = validate.color(options.color);
      container.setAccentColor(accentColor);
    }

    const attachments = collectAttachmentsFromContainerInputs(components);
    return attachContainerAttachments(container, attachments);
  },

  render(...components: DisplayInput[]): RenderedComponents {
    const rendered = toDisplayComponents(...components);
    validate.components(rendered);
    const files = collectAttachmentsFromDisplayInputs(components);
    return createRenderedComponents(rendered, files);
  },

  send(interaction: ReplyableInteraction, payload: MessageSendPayload) {
    if (!isRenderedComponents(payload.components)) {
      throw new Error('Components must be created with ui.render(...).');
    }

    validate.components(payload.components);

    const flags = payload.ephemeral
      ? [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral]
      : [MessageFlags.IsComponentsV2];

    const autoFiles = getRenderedComponentsAttachments(payload.components);
    const files = [...autoFiles, ...(payload.files ?? [])];

    return interaction.reply({
      flags,
      components: payload.components,
      ...(files.length ? { files } : {}),
    });
  },
};
