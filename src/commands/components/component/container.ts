import { createCommand } from '@base';
import { CommandType } from '@types';
import { message, ui } from '@ui';

export default createCommand({
  name: 'container',
  description: 'Exemplo de envio com ui.container',
  type: CommandType.ChatInput,

  async run(interaction) {
    const components = ui.render(
      ui.container(
        { color: '#0099ff' },
        ui.text('## Container Example'),
        ui.text('Mesma API, mas agrupando tudo em um ContainerBuilder.'),
        ui.divider(),
        ui.row(
          ui.button({
            label: 'Voltar',
            customId: 'container:back',
          }),
        ),
      ),
    );

    await message.reply(interaction, {
      ephemeral: true,
      components,
    });
  },
});
