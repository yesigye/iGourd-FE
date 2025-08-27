# 权限Store适配指南

## 概述

本文档说明了如何将原有的权限管理store适配到新的API规范。原有的权限store使用`passportOwnerSelection`接口获取菜单权限，现在需要更新为使用新的`selectOwnerApi`接口。

## 主要变化

### 1. API接口更新

**原接口：**
```typescript
import { passportOwnerSelection } from '@/apis/base.api';
```

**新接口：**
```typescript
import { selectOwnerApi } from '@/api/core/auth';
```

### 2. 数据结构适配

新的API响应结构与原有结构保持一致，主要包含：
- `jwt_token` - JWT令牌信息
- `user_model` - 用户模型信息
- `current_login_user_app` - 当前登录用户应用信息
- `function_trees` - 功能权限树
- `menu_trees` - 菜单树（向后兼容）

### 3. 权限管理流程

#### 原有流程
```typescript
// 1. 调用passportOwnerSelection获取权限
passportOwnerSelection({ owner_id, owner_type })
  .then(([res, error]) => {
    // 2. 处理响应数据
    userStore.setTokenId(res.jwt_token.token_id);
    userStore.setUserModel(res.user_model);
    
    // 3. 转换路由
    const asyncRoutes = transformRoutes(res.function_trees || []);
  });
```

#### 新流程
```typescript
// 1. 调用selectOwnerApi获取权限
selectOwnerApi({ owner_id, owner_type })
  .then((res) => {
    // 2. 处理响应数据
    userStore.setTokenId(res.jwt_token.token_id);
    userStore.setUserModel(res.user_model);
    
    // 3. 转换路由
    const asyncRoutes = transformRoutes(res.function_trees || []);
  });
```

## 适配步骤

### 1. 更新API导入

```typescript
// 旧代码
import { passportOwnerSelection } from '@/apis/base.api';

// 新代码
import { selectOwnerApi } from '@/api/core/auth';
```

### 2. 更新API调用

```typescript
// 旧代码
passportOwnerSelection({ owner_id, owner_type })
  .then(([res, error]: any) => {
    if (error) return reject(error);
    // ... 处理逻辑
  });

// 新代码
selectOwnerApi({ owner_id, owner_type })
  .then((res: any) => {
    if (!res || !res.jwt_token) {
      return reject(new Error('Invalid response from owner selection API'));
    }
    // ... 处理逻辑
  });
```

### 3. 响应数据结构处理

新的API响应结构更加统一，不需要处理`[res, error]`的数组格式：

```typescript
// 旧代码
const [res, error] = await passportOwnerSelection({ owner_id, owner_type });
if (error) {
  // 处理错误
}

// 新代码
try {
  const res = await selectOwnerApi({ owner_id, owner_type });
  // 直接使用res
} catch (error) {
  // 处理错误
}
```

## 完整的权限Store示例

```typescript
import type { RouteRecordRaw } from 'vue-router';
import { constantRouters } from '@/router';
import { store, useUserStore, useTagsViewStore } from '@/store';
import router from '@/router';
import { Local } from '@/utils';

import { selectOwnerApi } from '@/api/core/auth';
import { computed, ref } from 'vue';
import { defineStore } from 'pinia';

export const usePermissionStore = defineStore('permission', () => {
  const dynamicRoutes = ref<AnyObject[]>([]);
  const routes = ref<RouteRecordRaw[]>([]);
  const permActionsList = ref<any[]>([]);
  const mixLeftMenus = ref<RouteRecordRaw[]>([]);
  const isRoutesLoaded = ref(false);

  const permCodeList = computed(() => 
    permActionsList.value.map(item => item.action_key)
  );

  /**
   * 生成动态路由
   * 使用新的selectOwnerApi接口
   */
  function generateRoutes() {
    return new Promise<RouteRecordRaw[]>((resolve, reject) => {
      const userStore = useUserStore();
      const { owner_id, owner_type } = userStore.merchantInfo;
      
      selectOwnerApi({ owner_id, owner_type })
        .then((res: any) => {
          if (!res || !res.jwt_token) {
            return reject(new Error('Invalid response from owner selection API'));
          }

          // 设置用户信息
          userStore.setTokenId(res.jwt_token.token_id);
          userStore.setUserModel(res.user_model);
          userStore.setCurrentLoginUserApp(res.current_login_user_app);

          // 保存到本地存储
          Local.set('userinfo', { ...res });
          Local.set('menulist', res.menu_trees || []);
          Local.set('functionTrees', res?.function_trees);

          // 转换功能权限树为路由
          const asyncRoutes = transformRoutes(res.function_trees || []);
          resolve(asyncRoutes);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  // 其他方法保持不变...
  
  return {
    dynamicRoutes,
    routes,
    permCodeList,
    generateRoutes,
    getCreateRoutes,
    refreshRoute,
    mixLeftMenus,
    setMixLeftMenus,
    isRoutesLoaded,
    resetRouter
  };
});
```

## 路由转换逻辑

`transformRoutes`函数保持不变，因为它处理的是`function_trees`数据结构，这个结构在新的API中保持一致：

```typescript
const transformRoutes = (functionTrees: AnyObject[]) => {
  const asyncRoutes: RouteRecordRaw[] = [];
  
  functionTrees.forEach((tree: any) => {
    if (!tree.function || !tree.function.menu) {
      return;
    }

    const menuItem = tree.function.menu;
    // ... 路由转换逻辑
  });

  return asyncRoutes;
};
```

## 权限验证

权限验证逻辑保持不变，仍然基于`function_trees`和`actions`：

```typescript
// 检查功能权限
function hasFunctionPermission(functionKey: string): boolean {
  return functionTrees.some(tree => 
    tree.function?.function_key === functionKey
  );
}

// 检查操作权限
function hasActionPermission(actionKey: string): boolean {
  return permActionsList.value.some(action => 
    action.action_key === actionKey
  );
}
```

## 迁移检查清单

- [ ] 更新API导入语句
- [ ] 修改API调用方法
- [ ] 更新错误处理逻辑
- [ ] 测试权限获取功能
- [ ] 验证路由生成功能
- [ ] 检查权限验证逻辑
- [ ] 更新相关文档

## 注意事项

1. **向后兼容**：新的API响应结构与原有结构保持一致
2. **错误处理**：新的API使用标准的Promise错误处理
3. **数据一致性**：`function_trees`数据结构保持不变
4. **性能优化**：减少了额外的错误处理逻辑

## 总结

权限Store的适配相对简单，主要是API接口的更新。由于新的API响应结构与原有结构保持一致，大部分业务逻辑代码都不需要修改。只需要：

1. 更新API导入
2. 修改API调用方法
3. 调整错误处理逻辑

这样可以确保权限管理功能在新API规范下正常工作，同时保持代码的清晰性和可维护性。
