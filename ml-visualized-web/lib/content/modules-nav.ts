import { buildNavGroupsSplit } from '@/lib/content/nav';
import { getAllModuleLessons } from '@/lib/content/modules-catalog';
import type { NavGroup } from '@/lib/content/types';

export async function buildModulesNav(): Promise<NavGroup[]> {
  const lessons = await getAllModuleLessons();
  return buildNavGroupsSplit({
    basePath: '/modules',
    lessons,
  });
}
