import { client } from "./client";

/**
 * Thin wrapper around `client.fetch` that opts pages into ISR.
 * Content revalidates every 60s, or on-demand if you wire up webhooks later.
 */
export async function sanityFetch<T>({
  query,
  params = {},
  revalidate = 60,
  tags = [],
}: {
  query: string;
  params?: Record<string, unknown>;
  revalidate?: number | false;
  tags?: string[];
}): Promise<T> {
  return client.fetch<T>(query, params, {
    next: {
      revalidate: tags.length ? false : revalidate,
      tags,
    },
  });
}
