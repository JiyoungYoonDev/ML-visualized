export function OverviewHeroSection({
  title,
  description,
}: {
  title?: string;
  description?: string;
}) {
  return (
    <section>
      <h1 className='mt-2 text-3xl font-bold tracking-tight md:text-4xl'>
        {title ?? 'Module Overview'}
      </h1>
      {description && (
        <p className='mt-3 text-sm leading-7 text-muted-foreground md:text-base'>
          {description}
        </p>
      )}
    </section>
  );
}
