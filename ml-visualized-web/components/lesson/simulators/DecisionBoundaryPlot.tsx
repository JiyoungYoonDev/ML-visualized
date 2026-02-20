"use client";

import React from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

// Sample data to make the graph visible immediately
const sampleData = [
  { x: 2, y: 10, status: 0 },
  { x: 4, y: 15, status: 0 },
  { x: 8, y: 40, status: 1 },
  { x: 12, y: 45, status: 1 },
  { x: 14, y: 55, status: 1 },
];

export function DecisionBoundaryPlot({ w1 = 0.5, w2 = 0.1, b = -5 }) {
  // Solve for y: y = (-w1*x - b) / w2
  const getLinePoint = (x: number) => (-w1 * x - b) / w2;

  const lineData = [
    { x: 0, y: getLinePoint(0) },
    { x: 15, y: getLinePoint(15) },
  ];

  return (
    // Explicit height on the wrapper is crucial for ResponsiveContainer
    <div className="h-[300px] w-full min-w-[250px] bg-white">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis type="number" dataKey="x" name="Hours" domain={[0, 15]} />
          <YAxis type="number" dataKey="y" name="Grade" domain={[0, 60]} />
          <ZAxis type="number" range={[64, 64]} />
          <Tooltip cursor={{ strokeDasharray: "3 3" }} />
          
          {/* The Decision Boundary Line */}
          <Scatter 
            data={lineData} 
            line={{ stroke: '#2563eb', strokeWidth: 3 }} 
            shape={() => null} 
          />

          {/* Data Points */}
          <Scatter data={sampleData}>
            {sampleData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.status === 1 ? "#22c55e" : "#ef4444"} 
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}