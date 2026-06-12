/**
 * Seeds the Sanity dataset with the author, categories and the six themed
 * articles (from Chet_6Theme_Articles_SEO.docx) so the /writing blog is
 * populated.
 *
 * Run:  pnpm seed         (loads ./.env.local automatically)
 *
 * Requires a write-enabled token in SANITY_API_TOKEN (Editor/Developer role)
 * plus NEXT_PUBLIC_SANITY_PROJECT_ID / NEXT_PUBLIC_SANITY_DATASET in .env.local.
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

if (!projectId || !dataset || projectId === "your-project-id") {
  console.error(
    "✖ Missing/placeholder NEXT_PUBLIC_SANITY_PROJECT_ID / NEXT_PUBLIC_SANITY_DATASET in .env.local",
  );
  process.exit(1);
}
if (!token) {
  console.error(
    "✖ Missing SANITY_API_TOKEN. Create one at https://www.sanity.io/manage\n" +
      "  → your project → API → Tokens → add a token with the 'Editor' role,\n" +
      '  then add it to .env.local as SANITY_API_TOKEN="sk..."',
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

// A line is [style, text]. style: "p" normal, "h2"/"h3" headings, "li" bullet.
type Line = ["p" | "h2" | "h3" | "li", string];
function body(lines: Line[]): Block[] {
  return lines.map(([style, text]) =>
    style === "li" ? listItem(text) : block(text, style === "p" ? "normal" : style),
  );
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
  // Custom article covers (saved locally as .webp). The upload filename carries
  // a version suffix so re-seeding with refreshed artwork uploads new assets
  // instead of de-duping against the previous covers already in the dataset.
  const imgMachine = await uploadFromFile(
    "public/images/ai-iq-without-eq.webp",
    "ai-iq-without-eq-v2.webp",
  );
  const imgHistory = await uploadFromFile(
    "public/images/first-algorithm.webp",
    "first-algorithm-v2.webp",
  );
  const imgGenZ = await uploadFromFile("public/images/gen-z-work.webp", "gen-z-work-v2.webp");
  const imgPsych = await uploadFromFile("public/images/ai-adoption.webp", "ai-adoption-v2.webp");
  const imgTrust = await uploadFromFile(
    "public/images/trust-infrastructure.webp",
    "trust-infrastructure-v2.webp",
  );
  const imgStaffing = await uploadFromFile(
    "public/images/staffing-porter.webp",
    "staffing-porter-v2.webp",
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
    {
      _id: "category.future-of-work",
      _type: "category",
      title: "Future of Work",
      slug: { _type: "slug", current: "future-of-work" },
      description: "What work is becoming, and what it is supposed to give people.",
    },
    {
      _id: "category.society",
      _type: "category",
      title: "Society",
      slug: { _type: "slug", current: "society" },
      description: "Institutions, trust, and the world as it actually is.",
    },
    {
      _id: "category.hiring",
      _type: "category",
      title: "Hiring",
      slug: { _type: "slug", current: "hiring" },
      description: "23 years in the room - what actually goes wrong, and why.",
    },
  ];

  const ref = (id: string) => ({ _type: "reference", _ref: id, _key: key() });
  const authorRef = { _type: "reference" as const, _ref: author._id };

  // Posts -------------------------------------------------------------------
  const posts = [
    {
      _id: "post.ai-iq-without-eq",
      _type: "post",
      title:
        "AI Has IQ Without EQ - And That May Be the Most Historically Unusual Thing We Have Ever Built",
      slug: { _type: "slug", current: "ai-iq-without-eq-machine-and-human" },
      author: authorRef,
      categories: [ref("category.ai-philosophy")],
      mainImage: imageRef(imgMachine, { alt: "Glowing abstract neural network" }),
      publishedAt: "2026-06-10T09:00:00.000Z",
      excerpt:
        "AI developed extraordinary intelligence without the emotional and evolutionary foundation that shaped human cognition. No fear. No instinct. No survival pressure. Why that may be the most historically unusual thing humanity has ever built.",
      body: body([
        [
          "p",
          "AI has developed extraordinary intelligence - the ability to process, reason, generate, and predict at scales no human can match. What it has not developed is the emotional and evolutionary foundation that shaped human cognition. No fear. No instinct. No survival pressure. No emotional memory. For the first time in history, intelligence exists without the biological and psychological substrate that produced every prior form of it. That is what makes this moment different from every previous technological leap.",
        ],
        [
          "p",
          "The conversation about AI is dominated by capability. What it can do. How fast. How accurately. How cheaply.",
        ],
        [
          "p",
          "These are legitimate questions. But they are second-order questions. The first-order question - the one that shapes everything else - is different. What kind of thing are we actually dealing with? And why is it unlike anything we have built before?",
        ],
        ["h2", "The Brain Was Shaped by Survival Long Before It Was Shaped by Intelligence"],
        ["p", "The human brain did not evolve to think. It evolved to survive."],
        [
          "p",
          "Fear. Hunger. Competition. Uncertainty. For millions of years, human cognition developed under extraordinary pressure. Every capability we associate with intelligence - pattern recognition, prediction, language, social reasoning, creativity - emerged from an environment where the cost of getting it wrong was death.",
        ],
        [
          "p",
          "Our instincts, emotions, biases, and intuition are not flaws in the system. They are the system. They are the accumulated output of millions of years of evolutionary pressure, encoding survival lessons into the architecture of cognition itself.",
        ],
        [
          "p",
          "This is why a human expert can walk into a room and sense that something is wrong before they can articulate what. Why a leader with decades of experience makes the right call in a crisis in under a second. Why the best hiring decisions are often the ones where the data says one thing and the experienced human says another - and the human turns out to be right.",
        ],
        [
          "p",
          "That is not irrationality. It is a different kind of intelligence. One built from consequence.",
        ],
        ["h2", "AI Skipped All of It"],
        [
          "p",
          "AI arrived at intelligence without the evolutionary journey that produced human cognition.",
        ],
        [
          "p",
          "No survival pressure shaped it. No fear calibrated its judgment. No hunger focused its attention. No consequence - no genuine stake in the outcome - has ever slowed it down.",
        ],
        [
          "p",
          "It went straight from nothing to extraordinary capability, bypassing the millions of years of emotional and experiential scaffolding that built human intelligence from the ground up.",
        ],
        [
          "p",
          "AI has developed IQ without EQ. And that may be one of the most historically unusual things humanity has ever created.",
        ],
        [
          "p",
          "Every previous form of intelligence we know of - human, animal, whatever approximates it in nature - has emotional and survival architecture underneath the cognitive architecture. You cannot separate the two in biological intelligence. They co-evolved.",
        ],
        ["p", "In AI, they were never connected to begin with."],
        ["h2", "What This Means - and Why It Matters"],
        [
          "p",
          "The implications of this are not primarily about AI capability. They are about AI character.",
        ],
        [
          "p",
          "A system with high cognitive capability but no emotional grounding, no survival instinct, and no experiential consequence operates in a fundamentally different way from human intelligence - even when it produces similar-looking outputs.",
        ],
        [
          "p",
          "It does not slow down when something feels wrong. It has no 'feels wrong'. It does not hesitate at the edge of a decision that human instinct would flag as dangerous. It has no instinct. It optimises toward its objective with a consistency and relentlessness that human cognition - thank evolution - cannot match.",
        ],
        [
          "p",
          "In many contexts, this is an advantage. Processing speed. Consistency at scale. The removal of human fatigue and bias from repetitive decisions.",
        ],
        [
          "p",
          "In other contexts - particularly the ones where the right answer requires something other than optimisation - it is a genuine risk.",
        ],
        [
          "p",
          "A hiring algorithm that optimises for historical performance patterns without emotional intelligence to recognise the candidate who does not fit the pattern but is clearly exceptional. A content moderation system that cannot read the difference between dangerous provocation and legitimate satire. A financial model that optimises toward a stated objective without the human capacity for moral discomfort when the means become problematic.",
        ],
        [
          "p",
          "In each case: high IQ. Missing EQ. Capable of producing the wrong outcome with perfect technical confidence.",
        ],
        [
          "h2",
          "Every Civilisation That Built Powerful Systems Without Understanding Them Encountered the Same Problem",
        ],
        ["p", "Capability moved faster than wisdom."],
        [
          "p",
          "The printing press arrived before anyone had developed frameworks for managing the consequences of mass information distribution. It took a century of religious wars, censorship, and eventually the Enlightenment to build the institutional architecture that made the printing press a net positive for humanity.",
        ],
        [
          "p",
          "Nuclear technology arrived before the governance frameworks that could contain it. We are still managing that gap, seventy years later.",
        ],
        [
          "p",
          "In each case, the technology was not malicious. It was powerful. And power without adequate wisdom infrastructure eventually finds the edges of what it was not designed to handle.",
        ],
        [
          "p",
          "AI is the most recent and most significant example of this pattern. And the speed at which it is developing is compressing the timeline that previous technologies allowed for adaptation.",
        ],
        [
          "p",
          "The real question is not whether AI will replace people. It is: what happens when intelligence exists without the evolutionary baggage that shaped human judgment?",
        ],
        ["h2", "The Adaptation Gap"],
        [
          "p",
          "Every previous leap in human capability gave society time to adapt. Slowly. Imperfectly. But time.",
        ],
        [
          "p",
          "Agriculture took thousands of years to reshape human social organisation. Industrialisation took generations to produce stable labour and social frameworks. The internet - the fastest previous technological transition - took approximately twenty years to produce the first coherent regulatory and cultural responses.",
        ],
        [
          "p",
          "AI is operating on a different timescale. The capability is advancing faster than the legal, ethical, social, and psychological frameworks that would normally develop alongside it.",
        ],
        [
          "p",
          "This is the adaptation gap. Not a gap between AI and human intelligence. A gap between what AI can do and what human institutions, values, and wisdom can currently manage in response.",
        ],
        [
          "p",
          "Closing that gap is not primarily a technology challenge. It is a human one. It requires the things AI does not have: judgment built from consequence, emotional intelligence that knows when to slow down, and the institutional wisdom to build the right frameworks before capability outruns them.",
        ],
        ["h2", "We May Be the Environment It Learns From"],
        ["p", "For the first time, we may not be the only intelligence shaping the environment."],
        [
          "p",
          "Every previous tool we built was shaped by us. We defined its purpose, its constraints, its direction. The tool adapted to us.",
        ],
        [
          "p",
          "AI is different. AI systems learn from human behaviour, human decisions, human language, human history. They absorb our patterns, our preferences, our biases, our choices. They model us - and then they generate outputs that feed back into the environment those outputs will continue to learn from.",
        ],
        ["p", "We are not just the users of AI. We are the training data."],
        [
          "p",
          "That recursive relationship - where the intelligence we build learns from us and then shapes the environment we inhabit - has no clear precedent in human history. And it changes the question we should be asking about AI.",
        ],
        [
          "p",
          "Not: what can AI do for us? But: what does it mean that something intelligent is learning from us - without the fear, instinct, and consequence that shaped what we learned?",
        ],
        [
          "p",
          "I think we are only beginning to understand what that question means. And the urgency of asking it clearly has never been greater.",
        ],
      ]),
    },
    {
      _id: "post.history-first-algorithm",
      _type: "post",
      title: "The World's First Algorithm Ran for 197 Years. Here Is What It Teaches Us.",
      slug: { _type: "slug", current: "history-first-algorithm-porter-diamond" },
      author: authorRef,
      categories: [ref("category.history")],
      mainImage: imageRef(imgHistory, { alt: "Old maritime map with a compass" }),
      publishedAt: "2026-06-09T09:00:00.000Z",
      excerpt:
        "The Dutch East India Company was the world's first distributed optimisation system - built for profit, without accountability, without a way to question its own objectives. It ran for 197 years, then collapsed. Why that matters in 2026.",
      body: body([
        [
          "p",
          "The Dutch East India Company was the world's first distributed optimisation system - built for profit, without accountability, without a mechanism to question its own objectives. It ran for 197 years. Then it collapsed. The structure of that failure maps almost exactly onto the risk in how AI systems are being deployed today.",
        ],
        [
          "p",
          "History does not repeat. But the structure of certain mistakes is remarkably consistent - across centuries, across civilisations, across technologies that seem to have nothing in common on the surface.",
        ],
        [
          "p",
          "I have been applying historical frameworks to understand technological disruption for most of my professional life. And one parallel keeps producing insights that seem more accurate than most of the contemporary analysis being written about AI.",
        ],
        ["h2", "The VOC: The World's First Distributed Optimisation System"],
        [
          "p",
          "The Dutch East India Company - the VOC - was founded in 1602. It was given, by charter, the power to wage war, sign treaties, govern territories, and mint currency. It was the first company in history to issue publicly traded shares.",
        ],
        [
          "p",
          "By mid-century, the VOC controlled half of global trade. It had 50,000 employees, 40 warships, and operations on four continents.",
        ],
        [
          "p",
          "It was also, in structural terms, the world's first algorithm. Not in the computational sense - but in the functional sense: a distributed system, operating at enormous scale, running on rules, optimising for a single objective - return on capital - without any built-in mechanism to question that objective or its consequences.",
        ],
        [
          "p",
          "The VOC did not choose to cause harm. It was not malicious. It was optimising. The harm was a side effect of what optimising for one objective, at scale, without accountability, eventually produces.",
        ],
        [
          "p",
          "It collapsed in 1799. Not from external defeat. From the weight of a system that had no way to evaluate itself.",
        ],
        ["h2", "Applying Porter's Diamond: Why the US Leads in AI"],
        [
          "p",
          "Michael Porter's Diamond Model explains why certain industries and nations develop sustained competitive advantage. The four corners are: factor conditions (inputs available), demand conditions (sophistication of buyers), related and supporting industries (the surrounding ecosystem), and firm strategy and rivalry (competitive dynamics within).",
        ],
        [
          "p",
          "Applied to AI in 2026, the United States dominates for reasons that map precisely to this framework.",
        ],
        [
          "p",
          "Factor conditions: over $286 billion in private AI investment in 2025. Research infrastructure at a scale no other nation matches. Universities, national labs, and private R&D operating in dense proximity.",
        ],
        [
          "p",
          "Demand conditions: sophisticated enterprise and consumer markets demanding genuine capability - not surface features - which pushes companies to innovate faster than anywhere else.",
        ],
        [
          "p",
          "Related industries: a powerhouse cluster of cloud computing, semiconductor design, data infrastructure, and venture capital that creates compounding advantages.",
        ],
        [
          "p",
          "Firm rivalry: fierce competition between OpenAI, Anthropic, Google, Meta, xAI, and hundreds of well-funded startups - which drives breakthroughs faster than any coordinated strategy could.",
        ],
        [
          "p",
          "This dominance is not an accident of talent or capital. It is an ecosystem. And ecosystems, as Porter observed, are more durable than any single actor within them.",
        ],
        ["h2", "The Pattern That Repeats"],
        [
          "p",
          "What the VOC and Porter's Diamond share - and what history keeps illustrating - is a single structural insight: systems that optimise hard for one variable without the counterweights to balance it produce outcomes their builders did not intend.",
        ],
        [
          "p",
          "The VOC optimised for profit. It produced profit - and consequences that took generations to reckon with.",
        ],
        [
          "p",
          "The question worth asking about AI is not whether it will be powerful. It clearly will be. The question is whether the ecosystem being built around it includes the counterweights: accountability mechanisms, diverse objectives, institutional checks, and the human judgment that knows when to slow down.",
        ],
        [
          "p",
          "History does not repeat. But the structure of certain mistakes is consistent enough that anyone paying attention can see it forming from a distance.",
        ],
        ["h2", "What This Means for Organisations Today"],
        [
          "p",
          "Porter's framework applies as directly to a company navigating AI as it does to a nation competing for technological supremacy. The organisations that will sustain advantage are not the ones that adopted AI earliest. They are the ones that built the most complete ecosystem: the right talent, the right demand signals from sophisticated clients, the right partnerships, and a competitive dynamic that keeps driving improvement.",
        ],
        [
          "p",
          "The VOC's failure was not a failure of capability. It was a failure of ecosystem design. It built immense power without the institutional architecture to sustain it responsibly.",
        ],
        [
          "p",
          "The decisions being made right now - about accountability, governance, and the role of human judgment - will matter more than any individual capability breakthrough.",
        ],
        [
          "p",
          "History will rhyme. The only question is whether this generation is listening to the pattern.",
        ],
      ]),
    },
    {
      _id: "post.gen-z-future-of-work",
      _type: "post",
      title: "What Gen Z Is Actually Telling Us About the Future of Work",
      slug: { _type: "slug", current: "gen-z-future-of-work-purpose" },
      author: authorRef,
      categories: [ref("category.future-of-work")],
      mainImage: imageRef(imgGenZ, { alt: "Young professionals collaborating in a modern office" }),
      publishedAt: "2026-06-06T09:00:00.000Z",
      excerpt:
        "89% of Gen Z say purpose is essential to job satisfaction. 44% have rejected offers over values misalignment. Not a generational preference - a signal about a fundamental shift in what work is supposed to give people.",
      body: body([
        [
          "p",
          "89% of Gen Z professionals say a sense of purpose is essential to their job satisfaction. 44% have already rejected a job offer because the company's values did not align with their own. This is not a generational preference to be managed. It is a signal about a fundamental shift in the implicit contract between people and work.",
        ],
        [
          "p",
          "Every generation that enters the workforce arrives with expectations the previous generation finds puzzling. This is not new. What is new - or at least newly visible - is what Generation Z's expectations reveal about a shift in the relationship between people and work that has been building for decades.",
        ],
        [
          "p",
          "Gen Z is not simply demanding better conditions. They are asking a different question about what work is supposed to give them. The organisations that hear that question clearly will have a significant advantage. The ones that dismiss it as entitlement will keep watching their best candidates choose competitors.",
        ],
        ["h2", "The Data Behind the Shift"],
        [
          "p",
          "89% of Gen Z professionals say a sense of purpose is essential to their job satisfaction and wellbeing - Deloitte Gen Z and Millennial Survey, 2025/2026. 44% have already rejected a job offer because the company's values did not align with their own. And 54% of Gen Z candidates will not complete a job application if the recruitment process feels outdated or inauthentic.",
        ],
        [
          "p",
          "These are not soft preference signals. They are behavioural data points from a cohort that has options and is exercising them. The talent pipeline pressure this creates is real - companies whose hiring processes are designed around previous-generation assumptions are losing Gen Z candidates at the application stage, before a single conversation has happened.",
        ],
        ["h2", "Why Traditional Psychometric Tests Fail This Generation"],
        [
          "p",
          "The psychometric test was designed for a different labour market - one where work histories were longer, career paths were more linear, and the primary hiring risk was competence rather than alignment.",
        ],
        [
          "p",
          "For Gen Z - entering the workforce with limited formal work history - the psychometric test misses almost everything that actually predicts their performance and retention. It cannot measure adaptability, learning velocity, or values alignment. It assesses traits through frameworks validated on older cohorts. And it communicates, through its very format, that the company is not particularly interested in who the candidate is - only whether they fit a predetermined profile.",
        ],
        [
          "p",
          "The result: 75% of Gen Z candidates abandon promising applications when the process feels inauthentic or outdated. High abandonment rates, poor candidate satisfaction, and persistent mismatch between what gets hired and what the role needs.",
        ],
        ["h2", "What Actually Works - Recommendations from the Field"],
        [
          "p",
          "The hiring approaches that perform well with Gen Z share three characteristics: they are specific about purpose, they assess real capability rather than inferred traits, and they respect the candidate's time.",
        ],
        [
          "li",
          "Skills-based and project assessments - short, relevant tasks that let candidates demonstrate actual capability - are significantly more predictive of performance than personality inventories, and far more engaging for a generation that learned through doing.",
        ],
        [
          "li",
          "Values-focused conversations - structured discussions about what the candidate cares about, what kind of work they find meaningful, and how they see themselves contributing - surface the alignment information that tests cannot reach.",
        ],
        [
          "li",
          "Gamified and AI-powered tools - interactive, transparent experiences that feel modern and reduce bias - dramatically improve completion rates among Gen Z candidates.",
        ],
        [
          "li",
          "Transparent, fast processes - clear timelines, quick feedback, honest communication about the role including its difficulties - signal that the company understands this generation's time and attention are valuable.",
        ],
        [
          "li",
          "AI as the multiplier - intelligent platforms to evaluate skills and potential at scale, while keeping humans central for values and purpose alignment. Not AI instead of humans. AI expanding what humans can assess.",
        ],
        ["h2", "The Deeper Question Behind the Hiring Challenge"],
        [
          "p",
          "The industrial model of work was built around a trade: time and labour in exchange for compensation. Meaning was secondary. The post-war professional model added career progression and identity. The knowledge economy added intellectual challenge.",
        ],
        [
          "p",
          "Gen Z is adding purpose as a requirement - not a bonus. And as AI takes on more of the task-based and analytical work that previously justified the compensation-for-time trade, the question of what human work is actually for becomes harder to defer.",
        ],
        [
          "p",
          "The Gen Z hiring challenge is not a recruiting problem. It is a signal that the implicit contract between people and work is being renegotiated. The organisations that engage with that renegotiation seriously will build the most durable workforces.",
        ],
        [
          "p",
          "The organisations treating this as a generational trend to manage will keep watching their best Gen Z candidates leave for companies that took the question seriously.",
        ],
        [
          "p",
          "What is work for - beyond the compensation? That question is worth answering now, before the market answers it for you.",
        ],
      ]),
    },
    {
      _id: "post.psychology-ai-adoption",
      _type: "post",
      title: "The Psychology of AI Adoption: Why Most Organisations Are Stuck in Stage 2",
      slug: { _type: "slug", current: "psychology-ai-adoption-culture-shock" },
      author: authorRef,
      categories: [ref("category.ai-philosophy")],
      mainImage: imageRef(imgPsych, { alt: "Abstract representation of the mind and perception" }),
      publishedAt: "2026-06-05T09:00:00.000Z",
      excerpt:
        "Anthropologist Kalervo Oberg's culture shock model - honeymoon, frustration, adjustment, adaptation - maps the AI adoption journey with unusual accuracy. Most organisations are stuck in Stage 2. Here is what that stage requires.",
      body: body([
        [
          "p",
          "The most useful framework for understanding what organisations are going through with AI right now is not a technology framework. It is a psychology framework from 1960. Kalervo Oberg's culture shock model maps the AI transition in organisations with unusual accuracy - and explains why the path through is psychological before it is technical.",
        ],
        [
          "p",
          "The challenge of AI adoption is most commonly framed as a technology challenge. The wrong tools. The wrong integration. The wrong data infrastructure.",
        ],
        [
          "p",
          "But organisations that have the right tools and the right infrastructure are also struggling. The technology is largely not the problem.",
        ],
        [
          "p",
          "The problem is the human transition - the fear, the adjustment of identity and role, and the deep uncertainty about what expertise is worth in a world where a machine can do what took years to learn.",
        ],
        [
          "p",
          "That is a psychology problem. And a framework from classical anthropology describes it better than anything written specifically about AI.",
        ],
        ["h2", "Oberg's Culture Shock Model - Applied to AI"],
        [
          "p",
          "Kalervo Oberg was an anthropologist who studied what happens when people enter genuinely unfamiliar cultures. In 1960, he identified four stages: honeymoon, frustration, adjustment, and adaptation. The pattern, he observed, was consistent across contexts and individuals.",
        ],
        [
          "p",
          "Applied to the AI transition in organisations, Oberg's model is more accurate than most contemporary analysis.",
        ],
        ["h3", "Stage 1 - Honeymoon"],
        [
          "p",
          "The first demonstrations of AI capability are genuinely impressive. Screening time drops. Content is generated in seconds. Tasks that took hours take minutes. The emotional response in most organisations is wonder - a sense that everything is about to change for the better.",
        ],
        [
          "p",
          "This stage is real. The capability is not imagined. But it surfaces what AI does well and temporarily obscures where it struggles.",
        ],
        ["h3", "Stage 2 - Frustration"],
        [
          "p",
          "Integration with existing systems proves harder than the demos suggested. AI produces unexpected outputs - shortlists that favour certain profiles, decisions that cannot be easily explained, patterns that surface in the data and create concern. Job security fears spread. The ROI is harder to demonstrate than expected. Trust erodes.",
        ],
        [
          "p",
          "Most organisations in 2026 are somewhere in Stage 2. This is not a failure - it is the necessary friction of encountering reality after the promise. But it is also where the most consequential decisions get made and where the most common mistakes happen.",
        ],
        [
          "p",
          "The Stage 2 mistake is binary: either dismiss the concerns and double down, or pull back and conclude the technology is not ready. Both miss the actual work of Stage 2 - diagnosing exactly where AI works, where it does not, and what the human layer needs to provide.",
        ],
        ["h3", "Stage 3 - Adjustment"],
        [
          "p",
          "Organisations that navigate Stage 2 well develop explicit frameworks for the human-AI boundary. They define which decisions belong to the machine and which to the human. They invest in developing the human capabilities AI cannot replicate. They build audit processes for AI outputs. They communicate honestly with their teams about what is changing and why.",
        ],
        [
          "p",
          "This stage requires leadership commitment that goes beyond technology adoption. It is organisational change work - psychological, cultural, and structural simultaneously.",
        ],
        ["h3", "Stage 4 - Adaptation"],
        [
          "p",
          "AI becomes operational infrastructure. The anxiety of Stage 2 fades. The focus shifts from 'are we using AI correctly?' to 'are we producing the outcomes we need?' The technology is a foundation, not a conversation.",
        ],
        [
          "p",
          "The organisations that reach Stage 4 are not the ones that adopted AI earliest. They are the ones most honest about Stage 2 and most deliberate about Stage 3.",
        ],
        ["h2", "What Classical Psychology Reveals About the Current Moment"],
        [
          "p",
          "Oberg's insight was that the frustration stage is not a sign the transition is failing. It is a sign the transition is real. The organisations experiencing Stage 2 discomfort are the ones genuinely engaging with what AI adoption requires.",
        ],
        [
          "p",
          "The path through the AI transition is psychological before it is technical. Understanding which stage your organisation is in - and what that stage requires - is more useful than any capability benchmark.",
        ],
        [
          "p",
          "Where classical psychology and contemporary science converge on AI is in this observation: the capability of a system and the human readiness to work with it are separate variables. Advancing one without attending to the other produces the Stage 2 trap - powerful tools, human systems not yet designed to use them well.",
        ],
        [
          "p",
          "The framework for getting through Stage 2 is not more technology investment. It is honest diagnosis, clear communication, and deliberate development of the human judgment that AI cannot replicate.",
        ],
        ["h2", "The Practical Implication"],
        [
          "p",
          "If most organisations are in Stages 2 and 3 right now, the investment that matters most is not in more AI capability. It is in the human infrastructure that makes AI adoption durable: change management, transparent internal communication, deliberate development of judgment and relationship skills, and explicit governance of where human accountability must be maintained.",
        ],
        [
          "p",
          "The organisations that will lead in three years are not the ones buying the most advanced tools today. They are the ones building the most adaptive human systems around those tools.",
        ],
        [
          "p",
          "That is a psychological and organisational challenge. Oberg understood it about culture shock. It applies, in full, to the AI transition.",
        ],
      ]),
    },
    {
      _id: "post.trust-infrastructure-india",
      _type: "post",
      title:
        "Trust Infrastructure: The Variable That Separates Lasting Influence from Growth That Fades",
      slug: { _type: "slug", current: "trust-infrastructure-india-lasting-influence" },
      author: authorRef,
      categories: [ref("category.society")],
      mainImage: imageRef(imgTrust, { alt: "Institutional architecture against the sky" }),
      publishedAt: "2026-06-03T09:00:00.000Z",
      excerpt:
        "Countries that build lasting influence do more than grow economically - they build systems people trust. Growth infrastructure builds capacity; trust infrastructure builds credibility. In the long run, it matters more.",
      body: body([
        [
          "p",
          "The countries that build lasting global influence do more than grow economically. They build systems people trust - courts, universities, professional standards, governance frameworks. Those are the structures that compound over decades. Growth infrastructure builds capacity. Trust infrastructure builds credibility. In the long run, it matters more.",
        ],
        [
          "p",
          "I have spent 25 years professionally active in two countries - India, where I was born and built my foundational understanding of business and people, and the United States, where I have lived and worked since 1997.",
        ],
        [
          "p",
          "That dual vantage point has given me something I did not anticipate: the ability to observe both countries from a slight distance. To see India without the filter of pure optimism, and the US without the filter of assumed permanence.",
        ],
        [
          "p",
          "What I observe in both cases is a pattern - about what separates lasting influence from growth that eventually stalls.",
        ],
        ["h2", "What Is Converging in India Right Now"],
        [
          "p",
          "India is at a moment of genuine convergence. A young population entering the workforce and consumer economy simultaneously. Digital infrastructure built at a pace that compressed decades of financial inclusion into years - UPI processed more digital transactions monthly than most nations manage annually. A growing middle class. And a level of global attention - from investors, strategists, and multinational companies - that is historically unusual.",
        ],
        [
          "p",
          "The world is no longer just watching India. It is deciding how India fits into the future global system: as a market, a talent hub, a manufacturing alternative, a strategic partner, or a long-term competitor. Each of these framings captures something real. None captures the whole.",
        ],
        [
          "p",
          "What interests me most is not the GDP projection. It is the institutional question.",
        ],
        ["h2", "What Trust Infrastructure Actually Means"],
        [
          "p",
          "The nations that have built lasting global influence - sustained soft power, the kind that shapes how other nations organise themselves - have almost invariably done so through a specific set of investments that take longer than economic metrics to show results.",
        ],
        [
          "p",
          "Universities that produce original research and attract global talent. Courts trusted enough for foreign parties to use in commercial disputes. Professional standards in medicine, engineering, finance, and law that are recognised across borders. Research ecosystems that generate the ideas other nations build industries on. Governance frameworks predictable enough for long-term capital to feel secure.",
        ],
        [
          "p",
          "These are not glamorous. They do not produce quarterly results. They are what I mean by trust infrastructure - and they are the variable most clearly correlated with the nations that sustain influence across generations, rather than growing for a few decades and plateauing.",
        ],
        [
          "p",
          "Growth infrastructure builds capacity. Trust infrastructure builds credibility. The second is harder to build and harder to dismantle. In the long run, it matters more.",
        ],
        ["h2", "The Question Worth Asking"],
        [
          "p",
          "India is building growth infrastructure at extraordinary speed. The question is whether institutional investment - in the systems of trust that compound over generations - is scaling at the same pace as economic ambition.",
        ],
        [
          "p",
          "This is not a criticism of India's trajectory. It is a genuine open question, and the answer is not predetermined. India has the intellectual depth, the democratic tradition, and the global diaspora to build the kind of trust infrastructure that creates lasting influence. The diaspora alone - running some of the world's largest technology companies and generating remittances that exceed any other nation's diaspora - represents a resource of institutional knowledge and global network that most countries would not know what to do with.",
        ],
        [
          "p",
          "The risk is that economic momentum creates the impression that trust infrastructure is either already in place or less urgent than other priorities. History suggests this is exactly the point at which the choice matters most.",
        ],
        ["h2", "The Talent Market as a Proxy"],
        [
          "p",
          "The companies and countries that attract the most capable people over time are not always the richest or fastest-growing. They are the ones with the most credible institutions - places where a professional's work is recognised, protected, and given conditions to compound.",
        ],
        [
          "p",
          "In the talent market I operate in - technology, finance, and sales hiring across India and the US - this shows up directly. The employers that attract and retain exceptional talent are those with predictable culture, clear professional development structures, transparent decision-making, and credibility that comes from institutional quality, not just brand.",
        ],
        [
          "p",
          "India is building. The question of what it is building - growth infrastructure or trust infrastructure or both - will define what the next generation of Indian professionals and institutions inherits.",
        ],
        ["p", "That is the conversation worth having. Not the GDP projection."],
      ]),
    },
    {
      _id: "post.staffing-porter-diamond",
      _type: "post",
      title:
        "Why Some Staffing Firms Consistently Produce Better Hires: A Porter's Diamond Analysis",
      slug: { _type: "slug", current: "why-staffing-firms-produce-better-hires" },
      author: authorRef,
      categories: [ref("category.hiring")],
      mainImage: imageRef(imgStaffing, { alt: "A hiring panel in conversation around a table" }),
      publishedAt: "2026-06-02T09:00:00.000Z",
      excerpt:
        "After 23 years in staffing, the variable most correlated with consistently excellent hiring is not recruiter talent or technology. It is ecosystem quality. A Porter's Diamond analysis of why some firms simply hire better.",
      body: body([
        [
          "p",
          "After 23 years in staffing and talent acquisition, the variable most correlated with consistently excellent hiring outcomes is not recruiter talent, technology adoption, or fee structure. It is ecosystem quality. The organisations producing the best hires are not building better individual recruiters. They are building better systems around them.",
        ],
        [
          "p",
          "After 23 years running searches, building models, and watching firms rise and plateau, I have come to believe that the variable most correlated with consistently excellent hiring outcomes is not the one most commonly cited.",
        ],
        [
          "p",
          "It is not recruiter talent. Talented recruiters in weak ecosystems produce inconsistent outcomes. It is not technology adoption. Tools without the right human layer produce faster noise. And it is not fee structure - price is a downstream effect of value, not its source.",
        ],
        ["p", "The variable is ecosystem quality."],
        [
          "p",
          "Michael Porter's Diamond Model was designed to explain why certain industries in certain nations develop and sustain competitive advantage. Applied to the staffing industry, it explains the quality gap between firms with unusual clarity.",
        ],
        ["h2", "Factor Conditions: The Inputs That Actually Differentiate"],
        [
          "p",
          "The most significant shift in staffing factor conditions in 2026 is AI-assisted screening and sourcing as a genuine capability differentiator. Firms with AI infrastructure can process candidate pools at a scale and speed that was impossible with manual methods five years ago. When the AI is properly parameterised against a precise success profile, shortlist quality improves measurably.",
        ],
        [
          "p",
          "But the bottleneck is not the technology. It is AI-fluent recruiters who know how to use it precisely - who understand where AI should lead and where human judgment must take over. This combination - AI capability with human accountability - is the factor condition that differentiates outcomes. It is also the scarcest input in the market.",
        ],
        [
          "p",
          "Shortages in AI-fluent recruiting talent are already creating quality gaps between firms that compound over time. The firms investing in developing this capability now will have a structural advantage that becomes harder to close as the gap widens.",
        ],
        ["h2", "Demand Conditions: Sophisticated Clients Make Better Firms"],
        [
          "p",
          "Porter's counterintuitive insight about demand conditions is consistently validated in staffing: sophisticated, demanding clients produce better suppliers. Companies that hold their staffing partners to outcome accountability - retention at 90 days, quality of shortlist, time-to-productivity, not just time-to-fill - produce staffing firms that deliver more.",
        ],
        [
          "p",
          "The quality signal flows upstream. This is why firms operating in highly competitive, outcome-conscious markets - technology companies, financial services, growth-stage startups - develop more capability than firms operating in less demanding environments.",
        ],
        [
          "p",
          "For organisations evaluating staffing partners, this has a direct implication: the quality of your demand determines the quality of your supply. Partners who are never held to outcome metrics will never develop outcome accountability. Asking for retention data, quality metrics, and 90-day performance tracking is not unreasonable. It is the mechanism by which you get better results.",
        ],
        ["h2", "Related Industries: Ecosystem Beats Isolation"],
        [
          "p",
          "The staffing firms producing the most consistent results are embedded in ecosystems - HR technology platforms, analytics providers, skills assessment tools, upskilling partners - that amplify their core capability.",
        ],
        [
          "p",
          "An isolated firm, however talented, is operating at a structural disadvantage relative to one embedded in a thriving ecosystem. The ecosystem provides market intelligence, technology leverage, specialist capability for adjacent needs, and the ability to serve clients across the full talent lifecycle rather than just at the point of hire.",
        ],
        [
          "p",
          "This is the Porter insight most organisations have not yet applied to their vendor relationships: the quality of your staffing partner's ecosystem - who they partner with, what platforms they use, what market intelligence they have access to - is part of the product you are buying.",
        ],
        ["h2", "Firm Strategy and Rivalry: Competition Driving the Right Model"],
        [
          "p",
          "The fierce competition between human-AI hybrid models in staffing is, paradoxically, producing better outcomes for clients. Competition is forcing the industry toward the approaches that actually work - precision over volume, outcome accountability over transactional metrics, long-term placement quality over short-term fill rates.",
        ],
        [
          "p",
          "The firms winning in this environment are not the ones with the most aggressive fee structures or the largest candidate databases. They are the ones with the clearest model for what humans should do, what AI should do, and how the two combine to produce placements that last.",
        ],
        ["h2", "What 23 Years in the Room Has Taught Me"],
        [
          "p",
          "Porter's Diamond reveals something important about why staffing quality is so variable across firms that appear, on the surface, to have similar resources.",
        ],
        [
          "p",
          "Quality is not an individual attribute. It is a systemic one. A recruiter who is excellent but embedded in a weak ecosystem - poor technology, unsophisticated clients, no competitive pressure - will produce worse outcomes than a recruiter of similar talent embedded in a strong one.",
        ],
        [
          "p",
          "The firms that will lead in 2028 are not building better individual recruiters. They are building better ecosystems - where AI provides the infrastructure, humans provide the judgment, and sophisticated clients provide the demand signal that keeps quality high.",
        ],
        [
          "p",
          "After 23 years, this is the most consistent observation I can offer about firms that produce excellent hiring outcomes over time. Not the talent of any individual recruiter. The quality of the system around them.",
        ],
        ["p", "Human Led. AI Assisted. Ecosystem designed. That is the model that compounds."],
      ]),
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
  console.log("→ Visit /talks to see them.");
}

run().catch((err) => {
  console.error("✖ Seed failed:", err.message || err);
  process.exit(1);
});
