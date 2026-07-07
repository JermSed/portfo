export type Socials = {
  twitter?: string;
  linkedin?: string;
  github?: string;
};

export type Profile = {
  name: string;
  tagline: string;
  location: string;
  email: string;
  socials: Socials;
  summary: string;
};

export type WorkEntry = {
  company?: string;
  icon?: string;
  logo?: string;
  name: string;
  role: string;
  area: string;
  period: string;
};

export type Project = {
  name: string;
  description: string;
  url?: string;
  tech: string[];
};

export type Involvement = {
  name: string;
  role: string;
  period: string;
  logo?: string;
};

export type PhotoCategory = 'city' | 'nature' | 'coast' | 'night';

export type Photo = {
  title: string;
  location: string;
  url: string;
  /** [longitude, latitude] of roughly where the photo was taken */
  coordinates: [number, number];
  /** What kind of shot it is — drives the pin color on the map */
  category: PhotoCategory;
};

/** Pin color key for the photo map */
export const photoCategories: Record<PhotoCategory, { label: string; color: string }> = {
  city: { label: 'Streets & cities', color: '#d47474' },
  nature: { label: 'Mountains & forests', color: '#74b479' },
  coast: { label: 'Coasts & water', color: '#66b8b3' },
  night: { label: 'Night & golden hour', color: '#e3ab55' },
};

export const profile: Profile = {
  name: 'Jeremy Sedillo',
  tagline: 'Engineer interested in AI/ML and product design.',
  location: 'San Francisco, CA',
  email: 'jjsedill@usc.edu',
  socials: {
    twitter: '#',
    linkedin: 'https://www.linkedin.com/in/jeremy-sedillo/',
    github: 'https://github.com/jermsed',
  },
  summary:
    "I'm an engineer focused on building reliable software. I enjoy shipping clear interfaces and have a recent focus on AI-enabled products. I'm currently studying Computer Engineering and Computer Science at USC.                   When I'm not building software, I enjoy doing anything outdoors especially photography and hiking. I'm currently building SceneFlow, a collaborative pre-production canvas for filmmakers, combining my love for film/photography and software engineering.",
};

export const workEntries: WorkEntry[] = [
  {
    company: 'Amazon',
    logo: '/logos/amazon-color-svgrepo-com.svg',
    name: 'Amazon',
    role: 'Software Development Engineer Intern',
    area: 'Engineering',
    period: '2026',
  },
  {
    company: 'Amazon',
    logo: '/logos/amazon-color-svgrepo-com.svg',
    name: 'Amazon',
    role: 'Software Development Engineer Intern',
    area: 'Engineering',
    period: '2025',
  },
  {
    company: 'Tally',
    logo: '/logos/tally.png',
    name: 'Tally',
    role: 'Technical Co-Founder',
    area: 'Founding',
    period: '2025',
  },
  {
    company: 'Amazon',
    logo: '/logos/amazon-color-svgrepo-com.svg',
    name: 'Amazon',
    role: 'Software Development Engineer Intern',
    area: 'Engineering',
    period: '2024',
  },
  {
    company: 'HammerSpace',
    logo: '/logos/hammerspace.svg',
    name: 'HammerSpace',
    role: 'Full-Stack Developer',
    area: 'Engineering',
    period: '2023',
  },
  {
    company: 'Intuit',
    logo: '/logos/intuit.svg',
    name: 'Intuit',
    role: 'Full-Stack Developer',
    area: 'Engineering',
    period: '2022',
  },
];

export const involvement: Involvement[] = [
  {
    name: 'Code The Change',
    logo: '/logos/codethechange.jpeg',
    role: 'Technical Lead, Developer, VP of Events, VP of Development',
    period: '2023 — Present',
  },
  {
    name: 'LavaLab',
    logo: '/logos/lava.jpg',
    role: 'Technical Co-Founder, Mentor',
    period: '2024 — Present',
  },
  {
    name: 'ColorStack',
    logo: '/logos/colorstack.png',
    role: 'Member',
    period: '2023 — Present',
  },
];

export const projects: Project[] = [
  {
    name: 'SceneFlow',
    description:
      'Collaborative pre-production canvas for filmmakers — offline-first with CRDT-based sync for real-time co-editing on unreliable networks. Used by 3 working filmmakers in place of Milanote.',
    tech: ['Swift', 'SwiftUI', 'Automerge CRDTs'],
  },
  {
    name: 'FCCW CRM',
    description:
      'Nonprofit CRM unifying memberships, donations, and events for 3K+ members; led a 9-person team and cut manual data corrections 80%.',
    tech: ['Cloudflare Workers', 'D1', 'Hono', 'TypeScript', 'Shopify Webhooks'],
  },
  {
    name: 'Delphi',
    description:
      'Voice-driven browsing for the visually impaired — transforms live websites into conversational interfaces. 1st place, Healthcare Track at LA Hacks 2025.',
    url: 'https://github.com/brennenho/delphi',
    tech: ['Gemini', 'React', 'Web Speech API'],
  },
  {
    name: 'Tally',
    description:
      'Inventory management for small producers — automated reordering, variant tracking, threshold alerts, and real-time dashboards; generated $120K+ in recovered client revenue.',
    url: 'https://keeptallyapp.com',
    tech: ['Next.js', 'TypeScript', 'React'],
  },
  {
    name: 'Climate Cents',
    description:
      'Interactive map for Blue Sky LA with heatmap overlay and real-time air quality, with 30% faster loads.',
    url: 'https://climate-cents.pages.dev/',
    tech: ['Cloudflare', 'Next.js', 'TypeScript'],
  },
  {
    name: 'RaiseAChild',
    description:
      'Dashboard integrated with the Little Green Light API; processed 40k+ constituents and doubled report generation efficiency.',
    url: 'https://www.raiseachild.org/',
    tech: ['PostgreSQL', 'Express', 'React', 'Node'],
  },
];

export const photos: Photo[] = [
  {
    title: 'Boulder line',
    location: 'Lake Tahoe, NV',
    url: '/photos/lake-tahoe-2.jpg',
    coordinates: [-119.931, 39.199],
    category: 'nature',
  },
  {
    title: 'Summer lift',
    location: 'Lake Tahoe, NV',
    url: '/photos/lake-tahoe.jpg',
    coordinates: [-119.9236, 39.2371],
    category: 'nature',
  },
  {
    title: 'Ren1',
    location: 'San Francisco, CA',
    url: '/photos/ren1-sf.jpg',
    coordinates: [-122.4097, 37.779],
    category: 'city',
  },
  {
    title: 'Snow Lake window',
    location: 'Snoqualmie Pass, WA',
    url: '/photos/snow-lake.jpg',
    coordinates: [-121.4438, 47.4602],
    category: 'nature',
  },
  {
    title: 'Stars over the pines',
    location: 'Snoqualmie, WA',
    url: '/photos/snoqualmie.jpg',
    coordinates: [-121.8226, 47.5287],
    category: 'night',
  },
  {
    title: 'Off the deck',
    location: 'South Lake Union, WA',
    url: '/photos/south-lake-union.jpg',
    coordinates: [-122.3344, 47.627],
    category: 'city',
  },
  {
    title: 'Island sunset',
    location: 'Maui, HI',
    url: '/photos/maui.jpg',
    coordinates: [-156.445, 20.7644],
    category: 'coast',
  },
  {
    title: 'Into the mist',
    location: 'Cliffs of Moher, Ireland',
    url: '/photos/cliffs-of-moher.jpg',
    coordinates: [-9.4265, 52.9715],
    category: 'coast',
  },
  {
    title: 'Platform piano',
    location: 'Dublin, Ireland',
    url: '/photos/ireland-train.jpg',
    coordinates: [-6.2499, 53.3434],
    category: 'city',
  },
  {
    title: 'Morning trot',
    location: 'Dublin, Ireland',
    url: '/photos/dublin.jpg',
    coordinates: [-6.2603, 53.3498],
    category: 'city',
  },
  {
    title: 'Paddle out',
    location: 'Los Angeles, CA',
    url: '/photos/la-beach-2.jpg',
    coordinates: [-118.3921, 33.8412],
    category: 'coast',
  },
  {
    title: 'Beach afternoon',
    location: 'Los Angeles, CA',
    url: '/photos/la-beach.jpg',
    coordinates: [-118.3903, 33.8378],
    category: 'coast',
  },
  {
    title: 'Valley view',
    location: 'Yosemite, CA',
    url: '/photos/yosemite-cliff.jpg',
    coordinates: [-119.6053, 37.7128],
    category: 'nature',
  },
  {
    title: 'Falls rainbow',
    location: 'Yosemite, CA',
    url: '/photos/yosemite-falls.jpg',
    coordinates: [-119.5966, 37.7566],
    category: 'nature',
  },
  {
    title: 'Below the falls',
    location: 'Yosemite, CA',
    url: '/photos/yosemite.jpg',
    coordinates: [-119.5964, 37.7515],
    category: 'nature',
  },
];

