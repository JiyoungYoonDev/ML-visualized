'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { ScrollArea } from '../../components/ui/scroll-area';
import { Separator } from '../../components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '../../components/ui/sheet';
import { Button } from '../../components/ui/button';

import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Brain,
  LineChart,
  TrendingDown,
  Settings,
} from 'lucide-react';

type NavItem = {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  disabled?: boolean;
  exact?: boolean;
};

type NavSection = {
  section: string;
  items: NavItem[];
};

type NavGroup = {
  group: string;
  sections: NavSection[];
};

const nav: NavGroup[] = [
  {
    group: 'Chapter 1: Online Learning',
    sections: [
      {
        section: 'Mistake-Bounded',
        items: [
          {
            label: 'Overview',
            href: '/modules/mistake-bounded',
            icon: BookOpen,
            exact: true,
          },
          {
            label: 'Intro',
            href: '/modules/mistake-bounded/intro',
            icon: Brain,
          },
          {
            label: 'Weighted Majority',
            href: '/modules/mistake-bounded/weighted-majority',
            icon: LineChart,
          },
        ],
      },
    ],
  },
  {
    group: 'Chapter 2: Optimization',
    sections: [
      {
        section: 'Foundations',
        items: [
          {
            label: 'Gradient Descent',
            href: '/modules/gd',
            icon: TrendingDown,
          },
          {
            label: 'Linear Regression',
            href: '/modules/linreg',
            icon: LineChart,
          },
        ],
      },
    ],
  },
  {
    group: 'Extras',
    sections: [
      {
        section: 'Resources',
        items: [{ label: 'Settings', href: '/settings', icon: Settings }],
      },
    ],
  },
];

function isActive(pathname: string, item: { href: string; exact?: boolean }) {
  if (item.exact) return pathname === item.href;
  return pathname === item.href || pathname.startsWith(item.href + '/');
}

function SidebarContent({
  collapsed,
  onToggle,
  closeOnNavigate,
}: {
  collapsed: boolean;
  onToggle?: () => void;
  closeOnNavigate?: () => void;
}) {
  const pathname = usePathname();

  const flatItems = useMemo(() => {
    const items: NavItem[] = [];
    nav.forEach((g) =>
      g.sections.forEach((s) => s.items.forEach((i) => items.push(i))),
    );
    return items;
  }, []);

  return (
    <div className='h-full flex'>
      {collapsed && (
        <div className='w-14 border-r bg-card flex flex-col items-center py-3 gap-2'>
          {flatItems.map((item) => {
            const active = isActive(pathname, item);
            const Icon = item.icon;
            const base =
              'h-10 w-10 rounded-md grid place-items-center transition';
            const styles = active
              ? 'bg-muted text-foreground'
              : 'text-muted-foreground hover:bg-muted/60';
            return item.disabled ? (
              <div
                key={item.href}
                className={`${base} opacity-40`}
                title={item.label}
              >
                <Icon className='h-5 w-5' />
              </div>
            ) : (
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

      {/* Main sidebar panel */}

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
                      <div
                        className={[
                          'text-xs font-semibold text-foreground/80',
                          collapsed ? 'hidden' : '',
                        ].join(' ')}
                      >
                        {section.section}
                      </div>

                      <div className='space-y-1'>
                        {section.items.map((item) => {
                          const active = isActive(pathname, item);
                          const Icon = item.icon;

                          // ✅ (2) Active indicator (left bar + check vibe)
                          const rowBase =
                            'group flex items-center justify-between gap-2 rounded-md px-3 py-2 text-sm transition';
                          const rowActive = 'bg-muted text-foreground';
                          const rowIdle = 'hover:bg-muted/60 text-foreground';
                          const rowDisabled = 'opacity-50 cursor-not-allowed';

                          const leftBar = (
                            <span
                              className={[
                                'h-5 w-1 rounded-full',
                                active ? 'bg-foreground' : 'bg-transparent',
                              ].join(' ')}
                            />
                          );

                          const content = (
                            <div className='flex items-center gap-2 min-w-0'>
                              {leftBar}
                              <Icon className='h-4 w-4 text-muted-foreground group-hover:text-foreground' />
                              {!collapsed && (
                                <span className='truncate'>{item.label}</span>
                              )}
                              {collapsed && (
                                <span className='sr-only'>{item.label}</span>
                              )}
                            </div>
                          );

                          if (item.disabled) {
                            return (
                              <div
                                key={item.href}
                                className={`${rowBase} ${rowDisabled}`}
                                title='Coming soon'
                              >
                                {content}
                                {!collapsed && item.badge && (
                                  <span className='rounded-full border px-2 py-0.5 text-[10px] text-muted-foreground'>
                                    {item.badge}
                                  </span>
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
                              {!collapsed && item.badge && (
                                <span className='rounded-full border px-2 py-0.5 text-[10px] text-muted-foreground'>
                                  {item.badge}
                                </span>
                              )}
                            </Link>
                          );
                        })}
                      </div>
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

export default function ModulesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  if (pathname.startsWith('/modules/chapter1')) {
    return <>{children}</>;
  }

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
                <SidebarContent collapsed={false} closeOnNavigate={() => {}} />
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
