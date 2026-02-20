'use client';

import { useMemo, useState } from 'react';
import { LatexMath } from '@/components/latex-math';

function sigmoid(z: number) {
  return 1 / (1 + Math.exp(-z));
}

export function SigmoidClampDemo() {
  const [z, setZ] = useState(0);

  const p = useMemo(() => sigmoid(z), [z]);

  // progress bar처럼 보이게 (0~1)
  const pct = Math.round(p * 1000) / 10;

  return (
    <div className="mt-4 space-y-3">
      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-lg border bg-muted/30 p-3">
          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Linear score z
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            z can be any real number:
          </div>
          <div className="mt-2">
            <LatexMath block math={'z \\in (-\\infty, +\\infty)'} />
          </div>

          <div className="mt-3 text-sm">
            Current: <span className="font-semibold">{z.toFixed(2)}</span>
          </div>

          <input
            className="mt-2 w-full"
            type="range"
            min={-10}
            max={10}
            step={0.1}
            value={z}
            onChange={(e) => setZ(Number(e.target.value))}
          />
          <div className="mt-1 flex justify-between text-xs text-muted-foreground">
            <span>-10</span>
            <span>0</span>
            <span>+10</span>
          </div>
        </div>

        <div className="rounded-lg border bg-muted/30 p-3">
          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Probability p = σ(z)
          </div>
          <div className="mt-2">
            <LatexMath block math={'p = \\sigma(z) = \\frac{1}{1+e^{-z}}'} />
          </div>

          <div className="mt-3 text-sm">
            Current: <span className="font-semibold">{p.toFixed(4)}</span>{' '}
            <span className="text-muted-foreground">({pct}%)</span>
          </div>

          <div className="mt-2 h-3 w-full rounded-full border bg-card overflow-hidden">
            <div
              className="h-full bg-foreground/80"
              style={{ width: `${p * 100}%` }}
            />
          </div>

          <div className="mt-2 text-xs text-muted-foreground">
            Always stays in <span className="font-semibold text-foreground">(0,1)</span>.
            When z increases → p approaches 1, when z decreases → p approaches 0.
          </div>
        </div>
      </div>

      <div className="rounded-lg border p-3 text-xs text-muted-foreground">
        <span className="font-semibold text-foreground">Interpretation:</span>{' '}
        If p ≈ 0.9, the model is “very confident” about class 1. If p ≈ 0.1, it’s confident about class 0.
      </div>
    </div>
  );
}
