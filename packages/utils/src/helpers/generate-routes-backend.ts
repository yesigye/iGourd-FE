import type { RouteRecordRaw } from 'vue-router';

import type {
  ComponentRecordType,
  GenerateMenuAndRoutesOptions,
  RouteRecordStringComponent,
} from '@igourd-core/typings';

import { mapTree } from '@igourd-core/shared/utils';

/**
 * 动态生成路由 - 后端方式
 */
async function generateRoutesByBackend(
  options: GenerateMenuAndRoutesOptions,
): Promise<RouteRecordRaw[]> {
  const { fetchMenuListAsync, layoutMap = {}, pageMap = {} } = options;

  try {
    const menuRoutes = await fetchMenuListAsync?.();
    if (!menuRoutes) {
      return [];
    }
    const normalizePageMap: ComponentRecordType = {};
    for (const [key, value] of Object.entries(pageMap)) {
      normalizePageMap[normalizeViewPath(key)] = value;
    }
    const routeNodes = functionTreesToRouteNodes(menuRoutes);
    const routes = convertRoutes(routeNodes, layoutMap, normalizePageMap);
    return routes;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

function functionTreesToRouteNodes(
  functionTrees: Record<string, any>[],
): RouteRecordStringComponent[] {
  const nodes: RouteRecordStringComponent[] = [];

  functionTrees.forEach((tree) => {
    const fn = tree.function;
    if (!fn || !fn.menu) return;

    const menu = fn.menu;
    const menuUrl = menu.url || '';
    const routeName = menuUrl.split('/').filter(Boolean).join('_') || 'home';

    // 生成组件路径
    let componentPath = menu.component_paths;
    if (!componentPath) {
      // 根据 URL 生成 features 结构的组件路径
      if (menuUrl && menuUrl.startsWith('/')) {
        const pathParts = menuUrl.split('/').filter(Boolean);
        if (pathParts.length >= 2) {
          const module = pathParts[0];
          const page = pathParts[1];
          // 将 purchase/list 转换为 purchase-list 格式，并处理驼峰命名
          const pageName = page
            .replace(/\//g, '-')
            .replace(/([A-Z])/g, '-$1')
            .toLowerCase()
            .replace(/^-/, '');
          componentPath = `/features/${module}/pages/${pageName}/index.vue`;
        } else if (pathParts.length === 1) {
          // 对于单层路径，如果有子路由则不生成组件路径
          if (tree.sub_function_trees && tree.sub_function_trees.length > 0) {
            componentPath = undefined; // 不生成组件路径，作为容器路由
          } else {
            const module = pathParts[0];
            componentPath = `/features/${module}/pages/index/index.vue`;
          }
        } else {
          componentPath = `${menuUrl}/index.vue`;
        }
      } else {
        componentPath = `${menuUrl}/index.vue`;
      }
    }

    const node: any = {
      path: menuUrl,
      name: routeName,
      meta: {
        hideInMenu: menu.is_displayed === false,
        title: menu.menu_key,
        icon: menu.style_class,
        // 所有路由强制 KeepAlive
        keepAlive: true,
        sort: menu.sort_number,
        affixTab: routeName.toLowerCase() === 'home',
      },
    };

    // 只有当 componentPath 存在时才设置 component 属性
    if (componentPath) {
      node.component = componentPath;
    }

    if (tree.sub_function_trees && tree.sub_function_trees.length > 0) {
      node.children = functionTreesToRouteNodes(tree.sub_function_trees);
    } else if (!tree.sub_function_trees && menu.parent_id === '0') {
    }

    nodes.push(node);
  });
  return nodes;
}

function convertRoutes(
  routes: RouteRecordStringComponent[],
  layoutMap: ComponentRecordType,
  pageMap: ComponentRecordType,
): RouteRecordRaw[] {
  return mapTree(routes, (node) => {
    const route = node as unknown as RouteRecordRaw;
    const { component, name } = node;
    if (!name) {
      console.error('route name is required', route);
    }

    // layout转换
    if (component && layoutMap[component]) {
      route.component = layoutMap[component];
      // 页面组件转换
    } else if (component) {
      const normalizePath = normalizeViewPath(component);
      const pageKey = normalizePath.endsWith('.vue')
        ? normalizePath
        : `${normalizePath}.vue`;
      if (pageMap[pageKey]) {
        route.component = pageMap[pageKey];
      } else {
        console.error(`route component is invalid: ${pageKey}`, route);
        route.component = pageMap['/_core/fallback/not-found.vue'];
      }
    }

    return route;
  });
}

function normalizeViewPath(path: string): string {
  // 去除相对路径前缀
  const normalizedPath = path.replace(/^(\.\/|\.\.\/)+/, '');

  // 确保路径以 '/' 开头
  const viewPath = normalizedPath.startsWith('/')
    ? normalizedPath
    : `/${normalizedPath}`;

  // 这里耦合了igourd-admin的目录结构
  // 支持 /views 和 /features/{module}/pages 两种路径形式
  if (viewPath.startsWith('/views')) {
    return viewPath.replace(/^\/views/, '');
  }

  // 对于 features 结构，直接返回相对路径格式以匹配 pageMap
  if (viewPath.startsWith('/features/')) {
    return viewPath.replace(/^\//, '../');
  }

  return viewPath;
}
export { generateRoutesByBackend };
