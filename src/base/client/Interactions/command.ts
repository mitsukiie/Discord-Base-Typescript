import { MessageFlags } from 'discord.js';
import { App } from '@base';

export async function Command(i: any) {
  const app = App.get();

  const name = i.commandName;
  const id = i.user.id;
  const command = app.commands.get(name);
  if (!command) return;

  if (app.cooldowns.isOnCooldown(id, name)) {
    const remaining = app.cooldowns.get(id, name) / 1000;
    return i.reply({
      content: `⏳ Calma aí! Você precisa esperar **${remaining.toFixed(1)}s** antes de usar esse comando de novo.`,
      flags: [MessageFlags.Ephemeral],
    });
  }

  try {
    await command.run(i, app.client);
    app.cooldowns.set(id, name, command.cooldown ?? undefined);
  } catch (err) {
    console.error(err);
    const msg = "😓 Desculpa, eu acabei tropeçando aqui...\nTente de novo depois!";
    if (i.replied || i.deferred)
      await i.followUp({ content: msg, flags: [MessageFlags.Ephemeral] });
    else
      await i.reply({ content: msg, flags: [MessageFlags.Ephemeral] });
  }
}
