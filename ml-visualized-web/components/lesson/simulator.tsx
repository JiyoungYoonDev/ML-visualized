"use client";

import { simulatorRegistry } from "./simulators/registry";

export function Simulator({ id }: { id: string }) {
  const Comp = simulatorRegistry[id];
  if (!Comp) {
    return (
      <div className="rounded-xl border bg-muted/40 p-4 text-sm text-muted-foreground">
        Simulator not found: <span className="font-semibold text-foreground">{id}</span>
      </div>
    );
  }
  return <Comp />;
}
