import { createCommand } from '@base';
import { CommandType } from '@types';
import { ui } from '@ui';
import { AttachmentBuilder } from 'discord.js';

export default createCommand({
  name: 'media',
  description: 'Exemplo com gallery e file',
  type: CommandType.ChatInput,

  async run(interaction) {
    const file = new AttachmentBuilder(
      Buffer.from('Arquivo enviado pelo ui.file.fromAttachment'),
      {
        name: 'media-example.txt',
      },
    );

    const components = ui.render(
      ui.container(
        ui.text('## Gallery Example'),
        ui.gallery(
          ui.image({
            url: 'https://picsum.photos/id/1015/900/500',
            description: 'Imagem 1',
            spoiler: true,
          }),
          ui.image({
            url: 'https://picsum.photos/id/1018/900/500',
            description: 'Imagem 2',
          }),
        ),
        ui.file.fromAttachment(file),
      ),
    );

    await ui.send(interaction, {
      ephemeral: true,
      components,
    });
  },
});
