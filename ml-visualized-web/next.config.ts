import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/modules/machine-learning/overview',
        destination: '/modules/machine-learning/machine-learning/overview',
      },
      {
        source: '/modules/machine-learning/:lesson',
        destination: '/modules/machine-learning/machine-learning/:lesson',
      },
      {
        source: '/modules/bootcamps/overview',
        destination: '/modules/bootcamps/bootcamps/overview',
      },
      {
        source: '/modules/bootcamps/:lesson',
        destination: '/modules/bootcamps/bootcamps/:lesson',
      },
      {
        source: '/modules/linear-algebra/overview',
        destination: '/modules/linear-algebra/linear-algebra/overview',
      },
      {
        source: '/modules/optimization/overview',
        destination: '/modules/optimization/optimization/overview',
      },
      {
        source: '/modules/optimization/:lesson',
        destination: '/modules/optimization/optimization/:lesson',
      },
      {
        source: '/modules/linear-algebra/:feature',
        destination: '/modules/linear-algebra/linear-algebra/eigen/:feature',
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/modules/algorithms/overview',
        destination: '/modules/machine-learning/algorithms/overview',
        permanent: false,
      },
      {
        source: '/modules/mistake-bounded/overview',
        destination: '/modules/machine-learning/mistake-bounded/overview',
        permanent: false,
      },
      {
        source: '/modules/notation',
        destination: '/modules/bootcamps/notation',
        permanent: false,
      },
      {
        source: '/modules/machine-learning/machine-learning/overview',
        destination: '/modules/machine-learning/overview',
        permanent: false,
      },
      {
        source: '/modules/machine-learning/machine-learning/:lesson',
        destination: '/modules/machine-learning/:lesson',
        permanent: false,
      },
      {
        source: '/modules/lectures',
        destination: '/modules/machine-learning/overview',
        permanent: false,
      },
      {
        source: '/modules/lectures/overview',
        destination: '/modules/machine-learning/overview',
        permanent: false,
      },
      {
        source: '/modules/lectures/:lesson',
        destination: '/modules/machine-learning/:lesson',
        permanent: false,
      },
      {
        source: '/modules/lectures/:group/:lesson',
        destination: '/modules/machine-learning/:group/:lesson',
        permanent: false,
      },
      {
        source: '/modules/lectures/:group/:lesson/:feature',
        destination: '/modules/machine-learning/:group/:lesson/:feature',
        permanent: false,
      },
      {
        source: '/modules/lectures/lectures/overview',
        destination: '/modules/machine-learning/overview',
        permanent: false,
      },
      {
        source: '/modules/lectures/lectures/:lesson',
        destination: '/modules/machine-learning/:lesson',
        permanent: false,
      },
      {
        source: '/modules/bootcamps/bootcamps/overview',
        destination: '/modules/bootcamps/overview',
        permanent: false,
      },
      {
        source: '/modules/bootcamps/bootcamps/:lesson',
        destination: '/modules/bootcamps/:lesson',
        permanent: false,
      },
      {
        source: '/modules/linear-algebra',
        destination: '/modules/linear-algebra/overview',
        permanent: false,
      },
      {
        source: '/modules/linear-algebra/linear-algebra/overview',
        destination: '/modules/linear-algebra/overview',
        permanent: false,
      },
      {
        source: '/modules/optimization',
        destination: '/modules/optimization/overview',
        permanent: false,
      },
      {
        source: '/modules/optimiazaition',
        destination: '/modules/optimization/overview',
        permanent: false,
      },
      {
        source: '/modules/optimiazaition/overview',
        destination: '/modules/optimization/overview',
        permanent: false,
      },
      {
        source: '/modules/optimiazaition/:lesson',
        destination: '/modules/optimization/:lesson',
        permanent: false,
      },
      {
        source: '/modules/optimization/optimization/overview',
        destination: '/modules/optimization/overview',
        permanent: false,
      },
      {
        source: '/modules/optimization/optimization/:lesson',
        destination: '/modules/optimization/:lesson',
        permanent: false,
      },
      {
        source: '/modules/linear-algebra/linear-algebra/eigen',
        destination: '/modules/linear-algebra/overview',
        permanent: false,
      },
      {
        source: '/modules/linear-algebra/linear-algebra/eigen/:feature',
        destination: '/modules/linear-algebra/:feature',
        permanent: false,
      },
      {
        source: '/modules/linear-algebra/eigen',
        destination: '/modules/linear-algebra/overview',
        permanent: false,
      },
      {
        source: '/modules/linear-algebra/eigen/:feature',
        destination: '/modules/linear-algebra/:feature',
        permanent: false,
      },
      {
        source: '/modules/mistake-bounded',
        destination: '/modules/machine-learning/mistake-bounded/intro',
        permanent: false,
      },
      {
        source: '/modules/mistake-bounded/:slug',
        destination: '/modules/machine-learning/mistake-bounded/:slug',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
