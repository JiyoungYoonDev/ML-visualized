import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/modules/lectures/overview',
        destination: '/modules/lectures/lectures/overview',
      },
      {
        source: '/modules/lectures/:lesson',
        destination: '/modules/lectures/lectures/:lesson',
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
        source: '/modules/linear-algebra/:feature',
        destination: '/modules/linear-algebra/linear-algebra/eigen/:feature',
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/modules/algorithms/overview',
        destination: '/modules/lectures/algorithms/overview',
        permanent: false,
      },
      {
        source: '/modules/mistake-bounded/overview',
        destination: '/modules/lectures/mistake-bounded/overview',
        permanent: false,
      },
      {
        source: '/modules/notation',
        destination: '/modules/bootcamps/notation',
        permanent: false,
      },
      {
        source: '/modules/lectures/lectures/overview',
        destination: '/modules/lectures/overview',
        permanent: false,
      },
      {
        source: '/modules/lectures/lectures/:lesson',
        destination: '/modules/lectures/:lesson',
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
        destination: '/modules/lectures/mistake-bounded/intro',
        permanent: false,
      },
      {
        source: '/modules/mistake-bounded/:slug',
        destination: '/modules/lectures/mistake-bounded/:slug',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
