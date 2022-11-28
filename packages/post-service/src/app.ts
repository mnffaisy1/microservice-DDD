import "reflect-metadata";

import { AppSettings } from "./settings/app.settings";
import { bootstrap } from "./infra/bootstrapping/bootstrap";
import { container } from "./inversify.config";

export async function startApp() {
  const port = Number(AppSettings.PORT || 3000);
  const app = await bootstrap(container, port);
  return app;
}

startApp().catch((e) => {
  console.error(e);
  process.exit(1);
});
