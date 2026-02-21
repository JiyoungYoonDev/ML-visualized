import ModulesShell from '@/components/modules/ModulesShell';
import { buildModulesNav } from '@/lib/content/modules-nav';

export default async function ModulesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const nav = await buildModulesNav();

  return <ModulesShell nav={nav}>{children}</ModulesShell>;
}
