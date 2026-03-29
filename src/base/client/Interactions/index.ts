import { isResponder } from '@utils';
import { Command } from './command';
import { AutoComplete } from './autocomplete';
import { Responder } from './responder';

export async function Router(i: any) {
  if (i.isChatInputCommand()) return Command(i);
  if (i.isAutocomplete()) return AutoComplete(i);
  if (isResponder(i)) return Responder(i);
}
