import { defineConfig } from '@igourd/vite-config';

import ElementPlus from 'unplugin-element-plus/vite';

export default defineConfig(async () => {
  return {
    application: {},
    vite: {
      plugins: [
        ElementPlus({
          format: 'esm',
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
            rewrite: (path) => path.replace(/^\/api/, ''),
            // mock代理目标地址
            target: 'http://localhost:5320/api',
            ws: true,
          },
        },
      },
    },
  };
});
