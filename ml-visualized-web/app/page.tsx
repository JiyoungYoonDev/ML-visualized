import ModulesShell from '@/components/modules/ModulesShell';
import ChapterHomeClient from '@/components/modules/ChapterHomeClient';
import { getModulesHomeData } from '@/lib/content/modules-home';
import { buildModulesNav } from '@/lib/content/modules-nav';

export default async function Home() {
  const { sections, first } = await getModulesHomeData();
  const nav = await buildModulesNav();

  return (
    <ModulesShell nav={nav}>
      <ChapterHomeClient sections={sections} first={first} />
    </ModulesShell>
  );
}
