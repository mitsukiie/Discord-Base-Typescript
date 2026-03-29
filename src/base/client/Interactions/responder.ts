import { App } from '@base';

export async function Responder(i: any) {
  const app = App.get();
  await app.responders.run(i);
}
