"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function WMMiniSimulator() {
  const [count, setCount] = useState(0);

  return (
    <div className="rounded-xl border bg-card p-4 space-y-3">
      <div className="text-sm text-muted-foreground">
        (Placeholder) Weighted Majority simulator goes here.
      </div>
      <div className="text-sm">Clicks: {count}</div>
      <Button onClick={() => setCount((c) => c + 1)}>Test interaction</Button>
    </div>
  );
}
