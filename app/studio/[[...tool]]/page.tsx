/**
 * This route mounts the Sanity Studio for the whole `/studio` segment.
 * The catch-all `[[...tool]]` lets the Studio handle its own internal routing.
 *
 * See: https://www.sanity.io/docs/sanity-studio
 */
import { NextStudio } from "next-sanity/studio";

import config from "../../../sanity.config";

export const dynamic = "force-static";

export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
