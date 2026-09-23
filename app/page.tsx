import Homepage from "@/components/homepage";
import JsonLd from "@/components/json-ld";
import { personSchema, websiteSchema } from "@/lib/schema";

export default function Home() {
  return (
    <>
      {/* Identity for search and answer engines: who this site is about, and
          what the site itself is. Both carry stable @ids that the per-post
          schemas reference. */}
      <JsonLd data={personSchema()} />
      <JsonLd data={websiteSchema()} />
      <Homepage />
    </>
  );
}
