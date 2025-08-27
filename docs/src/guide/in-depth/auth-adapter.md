# 认证系统适配指南

## 概述

本项目已根据新的Swagger API规范（`passport-api-docs.json` 和 `merchant-api-docs.json`）完成了认证和授权逻辑的适配。

## 主要变化

### 1. 登录接口变化

**原接口：**
```
POST /auth/login
```

**新接口：**
```
POST /v1/passport/login
```

### 2. 请求参数结构变化

**原参数：**
```typescript
interface LoginParams {
  username?: string;
  password?: string;
}
```

**新参数：**
```typescript
interface LoginParams {
  app_key: string;           // 必填：应用类型
  login_account: string;     // 必填：登录账号
  password: string;          // 必填：密码
  type: AccountType;         // 必填：账号类型
  country_area_code?: string; // 可选：国家区号
  country_id?: number;       // 可选：国家ID
  owner_id?: number;         // 可选：平台身份ID
  owner_type?: OwnerType;    // 可选：平台身份类型
}
```

### 3. 响应数据结构变化

**原响应：**
```typescript
interface LoginResult {
  accessToken: string;
}
```

**新响应：**
```typescript
interface LoginResult {
  jwt_token: {
    jwt_token: string;      // JWT令牌
    token_id: string;       // 令牌ID
    token_type: string;     // 令牌类型
    expires_in: number;     // 过期时间
  };
  user_model: {
    id: number;
    real_name: string;
    login_id: string;
    email?: string;
    phone_number?: string;
    status: string;
  };
  function_trees: Array<...>;      // 功能权限树
  user_apps: Array<...>;          // 用户应用关系
  current_login_user_app: {...};   // 当前登录应用
}
```

### 4. 登出接口变化

**原接口：**
```
POST /auth/logout
```

**新接口：**
```
GET /v1/passport/logout
```

## 应用配置

### 应用类型 (app_key)

```typescript
const APP_KEYS = {
  BOSS_MANAGE_WEB_PC: 'BOSS_MANAGE_WEB_PC',           // BOSS管理后台WEB PC
  CUSTOMER_APP: 'CUSTOMER_APP',                       // 客户APP(Android/IOS)
  CUSTOMER_WEB_PC: 'CUSTOMER_WEB_PC',                 // 客户平台WEB PC
  MERCHANT_MANAGE_APP: 'MERCHANT_MANAGE_APP',         // 商家管理APP(Android/IOS)
  MERCHANT_MANAGE_WEB_PC: 'MERCHANT_MANAGE_WEB_PC',   // 商家管理后台WEB PC
  MERCHANT_POS_PC: 'MERCHANT_POS_PC',                 // 商家POS PC(Windows/Android)
} as const;
```

### 账号类型 (type)

```typescript
const ACCOUNT_TYPES = {
  EMAIL: 'EMAIL',                    // 邮箱登录
  LOGIN_ID: 'LOGIN_ID',             // 登录ID
  PHONE_NUMBER: 'PHONE_NUMBER',     // 手机号登录
  WECHAT_OPENID: 'WECHAT_OPENID',   // 微信OpenID
  WHATS_APP_OPENID: 'WHATS_APP_OPENID', // WhatsApp OpenID
} as const;
```

### 平台身份类型 (owner_type)

```typescript
const OWNER_TYPES = {
  BOSS: 'BOSS',           // 商户运营后台
  CUSTOMER: 'CUSTOMER',   // 客户
  MERCHANT: 'MERCHANT',   // 商户
  PARTNER: 'PARTNER',     // 服务商
} as const;
```

## 使用示例

### 基本登录

```typescript
import { loginApi } from '#/api/core/auth';
import { APP_CONFIG } from '@igourd/constants';

const loginParams = {
  app_key: APP_CONFIG.DEFAULT_APP.app_key,  // 'MERCHANT_MANAGE_WEB_PC'
  login_account: 'admin',
  password: 'password123',
  type: APP_CONFIG.DEFAULT_APP.type,        // 'LOGIN_ID'
};

const result = await loginApi(loginParams);
const accessToken = result.jwt_token.jwt_token;
```

### 手机号登录

```typescript
const loginParams = {
  app_key: 'MERCHANT_MANAGE_WEB_PC',
  login_account: '13800138000',
  password: 'password123',
  type: 'PHONE_NUMBER',
  country_area_code: '86',
  country_id: 1815710140407562241,
};
```

### 选择Owner切换

```typescript
import { selectOwnerApi } from '#/api/core/auth';

const result = await selectOwnerApi({
  owner_id: 123456,
  owner_type: 'MERCHANT',
});
```

## 新增功能

### 1. Owner切换功能

用户登录后，如果拥有多个平台身份，可以通过 `selectOwnerApi` 进行切换。

### 2. 功能权限树

新的登录响应包含 `function_trees` 字段，提供了更细粒度的权限控制。

### 3. 多应用支持

用户可以在多个应用间切换，每个应用都有独立的权限配置。

## 注意事项

1. **必填字段**：`app_key`、`login_account`、`password`、`type` 是必填字段
2. **手机号登录**：使用手机号登录时，需要提供 `country_area_code` 和 `country_id`
3. **Owner切换**：如果用户有多个平台身份，建议在登录后提供Owner选择界面
4. **权限控制**：新的权限系统基于功能树，比原来的权限码更灵活

## 迁移检查清单

- [ ] 更新所有应用的认证API接口
- [ ] 更新认证store中的登录逻辑
- [ ] 更新用户信息API接口
- [ ] 测试新的登录流程
- [ ] 验证权限控制功能
- [ ] 更新相关文档
