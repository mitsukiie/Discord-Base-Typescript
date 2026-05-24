import { ButtonStyle } from 'discord.js';

/** Branded type used for component custom ids. */
export type ButtonID = string & {};

type CommonButton = {
  label: string;
  emoji?: string;
};

/** Public button descriptor used by `ui.button(...)`. */
export type Button =
  | (CommonButton & {
      customId: ButtonID;
      style?: Exclude<ButtonStyle, ButtonStyle.Link>;
      url?: never;
    })
  | (CommonButton & {
      url: string;
      style?: ButtonStyle.Link;
      customId?: never;
    });
