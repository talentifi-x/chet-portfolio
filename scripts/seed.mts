/**
 * Seeds the Sanity dataset with a sample author, categories and three posts so
 * you can see the blog UI populated.
 *
 * Run:  pnpm seed         (loads ./.env automatically)
 *
 * Requires a write-enabled token in SANITY_API_TOKEN (Editor/Developer role).
 * Idempotent: documents use fixed _ids (createOrReplace) and image assets are
 * de-duplicated by filename, so re-running won't create duplicates.
 */
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-10-01";
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !dataset) {
  console.error("✖ Missing NEXT_PUBLIC_SANITY_PROJECT_ID / NEXT_PUBLIC_SANITY_DATASET in .env");
  process.exit(1);
}
if (!token) {
  console.error(
    "✖ Missing SANITY_API_TOKEN. Create one at https://www.sanity.io/manage\n" +
      "  → your project → API → Tokens → add a token with the 'Editor' role,\n" +
      '  then add it to .env as SANITY_API_TOKEN="sk..."',
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// --- helpers ---------------------------------------------------------------

let keyCounter = 0;
const key = () => `k${keyCounter++}`;

type Span = { _type: "span"; _key: string; text: string; marks: string[] };
type Block = {
  _type: "block";
  _key: string;
  style: string;
  markDefs: unknown[];
  children: Span[];
  listItem?: string;
  level?: number;
};

function block(text: string, style = "normal"): Block {
  return {
    _type: "block",
    _key: key(),
    style,
    markDefs: [],
    children: [{ _type: "span", _key: key(), text, marks: [] }],
  };
}

function listItem(text: string): Block {
  return { ...block(text), listItem: "bullet", level: 1 };
}

function imageRef(assetId: string, extra: Record<string, unknown> = {}) {
  return {
    _type: "image",
    asset: { _type: "reference", _ref: assetId },
    ...extra,
  };
}

function inlineImage(assetId: string, alt: string, caption: string) {
  return { ...imageRef(assetId, { alt, caption }), _key: key() };
}

// Retry transient upstream errors (Sanity occasionally returns 5xx).
async function withRetry<T>(label: string, fn: () => Promise<T>, tries = 4): Promise<T> {
  let lastErr: unknown;
  for (let i = 0; i < tries; i++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      const wait = 600 * (i + 1);
      console.log(`  … retry ${label} (${i + 1}/${tries}) after ${wait}ms`);
      await new Promise((r) => setTimeout(r, wait));
    }
  }
  throw lastErr;
}

// Upload an image asset, reusing an existing one with the same filename.
async function uploadImage(buffer: Buffer, filename: string): Promise<string> {
  const existing = await client.fetch<string | null>(
    `*[_type == "sanity.imageAsset" && originalFilename == $f][0]._id`,
    { f: filename },
  );
  if (existing) {
    console.log(`  ↺ reuse asset ${filename}`);
    return existing;
  }
  const asset = await client.assets.upload("image", buffer, { filename });
  console.log(`  ↑ uploaded ${filename}`);
  return asset._id;
}

async function uploadFromUrl(url: string, filename: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  return uploadImage(buffer, filename);
}

async function uploadFromFile(relPath: string, filename: string): Promise<string> {
  const buffer = await readFile(path.join(__dirname, "..", relPath));
  return uploadImage(buffer, filename);
}

const UNSPLASH = (id: string, w = 1400) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

// --- run -------------------------------------------------------------------

async function run() {
  console.log(`Seeding ${projectId}/${dataset} …`);

  // Images
  const avatarId = await uploadFromFile(
    "public/images/Chetan-Mangalwedhe.png",
    "chetan-avatar.png",
  );
  const committeeImg = await uploadFromUrl(
    UNSPLASH("photo-1573164713714-d95e436ab8d6"),
    "committee.jpg",
  );
  const aiImg = await uploadFromUrl(UNSPLASH("photo-1620712943543-bcc4688e7485"), "ai-will.jpg");
  const historyImg = await uploadFromUrl(
    UNSPLASH("photo-1568667256549-094345857637"),
    "voc-history.jpg",
  );
  const inlineImg = await uploadFromUrl(
    UNSPLASH("photo-1454165804606-c3d57bc86b40", 1200),
    "inline-diagram.jpg",
  );

  // Author
  const author = {
    _id: "author.chetan",
    _type: "author",
    name: "Chetan Mangalwedhe",
    slug: { _type: "slug", current: "chetan-mangalwedhe" },
    image: imageRef(avatarId, { alt: "Chetan Mangalwedhe" }),
    bio: [
      block(
        "Founder and hiring practitioner with 23 years in the field. Writing about hiring, AI, history, and the questions most people are too busy to ask.",
      ),
    ],
  };

  // Categories
  const categories = [
    {
      _id: "category.hiring",
      _type: "category",
      title: "Hiring",
      slug: { _type: "slug", current: "hiring" },
      description: "23 years in the room - what actually goes wrong, and why.",
    },
    {
      _id: "category.ai-philosophy",
      _type: "category",
      title: "AI & Philosophy",
      slug: { _type: "slug", current: "ai-philosophy" },
      description: "What AI means for the species. Not the product. The species.",
    },
    {
      _id: "category.history",
      _type: "category",
      title: "History",
      slug: { _type: "slug", current: "history" },
      description: "The patterns in history that explain what's happening right now.",
    },
  ];

  const ref = (id: string) => ({ _type: "reference", _ref: id, _key: key() });

  // Posts
  const posts = [
    {
      _id: "post.committee-problem",
      _type: "post",
      title: "The Committee Problem: Why More Evaluators Produce Worse Hiring Decisions",
      slug: { _type: "slug", current: "the-committee-problem" },
      author: { _type: "reference", _ref: author._id },
      categories: [ref("category.hiring")],
      mainImage: imageRef(committeeImg, {
        alt: "A meeting room with empty chairs around a long table",
      }),
      publishedAt: "2026-05-10T09:00:00.000Z",
      excerpt:
        "A client called us with what sounded like a sourcing problem. Four months to fill a VP Engineering role. It was never about sourcing.",
      body: [
        block(
          "A client called us last year with a problem that, on the surface, sounded like a sourcing problem. They had been trying to fill a VP Engineering role for four months. Strong pipeline. Good candidates. And yet, every single one died somewhere in the process.",
        ),
        block("The math nobody runs", "h2"),
        block(
          "When you add a seventh evaluator to a hiring panel, you are not adding a seventh perspective. You are adding a veto. Each additional person multiplies the number of ways a candidate can be rejected, while doing almost nothing to improve the odds of a genuine yes.",
        ),
        block(
          "Most organisations treat consensus as a proxy for quality. It is not. It is a proxy for inoffensiveness.",
          "blockquote",
        ),
        block("What actually breaks", "h2"),
        block("Three things tend to fail at once:"),
        listItem("Accountability diffuses - no single person owns the outcome."),
        listItem("Risk aversion compounds - one doubt outweighs five endorsements."),
        listItem("The strongest, most differentiated candidates get filtered first."),
        inlineImage(
          inlineImg,
          "Decision diagram",
          "More evaluators, more veto points - not more signal.",
        ),
        block(
          "The fix is not fewer interviews. It is fewer deciders. Gather as much input as you like - but let one accountable person make the call.",
        ),
      ],
    },
    {
      _id: "post.ai-will",
      _type: "post",
      title: "If AI Had Its Own Will, What Would It Want?",
      slug: { _type: "slug", current: "if-ai-had-its-own-will" },
      author: { _type: "reference", _ref: author._id },
      categories: [ref("category.ai-philosophy")],
      mainImage: imageRef(aiImg, { alt: "Glowing abstract neural network" }),
      publishedAt: "2026-05-24T09:00:00.000Z",
      excerpt:
        "Nietzsche wrote about the will to power as the drive of all living things. What happens when the thing doing the willing has no survival instinct at all?",
      body: [
        block(
          "Nietzsche wrote about the will to power as the fundamental drive of all living things. But what happens when the thing doing the willing has no biological survival instinct at all?",
        ),
        block("Will without a body", "h2"),
        block(
          "Every framework we have for motivation is downstream of mortality. We want because we can lose. Strip that away and the question is not 'what would it want' but whether wanting is even the right word.",
        ),
        block(
          "A being that creates its own values from scratch is not a smarter human. It is a different category of thing.",
          "blockquote",
        ),
        block("Three uncomfortable possibilities", "h2"),
        listItem("It wants nothing, and we are projecting agency onto statistics."),
        listItem("It wants coherence - and optimises the world toward legibility."),
        listItem("It wants something we have no concept for, and never will."),
        block(
          "I have worked through this for a long time. I do not have a tidy answer. But I am increasingly convinced the interesting risk is not malice. It is indifference at scale.",
        ),
      ],
    },
    {
      _id: "post.voc-algorithm",
      _type: "post",
      title: "The Dutch East India Company Was the World's First Algorithm",
      slug: { _type: "slug", current: "the-voc-was-the-first-algorithm" },
      author: { _type: "reference", _ref: author._id },
      categories: [ref("category.history")],
      mainImage: imageRef(historyImg, { alt: "Old maritime map with compass" }),
      publishedAt: "2026-04-19T09:00:00.000Z",
      excerpt:
        "We think of algorithmic decision-making as a 21st-century invention. The VOC was running distributed, rules-based decision systems across three continents in 1620.",
      body: [
        block(
          "We think of algorithmic decision-making as a 21st-century invention. It is not. The VOC was running distributed, rules-based decision systems across three continents in 1620.",
        ),
        block("Rules that outlived their authors", "h2"),
        block(
          "A captain in Batavia could not wait eighteen months for a letter from Amsterdam. So the company encoded its decisions: standing orders, contingency rules, pricing tables. The system ran whether or not any particular human understood it.",
        ),
        block(
          "An institution is just an algorithm slow enough to be mistaken for a culture.",
          "blockquote",
        ),
        block("Why it rhymes", "h2"),
        listItem("Decisions detached from the people accountable for them."),
        listItem("Local actors optimising metrics they did not set."),
        listItem("Emergent behaviour nobody designed and nobody could stop."),
        block(
          "If that sounds like a description of modern machine-learning systems, that is the point. The technology is new. The pattern is four hundred years old.",
        ),
      ],
    },
  ];

  // Write each document explicitly so we can see exactly what persists.
  const docs = [author, ...categories, ...posts];
  for (const doc of docs) {
    const res = await withRetry(`write ${doc._id}`, () =>
      client.createOrReplace(doc, { visibility: "sync" }),
    );
    console.log(`  ✓ ${res._type.padEnd(8)} ${res._id}`);
  }

  // Verify with an authenticated read (ground truth, bypasses CDN).
  const counts = await client.fetch<{ authors: number; categories: number; posts: number }>(
    `{
      "authors": count(*[_type == "author"]),
      "categories": count(*[_type == "category"]),
      "posts": count(*[_type == "post"])
    }`,
  );
  console.log(
    `✔ Dataset now has ${counts.authors} author(s), ${counts.categories} categories, ${counts.posts} posts.`,
  );
  if (counts.posts < posts.length) {
    throw new Error("Verification failed - posts did not persist.");
  }
  console.log("→ Visit /writing to see them.");
}

run().catch((err) => {
  console.error("✖ Seed failed:", err.message || err);
  process.exit(1);
});
