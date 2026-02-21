import ChapterHomeClient from '@/components/modules/ChapterHomeClient';
import { getModulesHomeData } from '@/lib/content/modules-home';

export default async function ModulesHomePage() {
  const { sections, first } = await getModulesHomeData();
  return <ChapterHomeClient sections={sections} first={first} />;
}
