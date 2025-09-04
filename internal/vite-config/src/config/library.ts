import type { ConfigEnv, UserConfig } from 'vite';

import type { DefineLibraryOptions } from '../typing';

import { readPackageJSON } from '@igourd/node-utils';

import replace from '@rollup/plugin-replace';
import { defineConfig, mergeConfig } from 'vite';

import { loadLibraryPlugins } from '../plugins';
import { getCommonConfig } from './common';

function defineLibraryConfig(userConfigPromise?: DefineLibraryOptions) {
  return defineConfig(async (config: ConfigEnv) => {
    const options = await userConfigPromise?.(config);
    const { command, mode } = config;
    const { library = {}, vite = {} } = options || {};
    const root = process.cwd();
    const isBuild = command === 'build';

    const plugins = await loadLibraryPlugins({
      dts: false,
      injectMetadata: true,
      isBuild,
      mode,
      ...library,
    });

    const { dependencies = {}, peerDependencies = {} } =
      await readPackageJSON(root);

    const externalPackages = [
      ...Object.keys(dependencies),
      ...Object.keys(peerDependencies),
    ];

    const packageConfig: UserConfig = {
      build: {
        lib: {
          entry: 'src/index.ts',
          fileName: () => 'index.mjs',
          formats: ['es'],
        },
        rollupOptions: {
          external: (id) => {
            return externalPackages.some(
              (pkg) => id === pkg || id.startsWith(`${pkg}/`),
            );
          },
        },
      },
      plugins: [
        ...plugins,
        replace({
          // 保留环境变量引用，不进行替换
          'import.meta.env.VITE_APP_API_LOGIN_URL':
            'import.meta.env.VITE_APP_API_LOGIN_URL',
          'import.meta.env.VITE_APP_API_BASE_URL':
            'import.meta.env.VITE_APP_API_BASE_URL',
          'import.meta.env.VITE_APP_TITLE': 'import.meta.env.VITE_APP_TITLE',
          'import.meta.env.VITE_APP_DESCRIPTION':
            'import.meta.env.VITE_APP_DESCRIPTION',
          'import.meta.env.VITE_APP_VERSION':
            'import.meta.env.VITE_APP_VERSION',
          'import.meta.env.VITE_APP_BUILD_TIME':
            'import.meta.env.VITE_APP_BUILD_TIME',
          'import.meta.env.VITE_APP_MODE': 'import.meta.env.VITE_APP_MODE',
          'import.meta.env.VITE_APP_DEV': 'import.meta.env.VITE_APP_DEV',
          'import.meta.env.VITE_APP_PROD': 'import.meta.env.VITE_APP_PROD',
          'import.meta.env.VITE_APP_SSR': 'import.meta.env.VITE_APP_SSR',
          'import.meta.env.VITE_APP_LOGIN_PATH':
            'import.meta.env.VITE_APP_LOGIN_PATH',
          'import.meta.env.VITE_APP_STORE_SECURE_KEY':
            'import.meta.env.VITE_APP_STORE_SECURE_KEY',
          delimiters: ['', ''],
          preventAssignment: true,
        }),
      ],
    };
    const commonConfig = await getCommonConfig();
    const mergedConmonConfig = mergeConfig(commonConfig, packageConfig);
    return mergeConfig(mergedConmonConfig, vite);
  });
}

export { defineLibraryConfig };
