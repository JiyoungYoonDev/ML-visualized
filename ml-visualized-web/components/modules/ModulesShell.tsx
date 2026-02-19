// components/modules/ModulesShell.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Check, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

import type { NavGroup, NavItem } from '@/lib/content/types';
import { isActive } from '@/lib/content/nav-client';
import { defaultIconKey, iconMap } from '@/lib/content/iconMap';
import { PROGRESS_EVENT, readDone, readQuizProgressMap } from '@/lib/progress';

function SidebarContent({
  nav,
  collapsed,
  onToggle,
  closeOnNavigate,
}: {
  nav: NavGroup[];
  collapsed: boolean;
  onToggle?: () => void;
  closeOnNavigate?: () => void;
}) {
  const pathname = usePathname();
  const [sectionOpen, setSectionOpen] = useState<Record<string, boolean>>({});
  const [done, setDone] = useState<string[]>([]);
  const [quizProgress, setQuizProgress] = useState<
    Record<
      string,
      { total: number; answered: number; correct: number; completed: boolean }
    >
  >({});

  const sectionKey = (group: string, section: string) => `${group}::${section}`;

  useEffect(() => {
    const sync = () => {
      setDone(readDone());
      setQuizProgress(readQuizProgressMap());
    };
    sync();
    window.addEventListener('storage', sync);
    window.addEventListener(PROGRESS_EVENT, sync);
    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener(PROGRESS_EVENT, sync);
    };
  }, []);

  useEffect(() => {
    setSectionOpen((prev) => {
      const next = { ...prev };
      let changed = false;

      for (const group of nav) {
        for (const section of group.sections) {
          const key = sectionKey(group.group, section.section);
          const hasActiveItem = section.items.some((item) =>
            isActive(pathname, item),
          );

          if (hasActiveItem && next[key] !== true) {
            next[key] = true;
            changed = true;
          }
        }
      }

      return changed ? next : prev;
    });
  }, [pathname, nav]);

  const slugFromHref = (href: string) => {
    const parts = href.split('/').filter(Boolean);
    return parts[parts.length - 1] ?? '';
  };

  const flatItems = useMemo(() => {
    const items: NavItem[] = [];
    nav.forEach((g) =>
      g.sections.forEach((s) => s.items.forEach((i) => items.push(i))),
    );
    return items;
  }, [nav]);

  return (
    <div className='h-full flex'>
      {/* Collapsed icon rail */}
      {collapsed && (
        <div className='w-14 border-r bg-card flex flex-col items-center py-3 gap-2'>
          {flatItems.map((item) => {
            const active = isActive(pathname, item);
            const Icon =
              iconMap[item.iconKey ?? defaultIconKey] ??
              iconMap[defaultIconKey];

            const base =
              'h-10 w-10 rounded-md grid place-items-center transition';
            const styles = active
              ? 'bg-muted text-foreground'
              : 'text-muted-foreground hover:bg-muted/60';

            if (item.disabled) {
              return (
                <div
                  key={item.href}
                  className={`${base} opacity-40`}
                  title={`${item.label} (Coming soon)`}
                >
                  <Icon className='h-5 w-5' />
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeOnNavigate}
                className={`${base} ${styles}`}
                title={item.label}
              >
                <Icon className='h-5 w-5' />
              </Link>
            );
          })}
        </div>
      )}

      {/* Main panel */}
      <div className={collapsed ? 'flex-1 min-w-0' : 'w-full'}>
        <div className='px-4 py-4'>
          <div className='flex items-start justify-between gap-2'>
            <div className={collapsed ? 'hidden' : ''}>
              <div className='text-lg font-semibold'>ML Visualized</div>
              <div className='text-sm text-muted-foreground'>
                Learn by moving graphs
              </div>
            </div>

            {onToggle && (
              <Button
                variant='ghost'
                size='icon'
                className='h-8 w-8'
                onClick={onToggle}
                aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                title={collapsed ? 'Expand' : 'Collapse'}
              >
                {collapsed ? (
                  <ChevronRight className='h-4 w-4' />
                ) : (
                  <ChevronLeft className='h-4 w-4' />
                )}
              </Button>
            )}
          </div>
        </div>

        <Separator />

        <ScrollArea className='h-[calc(100vh-80px)]'>
          <div className='p-4 space-y-6'>
            {nav.map((group) => (
              <div key={group.group} className='space-y-3'>
                <div
                  className={[
                    'text-xs font-semibold uppercase tracking-wide text-muted-foreground',
                    collapsed ? 'hidden' : '',
                  ].join(' ')}
                >
                  {group.group}
                </div>

                <div className='space-y-4'>
                  {group.sections.map((section) => (
                    <div key={section.section} className='space-y-2'>
                      {(() => {
                        const key = sectionKey(group.group, section.section);
                        const open = sectionOpen[key] ?? true;

                        return (
                          <>
                            <button
                              type='button'
                              onClick={() =>
                                setSectionOpen((prev) => ({
                                  ...prev,
                                  [key]: !open,
                                }))
                              }
                              className={[
                                'w-full flex items-center justify-between text-xs font-semibold text-foreground/80 px-3 py-1 rounded-md hover:bg-muted/60 transition',
                                collapsed ? 'hidden' : '',
                              ].join(' ')}
                              aria-label={`${section.section} ${open ? 'collapse' : 'expand'}`}
                            >
                              <span>{section.section}</span>
                              <ChevronDown
                                className={[
                                  'h-4 w-4 transition-transform',
                                  open ? 'rotate-0' : '-rotate-90',
                                ].join(' ')}
                              />
                            </button>

                            {(collapsed || open) && (
                              <div className='space-y-1'>
                                {section.items.map((item) => {
                                  const active = isActive(pathname, item);
                                  const Icon =
                                    iconMap[item.iconKey ?? defaultIconKey] ??
                                    iconMap[defaultIconKey];

                                  const rowBase =
                                    'group flex items-center justify-between gap-2 rounded-md px-3 py-2 text-sm transition';
                                  const rowActive = 'bg-muted text-foreground';
                                  const rowIdle =
                                    'hover:bg-muted/60 text-foreground';
                                  const rowDisabled =
                                    'opacity-50 cursor-not-allowed';

                                  const leftBar = (
                                    <span
                                      className={[
                                        'h-5 w-1 rounded-full',
                                        active
                                          ? 'bg-foreground'
                                          : 'bg-transparent',
                                      ].join(' ')}
                                    />
                                  );

                                  const content = (
                                    <div className='flex items-center gap-2 min-w-0'>
                                      {leftBar}
                                      <Icon className='h-4 w-4 text-muted-foreground group-hover:text-foreground' />
                                      {!collapsed ? (
                                        <span className='truncate'>
                                          {item.label}
                                        </span>
                                      ) : (
                                        <span className='sr-only'>
                                          {item.label}
                                        </span>
                                      )}
                                    </div>
                                  );
                                  const doneSlug = slugFromHref(item.href);
                                  const completed = done.includes(doneSlug);
                                  const qp = quizProgress[doneSlug];
                                  const hasQuiz = Boolean(qp && qp.total > 0);

                                  if (item.disabled) {
                                    return (
                                      <div
                                        key={item.href}
                                        className={`${rowBase} ${rowDisabled}`}
                                        title='Coming soon'
                                      >
                                        {content}
                                        {!collapsed && (
                                          <div className='flex items-center gap-1.5'>
                                            {hasQuiz && (
                                              <span className='rounded-full border px-2 py-0.5 text-[10px] text-muted-foreground'>
                                                {qp.correct}/{qp.total}
                                              </span>
                                            )}
                                            {completed ? (
                                              <Check className='h-4 w-4 text-muted-foreground' />
                                            ) : item.badge ? (
                                              <span className='rounded-full border px-2 py-0.5 text-[10px] text-muted-foreground'>
                                                {item.badge}
                                              </span>
                                            ) : null}
                                          </div>
                                        )}
                                      </div>
                                    );
                                  }

                                  return (
                                    <Link
                                      key={item.href}
                                      href={item.href}
                                      onClick={closeOnNavigate}
                                      className={`${rowBase} ${active ? rowActive : rowIdle}`}
                                    >
                                      {content}
                                      {!collapsed && (
                                        <div className='flex items-center gap-1.5'>
                                          {hasQuiz && (
                                            <span className='rounded-full border px-2 py-0.5 text-[10px] text-muted-foreground'>
                                              {qp.correct}/{qp.total}
                                            </span>
                                          )}
                                          {completed ? (
                                            <Check className='h-4 w-4 text-muted-foreground' />
                                          ) : item.badge ? (
                                            <span className='rounded-full border px-2 py-0.5 text-[10px] text-muted-foreground'>
                                              {item.badge}
                                            </span>
                                          ) : null}
                                        </div>
                                      )}
                                    </Link>
                                  );
                                })}
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

export default function ModulesShell({
  nav,
  children,
}: {
  nav: NavGroup[];
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className='min-h-screen'>
      <div className='flex'>
        {/* Desktop sidebar */}
        <aside
          className={[
            'hidden md:block border-r h-screen sticky top-0 bg-card',
            collapsed ? 'w-14' : 'w-72',
          ].join(' ')}
        >
          <SidebarContent
            nav={nav}
            collapsed={collapsed}
            onToggle={() => setCollapsed((v) => !v)}
          />
        </aside>

        {/* Main */}
        <main className='flex-1'>
          {/* Mobile top bar */}
          <div className='md:hidden border-b p-3 flex items-center gap-2'>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant='outline'>Menu</Button>
              </SheetTrigger>

              <SheetContent side='left' className='p-0 w-72'>
                <SidebarContent
                  nav={nav}
                  collapsed={false}
                  closeOnNavigate={() => {}}
                />
              </SheetContent>
            </Sheet>

            <div className='font-semibold'>Modules</div>
          </div>

          <div className='p-6'>{children}</div>
        </main>
      </div>
    </div>
  );
}
