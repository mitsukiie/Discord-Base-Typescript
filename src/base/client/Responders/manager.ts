import { ResponderInteraction, ResponderType } from '#types';
import { getType } from '#utils';
import { session } from './session';
import { route } from './route';

export class ResponderManager {
  private routes = new route();
  private sessions = new session();

  register = this.routes.create.bind(this.routes);

  async run(interaction: ResponderInteraction<ResponderType>) {
    const id = interaction.customId;
    if (!id) return;

    const type = getType(interaction);

    if (this.sessions.isExpired(id)) {
      if ('reply' in interaction && interaction.isRepliable() && !interaction.replied) {
        await interaction.reply({
          content: 'Esta interação não está mais disponível.',
          flags: ['Ephemeral'],
        }).catch(() => {});
      }
      return;
    }

    const route = this.routes.find(id, type);
    if (!route) return;

    try {
      const params = this.routes.extract(id, route);
      const data = route.parse ? route.parse(params) : params;

      if (route.cache === 'temporary' && !this.sessions.has(id)) {
        this.sessions.add(id, route.cache, route.expire);
      } else if (route.cache === 'once') {
        this.sessions.add(id, route.cache);
      }

      await route.run(interaction, data);
    } catch (err) {
      console.error('Responder error:', err);
      if ('reply' in interaction && interaction.isRepliable() && !interaction.replied) {
        await interaction.reply({
          content: 'Erro ao processar interação.',
          flags: ['Ephemeral'],
        }).catch(() => {});
      }
    }
  }
}
