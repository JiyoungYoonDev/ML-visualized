declare module 'react-plotly.js' {
  import * as React from 'react';
  import type { Config, Data, Layout } from 'plotly.js';

  export type PlotParams = {
    data: Data[];
    layout?: Partial<Layout>;
    config?: Partial<Config>;
    frames?: unknown[];
    style?: React.CSSProperties;
    className?: string;
    useResizeHandler?: boolean;
    onInitialized?: (figure: unknown, graphDiv: unknown) => void;
    onUpdate?: (figure: unknown, graphDiv: unknown) => void;
    onPurge?: (figure: unknown, graphDiv: unknown) => void;
    onError?: (err: Error) => void;
  };

  const Plot: React.ComponentType<PlotParams>;
  export default Plot;
}
