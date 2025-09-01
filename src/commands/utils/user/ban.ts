import { ApplicationCommandOptionType } from 'discord.js';
import { createCommand } from '#builders';

/**
 * Comando /user info (dentro da categoria "user")
 *
 * Demonstra como criar um subcomando com argumento de usuário
 */

export default createCommand({
  name: 'ban',
  description: 'Banir um usuário do servidor',
  type: 'ChatInput', // Lembre de passar type para o run funcionar!

  // Opções (argumentos) que o comando pode receber
  options: [
    {
      name: 'usuário',
      description: 'Usuário para banir',

      // Tipo da opção (nesse caso, um usuário do Discord)
      type: ApplicationCommandOptionType.User,

      required: false,
    },
  ],

  async run(interaction, client) {
    // Obtém o usuário passado como argumento (se existir)
    const usuario = interaction.options.getUser('usuário');

    await interaction.reply({
      content: usuario
        ? `${usuario} foi banido!`
        : '⚠️ Nenhum usuário especificado para banir.',
    });
  },
});
