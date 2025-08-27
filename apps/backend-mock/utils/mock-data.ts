export interface UserInfo {
  id: number;
  password: string;
  realName: string;
  roles: string[];
  username: string;
  homePath?: string;
  email?: string;
  phoneNumber?: string;
  status: string;
}

// 新增：功能权限树结构
export interface FunctionTree {
  id: number;
  name: string;
  key: string;
  children?: FunctionTree[];
}

// 新增：用户应用关系
export interface UserApp {
  id: number;
  owner_id: number;
  owner_type: string;
  app_key: string;
}

// 新增：JWT Token结构
export interface JwtToken {
  jwt_token: string;
  token_id: string;
  token_type: string;
  expires_in: number;
}

// 新增：登录响应结构
export interface LoginResponse {
  jwt_token: JwtToken;
  user_model: {
    id: number;
    real_name: string;
    login_id: string;
    email?: string;
    phone_number?: string;
    status: string;
  };
  function_trees: FunctionTree[];
  user_apps: UserApp[];
  current_login_user_app: UserApp;
}

export const MOCK_USERS: UserInfo[] = [
  {
    id: 0,
    password: '123456',
    realName: 'Igourd',
    roles: ['super'],
    username: 'igourd',
    email: 'igourd@example.com',
    phoneNumber: '13800138000',
    status: 'ACTIVE',
  },
  {
    id: 1,
    password: '123456',
    realName: 'Admin',
    roles: ['admin'],
    username: 'admin',
    homePath: '/workspace',
    email: 'admin@example.com',
    phoneNumber: '13800138001',
    status: 'ACTIVE',
  },
  {
    id: 2,
    password: '123456',
    realName: 'Jack',
    roles: ['user'],
    username: 'jack',
    homePath: '/analytics',
    email: 'jack@example.com',
    phoneNumber: '13800138002',
    status: 'ACTIVE',
  },
];

// 新增：功能权限树数据
export const MOCK_FUNCTION_TREES: Record<string, FunctionTree[]> = {
  igourd: [
    {
      id: 1,
      name: 'Dashboard',
      key: 'dashboard',
      children: [
        {
          id: 11,
          name: 'Analytics',
          key: 'dashboard:analytics',
        },
        {
          id: 12,
          name: 'Workspace',
          key: 'dashboard:workspace',
        },
      ],
    },
    {
      id: 2,
      name: 'System',
      key: 'system',
      children: [
        {
          id: 21,
          name: 'Menu',
          key: 'system:menu',
        },
        {
          id: 22,
          name: 'Dept',
          key: 'system:dept',
        },
      ],
    },
  ],
  admin: [
    {
      id: 1,
      name: 'Dashboard',
      key: 'dashboard',
      children: [
        {
          id: 11,
          name: 'Analytics',
          key: 'dashboard:analytics',
        },
        {
          id: 12,
          name: 'Workspace',
          key: 'dashboard:workspace',
        },
      ],
    },
    {
      id: 2,
      name: 'System',
      key: 'system',
      children: [
        {
          id: 21,
          name: 'Menu',
          key: 'system:menu',
        },
      ],
    },
  ],
  jack: [
    {
      id: 1,
      name: 'Dashboard',
      key: 'dashboard',
      children: [
        {
          id: 11,
          name: 'Analytics',
          key: 'dashboard:analytics',
        },
      ],
    },
  ],
};

// 新增：用户应用关系数据
export const MOCK_USER_APPS: Record<string, UserApp[]> = {
  igourd: [
    {
      id: 1,
      owner_id: 1001,
      owner_type: 'BOSS',
      app_key: 'BOSS_MANAGE_WEB_PC',
    },
    {
      id: 2,
      owner_id: 1002,
      owner_type: 'MERCHANT',
      app_key: 'MERCHANT_MANAGE_WEB_PC',
    },
  ],
  admin: [
    {
      id: 3,
      owner_id: 1002,
      owner_type: 'MERCHANT',
      app_key: 'MERCHANT_MANAGE_WEB_PC',
    },
  ],
  jack: [
    {
      id: 4,
      owner_id: 1002,
      owner_type: 'MERCHANT',
      app_key: 'MERCHANT_MANAGE_WEB_PC',
    },
  ],
};

export const MOCK_CODES = [
  // super
  {
    codes: ['AC_100100', 'AC_100110', 'AC_100120', 'AC_100010'],
    username: 'igourd',
  },
  {
    // admin
    codes: ['AC_100010', 'AC_100020', 'AC_100030'],
    username: 'admin',
  },
  {
    // user
    codes: ['AC_1000001', 'AC_1000002'],
    username: 'jack',
  },
];

const dashboardMenus = [
  {
    meta: {
      order: -1,
      title: 'page.dashboard.title',
    },
    name: 'Dashboard',
    path: '/dashboard',
    redirect: '/analytics',
    children: [
      {
        name: 'Analytics',
        path: '/analytics',
        component: '/dashboard/analytics/index',
        meta: {
          affixTab: true,
          title: 'page.dashboard.analytics',
        },
      },
      {
        name: 'Workspace',
        path: '/workspace',
        component: '/dashboard/workspace/index',
        meta: {
          title: 'page.dashboard.workspace',
        },
      },
    ],
  },
];

const createDemosMenus = (role: 'admin' | 'super' | 'user') => {
  const roleWithMenus = {
    admin: {
      component: '/demos/access/admin-visible',
      meta: {
        icon: 'mdi:button-cursor',
        title: 'demos.access.adminVisible',
      },
      name: 'AccessAdminVisibleDemo',
      path: '/demos/access/admin-visible',
    },
    super: {
      component: '/demos/access/super-visible',
      meta: {
        icon: 'mdi:button-cursor',
        title: 'demos.access.superVisible',
      },
      name: 'AccessSuperVisibleDemo',
      path: '/demos/access/super-visible',
    },
    user: {
      component: '/demos/access/user-visible',
      meta: {
        icon: 'mdi:button-cursor',
        title: 'demos.access.userVisible',
      },
      name: 'AccessUserVisibleDemo',
      path: '/demos/access/user-visible',
    },
  };

  return [
    {
      meta: {
        icon: 'ic:baseline-view-in-ar',
        keepAlive: true,
        order: 1000,
        title: 'demos.title',
      },
      name: 'Demos',
      path: '/demos',
      redirect: '/demos/access',
      children: [
        {
          name: 'AccessDemos',
          path: '/demosaccess',
          meta: {
            icon: 'mdi:cloud-key-outline',
            title: 'demos.access.backendPermissions',
          },
          redirect: '/demos/access/page-control',
          children: [
            {
              name: 'AccessPageControlDemo',
              path: '/demos/access/page-control',
              component: '/demos/access/index',
              meta: {
                icon: 'mdi:page-previous-outline',
                title: 'demos.access.pageAccess',
              },
            },
            {
              name: 'AccessButtonControlDemo',
              path: '/demos/access/button-control',
              component: '/demos/access/button-control',
              meta: {
                icon: 'mdi:button-cursor',
                title: 'demos.access.buttonControl',
              },
            },
            {
              name: 'AccessMenuVisible403Demo',
              path: '/demos/access/menu-visible-403',
              component: '/demos/access/menu-visible-403',
              meta: {
                authority: ['no-body'],
                icon: 'mdi:button-cursor',
                menuVisibleWithForbidden: true,
                title: 'demos.access.menuVisible403',
              },
            },
            roleWithMenus[role],
          ],
        },
      ],
    },
  ];
};

export const MOCK_MENUS = [
  {
    menus: [...dashboardMenus, ...createDemosMenus('super')],
    username: 'igourd',
  },
  {
    menus: [...dashboardMenus, ...createDemosMenus('admin')],
    username: 'admin',
  },
  {
    menus: [...dashboardMenus, ...createDemosMenus('user')],
    username: 'jack',
  },
];

export const MOCK_MENU_LIST = [
  {
    id: 1,
    name: 'Workspace',
    status: 1,
    type: 'menu',
    icon: 'mdi:dashboard',
    path: '/workspace',
    component: '/dashboard/workspace/index',
    meta: {
      icon: 'carbon:workspace',
      title: 'page.dashboard.workspace',
      affixTab: true,
      order: 0,
    },
  },
  {
    id: 2,
    meta: {
      icon: 'carbon:settings',
      order: 9997,
      title: 'system.title',
      badge: 'new',
      badgeType: 'normal',
      badgeVariants: 'primary',
    },
    status: 1,
    type: 'catalog',
    name: 'System',
    path: '/system',
    children: [
      {
        id: 201,
        pid: 2,
        path: '/system/menu',
        name: 'SystemMenu',
        authCode: 'System:Menu:List',
        status: 1,
        type: 'menu',
        meta: {
          icon: 'carbon:menu',
          title: 'system.menu.title',
        },
        component: '/system/menu/list',
        children: [
          {
            id: 20_101,
            pid: 201,
            name: 'SystemMenuCreate',
            status: 1,
            type: 'button',
            authCode: 'System:Menu:Create',
            meta: { title: 'common.create' },
          },
          {
            id: 20_102,
            pid: 201,
            name: 'SystemMenuEdit',
            status: 1,
            type: 'button',
            authCode: 'System:Menu:Edit',
            meta: { title: 'common.edit' },
          },
          {
            id: 20_103,
            pid: 201,
            name: 'SystemMenuDelete',
            status: 1,
            type: 'button',
            authCode: 'System:Menu:Delete',
            meta: { title: 'common.delete' },
          },
        ],
      },
      {
        id: 202,
        pid: 2,
        path: '/system/dept',
        name: 'SystemDept',
        status: 1,
        type: 'menu',
        authCode: 'System:Dept:List',
        meta: {
          icon: 'carbon:container-services',
          title: 'system.dept.title',
        },
        component: '/system/dept/list',
        children: [
          {
            id: 20_401,
            pid: 201,
            name: 'SystemDeptCreate',
            status: 1,
            type: 'button',
            authCode: 'System:Dept:Create',
            meta: { title: 'common.create' },
          },
          {
            id: 20_402,
            pid: 201,
            name: 'SystemDeptEdit',
            status: 1,
            type: 'button',
            authCode: 'System:Dept:Edit',
            meta: { title: 'common.edit' },
          },
          {
            id: 20_403,
            pid: 201,
            name: 'SystemDeptDelete',
            status: 1,
            type: 'button',
            authCode: 'System:Dept:Delete',
            meta: { title: 'common.delete' },
          },
        ],
      },
    ],
  },
  {
    id: 9,
    meta: {
      badgeType: 'dot',
      order: 9998,
      title: 'demos.igourd.title',
      icon: 'carbon:data-center',
    },
    name: 'Project',
    path: '/igourd-admin',
    type: 'catalog',
    status: 1,
    children: [
      {
        id: 901,
        pid: 9,
        name: 'IgourdDocument',
        path: '/igourd-admin/document',
        component: 'IFrameView',
        type: 'embedded',
        status: 1,
        meta: {
          icon: 'carbon:book',
          iframeSrc: 'https://doc.igourd.pro',
          title: 'demos.igourd.document',
        },
      },
      {
        id: 902,
        pid: 9,
        name: 'IgourdGithub',
        path: '/igourd-admin/github',
        component: 'IFrameView',
        type: 'link',
        status: 1,
        meta: {
          icon: 'carbon:logo-github',
          link: 'https://github.com/igourdjs/vue-igourd-admin',
          title: 'Github',
        },
      },
      {
        id: 903,
        pid: 9,
        name: 'IgourdAntdv',
        path: '/igourd-admin/antdv',
        component: 'IFrameView',
        type: 'link',
        status: 0,
        meta: {
          icon: 'carbon:hexagon-vertical-solid',
          badgeType: 'dot',
          link: 'https://ant.igourd.pro',
          title: 'demos.igourd.antdv',
        },
      },
    ],
  },
  {
    id: 10,
    component: '_core/about/index',
    type: 'menu',
    status: 1,
    meta: {
      icon: 'lucide:copyright',
      order: 9999,
      title: 'demos.igourd.about',
    },
    name: 'About',
    path: '/about',
  },
];

export function getMenuIds(menus: any[]) {
  const ids: number[] = [];
  menus.forEach((item) => {
    ids.push(item.id);
    if (item.children && item.children.length > 0) {
      ids.push(...getMenuIds(item.children));
    }
  });
  return ids;
}
