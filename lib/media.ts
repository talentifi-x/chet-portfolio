// Media appearances - single source of truth shared by the /media page and the
// homepage preview. Add new entries here and they show up in both places
// (the homepage shows the first 4 and links to /media for the rest).
//
// Mirrors the "TalentiFi-X Media Page: All 27 Coverage Items" doc, which is the
// source of truth for every headline, date, link and image here. Ordered
// strictly newest-first by `date`; keep that order when adding an entry.
//
// Every card image is the publisher's own article artwork, mirrored into
// /public/images/media rather than hotlinked, so a publisher adding hotlink
// protection later cannot blank a card. The four LinkedIn entries are reshares
// of pieces already listed, so each carries the image of the piece it reshares.

export type MediaItem = {
  outlet: string;
  type: string;
  title: string;
  excerpt: string;
  href: string;
  /** ISO publication date - the list is sorted on this, newest first. */
  date: string;
  image?: string;
  /** Small square brand mark shown next to the outlet name. */
  logo?: string;
};

export const mediaItems: MediaItem[] = [
  {
    outlet: "Analytics Insight",
    type: "Authored Article",
    title:
      "The Human-AI Workforce: What Should Companies Automate, and What Should They Never Automate?",
    excerpt:
      "An authored piece on drawing the line between the work AI should take over and the judgement calls companies should never hand across.",
    href: "https://www.analyticsinsight.net/artificial-intelligence/the-human-ai-workforce-what-should-companies-automate-and-what-should-they-never-automate",
    date: "2026-10-19",
    image: "/images/media/analytics-insight-human-ai-workforce.webp",
    logo: "/images/logos/analytics-insight.webp",
  },
  {
    outlet: "The Week",
    type: "Authored Article",
    title:
      "The rise of the 'unhireable' candidate: When good professionals don't fit recruitment filters",
    excerpt:
      "On the capable people screened out before a human ever reads them - and what recruitment filters are really selecting for.",
    href: "https://www.theweek.in/news/biz-tech/2026/10/12/the-rise-of-the-unhireable-candidate-when-good-professionals-dont-fit-recruitment-filters.html",
    date: "2026-10-12",
    image: "/images/media/the-week-unhireable-candidate.webp",
    logo: "/images/logos/the-week.webp",
  },
  {
    outlet: "Lokmat Times",
    type: "Print Column",
    title: "Entry-Level Jobs Are Disappearing. What Will Freshers Do Instead?",
    excerpt:
      "A print column on what happens to India's graduates when the first rung of the ladder is automated away - and what they should build instead.",
    href: "https://epaper.lokmat.com/lokmattimes/main-editions/Nagpur%20Main/2026-09-27/11",
    date: "2026-09-27",
    image: "/images/media/lokmat-times-entry-level-jobs.webp",
    logo: "/images/logos/lokmat-times.webp",
  },
  {
    outlet: "Business Today",
    type: "Industry Story",
    title: "BT Big Story: Why India Inc is warming up to non-English-speaking executives",
    excerpt:
      "Expert commentary on why fluency in English is slipping as a hiring filter, and what Indian boardrooms are starting to value instead.",
    href: "https://www.businesstoday.in/jobs/story/bt-big-story-why-india-inc-is-warming-up-to-non-english-speaking-executives-557092-2026-09-23",
    date: "2026-09-23",
    image: "/images/media/business-today-non-english-speaking-executives.webp",
    logo: "/images/logos/business-today.webp",
  },
  {
    outlet: "Business Standard",
    type: "Industry Story",
    title: "As AI agents grow more autonomous, India faces a safety-regulation test",
    excerpt:
      "On the governance gap opening up as AI agents start acting without a human in the loop - and what India's regulators have to settle.",
    href: "https://www.business-standard.com/technology/tech-news/ai-agents-safety-india-guardrails-frontier-models-hugging-face-openai-126092301026_1.html",
    date: "2026-09-23",
    image: "/images/media/business-standard-ai-agents-safety.webp",
    logo: "/images/logos/business-standard.webp",
  },
  {
    outlet: "CXO Herald",
    type: "LinkedIn",
    title: "The New War for Talent Is Not About Hiring More People",
    excerpt:
      "The CXO Herald interview shared on LinkedIn - why the hiring race is no longer about headcount, but about people who multiply everyone around them.",
    href: "https://www.linkedin.com/posts/ceo-chro-ai-share-7505612601167458306-Eb2s",
    date: "2026-09-17",
    image: "/images/media/cxo-herald-new-war-for-talent.webp",
    logo: "/images/logos/cxo-herald.webp",
  },
  {
    outlet: "India Today",
    type: "Industry Story",
    title: "The next AI job is not just coding: Meet the engineers who solve people problems",
    excerpt:
      "On the rise of forward-deployed engineers - the roles where business judgement matters as much as the code.",
    href: "https://www.indiatoday.in/jobs/story/fde-jobs-in-india-forward-deployed-engineers-ai-jobs-with-business-coding-skills-educ-2994960-2026-09-15",
    date: "2026-09-15",
    image: "/images/media/india-today-forward-deployed-engineers.webp",
    logo: "/images/logos/india-today.svg",
  },
  {
    outlet: "CXO Herald",
    type: "Interview",
    title:
      "The New War for Talent Is Not About Hiring More People. It Is About Hiring People Who Multiply",
    excerpt:
      "A long-form conversation on building TalentiFi-X, and why the new war for talent is about hiring people who multiply.",
    href: "https://cxoherald.com/interview-the-new-war-for-talent-is-not-about-hiring-more-people-it-is-about-hiring-people-who-multiply/",
    date: "2026-09-15",
    image: "/images/media/cxo-herald-new-war-for-talent.webp",
    logo: "/images/logos/cxo-herald.webp",
  },
  {
    outlet: "Business Standard",
    type: "Industry Story",
    title: "From Oracle to Amazon: Tech giants drive global wave of layoffs in 2026",
    excerpt:
      "Industry commentary on the 2026 layoff wave rolling through global tech - and what it signals about how teams are being rebuilt.",
    href: "https://www.business-standard.com/industry/news/global-tech-layoffs-2026-oracle-amazon-dell-uber-paypal-it-sector-job-cuts-126091100188_1.html",
    date: "2026-09-11",
    image: "/images/media/business-standard-global-tech-layoffs.webp",
    logo: "/images/logos/business-standard.webp",
  },
  {
    outlet: "Deccan Herald",
    type: "Industry Story",
    title: "AI layoffs are coming back to haunt companies: 30% may rehire workers by 2029",
    excerpt:
      "On the companies that cut too deep for AI and are now quietly hiring the same capability back.",
    href: "https://www.deccanherald.com/business/jobs-and-careers/ai-layoffs-are-coming-back-to-haunt-companies-30-may-rehire-workers-by-2029-4141033",
    date: "2026-09-10",
    image: "/images/media/deccan-herald-ai-layoffs-rehire.webp",
    logo: "/images/logos/deccan-herald.webp",
  },
  {
    outlet: "NDTV",
    type: "Industry Story",
    title:
      "Middle-Class Career Ladder Is Changing: What Happens When AI Takes Over Entry-Level Work",
    excerpt:
      "What happens to the middle-class career path when the entry-level rungs - the jobs people learned on - are the first to be automated.",
    href: "https://www.ndtv.com/business-news/middle-class-career-ladder-changing-what-happens-when-artificial-intelligence-takes-over-entry-level-job-11995505",
    date: "2026-09-03",
    image: "/images/media/ndtv-middle-class-career-ladder.webp",
    logo: "/images/logos/ndtv.svg",
  },
  {
    outlet: "Hindustan Times",
    type: "Authored Article",
    title: "India Inc's hiring reset is showing up on the balance sheet",
    excerpt:
      "An authored column on how the real cost of a broken hiring process stops being an HR metric and starts being a financial one.",
    href: "https://www.hindustantimes.com/ht-insight/economy/india-inc-s-hiring-reset-is-showing-up-on-the-balance-sheet-101787998487133.html",
    date: "2026-08-29",
    image: "/images/media/hindustan-times-hiring-reset.webp",
    logo: "/images/logos/hindustan-times.svg",
  },
  {
    outlet: "Rediff",
    type: "Authored Article",
    title: "Is AI Rejecting Your CV? 9 Mistakes To Avoid",
    excerpt:
      "A practical column on the nine things that get a CV filtered out before a human ever opens it.",
    href: "https://www.rediff.com/getahead/report/is-ai-rejecting-your-cv-9-mistakes-to-avoid/20260813.htm",
    date: "2026-08-13",
    image: "/images/media/rediff-ai-rejecting-your-cv.webp",
    logo: "/images/logos/rediff.svg",
  },
  {
    outlet: "Adgully",
    type: "Industry Story",
    title: "AI's biggest risk? The scale of a mistake",
    excerpt:
      "Featured commentary on why AI's real danger is the scale of its mistakes - and a three-layer safety net of reserves, insurance, and human oversight.",
    href: "https://www.adgully.com/post/19071/ais-biggest-risk-the-scale-of-a-mistake",
    date: "2026-08-10",
    image: "/images/media/adgully-ai-biggest-risk.webp",
    logo: "/images/logos/adgully.webp",
  },
  {
    outlet: "NDTV",
    type: "Industry Story",
    title: "Learning Is Free Online, So Why Are Parents Paying Lakhs For Education?",
    excerpt:
      "An industry story on why families keep paying premium fees when the lectures themselves are free - and what employers are really buying.",
    href: "https://www.ndtv.com/business-news/learning-is-free-online-so-why-is-education-costlier-than-ever-11877260",
    date: "2026-08-09",
    image: "/images/media/ndtv-learning-free-online.webp",
    logo: "/images/logos/ndtv.svg",
  },
  {
    outlet: "The Week",
    type: "Industry Story",
    title: "From IT to construction: How AI is reshaping India's job market for Gen Z",
    excerpt:
      "Expert commentary on how AI is reshaping India's job market for Gen Z - from IT to construction - and where hiring sentiment is heading.",
    href: "https://www.theweek.in/magazine/theweek/specials/2026/08/08/from-it-to-construction-how-ai-is-reshaping-indias-job-market-for-gen-z.html",
    date: "2026-08-08",
    image: "/images/media/the-week-ai-gen-z-job-market.webp",
    logo: "/images/logos/the-week.webp",
  },
  {
    outlet: "The Hans India",
    type: "Authored Article",
    title: "What students should know before entering the job market",
    excerpt:
      "An authored column on the skills, mindset, and AI-era realities students should understand before they step into today's job market.",
    href: "https://www.thehansindia.com/hans/education-careers/what-students-should-know-before-entering-the-job-market-1103472",
    date: "2026-07-31",
    image: "/images/media/hans-india-students-job-market.webp",
    logo: "/images/logos/hans-india.webp",
  },
  {
    outlet: "Sugermint",
    type: "Interview",
    title:
      "Rebuilding Hiring for the AI Age: Interview with Chetan Mangalwedhe, Founder & CEO of TalentiFi-X",
    excerpt:
      "A founder interview on the story behind TalentiFi-X and pairing AI speed with human judgement in enterprise hiring.",
    href: "https://sugermint.com/chetan-mangalwedhe-talentifi-x-interview/",
    date: "2026-07-28",
    image: "/images/media/sugermint-rebuilding-hiring-ai-age.webp",
    logo: "/images/logos/sugermint.webp",
  },
  {
    outlet: "CXO Xperts",
    type: "Interview",
    title: "The XPERT Talks: The Future of AI-Powered Hiring with Chetan Mangalwedhe",
    excerpt:
      "A video conversation on trust, AI, and how enterprises should rethink talent acquisition.",
    href: "https://www.youtube.com/watch?v=z_ioiiUn_28",
    date: "2026-06-30",
    image: "/images/media/cxo-xperts-hiring-right-talent.webp",
    logo: "/images/logos/cxo-xperts.webp",
  },
  {
    outlet: "CXO Xperts",
    type: "LinkedIn",
    title: "Trust, AI, and the Future of Enterprise Talent",
    excerpt:
      "The CXO Xperts conversation on building trust into AI-driven hiring, shared on LinkedIn.",
    href: "https://www.linkedin.com/feed/update/urn:li:share:7477682809650896896/",
    date: "2026-06-30",
    image: "/images/media/cxo-xperts-hiring-right-talent.webp",
    logo: "/images/logos/cxo-xperts.webp",
  },
  {
    outlet: "Business Standard",
    type: "Industry Story",
    title: "Beyond AI engineers: Sovereign AI may redefine India's IT talent pyramid",
    excerpt:
      "An industry story on how the rise of sovereign AI could reshape India's IT talent pyramid - well beyond just AI engineers.",
    href: "https://www.business-standard.com/technology/artificial-intelligence/beyond-ai-engineers-sovereign-ai-may-redefine-india-s-it-talent-pyramid-126063000144_1.html",
    date: "2026-06-30",
    image: "/images/media/business-standard-sovereign-ai-talent-pyramid.webp",
    logo: "/images/logos/business-standard.webp",
  },
  {
    outlet: "The Week",
    type: "Authored Article",
    title: "The limits of algorithmic hiring: Why AI cannot judge human potential",
    excerpt:
      "A guest opinion on the practical challenges AI introduces into hiring - and why they demand governance, not just adoption.",
    href: "https://www.theweek.in/news/biz-tech/2026/06/26/guest-opinion-ai-hiring-challenges.html",
    date: "2026-06-26",
    image: "/images/media/the-week-limits-of-algorithmic-hiring.webp",
    logo: "/images/logos/the-week.webp",
  },
  {
    outlet: "HR Today",
    type: "Authored Article",
    title: 'Why Artificial Intelligence Should Be Renamed "Duplicate Intelligence"',
    excerpt:
      "Why modern AI is less an autonomous intellect than a statistical remix of human output - and what that means for how we name and use it.",
    href: "https://hrtoday.in/insights/why-artificial-intelligence-should-be-renamed-duplicate-intelligence/",
    date: "2026-06-24",
    image: "/images/media/hr-today-duplicate-intelligence.webp",
    logo: "/images/logos/hr-today.svg",
  },
  {
    outlet: "HR Today",
    type: "LinkedIn",
    title: "Why 'Artificial' Intelligence Is Really Duplicate Intelligence",
    excerpt:
      "A LinkedIn take on why today's AI is less an original intellect than a high-scale remix of human work.",
    href: "https://www.linkedin.com/feed/update/urn:li:activity:7475494796187287552",
    date: "2026-06-24",
    image: "/images/media/hr-today-duplicate-intelligence.webp",
    logo: "/images/logos/hr-today.svg",
  },
  {
    outlet: "CXO Today",
    type: "Interview",
    title: "Building Trust in AI Workflows: TalentiFi-X's Blueprint for Modern Enterprise Hiring",
    excerpt:
      "Why legacy applicant tracking systems and keyword filters fall short - and how trust-centred AI workflows identify high-velocity learners.",
    href: "https://cxotoday.com/corner-office/building-trust-in-ai-workflows-talentifi-xs-blueprint-for-modern-enterprise-hiring/",
    date: "2026-06-10",
    image: "/images/media/cxo-today-trust-in-ai-workflows.webp",
    logo: "/images/logos/cxo-today.webp",
  },
  {
    outlet: "HR Today",
    type: "Authored Article",
    title: "Amoral Drift: The AI Hiring Risk Nobody in Talent Acquisition Is Talking About",
    excerpt:
      "How AI hiring systems quietly learn yesterday's patterns and narrow tomorrow's pipelines - and why it demands governance and human oversight.",
    href: "https://hrtoday.in/insights/amoral-drift-the-ai-hiring-risk-nobody-in-talent-acquisition-is-talking-about/",
    date: "2026-05-29",
    image: "/images/media/hr-today-amoral-drift.webp",
    logo: "/images/logos/hr-today.svg",
  },
  {
    outlet: "HR Today",
    type: "LinkedIn",
    title: "The AI Hiring Risk Nobody in Talent Acquisition Is Talking About",
    excerpt:
      "A LinkedIn note on how AI hiring systems quietly learn yesterday's patterns and narrow tomorrow's pipelines.",
    href: "https://www.linkedin.com/feed/update/urn:li:activity:7465753766022094850",
    date: "2026-05-29",
    image: "/images/media/hr-today-amoral-drift.webp",
    logo: "/images/logos/hr-today.svg",
  },
];
