import { getAllLessons } from '@/lib/content';
import Chapter1HomeClient from './ChapterHomeClient';

export default async function Chapter1Home() {
  const lessons = await getAllLessons('chapter1');

  // section별 그룹
  const bySection = new Map<string, typeof lessons>();
  for (const l of lessons) {
    const key = l.section ?? 'Lectures';
    if (!bySection.has(key)) bySection.set(key, []);
    bySection.get(key)!.push(l);
  }

  // 렌더용 배열로 변환 + 정렬
  const sections = [...bySection.entries()].map(([section, items]) => ({
    section,
    items: [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
  }));

  const first = lessons[0];

  return <Chapter1HomeClient sections={sections} first={first ?? null} />;
}
