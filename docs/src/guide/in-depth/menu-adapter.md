# 菜单系统适配指南

## 概述

本文档说明了如何将项目的菜单系统适配到新的API规范。在新的认证系统中，菜单信息通过登录响应的 `function_trees` 字段返回，而不是单独的菜单接口。

## 主要变化

### 1. 菜单数据来源变化

**原方式：**
```typescript
// 登录后单独调用菜单接口
const menus = await getAllMenusApi();
```

**新方式：**
```typescript
// 登录响应直接包含菜单信息
const loginResult = await loginApi(loginParams);
const functionTrees = loginResult.function_trees; // 直接获取菜单权限树
```

### 2. 接口路径更新

| 原接口 | 新接口 | 说明 |
|--------|--------|------|
| `/menu/all` | 保持兼容 | 向后兼容，但建议使用function_trees |
| - | `/v1/passport/menu/user/menus` | 获取用户菜单权限 |
| - | `/v1/passport/menu/tree-list` | 获取菜单树列表 |

### 3. 数据结构变化

**原菜单结构：**
```typescript
interface MenuItem {
  name: string;
  path: string;
  component: string;
  meta: {
    title: string;
    icon: string;
  };
  children?: MenuItem[];
}
```

**新功能权限树结构：**
```typescript
interface FunctionTree {
  id: number;
  name: string;
  key: string;
  children?: FunctionTree[];
}
```

## 适配步骤

### 1. 更新API接口

所有应用都已更新了menu接口，新增了以下方法：

```typescript
// 获取用户菜单权限树
export async function getUserMenusApi() {
  return requestClient.get('/v1/passport/menu/user/menus');
}

// 获取菜单树列表
export async function getMenuTreeListApi(data: MenuQueryParams) {
  return requestClient.post('/v1/passport/menu/tree-list', data);
}
```

### 2. 更新认证逻辑

在登录成功后，直接使用返回的 `function_trees`：

```typescript
const loginResult = await loginApi(loginParams);

if (loginResult.jwt_token?.jwt_token) {
  // 获取菜单权限树
  const functionTrees = loginResult.function_trees;
  
  // 处理菜单数据
  processMenuData(functionTrees);
}
```

### 3. 菜单数据处理

将 `function_trees` 转换为路由格式：

```typescript
function convertFunctionTreesToRoutes(functionTrees: FunctionTree[]) {
  return functionTrees.map(tree => ({
    name: tree.name,
    path: `/${tree.key}`,
    component: 'Layout',
    meta: {
      title: tree.name,
      icon: getIconByKey(tree.key),
    },
    children: tree.children ? convertFunctionTreesToRoutes(tree.children) : [],
  }));
}
```

## 使用示例

### 基本登录流程

```typescript
import { loginApi } from '#/api/core/auth';
import { APP_CONFIG } from '@igourd/constants';

const loginParams = {
  app_key: APP_CONFIG.DEFAULT_APP.app_key,
  login_account: 'admin',
  password: '123456',
  type: APP_CONFIG.DEFAULT_APP.type,
};

try {
  const loginResult = await loginApi(loginParams);
  
  if (loginResult.jwt_token?.jwt_token) {
    // 保存token
    const accessToken = loginResult.jwt_token.jwt_token;
    accessStore.setAccessToken(accessToken);
    
    // 保存用户信息
    userStore.setUserInfo(loginResult.user_model);
    
    // 处理菜单权限树
    const functionTrees = loginResult.function_trees;
    const routes = convertFunctionTreesToRoutes(functionTrees);
    
    // 设置路由
    router.addRoute(routes);
    
    // 跳转到首页
    router.push('/dashboard');
  }
} catch (error) {
  console.error('登录失败:', error);
}
```

### 菜单权限控制

```typescript
// 检查用户是否有某个菜单的权限
function hasMenuPermission(menuKey: string, functionTrees: FunctionTree[]): boolean {
  function checkPermission(trees: FunctionTree[]): boolean {
    for (const tree of trees) {
      if (tree.key === menuKey) {
        return true;
      }
      if (tree.children && checkPermission(tree.children)) {
        return true;
      }
    }
    return false;
  }
  
  return checkPermission(functionTrees);
}

// 使用示例
const canAccessDashboard = hasMenuPermission('dashboard', functionTrees);
if (canAccessDashboard) {
  // 显示仪表板菜单
}
```

## 向后兼容

为了保持向后兼容，原有的菜单接口仍然可用：

```typescript
// 仍然可以调用原有的菜单接口
const oldMenus = await getAllMenusApi();

// 但建议使用新的function_trees
const newMenus = loginResult.function_trees;
```

## 注意事项

1. **数据一致性**：`function_trees` 中的数据与用户权限保持一致
2. **实时性**：菜单权限在登录时获取，如需更新需要重新登录
3. **缓存策略**：可以将 `function_trees` 缓存到本地存储
4. **权限验证**：前端菜单显示应该基于 `function_trees` 进行权限控制

## 迁移检查清单

- [ ] 更新所有应用的menu接口
- [ ] 修改认证逻辑，使用function_trees
- [ ] 更新菜单数据处理逻辑
- [ ] 测试新的菜单系统
- [ ] 验证权限控制功能
- [ ] 更新相关文档

## 总结

新的菜单系统提供了更统一的权限管理方式，通过登录响应直接获取菜单信息，减少了额外的API调用，提高了系统性能。同时保持了向后兼容性，可以渐进式迁移。
