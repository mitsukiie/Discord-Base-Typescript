import { ApplicationCommandOptionType } from 'discord.js';
import { createCommand } from '#builders';

/**
 * Comando /user info (dentro da categoria "user")
 *
 * Demonstra como criar um subcomando com argumento de usuário
 * usando o helper `createCommand`.
 */

export default createCommand({
  data: {
    name: 'ban',
    description: 'Banir um usuário do servidor',

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
  },

  // Função executada quando o comando é chamado
  async run(interaction) {
    // Obtém o usuário passado como argumento (se existir)
    const usuario = interaction.options.getUser('usuário');

    // Responde à interação
    await interaction.reply({
      content: usuario
        ? `${usuario} foi banido!`
        : '⚠️ Nenhum usuário especificado para banir.',
    });
  },
});
