// Media appearances - single source of truth shared by the /media page and the
// homepage preview. Add new entries here and they show up in both places
// (the homepage shows the first 4 and links to /media for the rest).
// Ordered newest first.

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
    outlet: "Adgully",
    type: "Feature",
    title: "AI's Biggest Risk? The Scale of a Mistake",
    excerpt:
      "Featured commentary on why AI's real danger is the scale of its mistakes - and a three-layer safety net of reserves, insurance, and mandatory human oversight.",
    href: "https://www.adgully.com/post/19071/ais-biggest-risk-the-scale-of-a-mistake",
    image: "https://erp.adgully.com/artical_image/bb15b222824ef7bb45f092f5b49dd252.jpeg",
    logo: "/images/logos/adgully-word.png",
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
    title: "In Conversation: Chetan Mangalwedhe on Building TalentiFi-X",
    excerpt:
      "A founder interview on the story behind TalentiFi-X and where AI is taking enterprise hiring next.",
    href: "https://sugermint.com/chetan-mangalwedhe-talentifi-x-interview/",
    image:
      "https://sugermint.com/wp-content/uploads/2026/07/Chetan-Mangalwedhe-Founder-CEO-of-TalentiFi-X-758x474.jpg",
    logo: "/images/logos/sugarmint-word.png",
  },
  {
    outlet: "CXO Xperts",
    type: "Interview",
    title: "Trust, AI, and the Future of Enterprise Talent",
    excerpt:
      "A video conversation on trust, AI, and how enterprises should rethink talent acquisition.",
    href: "https://www.youtube.com/watch?v=z_ioiiUn_28",
    image: "https://img.youtube.com/vi/z_ioiiUn_28/maxresdefault.jpg",
    logo: "/images/logos/cxo-xperts-word.png",
  },
  {
    outlet: "CXO Xperts",
    type: "Interview",
    title: "Trust, AI, and the Future of Enterprise Talent",
    excerpt:
      "The CXO Xperts conversation on building trust into AI-driven hiring, shared on LinkedIn.",
    href: "https://www.linkedin.com/feed/update/urn:li:share:7477682809650896896/",
    image: "https://img.youtube.com/vi/z_ioiiUn_28/maxresdefault.jpg",
    logo: "/images/logos/cxo-xperts-word.png",
  },
  {
    outlet: "Business Standard",
    type: "Feature",
    title:
      "Beyond AI Engineers: Sovereign AI May Redefine India's IT Talent Pyramid",
    excerpt:
      "An industry story on how the rise of sovereign AI could reshape India's IT talent pyramid - well beyond just AI engineers.",
    href: "https://www.business-standard.com/technology/artificial-intelligence/beyond-ai-engineers-sovereign-ai-may-redefine-india-s-it-talent-pyramid-126063000144_1.html",
    image:
      "https://bsmedia.business-standard.com/_media/bs/img/article/2026-06/10/full/1781073770-4974.JPG?im=FeatureCrop,size=(826,465)",
    logo: "/images/business-standard.png",
  },
  {
    outlet: "The Week",
    type: "Article",
    title: "Guest Opinion: The AI Hiring Challenges We Can't Ignore",
    excerpt:
      "A guest opinion on the practical challenges AI introduces into hiring - and why they demand governance, not just adoption.",
    href: "https://www.theweek.in/news/biz-tech/2026/06/26/guest-opinion-ai-hiring-challenges.html",
    image:
      "https://img.theweek.in/content/dam/week/week/news/biz-tech/images/2025/1/31/ai-in-india.jpg?w=1248&h=650",
    logo: "/images/logos/the-week-word.jpg",
  },
  {
    outlet: "HR Today",
    type: "LinkedIn",
    title: "Why 'Artificial' Intelligence Is Really Duplicate Intelligence",
    excerpt:
      "A LinkedIn take on why today's AI is less an original intellect than a high-scale remix of human work.",
    href: "https://www.linkedin.com/feed/update/urn:li:activity:7475494796187287552",
    image: "https://hrtoday.in/wp-content/uploads/2026/06/HR-TODAY-SUNIL-14-10.png",
    logo: "/images/logos/hr-today-word.svg",
  },
  {
    outlet: "HR Today",
    type: "Article",
    title:
      "Why Artificial Intelligence Should Be Renamed \"Duplicate Intelligence\"",
    excerpt:
      "Why modern AI is less an autonomous intellect than a statistical remix of human output - and what that means for how we name and use it.",
    href: "https://hrtoday.in/insights/why-artificial-intelligence-should-be-renamed-duplicate-intelligence/",
    image: "https://hrtoday.in/wp-content/uploads/2026/06/HR-TODAY-SUNIL-14-10.png",
    logo: "/images/logos/hr-today-word.svg",
  },
  {
    outlet: "CXO Today",
    type: "Feature",
    title: "Building Trust in AI Workflows: Talentifi-X's Blueprint for Modern Enterprise Hiring",
    excerpt:
      "Why legacy applicant tracking systems and keyword filters fall short - and how trust-centred AI workflows help enterprises identify high-velocity learners and the precise skills they need.",
    href: "https://cxotoday.com/corner-office/building-trust-in-ai-workflows-talentifi-xs-blueprint-for-modern-enterprise-hiring/",
    image: "/images/cxotoday-talentifi-x.jpg?v=2",
    logo: "/images/logos/cxo-today-word.png",
  },
  {
    outlet: "HR Today",
    type: "LinkedIn",
    title: "The AI Hiring Risk Nobody in Talent Acquisition Is Talking About",
    excerpt:
      "A LinkedIn note on how AI hiring systems quietly learn yesterday's patterns and narrow tomorrow's pipelines.",
    href: "https://www.linkedin.com/feed/update/urn:li:activity:7465753766022094850",
    image: "https://hrtoday.in/wp-content/uploads/2026/05/HR-TODAY-SUNIL-54-2.png",
    logo: "/images/logos/hr-today-word.svg",
  },
  {
    outlet: "HR Today",
    type: "Insight",
    title: "Amoral Drift: The AI Hiring Risk Nobody in Talent Acquisition Is Talking About",
    excerpt:
      "How AI hiring systems quietly learn yesterday's patterns and narrow tomorrow's pipelines - and why it demands governance and human oversight.",
    href: "https://hrtoday.in/insights/amoral-drift-the-ai-hiring-risk-nobody-in-talent-acquisition-is-talking-about/",
    image: "https://hrtoday.in/wp-content/uploads/2026/05/HR-TODAY-SUNIL-54-2.png",
    logo: "/images/logos/hr-today-word.svg",
  },
];
