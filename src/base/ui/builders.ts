import { ButtonStyle, ChannelType, ContainerBuilder } from 'discord.js';

import {
  AttachmentUrlString,
  ContainerInput,
  ContainerOptions,
  EasyButton,
  EasyMediaItem,
  EasyRowComponent,
  EasySelectBase,
  EasyStringSelectOption,
  EasyThumbnail,
  SectionOptions,
  SectionTexts,
  UrlString,
  DisplayInput,
} from '@types';

import {
  attachContainerAttachments,
  collectAttachmentsFromContainerInputs,
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
  attachmentOrSpoiler?: unknown | boolean,
  spoiler = false,
) {
  const hasAttachment = typeof attachmentOrSpoiler !== 'boolean';

  return {
    type: 'file' as const,
    url,
    spoiler: hasAttachment ? spoiler : (attachmentOrSpoiler ?? false),
    attachment: hasAttachment ? attachmentOrSpoiler : undefined,
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

  const candidate = value as Record<string, unknown>;
  return 'color' in candidate || 'text' in candidate || 'description' in candidate;
}

export const ui = {
  text(content: string) {
    return { type: 'text' as const, content };
  },

  divider() {
    return { type: 'separator' as const };
  },

  button(
    label: string,
    id: string,
    style: ButtonStyle = ButtonStyle.Primary,
  ): EasyButton {
    return { label, id, style };
  },

  select: {
    user(id: string, opts: Omit<EasySelectBase, 'id'> = {}) {
      return { type: 'select.user' as const, id, ...opts };
    },

    string(
      id: string,
      options: EasyStringSelectOption[],
      opts: Omit<EasySelectBase, 'id'> = {},
    ) {
      return { type: 'select.string' as const, id, options, ...opts };
    },

    role(id: string, opts: Omit<EasySelectBase, 'id'> = {}) {
      return { type: 'select.role' as const, id, ...opts };
    },

    channel(
      id: string,
      channelTypes?: ChannelType[],
      opts: Omit<EasySelectBase, 'id'> = {},
    ) {
      return { type: 'select.channel' as const, id, channelTypes, ...opts };
    },

    mentionable(id: string, opts: Omit<EasySelectBase, 'id'> = {}) {
      return { type: 'select.mentionable' as const, id, ...opts };
    },
  },

  section(texts: SectionTexts, opts: SectionOptions = {}) {
    return {
      type: 'section' as const,
      texts,
      button: opts.button,
      thumbnail: opts.thumbnail,
    };
  },

  thumbnail(url: UrlString, description?: string, spoiler?: boolean): EasyThumbnail {
    return { url, description, spoiler };
  },

  gallery(...items: EasyMediaItem[]) {
    return {
      type: 'gallery' as const,
      items,
    };
  },

  image(url: UrlString, description?: string, spoiler?: boolean): EasyMediaItem {
    return { url, description, spoiler };
  },

  file,

  row(...components: EasyRowComponent[]) {
    return { type: 'row' as const, components };
  },

  container(...args: [ContainerOptions, ...ContainerInput[]] | ContainerInput[]) {
    const options = isContainerOptions(args[0]) ? args[0] : {};
    const components = (
      isContainerOptions(args[0]) ? args.slice(1) : args
    ) as ContainerInput[];

    const withMeta: ContainerInput[] = [
      ...(options.text ? [options.text] : []),
      ...(options.description ? [options.description] : []),
      ...components,
    ];

    const container = new ContainerBuilder();
    container.components.push(...withMeta.map(toContainerChild));

    if (options.color !== undefined) {
      const accentColor = validate.color(options.color);
      container.setAccentColor(accentColor);
    }

    const attachments = collectAttachmentsFromContainerInputs(withMeta);
    return attachContainerAttachments(container, attachments);
  },

  v2(...components: DisplayInput[]) {
    return toDisplayComponents(...components);
  },
};
