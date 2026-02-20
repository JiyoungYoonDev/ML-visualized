'use client';

import { useEffect, useMemo, useState } from 'react';

type TocItem = {
  id: string;
  text: string;
  level: 2 | 3;
};

type OnThisPageTocProps = {
  items: TocItem[];
};

export function OnThisPageToc({ items }: OnThisPageTocProps) {
  const [activeId, setActiveId] = useState<string>('');

  const validItems = useMemo(
    () => items.filter((item) => item.id && item.text),
    [items],
  );

  useEffect(() => {
    if (validItems.length === 0) return;

    const elements = validItems
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (elements.length === 0) return;

    const updateFromHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) setActiveId(hash);
    };

    updateFromHash();

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              Math.abs(a.boundingClientRect.top) -
              Math.abs(b.boundingClientRect.top),
          );

        if (visible.length > 0) {
          const id = visible[0].target.getAttribute('id');
          if (id) setActiveId(id);
        }
      },
      {
        rootMargin: '-25% 0px -60% 0px',
        threshold: [0, 1],
      },
    );

    elements.forEach((el) => observer.observe(el));
    window.addEventListener('hashchange', updateFromHash);

    return () => {
      observer.disconnect();
      window.removeEventListener('hashchange', updateFromHash);
    };
  }, [validItems]);

  if (validItems.length === 0) return null;

  return (
    <aside className='hidden md:block'>
      <div className='sticky top-24 rounded-lg border bg-card p-4'>
        <p className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
          On this page
        </p>
        <nav className='mt-3 border-l border-border pl-3'>
          <ul className='space-y-2 text-sm'>
            {validItems.map((item) => {
              const isActive = item.id === activeId;
              return (
                <li key={item.id} className={item.level === 3 ? 'pl-3' : ''}>
                  <a
                    href={`#${item.id}`}
                    className={
                      isActive
                        ? 'font-semibold text-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }
                  >
                    {item.text}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
