export interface Note {
  slug: string;
  title: string;
  description: string;
  datePublished: string;
}

export const notes: Note[] = [
  {
    slug: "hello-world",
    title: "Hello World",
    description: "My first note — getting started with writing.",
    datePublished: "2026-02-16",
  },
];

export function getNote(slug: string): Note | undefined {
  return notes.find((note) => note.slug === slug);
}

export function getAllNotes(): Note[] {
  return notes.sort(
    (a, b) =>
      new Date(b.datePublished).getTime() -
      new Date(a.datePublished).getTime(),
  );
}
