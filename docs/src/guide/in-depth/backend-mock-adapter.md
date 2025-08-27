# Backend Mock 服务适配指南

## 概述

本文档说明了 `backend-mock` 服务如何适配新的认证和授权接口规范。

## 已完成的适配工作

### 1. 数据结构更新

#### 用户信息结构
- 新增了 `email`、`phoneNumber`、`status` 字段
- 支持多种用户状态和联系方式

#### 功能权限树
- 新增 `FunctionTree` 接口，支持树形权限结构
- 每个用户都有独立的功能权限配置

#### 用户应用关系
- 新增 `UserApp` 接口，支持多应用切换
- 支持不同的平台身份类型（BOSS、MERCHANT、CUSTOMER、PARTNER）

#### JWT Token结构
- 新增 `JwtToken` 接口，包含完整的token信息
- 支持 `token_id`、`token_type`、`expires_in` 等字段

### 2. 接口路径更新

| 原接口 | 新接口 | 方法 | 说明 |
|--------|--------|------|------|
| `/auth/login` | `/auth/login` | POST | 保持兼容，但数据结构已更新 |
| `/auth/logout` | `/auth/logout` | GET | 从POST改为GET方法 |
| `/user/info` | `/passport/user/info` | GET | 新的用户信息接口 |
| - | `/passport/owner/selection` | POST | 新增：Owner切换接口 |
| - | `/passport/menu/user/menus` | GET | 新增：用户菜单接口 |
| - | `/passport/role/user/roles` | GET | 新增：用户角色接口 |

### 3. 新增的Mock数据

#### 功能权限树数据
```typescript
export const MOCK_FUNCTION_TREES: Record<string, FunctionTree[]> = {
  igourd: [
    {
      id: 1,
      name: 'Dashboard',
      key: 'dashboard',
      children: [
        { id: 11, name: 'Analytics', key: 'dashboard:analytics' },
        { id: 12, name: 'Workspace', key: 'dashboard:workspace' },
      ],
    },
    // ... 更多权限
  ],
  // ... 其他用户
};
```

#### 用户应用关系数据
```typescript
export const MOCK_USER_APPS: Record<string, UserApp[]> = {
  igourd: [
    {
      id: 1,
      owner_id: 1001,
      owner_type: 'BOSS',
      app_key: 'BOSS_MANAGE_WEB_PC',
    },
    // ... 更多应用
  ],
  // ... 其他用户
};
```

### 4. 工具函数更新

#### JWT工具函数
- `generateNewJwtToken()`: 生成新的JWT Token结构
- `generateFunctionTrees()`: 生成功能权限树
- `generateUserApps()`: 生成用户应用关系
- `generateCurrentLoginUserApp()`: 生成当前登录应用

#### 新增依赖
- `uuid`: 用于生成唯一的 `token_id`

### 5. 接口实现

#### 登录接口 (`/api/auth/login`)
- 支持新的请求参数：`app_key`、`login_account`、`type`
- 返回完整的登录响应结构，包括JWT token、用户信息、权限树等

#### 登出接口 (`/api/auth/logout`)
- 改为GET方法
- 清除refresh token cookie

#### 用户信息接口 (`/api/passport/user/info`)
- 验证Authorization token
- 返回完整的用户信息

#### Owner切换接口 (`/api/passport/owner/selection`)
- 支持用户在不同平台身份间切换
- 返回切换后的完整登录信息

#### 权限码接口 (`/api/auth/codes`)
- 返回当前用户的权限码数组

#### 菜单接口 (`/api/passport/menu/user/menus`)
- 返回当前用户的菜单权限

#### 角色接口 (`/api/passport/role/user/roles`)
- 返回当前用户的角色数组

## 配置说明

### 环境要求
- Node.js 18+
- pnpm 包管理器

### 依赖包
```json
{
  "dependencies": {
    "jsonwebtoken": "用于JWT处理",
    "uuid": "生成唯一标识符",
    "nitropack": "Nitro框架",
    "h3": "HTTP框架"
  }
}
```

### 启动服务
```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm start

# 构建生产版本
pnpm build
```

## 测试说明

### 默认用户
- **igourd** (密码: 123456) - 超级管理员
- **admin** (密码: 123456) - 管理员
- **jack** (密码: 123456) - 普通用户

### 测试流程
1. 使用新接口登录，获取JWT token
2. 使用token访问需要认证的接口
3. 测试Owner切换功能
4. 测试登出功能

### 接口验证
所有新增接口都包含：
- 参数验证
- Token认证
- 错误处理
- 响应格式化

## 注意事项

1. **向后兼容**: 原有的登录接口仍然支持，但建议使用新的参数结构
2. **数据一致性**: Mock数据在内存中，重启服务后数据会重置
3. **开发用途**: 仅用于开发和测试，不要在生产环境中使用
4. **权限控制**: 不同角色的用户有不同的菜单和权限配置

## 扩展说明

如需添加新的Mock接口或修改现有逻辑：

1. 在 `api/` 目录下创建新的接口文件
2. 在 `utils/mock-data.ts` 中添加相关数据
3. 在 `utils/jwt-utils.ts` 中添加相关工具函数
4. 更新相关文档

## 总结

`backend-mock` 服务已经完全适配了新的认证和授权接口规范，提供了：

- ✅ 完整的JWT Token支持
- ✅ 功能权限树结构
- ✅ 多应用切换支持
- ✅ 完整的用户权限管理
- ✅ 向后兼容的接口设计

现在前端应用可以使用新的接口规范进行开发和测试了！
