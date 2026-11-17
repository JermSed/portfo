export const projectLandings = {
  sceneflow: {
    intro: 'A storyboarding app for iPad and Mac, with an AI agent that matches footage to shots and builds a DaVinci Resolve timeline.',
    status: 'In development. Demo uses real footage and Resolve output in a recreated interface.',
  },
  'fccw-crm': {
    intro: 'A CRM for the Feminist Center for Creative Work. It brings memberships, donations, events, and Shopify sales into one database.',
    status: 'Demo uses sample records and a simulated sync response.',
  },
  delphi: {
    intro: 'A browser assistant that turns spoken requests into website actions and reads back the results. Built at LA Hacks 2025 for blind and visually impaired users.',
    status: 'Hackathon prototype. Demo recreates the app’s workflow with captions for spoken requests and responses.',
  },
  tally: {
    intro: 'Inventory software for small businesses. Tracks product variants, materials, stock levels, and reorders.',
    status: 'Co-founded in 2024. Demo uses sample inventory from the app.',
  },
  'climate-cents': {
    intro: 'A map of local environmental projects for Climate Cents and Blue Sky LA, with heat, air-quality, and ozone layers.',
    status: 'Demo uses sample project locations and shows search and navigation. Live environmental readings are not included.',
  },
  raiseachild: {
    intro: 'A reporting dashboard for RaiseAChild, a nonprofit supporting prospective foster and adoptive parents. Connects to Little Green Light to filter records, save reports, and compare outreach data.',
    status: 'Demo uses fictional data. No constituent information is shown.',
  },
};

export const projectLinks: Record<string, { label: string; url: string }> = {
  'fccw-crm': {label: 'About FCCW', url: 'https://fccwla.org/mission-core-values/'},
  'climate-cents': {label: 'About Blue Sky LA', url: 'https://www.blueskyla.org/our-mission'},
  raiseachild: {label: 'About RaiseAChild', url: 'https://www.raiseachild.org/'},
  delphi: {label: 'Watch the original demo', url: 'https://devpost.com/software/delphi-lxes1j'},
};
