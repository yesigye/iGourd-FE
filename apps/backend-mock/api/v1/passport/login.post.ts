import { defineEventHandler, readBody, setResponseStatus } from 'h3';
import {
  generateNewJwtToken,
  generateUserApps,
  generateCurrentLoginUserApp,
} from '~/utils/jwt-utils';
import {
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
} from '~/utils/cookie-utils';
import { MOCK_USERS } from '~/utils/mock-data';
import {
  forbiddenResponse,
  useResponseError,
  useResponseSuccess
} from '~/utils/response';

export default defineEventHandler(async (event) => {
  const { password, login_account, app_key, type } = await readBody(event);

  // 验证必填参数
  if (!password || !login_account || !app_key || !type) {
    setResponseStatus(event, 400);
    return useResponseError(
      'BadRequestException',
      'login_account, password, app_key and type are required',
    );
  }

  // 查找用户
  const findUser = MOCK_USERS.find(
    (item) => item.username === login_account && item.password === password,
  );

  if (!findUser) {
    clearRefreshTokenCookie(event);
    return forbiddenResponse(event, 'Username or password is incorrect.');
  }

  // 生成新的JWT Token结构
  const jwtToken = generateNewJwtToken(findUser);
  const refreshToken = generateRefreshToken(findUser);

  // 生成功能权限树 - 为playground提供完整的菜单结构
  const functionTrees = generatePlaygroundFunctionTrees();

  // 生成用户应用关系
  const userApps = generateUserApps(findUser.username);

  // 生成当前登录应用
  const currentLoginUserApp = generateCurrentLoginUserApp(findUser.username);

  // 设置refresh token到cookie
  setRefreshTokenCookie(event, refreshToken);

  // 返回新的登录响应结构
  return useResponseSuccess({
    jwt_token: jwtToken,
    user_model: {
      id: findUser.id,
      real_name: findUser.realName,
      login_id: findUser.username,
      email: findUser.email,
      phone_number: findUser.phoneNumber,
      status: findUser.status,
    },
    function_trees: functionTrees,
    user_apps: userApps,
    current_login_user_app: currentLoginUserApp,
  });
});

/**
 * 为playground生成完整的功能权限树
 * 包含正确的Vue文件路径和菜单结构
 */
function generatePlaygroundFunctionTrees() {
  return [
    {
      id: 1,
      name: '仪表板',
      key: 'dashboard',
      function: {
        function_key: 'dashboard',
        actions: [
          { action_key: 'dashboard:view', action_name: '查看仪表板' }
        ],
        menu: {
          menu_id: '1',
          menu_key: 'dashboard',
          name: '仪表板',
          url: '/dashboard',
          component_paths: '/dashboard',
          style_class: 'dashboard',
          is_displayed: true,
          parent_id: '0',
          redirect: '/dashboard/analytics'
        }
      },
      sub_function_trees: [
        {
          id: 11,
          name: '分析页面',
          key: 'dashboard.analytics',
          function: {
            function_key: 'dashboard.analytics',
            actions: [
              { action_key: 'dashboard.analytics:view', action_name: '查看分析页面' }
            ],
            menu: {
              menu_id: '11',
              menu_key: 'dashboard.analytics',
              name: '分析页面',
              url: '/dashboard/analytics',
              component_paths: '/dashboard/analytics',
              style_class: 'chart',
              is_displayed: true,
              parent_id: '1'
            }
          },
          sub_function_trees: null
        },
        {
          id: 12,
          name: '工作台',
          key: 'dashboard.workspace',
          function: {
            function_key: 'dashboard.workspace',
            actions: [
              { action_key: 'dashboard.workspace:view', action_name: '查看工作台' }
            ],
            menu: {
              menu_id: '12',
              menu_key: 'dashboard.workspace',
              name: '工作台',
              url: '/dashboard/workspace',
              component_paths: '/dashboard/workspace',
              style_class: 'desktop',
              is_displayed: true,
              parent_id: '1'
            }
          },
          sub_function_trees: null
        }
      ]
    },
    {
      id: 2,
      name: '系统管理',
      key: 'system',
      function: {
        function_key: 'system',
        actions: [
          { action_key: 'system:view', action_name: '查看系统管理' }
        ],
        menu: {
          menu_id: '2',
          menu_key: 'system',
          name: '系统管理',
          url: '/system',
          component_paths: '/system',
          style_class: 'setting',
          is_displayed: true,
          parent_id: '0'
        }
      },
      sub_function_trees: [
        {
          id: 21,
          name: '角色管理',
          key: 'system.role',
          function: {
            function_key: 'system.role',
            actions: [
              { action_key: 'system.role:view', action_name: '查看角色' },
              { action_key: 'system.role:create', action_name: '创建角色' },
              { action_key: 'system.role:edit', action_name: '编辑角色' },
              { action_key: 'system.role:delete', action_name: '删除角色' }
            ],
            menu: {
              menu_id: '21',
              menu_key: 'system.role',
              name: '角色管理',
              url: '/system/role',
              component_paths: '/system/role',
              style_class: 'user',
              is_displayed: true,
              parent_id: '2'
            }
          },
          sub_function_trees: null
        },
        {
          id: 22,
          name: '菜单管理',
          key: 'system.menu',
          function: {
            function_key: 'system.menu',
            actions: [
              { action_key: 'system.menu:view', action_name: '查看菜单' },
              { action_key: 'system.menu:create', action_name: '创建菜单' },
              { action_key: 'system.menu:edit', action_name: '编辑菜单' },
              { action_key: 'system.menu:delete', action_name: '删除菜单' }
            ],
            menu: {
              menu_id: '22',
              menu_key: 'system.menu',
              name: '菜单管理',
              url: '/system/menu',
              component_paths: '/system/menu',
              style_class: 'menu',
              is_displayed: true,
              parent_id: '2'
            }
          },
          sub_function_trees: null
        },
        {
          id: 23,
          name: '部门管理',
          key: 'system.dept',
          function: {
            function_key: 'system.dept',
            actions: [
              { action_key: 'system.dept:view', action_name: '查看部门' },
              { action_key: 'system.dept:create', action_name: '创建部门' },
              { action_key: 'system.dept:edit', action_name: '编辑部门' },
              { action_key: 'system.dept:delete', action_name: '删除部门' }
            ],
            menu: {
              menu_id: '23',
              menu_key: 'system.dept',
              name: '部门管理',
              url: '/system/dept',
              component_paths: '/system/dept',
              style_class: 'apartment',
              is_displayed: true,
              parent_id: '2'
            }
          },
          sub_function_trees: null
        }
      ]
    },
    {
      id: 3,
      name: '示例页面',
      key: 'examples',
      function: {
        function_key: 'examples',
        actions: [
          { action_key: 'examples:view', action_name: '查看示例页面' }
        ],
        menu: {
          menu_id: '3',
          menu_key: 'examples',
          name: '示例页面',
          url: '/examples',
          component_paths: '/examples',
          style_class: 'file-text',
          is_displayed: true,
          parent_id: '0'
        }
      },
      sub_function_trees: null
    },
    {
      id: 4,
      name: '演示页面',
      key: 'demos',
      function: {
        function_key: 'demos',
        actions: [
          { action_key: 'demos:view', action_name: '查看演示页面' }
        ],
        menu: {
          menu_id: '4',
          menu_key: 'demos',
          name: '演示页面',
          url: '/demos',
          component_paths: '/examples',
          style_class: 'play-circle',
          is_displayed: true,
          parent_id: '0'
        }
      },
      sub_function_trees: null
    }
  ];
}
