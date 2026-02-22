"use client";

import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  ResponsiveContainer, ReferenceArea, ReferenceDot, Label
} from 'recharts';

const generateData = () => {
  const data = [];
  for (let x = -1; x <= 4.1; x += 0.2) {
    data.push({
      x: parseFloat(x.toFixed(1)),
      y: Math.pow(x - 2, 2) + 1,
    });
  }
  return data;
};

export function ConstrainedOptimizationGraph() {
  const data = generateData();

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
          <XAxis dataKey="x" type="number" domain={[-1, 4]} />
          <YAxis type="number" domain={[0, 10]} />

          {/* Shading the Feasible Region: x <= 1 */}
          <ReferenceArea x1={-1} x2={1} fill="#3b82f6" fillOpacity={0.1}>
             <Label value="Feasible Region" position="insideBottomLeft" fill="#3b82f6" fontSize={10} offset={10} />
          </ReferenceArea>

          {/* Unconstrained Minimum (The Vertex) */}
          <ReferenceDot x={2} y={1} r={4} fill="#94a3b8" stroke="#fff">
            <Label value="Unconstrained Min (x=2)" position="top" fill="#94a3b8" fontSize={10} />
          </ReferenceDot>

          {/* Constrained Minimum (The Optimum) */}
          <ReferenceDot x={1} y={2} r={6} fill="#ef4444" stroke="#fff" strokeWidth={2}>
            <Label value="Optimum x*=1" position="left" fill="#ef4444" fontWeight="bold" fontSize={11} offset={10} />
          </ReferenceDot>

          <Line 
            type="monotone" 
            dataKey="y" 
            stroke="#1e293b" 
            strokeWidth={3} 
            dot={false} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}