import { SeparatorSpacingSize } from 'discord.js';

export enum TextSize {
  Title = 1,
  Subtitle = 2,
  Section = 3,
  Small = 4,
}

export const SeparatorSize = {
  Small: SeparatorSpacingSize.Small,
  Large: SeparatorSpacingSize.Large,
} as const;

export type SeparatorSize = (typeof SeparatorSize)[keyof typeof SeparatorSize];
