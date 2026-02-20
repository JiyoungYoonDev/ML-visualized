'use client'; // 클라이언트 컴포넌트 선언

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import type { PlotParams } from 'react-plotly.js';

const Plot = dynamic<PlotParams>(() => import('react-plotly.js'), {
  ssr: false,
});

type GraphData = {
  data: PlotParams['data'];
  layout?: PlotParams['layout'];
};

const DEFAULT_FALLBACK_DATA: GraphData = {
  data: [
    {
      x: [-2, -1, 0, 1, 2],
      y: [2.12, 1.31, 0.69, 0.31, 0.12],
      type: 'scatter',
    },
  ],
  layout: { title: 'Logistic Loss Visualization' },
};

type GraphPlotProps = {
  dataUrl?: string;
  fallbackData?: GraphData;
  className?: string;
  mobileBreakpointPx?: number;
  loadingText?: string;
  fetchErrorMessage?: string;
  hoverTemplate?: string;
  hoverInfo?: string;
};

export default function GraphPlot({
  dataUrl = '/data/logistic_loss_graph.json',
  fallbackData = DEFAULT_FALLBACK_DATA,
  className = 'w-full h-[300px] sm:h-[400px]',
  mobileBreakpointPx = 640,
  loadingText = 'Loading Graph...',
  fetchErrorMessage = 'Graph JSON 로드 실패: fallback 데이터로 표시합니다.',
  hoverTemplate =
    '<b>Margin (z)</b>: %{x:.2f}<br><b>Loss</b>: %{y:.4f}<extra>%{fullData.name}</extra>',
  hoverInfo = 'x+y+name',
}: GraphPlotProps) {
  const [data, setData] = useState<GraphData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${mobileBreakpointPx}px)`);
    const updateViewport = (event: MediaQueryList | MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };

    updateViewport(mediaQuery);

    mediaQuery.addEventListener('change', updateViewport);
    return () => mediaQuery.removeEventListener('change', updateViewport);
  }, [mobileBreakpointPx]);

  useEffect(() => {
    if (!dataUrl) {
      setData(fallbackData);
      setError(null);
      return;
    }

    const controller = new AbortController();

    const load = async () => {
      try {
        const response = await fetch(dataUrl, {
          signal: controller.signal,
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch graph json: ${response.status}`);
        }

        const payload = (await response.json()) as GraphData;

        if (!payload || !Array.isArray(payload.data)) {
          throw new Error('Invalid graph data format');
        }

        setData(payload);
      } catch (loadError) {
        if (controller.signal.aborted) return;
        setError(fetchErrorMessage);
        setData(fallbackData);
      }
    };

    load();

    return () => controller.abort();
  }, [dataUrl, fallbackData, fetchErrorMessage]);

  if (!data) return <div>{loadingText}</div>;

  const interactiveData: PlotParams['data'] = data.data.map((trace) => {
    if (!trace || typeof trace !== 'object') return trace;

    const typedTrace = trace as Record<string, unknown>;
    const hasCustomHover =
      typeof typedTrace.hovertemplate === 'string' ||
      typeof typedTrace.hoverinfo === 'string';

    if (hasCustomHover) return trace;

    return {
      ...typedTrace,
      hoverinfo: hoverInfo,
      hovertemplate: hoverTemplate,
    } as typeof trace;
  });

  const layout: PlotParams['layout'] = {
    ...(data.layout ?? {}),
    autosize: true,
    hovermode: 'closest',
    margin: isMobile
      ? { l: 36, r: 16, t: 48, b: 42 }
      : { l: 48, r: 24, t: 60, b: 48 },
    font: {
      ...(data.layout?.font ?? {}),
      size: isMobile ? 10 : 12,
    },
  };

  return (
    <div className={className}>
      {error && <p className='mb-2 text-xs text-amber-600'>{error}</p>}
      <Plot
        data={interactiveData}
        layout={layout}
        config={{ responsive: true, displayModeBar: !isMobile }}
        useResizeHandler={true}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
