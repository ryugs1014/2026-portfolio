import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,

  compiler: {
    styledComponents: true,
  },

  images: {
    formats: ['image/webp'],
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'https', hostname: 'vercel.app' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      // { protocol: 'https', hostname: 'drive.google.com' },
      // {
      //   protocol: 'https',
      //   hostname: 'heydealer-api.s3.amazonaws.com',
      //   pathname: '/**',
      // },
      // {
      //   protocol: 'https',
      //   hostname: 'prnd-car-purchase.s3.ap-northeast-2.amazonaws.com',
      //   pathname: '/**',
      // },
    ],
  },

  sassOptions: {
    includePaths: [path.join(__dirname, 'src')],
  },

  // 1. next build(배포) 시 사용될 Webpack 설정
  webpack(config) {
    const fileLoaderRule = config.module.rules.find((rule: any) =>
      rule.test?.test?.('.svg'),
    );

    config.module.rules.push(
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/,
      },
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: {
          not: [...(fileLoaderRule.resourceQuery?.not || []), /url/],
        },
        use: ['@svgr/webpack'],
      },
    );

    fileLoaderRule.exclude = /\.svg$/i;
    return config;
  },

  // 2. next dev(개발 서버) 시 사용될 터보팩 설정
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
};

export default nextConfig;
