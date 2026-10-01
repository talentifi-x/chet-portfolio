// Media appearances - single source of truth shared by the /media page and the
// homepage preview. Add new entries here and they show up in both places
// (the homepage shows the first 4 and links to /media for the rest).
//
// Mirrors the TalentiFi-X coverage sheet, newest first. Every row of that sheet
// that carries a link is represented here; the one print-only Dainik Bhaskar
// row has no URL to point at, so it is deliberately absent.
//
// Covers: publisher artwork is hotlinked where that actually works. HR Today
// runs Cloudflare hotlink protection so its art can never load off-site, and
// most of the newer outlets publish no reusable art - those entries use
// topical covers in /public/images/media. Where the same piece appears twice
// (an article plus its LinkedIn post) the two entries carry deliberately
// different covers so the grid never repeats an image.

export type MediaItem = {
  outlet: string;
  type: string;
  title: string;
  excerpt: string;
  href: string;
  image?: string;
  /** Small square brand mark shown next to the outlet name. */
  logo?: string;
};

export const mediaItems: MediaItem[] = [
  {
    outlet: "Lokmat Times",
    type: "Print",
    title: "Entry-Level Jobs Are Disappearing. What Will Freshers Do Instead?",
    excerpt:
      "A print column on what happens to India's graduates when the first rung of the ladder is automated away - and what they should build instead.",
    href: "https://epaper.lokmat.com/lokmattimes/main-editions/Nagpur%20Main/2026-09-27/11",
    image: "/images/media/freshers-corridor.jpg",
    logo: "/images/logos/lokmat-times-word.png",
  },
  {
    outlet: "Business Today",
    type: "Feature",
    title: "BT Big Story: Why India Inc Is Warming Up to Non-English-Speaking Executives",
    excerpt:
      "Expert commentary on why fluency in English is slipping as a hiring filter, and what Indian boardrooms are starting to value instead.",
    href: "https://www.businesstoday.in/jobs/story/bt-big-story-why-india-inc-is-warming-up-to-non-english-speaking-executives-557092-2026-09-23",
    image: "/images/media/boardroom-india.jpg",
    logo: "/images/logos/business-today-word.png",
  },
  {
    outlet: "Business Standard",
    type: "Feature",
    title: "As AI Agents Grow More Autonomous, India Faces a Safety-Regulation Test",
    excerpt:
      "On the governance gap opening up as AI agents start acting without a human in the loop - and what India's regulators have to settle.",
    href: "https://www.business-standard.com/technology/tech-news/ai-agents-safety-india-guardrails-frontier-models-hugging-face-openai-126092301026_1.html",
    image: "/images/media/ai-guardrails.jpg",
    logo: "/images/business-standard.png",
  },
  {
    outlet: "CXO Herald",
    type: "LinkedIn",
    title: "The New War for Talent Is Not About Hiring More People",
    excerpt:
      "The CXO Herald interview shared on LinkedIn - why the hiring race is no longer about headcount, but about people who multiply everyone around them.",
    href: "https://www.linkedin.com/posts/ceo-chro-ai-share-7505612601167458306-Eb2s",
    image: "/images/media/interview-mic.jpg",
    logo: "/images/logos/cxo-herald-word.png",
  },
  {
    outlet: "India Today",
    type: "Feature",
    title: "The Next AI Job Is Not Just Coding: Meet the Engineers Who Solve People Problems",
    excerpt:
      "On the rise of forward-deployed engineers - the roles where business judgement matters as much as the code.",
    href: "https://www.indiatoday.in/jobs/story/fde-jobs-in-india-forward-deployed-engineers-ai-jobs-with-business-coding-skills-educ-2994960-2026-09-15",
    image: "/images/media/people-problems.jpg",
    logo: "/images/logos/india-today-word.png",
  },
  {
    outlet: "CXO Herald",
    type: "Interview",
    title: "An Exclusive Interview with Chetan Mangalwedhe, Founder & CEO, TalentiFi-X",
    excerpt:
      "A long-form conversation on building TalentiFi-X, and why the new war for talent is about hiring people who multiply.",
    href: "https://cxoherald.com/interview-the-new-war-for-talent-is-not-about-hiring-more-people-it-is-about-hiring-people-who-multiply/",
    image: "/images/media/interview-set.jpg",
    logo: "/images/logos/cxo-herald-word.png",
  },
  {
    outlet: "Business Standard",
    type: "Feature",
    title: "From Oracle to Amazon: Tech Giants Drive Global Wave of Layoffs in 2026",
    excerpt:
      "Industry commentary on the 2026 layoff wave rolling through global tech - and what it signals about how teams are being rebuilt.",
    href: "https://www.business-standard.com/industry/news/global-tech-layoffs-2026-oracle-amazon-dell-uber-paypal-it-sector-job-cuts-126091100188_1.html",
    image: "/images/media/tech-layoffs.jpg",
    logo: "/images/business-standard.png",
  },
  {
    outlet: "Deccan Herald",
    type: "Feature",
    title: "AI Layoffs Are Coming Back to Haunt Companies: 30% May Rehire Workers by 2029",
    excerpt:
      "On the companies that cut too deep for AI and are now quietly hiring the same capability back.",
    href: "https://www.deccanherald.com/business/jobs-and-careers/ai-layoffs-are-coming-back-to-haunt-companies-30-may-rehire-workers-by-2029-4141033",
    image: "/images/media/layoff-box.jpg",
    logo: "/images/logos/deccan-herald-word.png",
  },
  {
    outlet: "NDTV",
    type: "Feature",
    title:
      "Middle-Class Career Ladder Is Changing: What Happens When AI Takes Over Entry-Level Work",
    excerpt:
      "What happens to the middle-class career path when the entry-level rungs - the jobs people learned on - are the first to be automated.",
    href: "https://www.ndtv.com/business-news/middle-class-career-ladder-changing-what-happens-when-artificial-intelligence-takes-over-entry-level-job-11995505",
    image: "/images/media/career-ladder.jpg",
    logo: "/images/logos/ndtv-word.png",
  },
  {
    outlet: "Hindustan Times",
    type: "Article",
    title: "India Inc's Hiring Problem Is Showing Up on the Balance Sheet",
    excerpt:
      "An authored column on how the real cost of a broken hiring process stops being an HR metric and starts being a financial one.",
    href: "https://www.hindustantimes.com/ht-insight/economy/india-inc-s-hiring-reset-is-showing-up-on-the-balance-sheet-101787998487133.html",
    image: "/images/media/balance-sheet.jpg",
    logo: "/images/logos/hindustan-times-word.png",
  },
  {
    outlet: "Rediff",
    type: "Article",
    title: "Is AI Rejecting Your CV? 9 Mistakes To Avoid",
    excerpt:
      "A practical column on the nine things that get a CV filtered out before a human ever opens it.",
    href: "https://www.rediff.com/getahead/report/is-ai-rejecting-your-cv-9-mistakes-to-avoid/20260813.htm",
    image: "/images/media/cv-screening.jpg",
    logo: "/images/logos/rediff-word.png",
  },
  {
    outlet: "Hindustan Times",
    type: "Article",
    title: "India Inc's Hiring Reset Is Showing Up on the Balance Sheet",
    excerpt:
      "The companion filing of the same HT Insight piece - why the correction is being measured in margins, not headcount.",
    href: "https://www.hindustantimes.com/ht-insight/economy/india-inc-s-hiring-reset-is-showing-up-on-the-balance-sheet-101787998487133.html",
    image: "/images/media/hiring-reset.jpg",
    logo: "/images/logos/hindustan-times-word.png",
  },
  {
    outlet: "Adgully",
    type: "Feature",
    title: "AI's Biggest Risk? The Scale of a Mistake",
    excerpt:
      "Follow-up coverage of the argument that AI's real danger is not error itself but the scale at which a single error propagates.",
    href: "https://www.adgully.com/post/19071/ais-biggest-risk-the-scale-of-a-mistake",
    image: "/images/media/domino-risk.jpg",
    logo: "/images/logos/adgully-word.png",
  },
  {
    outlet: "NDTV",
    type: "Feature",
    title: "Learning Is Free Online, So Why Are Parents Paying Lakhs For Education?",
    excerpt:
      "An industry story on why families keep paying premium fees when the lectures themselves are free - and what employers are really buying.",
    href: "https://www.ndtv.com/business-news/learning-is-free-online-so-why-is-education-costlier-than-ever-11877260",
    image: "/images/media/education-cost.jpg",
    logo: "/images/logos/ndtv-word.png",
  },
  {
    outlet: "The Week",
    type: "Feature",
    title: "From IT to Construction: How AI Is Reshaping India's Job Market for Gen Z",
    excerpt:
      "Expert commentary on how AI is reshaping India's job market for Gen Z - from IT to construction - and where hiring sentiment is heading.",
    href: "https://www.theweek.in/theweek/specials/2026/08/08/from-it-to-construction-how-ai-is-reshaping-indias-job-market-for-gen-z.html",
    image:
      "https://img.theweek.in/content/dam/week/en/archive/magazine/theweek/specials/images/2026/8/8/40-Government-BCK.jpg?w=1248&h=650",
    logo: "/images/logos/the-week-word.jpg",
  },
  {
    outlet: "The Hans India",
    type: "Article",
    title: "What Students Should Know Before Entering the Job Market",
    excerpt:
      "An authored column on the skills, mindset, and AI-era realities students should understand before they step into today's job market.",
    href: "https://www.thehansindia.com/hans/education-careers/what-students-should-know-before-entering-the-job-market-1103472",
    image: "https://assets.thehansindia.com/h-upload/2026/07/31/1683654-job-market.webp",
    logo: "/images/logos/hans-india-word.png",
  },
  {
    outlet: "Sugarmint",
    type: "Interview",
    title: "Rebuilding Hiring for the AI Age: Interview with Chetan Mangalwedhe",
    excerpt:
      "A founder interview on the story behind TalentiFi-X and pairing AI speed with human judgement in enterprise hiring.",
    href: "https://sugermint.com/chetan-mangalwedhe-talentifi-x-interview/",
    image:
      "https://sugermint.com/wp-content/uploads/2026/07/Chetan-Mangalwedhe-Founder-CEO-of-TalentiFi-X.jpg",
    logo: "/images/logos/sugarmint-word.png",
  },
  {
    outlet: "Adgully",
    type: "Feature",
    title: "AI's Biggest Risk? The Scale of a Mistake",
    excerpt:
      "Featured commentary on why AI's real danger is the scale of its mistakes - and a three-layer safety net of reserves, insurance, and human oversight.",
    href: "https://www.adgully.com/post/19071/ais-biggest-risk-the-scale-of-a-mistake",
    image: "https://erp.adgully.com/artical_image/bb15b222824ef7bb45f092f5b49dd252.jpeg",
    logo: "/images/logos/adgully-word.png",
  },
  {
    outlet: "CXO Xperts",
    type: "Interview",
    title: "Hiring Is No Longer Just About Filling Open Positions",
    excerpt:
      "A video conversation on trust, AI, and how enterprises should rethink talent acquisition.",
    href: "https://www.youtube.com/watch?v=z_ioiiUn_28",
    image: "https://img.youtube.com/vi/z_ioiiUn_28/maxresdefault.jpg",
    logo: "/images/logos/cxo-xperts-logo.png",
  },
  {
    outlet: "Business Standard",
    type: "Feature",
    title: "Beyond AI Engineers: Sovereign AI May Redefine India's IT Talent Pyramid",
    excerpt:
      "An industry story on how the rise of sovereign AI could reshape India's IT talent pyramid - well beyond just AI engineers.",
    href: "https://www.business-standard.com/technology/artificial-intelligence/beyond-ai-engineers-sovereign-ai-may-redefine-india-s-it-talent-pyramid-126063000144_1.html",
    image:
      "https://bsmedia.business-standard.com/_media/bs/img/article/2026-06/10/full/1781073770-4974.JPG?im=FeatureCrop,size=(826,465)",
    logo: "/images/business-standard.png",
  },
  {
    outlet: "CXO Xperts",
    type: "LinkedIn",
    title: "Trust, AI, and the Future of Enterprise Talent",
    excerpt:
      "The CXO Xperts conversation on building trust into AI-driven hiring, shared on LinkedIn.",
    href: "https://www.linkedin.com/feed/update/urn:li:share:7477682809650896896/",
    image: "/images/media/interview-table.jpg",
    logo: "/images/logos/cxo-xperts-logo.png",
  },
  {
    outlet: "The Week",
    type: "Article",
    title: "The Limits of Algorithmic Hiring: Why AI Cannot Judge Human Potential",
    excerpt:
      "A guest opinion on the practical challenges AI introduces into hiring - and why they demand governance, not just adoption.",
    href: "https://www.theweek.in/news/biz-tech/2026/06/26/guest-opinion-ai-hiring-challenges.html",
    image:
      "https://img.theweek.in/content/dam/week/week/news/biz-tech/images/2025/1/31/ai-in-india.jpg?w=1248&h=650",
    logo: "/images/logos/the-week-word.jpg",
  },
  {
    outlet: "HR Today",
    type: "Article",
    title: 'Why Artificial Intelligence Should Be Renamed "Duplicate Intelligence"',
    excerpt:
      "Why modern AI is less an autonomous intellect than a statistical remix of human output - and what that means for how we name and use it.",
    href: "https://hrtoday.in/insights/why-artificial-intelligence-should-be-renamed-duplicate-intelligence/",
    image: "/images/media/duplicate-intelligence.jpg",
    logo: "/images/logos/hr-today-word.svg",
  },
  {
    outlet: "HR Today",
    type: "LinkedIn",
    title: "Why 'Artificial' Intelligence Is Really Duplicate Intelligence",
    excerpt:
      "A LinkedIn take on why today's AI is less an original intellect than a high-scale remix of human work.",
    href: "https://www.linkedin.com/feed/update/urn:li:activity:7475494796187287552",
    image: "/images/media/duplicate-minds.jpg",
    logo: "/images/logos/hr-today-word.svg",
  },
  {
    outlet: "CXO Today",
    type: "Interview",
    title: "Building Trust in AI Workflows: TalentiFi-X's Blueprint for Modern Enterprise Hiring",
    excerpt:
      "Why legacy applicant tracking systems and keyword filters fall short - and how trust-centred AI workflows identify high-velocity learners.",
    href: "https://cxotoday.com/corner-office/building-trust-in-ai-workflows-talentifi-xs-blueprint-for-modern-enterprise-hiring/",
    image: "/images/cxotoday-talentifi-x.jpg?v=2",
    logo: "/images/logos/cxo-today-word.png",
  },
  {
    outlet: "HR Today",
    type: "Article",
    title: "Amoral Drift: The AI Hiring Risk Nobody in Talent Acquisition Is Talking About",
    excerpt:
      "How AI hiring systems quietly learn yesterday's patterns and narrow tomorrow's pipelines - and why it demands governance and human oversight.",
    href: "https://hrtoday.in/insights/amoral-drift-the-ai-hiring-risk-nobody-in-talent-acquisition-is-talking-about/",
    image: "/images/media/ai-hiring-risk.jpg",
    logo: "/images/logos/hr-today-word.svg",
  },
  {
    outlet: "HR Today",
    type: "LinkedIn",
    title: "The AI Hiring Risk Nobody in Talent Acquisition Is Talking About",
    excerpt:
      "A LinkedIn note on how AI hiring systems quietly learn yesterday's patterns and narrow tomorrow's pipelines.",
    href: "https://www.linkedin.com/feed/update/urn:li:activity:7465753766022094850",
    image: "/images/media/resume-stack.jpg",
    logo: "/images/logos/hr-today-word.svg",
  },
];
