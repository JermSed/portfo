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

export type Thought = {
  date: string;
  text: string;
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
    "I'm an engineer focused on building reliable software. I enjoy shipping clear interfaces and have a recent focus on AI-enabled products. I'm currently studying Computer Engineering and Computer Science at USC. When I'm not building software, I enjoy doing anything outdoors especially photography and hiking. I'm currently building SceneFlow, a collaborative pre-production canvas for filmmakers, combining my love for film/photography and software engineering.",
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

// raw thoughts — newest first
export const thoughts: Thought[] = [
  {
    date: 'Jul 2026',
    text: 'Rebuilt this site to feel more like me.',
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
    title: 'Pacific fog',
    location: 'San Francisco, CA',
    url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80',
    coordinates: [-122.4194, 37.7749],
    category: 'nature',
  },
  {
    title: 'Desert bloom',
    location: 'Palm Springs, CA',
    url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80',
    coordinates: [-116.5453, 33.8303],
    category: 'nature',
  },
  {
    title: 'Night ride',
    location: 'Los Angeles, CA',
    url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    coordinates: [-118.2437, 34.0522],
    category: 'night',
  },
  {
    title: 'Late hike',
    location: 'Yosemite, CA',
    url: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
    coordinates: [-119.5383, 37.8651],
    category: 'nature',
  },
  {
    title: 'City reflections',
    location: 'New York, NY',
    url: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80',
    coordinates: [-74.006, 40.7128],
    category: 'city',
  },
  {
    title: 'Blue hour',
    location: 'Seattle, WA',
    url: 'https://images.unsplash.com/photo-1502175353174-a7a70e73b362?auto=format&fit=crop&w=1200&q=80',
    coordinates: [-122.3321, 47.6062],
    category: 'night',
  },
  {
    title: 'Coast drive',
    location: 'Big Sur, CA',
    url: 'https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&w=1200&q=80',
    coordinates: [-121.8081, 36.2704],
    category: 'coast',
  },
  {
    title: 'Golden light',
    location: 'San Diego, CA',
    url: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80',
    coordinates: [-117.1611, 32.7157],
    category: 'coast',
  },
  {
    title: 'Quiet morning',
    location: 'Dublin, Ireland',
    url: 'https://images.unsplash.com/photo-1549918864-48ac978761a4?auto=format&fit=crop&w=1200&q=80',
    coordinates: [-6.2603, 53.3498],
    category: 'city',
  },
  {
    title: 'Deck of cards',
    location: 'Cobh, Ireland',
    url: 'https://images.unsplash.com/photo-1590089415225-401ed6f9db8e?auto=format&fit=crop&w=1200&q=80',
    coordinates: [-8.2967, 51.8503],
    category: 'city',
  },
  {
    title: 'Sagrada from above',
    location: 'Barcelona, Spain',
    url: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=1200&q=80',
    coordinates: [2.1734, 41.3851],
    category: 'city',
  },
  {
    title: 'Gran Vía glow',
    location: 'Madrid, Spain',
    url: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=1200&q=80',
    coordinates: [-3.7038, 40.4168],
    category: 'night',
  },
];

