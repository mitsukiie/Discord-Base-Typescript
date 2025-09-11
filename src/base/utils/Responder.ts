import { Interaction } from 'discord.js';
import { ResponderType, ResponderInteraction } from '#types';

export function getType(interaction: Interaction): ResponderType {
  if (interaction.isButton()) return ResponderType.Button;
  if (interaction.isModalSubmit()) return ResponderType.Modal;
  if (interaction.isStringSelectMenu()) return ResponderType.SelectString;
  if (interaction.isUserSelectMenu()) return ResponderType.SelectUser;
  if (interaction.isRoleSelectMenu()) return ResponderType.SelectRole;
  if (interaction.isChannelSelectMenu()) return ResponderType.SelectChannel;
  if (interaction.isMentionableSelectMenu()) return ResponderType.SelectMentionable;
  return ResponderType.Button;
}

export function isResponder(
  interaction: Interaction,
): interaction is ResponderInteraction<ResponderType> {
  return (
    interaction.isButton() ||
    interaction.isModalSubmit() ||
    interaction.isStringSelectMenu() ||
    interaction.isUserSelectMenu() ||
    interaction.isRoleSelectMenu() ||
    interaction.isChannelSelectMenu() ||
    interaction.isMentionableSelectMenu()
  );
}
