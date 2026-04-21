import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypeScript from 'eslint-config-next/typescript';

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypeScript,
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      '.eslintcache',
      'public/**',
      'next-env.d.ts',
      'pnpm-lock.yaml',
    ],
  },
];

export default eslintConfig;
