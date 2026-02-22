import { SectionBox } from './SectionBox';

export function HeroCard({
  title,
  description,
  eyebrow,
}: {
  title: string;
  description?: string;
  eyebrow?: string;
}) {
  const overviewLabel = eyebrow ?? `${title} Overview`;

  return (
    <SectionBox>
      <p className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
        {overviewLabel}
      </p>
      <h1 className='mt-2 text-3xl font-bold tracking-tight md:text-4xl'>
        {title}
      </h1>
      {description && (
        <p className='mt-3 text-sm leading-7 text-muted-foreground md:text-base'>
          {description}
        </p>
      )}
    </SectionBox>
  );
}
