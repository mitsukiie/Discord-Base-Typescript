import { App } from '@base';

export async function Responder(i: any) {
  const app = App.getInstance();
  await app.responders.run(i);
}
