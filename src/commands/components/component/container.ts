import { createCommand } from '@base';
import { CommandType } from '@types';
import { message, ui } from '@ui';

export default createCommand({
  name: 'container',
  description: 'Exemplo de envio com ui.container',
  type: CommandType.ChatInput,

  async run(interaction) {
    const components = ui.container(
      {
        color: '#0099ff',
        text: '## Container Example',
        description: 'Mesma API, mas agrupando tudo em um ContainerBuilder.',
      },
      ui.divider(),
      ui.row(ui.button('Voltar', 'container:back')),
    );

    await message.reply(interaction, {
      ephemeral: true,
      components: [components],
    });
  },
});
