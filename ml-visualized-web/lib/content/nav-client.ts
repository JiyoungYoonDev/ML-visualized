// lib/content/nav-client.ts
export function isActive(pathname: string, item: { href: string; exact?: boolean }) {
  if (item.exact) return pathname === item.href;
  return pathname === item.href || pathname.startsWith(item.href + "/");
}
