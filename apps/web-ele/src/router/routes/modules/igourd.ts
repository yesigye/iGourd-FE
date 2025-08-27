import type { RouteRecordRaw } from 'vue-router';

import {
  IGOURD_ANT_PREVIEW_URL,
  IGOURD_DOC_URL,
  IGOURD_GITHUB_URL,
  IGOURD_LOGO_URL,
  IGOURD_NAIVE_PREVIEW_URL,
} from '@igourd/constants';
import { SvgAntdvLogoIcon } from '@igourd/icons';

import { IFrameView } from '#/layouts';
import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      badgeType: 'dot',
      icon: IGOURD_LOGO_URL,
      order: 9998,
      title: $t('demos.igourd.title'),
    },
    name: 'IgourdProject',
    path: '/igourd-admin',
    children: [
      {
        name: 'IgourdDocument',
        path: '/igourd-admin/document',
        component: IFrameView,
        meta: {
          icon: 'lucide:book-open-text',
          link: IGOURD_DOC_URL,
          title: $t('demos.igourd.document'),
        },
      },
      {
        name: 'IgourdGithub',
        path: '/igourd-admin/github',
        component: IFrameView,
        meta: {
          icon: 'mdi:github',
          link: IGOURD_GITHUB_URL,
          title: 'Github',
        },
      },
      {
        name: 'IgourdNaive',
        path: '/igourd-admin/naive',
        component: IFrameView,
        meta: {
          badgeType: 'dot',
          icon: 'logos:naiveui',
          link: IGOURD_NAIVE_PREVIEW_URL,
          title: $t('demos.igourd.naive-ui'),
        },
      },
      {
        name: 'IgourdAntd',
        path: '/igourd-admin/antd',
        component: IFrameView,
        meta: {
          badgeType: 'dot',
          icon: SvgAntdvLogoIcon,
          link: IGOURD_ANT_PREVIEW_URL,
          title: $t('demos.igourd.antdv'),
        },
      },
    ],
  },
  {
    name: 'IgourdAbout',
    path: '/igourd-admin/about',
    component: () => import('#/views/_core/about/index.vue'),
    meta: {
      icon: 'lucide:copyright',
      title: $t('demos.igourd.about'),
      order: 9999,
    },
  },
];

export default routes;
