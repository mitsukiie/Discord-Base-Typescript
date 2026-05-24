import { createCommand } from '@base';
import { CommandType,TextSize, SeparatorSize } from '@types';
import { ui } from '@ui';

export default createCommand({
  name: 'container',
  description: 'Exemplo de envio com ui.container',
  type: CommandType.ChatInput,

  async run(interaction) {
    const components = ui.render(
      ui.container(
        { color: '#0099ff' },
        ui.text('Container Example', { size: TextSize.Title }),
        ui.text('Mesma API, mas agrupando tudo em um ContainerBuilder.'),
        ui.separator({ spacing: SeparatorSize.Large, divider: true }),
        ui.row(
          ui.button({
            label: 'Voltar',
            customId: 'container:back',
          }),
        ),
      ),
    );

    await ui.send(interaction, {
      ephemeral: true,
      components,
    });
  },
});
