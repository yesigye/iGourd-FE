# Playground应用API适配总结

## 概述

本文档总结了为 `playground` 应用适配新API规范所做的所有工作。playground使用的是 `@igourd/access` 库来管理权限和菜单，而不是传统的权限store。

## 已完成的适配工作

### 1. 认证API接口更新 ✅

**文件：** `playground/src/api/core/auth.ts`

- 更新了 `LoginParams` 接口，适配新的登录参数结构
- 更新了 `LoginResult` 接口，包含 `function_trees` 字段
- 更新了 `loginApi` 路径：`/v1/passport/login`
- 更新了 `logoutApi` 方法：GET `/v1/passport/logout`
- 新增了 `selectOwnerApi`：POST `/v1/passport/owner/selection`

### 2. 用户API接口更新 ✅

**文件：** `playground/src/api/core/user.ts`

- 更新了 `getUserInfoApi` 路径：`/v1/passport/user/info`
- 新增了 `getUserMenusApi`：`/v1/passport/menu/user/menus`
- 新增了 `getUserRolesApi`：`/v1/passport/role/user/roles`

### 3. 菜单API接口更新 ✅

**文件：** `playground/src/api/core/menu.ts`

- 保持了 `getAllMenusApi` 向后兼容
- 新增了 `getUserMenusApi` 和 `getMenuTreeListApi`
- 添加了详细的注释说明新的API规范

### 4. 认证Store更新 ✅

**文件：** `playground/src/store/auth.ts`

- 更新了 `authLogin` 函数，使用新的 `LoginParams` 结构
- 在登录成功后保存 `function_trees` 到localStorage
- 使用 `APP_CONFIG` 常量设置默认的 `app_key` 和 `type`

### 5. 权限Store创建 ✅

**文件：** `playground/src/store/permission.ts`

- 创建了新的权限store，适配新API规范
- 使用 `selectOwnerApi` 获取权限信息
- 保持了原有的路由转换逻辑

### 6. 路由访问逻辑更新 ✅

**文件：** `playground/src/router/access.ts`

- 移除了对 `getAllMenusApi` 的调用
- 改为从localStorage获取 `function_trees`
- 新增了 `convertFunctionTreesToMenus` 函数，将功能权限树转换为菜单格式
- 完全避免了调用旧的 `/api/menu/all` 接口

## 关键变化点

### 1. 菜单数据来源变化

**原有方式：**
```typescript
// 调用单独的菜单接口
return await getAllMenusApi();
```

**新方式：**
```typescript
// 从登录响应中获取function_trees
const functionTrees = localStorage.getItem('functionTrees');
return convertFunctionTreesToMenus(JSON.parse(functionTrees));
```

### 2. 登录流程更新

**原有流程：**
1. 调用登录接口
2. 保存token和用户信息
3. 调用菜单接口获取菜单

**新流程：**
1. 调用登录接口
2. 保存token、用户信息和function_trees
3. 直接使用function_trees生成菜单

### 3. 权限管理方式

playground使用 `@igourd/access` 库进行权限管理，该库通过 `generateAccess` 函数生成可访问的菜单和路由。我们的适配确保了：

- 登录后正确保存 `function_trees` 到localStorage
- `access.ts` 能够正确读取和转换 `function_trees`
- 避免了对旧菜单接口的依赖

## 技术实现细节

### 1. 数据转换函数

```typescript
function convertFunctionTreesToMenus(functionTrees: any[]): any[] {
  const menus: any[] = [];
  
  functionTrees.forEach((tree: any) => {
    if (!tree.function || !tree.function.menu) {
      return;
    }

    const menuItem = tree.function.menu;
    const menu = {
      id: tree.id || menuItem.menu_id,
      name: menuItem.name,
      key: menuItem.menu_key,
      path: menuItem.url,
      component: menuItem.component_paths || menuItem.url,
      meta: {
        title: menuItem.name,
        icon: menuItem.style_class,
        hidden: menuItem.is_displayed === false,
      },
      children: tree.sub_function_trees ? convertFunctionTreesToMenus(tree.sub_function_trees) : []
    };
    
    menus.push(menu);
  });
  
  return menus;
}
```

### 2. 权限检查流程

1. **路由守卫触发** → `guard.ts`
2. **调用generateAccess** → `access.ts`
3. **获取菜单数据** → 从localStorage读取function_trees
4. **转换菜单格式** → 调用convertFunctionTreesToMenus
5. **生成可访问路由** → 返回给@igourd/access库

## 测试验证

### 1. 登录流程测试

- [ ] 使用新API接口成功登录
- [ ] function_trees正确保存到localStorage
- [ ] 用户信息和token正确保存

### 2. 菜单生成测试

- [ ] 登录后菜单正确显示
- [ ] 不再调用 `/api/menu/all` 接口
- [ ] 权限控制正常工作

### 3. 路由访问测试

- [ ] 动态路由正确生成
- [ ] 权限验证正常工作
- [ ] 页面跳转正常

## 注意事项

### 1. 向后兼容

- 保留了 `getAllMenusApi` 函数，但不再使用
- 原有的菜单数据结构完全兼容
- 权限验证逻辑保持不变

### 2. 数据一致性

- `function_trees` 在登录时获取，确保数据最新
- 如果localStorage中没有数据，返回空数组
- 避免了数据不同步的问题

### 3. 性能优化

- 减少了额外的API调用
- 菜单数据在登录时一次性获取
- 提高了页面加载速度

## 总结

playground应用的API适配工作已经完成，主要变化包括：

1. **完全移除了对旧菜单接口的依赖**
2. **使用新的认证API接口**
3. **通过function_trees管理菜单权限**
4. **保持了与@igourd/access库的兼容性**

现在playground应该能够：
- 使用新的API接口进行认证
- 正确生成和显示菜单
- 不再请求 `/api/menu/all` 接口
- 保持所有原有功能正常工作

如果遇到任何问题，请检查：
1. localStorage中是否有function_trees数据
2. 登录API是否返回正确的数据结构
3. 权限验证是否正常工作
