// Media appearances - single source of truth shared by the /media page and the
// homepage preview. Add new entries here and they show up in both places
// (the homepage shows the first 4 and links to /media for the rest).

export type MediaItem = {
  outlet: string;
  type: string;
  title: string;
  excerpt: string;
  href: string;
  image?: string;
};

export const mediaItems: MediaItem[] = [
  {
    outlet: "HR Today",
    type: "Insight",
    title: "Amoral Drift: The AI Hiring Risk Nobody in Talent Acquisition Is Talking About",
    excerpt:
      "How AI hiring systems quietly learn yesterday's patterns and narrow tomorrow's pipelines - and why it demands governance and human oversight.",
    href: "https://hrtoday.in/insights/amoral-drift-the-ai-hiring-risk-nobody-in-talent-acquisition-is-talking-about/",
    image: "https://hrtoday.in/wp-content/uploads/2026/05/HR-TODAY-SUNIL-54-2.png",
  },
  {
    outlet: "CXOToday",
    type: "Feature",
    title: "Building Trust in AI Workflows: Talentifi-X's Blueprint for Modern Enterprise Hiring",
    excerpt:
      "Why legacy applicant tracking systems and keyword filters fall short - and how trust-centred AI workflows help enterprises identify high-velocity learners and the precise skills they need.",
    href: "https://cxotoday.com/corner-office/building-trust-in-ai-workflows-talentifi-xs-blueprint-for-modern-enterprise-hiring/",
    image: "/images/cxotoday-talentifi-x.jpg",
  },
];
