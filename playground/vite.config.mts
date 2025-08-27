import { defineConfig } from '@igourd/vite-config';

export default defineConfig(async () => {
  return {
    application: {},
    vite: {
      server: {
        proxy: {
          '/api': {
            secure: false, // 修复拼写错误：secrue -> secure
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ''),
            // mock代理目标地址
            target: 'https://test-api.seller100.com',
            ws: true,
            // 忽略SSL证书验证，解决证书过期问题
            configure: (proxy, _options) => {
              proxy.on('proxyReq', (proxyReq, _req, _res) => {
                // 设置忽略SSL证书验证
                proxyReq.setHeader('Connection', 'keep-alive');
              });
            },
          },
        },
      },
    },
  };
});
