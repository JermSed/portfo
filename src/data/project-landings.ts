export const projectLandings = {
  sceneflow: {
    intro: 'Give your footage a starting point. SceneFlow connects your storyboard to an AI agent that assembles an editable DaVinci Resolve timeline.',
    heading: 'Less setup. More filmmaking.',
    benefits: [['Plan together', 'Sketch shots and shape the sequence on a shared canvas for iPad and Mac.'], ['Connect your footage', 'Match clips from Google Drive to the intent and order of your storyboard.'], ['Keep creative control', 'Continue in Resolve with linked video and audio. Unshot beats stay visible for follow-up.']],
    proof: 'In the demo: eight planned beats, four matched shots, one editable timeline.',
    status: 'In development · Demo uses a redesigned interface with real project footage and Resolve output.',
  },
  'fccw-crm': {
    intro: 'Built for the Feminist Center for Creative Work, a Los Angeles nonprofit supporting feminist and queer creative practices. The CRM connects events, memberships, donations, and shop sales so its staff can spend less time reconciling records and more time supporting artists.',
    heading: 'More time for your community.',
    benefits: [['From invitation to attendance', 'Create events, collect registrations, and see who has paid from the same workspace.'], ['See where support comes from', 'Review donations, memberships, and Shopify sales together, then drill into the underlying records.'], ['Keep records aligned', 'Webhooks bring in changes as they happen. Scheduled reconciliation catches updates that were missed.']],
    proof: '80% fewer manual data corrections across a community of 3,000+ members.',
    status: 'Technical lead of a nine-person team. Recorded from the local application with sample records and a simulated sync response.',
  },
  delphi: {
    intro: 'A voice-controlled browser assistant for blind and visually impaired people. Delphi turns spoken requests into website actions and narrates what it finds, helping users browse without relying on a page’s visual layout.',
    heading: 'Say where you want to go.',
    benefits: [['Start with your intent', 'Ask a question or describe a task aloud, without mapping out every click.'], ['Let the browser agent navigate', 'A coordinating agent breaks down the request and delegates website interactions to a browser agent.'], ['Hear what happens', 'Voice responses and visual narration help make the page and the agent’s actions understandable.']],
    proof: 'Winner, Heart of the Matter track · LA Hacks 2025.',
    status: 'LA Hacks prototype. Original demo footage, edited into a side-by-side view of the voice interface and browser agent.',
  },
  tally: {
    intro: 'Connect the products you sell to the materials they consume. Tally keeps variants, stock levels, and replenishment needs together so small teams can stay ahead of the next order.',
    heading: 'Keep your business in stock.',
    benefits: [['Know what goes into each product', 'Link materials and quantities to individual variants, from a small T-shirt to a large hoodie.'], ['Set the right buffer', 'Keep a reserve for each variant so low inventory becomes visible before it interrupts fulfillment.'], ['Bring operations together', 'Move between products, materials, orders, and restocking without maintaining a separate spreadsheet for each.']],
    proof: '$120K+ in recovered client revenue · 40% less inventory management overhead.',
    status: 'Technical co-founder, 2024–2025. Recorded from the application using its sample product inventory.',
  },
  'climate-cents': {
    intro: 'Built for Climate Cents and Blue Sky LA, its partnership with Breathe Southern California. The map helps people discover local projects that improve air quality, reduce heat, and cut emissions—and explore the environmental conditions around them.',
    heading: 'Find the work happening near you.',
    benefits: [['Find a relevant project', 'Search by name or narrow the map to a project type and completion status.'], ['Explore it in place', 'Select a project to move to its location and learn about its work and impact.'], ['Add environmental context', 'Switch between heat, air-quality, and ozone layers to explore local conditions alongside projects.']],
    proof: '30% faster loads for the Blue Sky LA air-quality map.',
    status: 'Recorded from the local application with sample project locations. The demo shows search and map navigation; environmental readings are not shown.',
  },
  raiseachild: {
    intro: 'Built for RaiseAChild, a nonprofit that recruits and supports prospective foster and adoptive parents, including LGBTQ+ and Spanish-speaking families. Its team can turn Little Green Light data into reusable reports to understand outreach, events, and where families are in the process.',
    heading: 'Spend less time building reports.',
    benefits: [['Find the group you need', 'Filter constituents by status, process step, preferred language, and other fields relevant to the team’s outreach.'], ['Save the question', 'Name and reuse filters so recurring reporting starts with the right group instead of a blank slate.'], ['Compare across time and place', 'Use charts to explore constituent and event data by year and region.']],
    proof: 'Doubled report-generation efficiency across 40,000+ constituent records.',
    status: 'Recorded from the local application with fictional reporting data; no constituent information is shown.',
  },
};

export const projectLinks: Record<string, { label: string; url: string }> = {
  'fccw-crm': {label: 'About FCCW', url: 'https://fccwla.org/mission-core-values/'},
  'climate-cents': {label: 'About Blue Sky LA', url: 'https://www.blueskyla.org/our-mission'},
  raiseachild: {label: 'About RaiseAChild', url: 'https://www.raiseachild.org/'},
  delphi: {label: 'Watch the original demo', url: 'https://devpost.com/software/delphi-lxes1j'},
};
