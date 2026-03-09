import { createCommand } from '@base';
import { CommandType } from '@types';
import { message, ui } from '@ui';
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

    const components = ui.container(
      '## Media Example',
      ui.gallery(
        ui.image('https://picsum.photos/id/1015/900/500', 'Imagem 1'),
        ui.image('https://picsum.photos/id/1018/900/500', 'Imagem 2'),
      ),
      ui.file.fromAttachment(file),
    );

    await message.reply(interaction, {
      ephemeral: true,
      components: [components],
    });
  },
});
