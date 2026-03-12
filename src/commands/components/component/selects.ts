import { createCommand } from '@base';
import { CommandType } from '@types';
import { message, ui } from '@ui';
import { ChannelType } from 'discord.js';

export default createCommand({
  name: 'selects',
  description: 'Exemplo com todos os tipos de select menu',
  type: CommandType.ChatInput,

  async run(interaction) {
    const components = ui.render(
      ui.text('## Select Menus Example'),
      ui.text('Cada select precisa ficar sozinho na propria row.'),
      ui.row(
        ui.select.string({
          customId: 'select:string:demo',
          placeholder: 'String select',
          options: [
            { label: 'Opcao A', value: 'a' },
            { label: 'Opcao B', value: 'b' },
          ],
        }),
      ),
      ui.row(ui.select.user('select:user:demo', { placeholder: 'User select' })),
      ui.row(ui.select.role('select:role:demo', { placeholder: 'Role select' })),
      ui.row(
        ui.select.channel(
          'select:channel:demo',
          [ChannelType.GuildText, ChannelType.GuildVoice],
          { placeholder: 'Channel select' },
        ),
      ),
      ui.row(
        ui.select.mentionable('select:mentionable:demo', {
          placeholder: 'Mentionable select',
        }),
      ),
    );

    await message.reply(interaction, {
      ephemeral: true,
      components,
    });
  },
});
