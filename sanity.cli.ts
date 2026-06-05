/**
 * Used by the Sanity CLI (`npx sanity ...`) - e.g. `sanity init`,
 * `sanity dataset`, `sanity deploy`. Reads the same env vars as the app.
 */
import { defineCliConfig } from "sanity/cli";

import { dataset, projectId } from "./sanity/env";

export default defineCliConfig({
  api: { projectId, dataset },
  autoUpdates: true,
});
