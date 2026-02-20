import { getAllLessons } from '@/lib/content';
import Chapter1HomeClient from './ChapterHomeClient';

export default async function Chapter1Home() {
  const lessons = await getAllLessons('chapter1');

  const bySection = new Map<string, typeof lessons>();
  for (const l of lessons) {
    const key = l.section ?? 'Lectures';
    if (!bySection.has(key)) bySection.set(key, []);
    bySection.get(key)!.push(l);
  }

  const sections = [...bySection.entries()].map(([section, items]) => ({
    section,
    items: [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
  }));

  const first = lessons[0];

  return <Chapter1HomeClient sections={sections} first={first ?? null} />;
}
