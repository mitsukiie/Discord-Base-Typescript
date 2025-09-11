import { ApplicationCommandOptionType } from 'discord.js';
import { CommandType } from '#types';
import { createCommand } from '#base';

/**
 * Comando /user info (dentro da categoria "user")
 *
 * Demonstra como criar um subcomando com argumento de usuário
 */

export default createCommand({
  name: 'ban',
  description: 'Banir um usuário do servidor',
  type: CommandType.ChatInput, // Lembre de passar type para o run funcionar!

  // Opções (argumentos) que o comando pode receber
  options: [
    {
      name: 'usuário',
      description: 'Usuário para banir',
      type: ApplicationCommandOptionType.User,

      required: false,
    },
  ],

  async run(interaction, client) {
    const usuario = interaction.options.getUser('usuário');

    await interaction.reply({
      content: usuario
        ? `${usuario} foi banido!`
        : '⚠️ Nenhum usuário especificado para banir.',
    });
  },
});
