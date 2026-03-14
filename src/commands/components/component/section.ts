import { createCommand } from '@base';
import { CommandType } from '@types';
import { message, ui } from '@ui';
import { ButtonStyle } from 'discord.js';

export default createCommand({
  name: 'section',
  description: 'Exemplo de section com textos e botao',
  type: CommandType.ChatInput,

  async run(interaction) {
    const components = ui.render(
      ui.text('## Section Example'),
      ui.section(['Texto principal da section', 'Texto secundario da section'], {
        button: ui.button({
          label: 'Confirmar',
          customId: 'section:confirm',
          style: ButtonStyle.Success,
        }),
        /*
        // Ou thumbnail, mas nao pode ser os dois ao mesmo tempo por causa da regra de layout de largura maxima.
        thumbnail: ui.thumbnail({
          url: 'https://picsum.photos/id/1025/400/400',
          description: 'Thumbnail da section',
        }),
        */
      }),
    );
    await message.reply(interaction, {
      ephemeral: true,
      components,
    });
  },
});
