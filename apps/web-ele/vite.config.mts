import path from 'node:path';

import { defineConfig } from '@igourd/vite-config';

import ElementPlus from 'unplugin-element-plus/vite';

export default defineConfig(async () => {
  return {
    application: {},
    vite: {
      resolve: {
        alias: {
          '@@': path.resolve('./src/features'),
        },
      },
      plugins: [
        ElementPlus({
          format: 'esm',
          ignoreComponents: ['AutoResizer'],
        }),
        // VitePluginImp({
        //   libList: [
        //     {
        //       libName: '@igourd/common-ui',
        //       style(name) {
        //         return '@igourd/common-ui'
        //       },
        //     },
        //   ],
        // }),
      ],
      server: {
        proxy: {
          '/api': {
            changeOrigin: true,
            secure: false,
            rewrite: (path) => {
              return path.replace(/^\/api/, '');
            },
            // mock代理目标地址
            target: 'https://dev-api.seller100.com',
            ws: true,
          },
          // '/api/passport': {
          //   changeOrigin: true,
          //   secure: false,
          //   rewrite: (path) => path.replace(/^\/api/, ''),
          //   // mock代理目标地址
          //   target: 'https://test-api.seller100.com',
          //   ws: true,
          // },
        },
      },
    },
  };
});
