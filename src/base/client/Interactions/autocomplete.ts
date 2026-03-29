import { App } from '@base';

export async function AutoComplete(i: any) {
  const app = App.get();
  const command = app.commands.get(i.commandName);

  if (command?.autocomplete) {
    const focused = i.options.getFocused();
    await command.autocomplete(i, focused);
  }
}
