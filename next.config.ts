import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  typescript: {},
  turbopack: {
    rules: {
      '*.glsl': {
        loaders: ['raw-loader', 'glslify-loader'],
        as: '*.js',
      },
      '*.vs': {
        loaders: ['raw-loader', 'glslify-loader'],
        as: '*.js',
      },
      '*.fs': {
        loaders: ['raw-loader', 'glslify-loader'],
        as: '*.js',
      },
      '*.vert': {
        loaders: ['raw-loader', 'glslify-loader'],
        as: '*.js',
      },
      '*.frag': {
        loaders: ['raw-loader', 'glslify-loader'],
        as: '*.js',
      },
    },
  },
  allowedDevOrigins: ['192.168.1.98'],
};

export default nextConfig;
