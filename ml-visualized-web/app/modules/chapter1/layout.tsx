import ModulesShell from '@/components/modules/ModulesShell';
import { getAllLessons } from '@/lib/content';
import { buildNavGroupsSplit } from '@/lib/content/nav';

export default async function Chapter1Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const lessons = await getAllLessons('chapter1');
  const nav = buildNavGroupsSplit({
    basePath: '/modules/chapter1',
    lessons,
  });

  return <ModulesShell nav={nav}>{children}</ModulesShell>;
}
