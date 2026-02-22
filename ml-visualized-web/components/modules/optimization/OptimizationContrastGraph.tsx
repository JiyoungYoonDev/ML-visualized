'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceDot,
  Label,
} from 'recharts';
import { TrendingDown, TrendingUp, Target } from 'lucide-react';

const generateData = () => {
  const data = [];
  for (let x = -5; x <= 5.1; x += 0.5) {
    data.push({
      x: parseFloat(x.toFixed(1)),
      cost: parseFloat((x * x).toFixed(2)),
      gain: parseFloat((25 - x * x).toFixed(2)),
    });
  }
  return data;
};

const data = generateData();

const CustomArrow = ({ cx, cy, direction, color }: any) => {
  const arrowPath =
    direction === 'down'
      ? `M${cx - 10},${cy - 20} L${cx},${cy} L${cx + 10},${cy - 20}`
      : `M${cx - 10},${cy + 20} L${cx},${cy} L${cx + 10},${cy + 20}`;

  return (
    <g>
      <path
        d={arrowPath}
        stroke={color}
        strokeWidth={3}
        fill='none'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </g>
  );
};

export function OptimizationContrastGraph() {
  return (
    <div className='w-full py-8'>
      <div className='grid md:grid-cols-2 gap-8 max-w-5xl mx-auto'>
        <div className='rounded-3xl border border-rose-100 bg-rose-50/50 p-6 shadow-sm overflow-hidden relative'>
          <div className='mb-6 flex items-center justify-between'>
            <div>
              <h3 className='text-lg font-bold flex items-center gap-2 text-rose-900'>
                <TrendingDown className='text-rose-600' /> Minimize: Cost
              </h3>
              <p className='text-xs text-rose-700 mt-1'>
                Goal: Find the minimum of the Loss Function
              </p>
            </div>
            <div className='bg-rose-100 p-2 rounded-full text-rose-600'>
              <Target size={20} />
            </div>
          </div>

          <div className='h-[300px] w-full'>
            <ResponsiveContainer width='100%' height='100%'>
              <LineChart
                data={data}
                margin={{ top: 20, right: 20, bottom: 45, left: 0 }}
              >
                <CartesianGrid
                  strokeDasharray='3 3'
                  stroke='#fda4af'
                  opacity={0.5}
                  vertical={false}
                />
                <XAxis dataKey='x' hide domain={[-5, 5]} />
                <YAxis hide domain={[0, 30]} />

                <ReferenceDot
                  x={-2.5}
                  y={6.25}
                  r={0}
                  shape={<CustomArrow direction='down' color='#e11d48' />}
                />
                <ReferenceDot
                  x={2.5}
                  y={6.25}
                  r={0}
                  shape={<CustomArrow direction='down' color='#e11d48' />}
                />

                <ReferenceDot
                  x={0}
                  y={0}
                  r={6}
                  fill='#e11d48'
                  stroke='#fff'
                  strokeWidth={2}
                >
                  <Label
                    value='Global Minimum'
                    position='bottom'
                    offset={10}
                    className='fill-rose-800 text-xs font-bold'
                  />
                </ReferenceDot>

                <Line
                  type='monotone'
                  dataKey='cost'
                  stroke='#e11d48'
                  strokeWidth={4}
                  dot={false}
                  isAnimationActive={true}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className='absolute bottom-4 left-0 right-0 text-center text-[10px] text-rose-800/60 font-mono'>
            Convex Function
          </div>
        </div>

        <div className='rounded-3xl border border-emerald-100 bg-emerald-50/50 p-6 shadow-sm overflow-hidden relative'>
          <div className='mb-6 flex items-center justify-between'>
            <div>
              <h3 className='text-lg font-bold flex items-center gap-2 text-emerald-900'>
                <TrendingUp className='text-emerald-600' /> Maximize: Gain
              </h3>
              <p className='text-xs text-emerald-700 mt-1'>
                Goal: Find the maximum of the Objective Function
              </p>
            </div>
            <div className='bg-emerald-100 p-2 rounded-full text-emerald-600'>
              <Target size={20} />
            </div>
          </div>

          <div className='h-[300px] w-full'>
            <ResponsiveContainer width='100%' height='100%'>
              <LineChart
                data={data}
                margin={{ top: 20, right: 20, bottom: 20, left: 0 }}
              >
                <CartesianGrid
                  strokeDasharray='3 3'
                  stroke='#6ee7b7'
                  opacity={0.5}
                  vertical={false}
                />
                <XAxis dataKey='x' hide domain={[-5, 5]} />
                <YAxis hide domain={[0, 30]} />

                <ReferenceDot
                  x={-2.5}
                  y={18.75}
                  r={0}
                  shape={<CustomArrow direction='up' color='#059669' />}
                />
                <ReferenceDot
                  x={2.5}
                  y={18.75}
                  r={0}
                  shape={<CustomArrow direction='up' color='#059669' />}
                />

                <ReferenceDot
                  x={0}
                  y={25}
                  r={6}
                  fill='#059669'
                  stroke='#fff'
                  strokeWidth={2}
                >
                  <Label
                    value='Global Maximum'
                    position='top'
                    offset={10}
                    className='fill-emerald-800 text-xs font-bold'
                  />
                </ReferenceDot>

                <Line
                  type='monotone'
                  dataKey='gain'
                  stroke='#059669'
                  strokeWidth={4}
                  dot={false}
                  isAnimationActive={true}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className='absolute bottom-4 left-0 right-0 text-center text-[10px] text-emerald-800/60 font-mono'>
            Concave Function
          </div>
        </div>
      </div>
      <p className='text-center text-xs text-muted-foreground mt-6'>
        Most machine learning problems ultimately boil down to{' '}
        <strong>"finding the bottom of the valley"</strong> by minimizing the
        cost.
      </p>
    </div>
  );
}
