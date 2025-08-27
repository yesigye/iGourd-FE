# Backend Mock Service

这是一个基于Nitro的Mock服务，用于模拟后端API接口。

## 功能特性

- 🔐 **认证接口** - 完整的登录、登出、刷新token流程
- 👤 **用户管理** - 用户信息、权限码、角色等接口
- 🌳 **菜单权限** - 功能权限树、用户菜单、角色权限等
- 🏢 **Owner管理** - 多应用、多Owner支持
- 📊 **Mock数据** - 完整的测试数据支持

## 新增功能

### 🎯 Playground专用菜单系统

为了支持playground应用的完整功能，新增了专门的菜单数据结构：

#### 菜单结构
- **仪表板** (`/dashboard`)
  - 分析页面 (`/dashboard/analytics`)
  - 工作台 (`/dashboard/workspace`)
- **系统管理** (`/system`)
  - 角色管理 (`/system/role`)
  - 菜单管理 (`/system/menu`)
  - 部门管理 (`/system/dept`)
- **示例页面** (`/examples`)
- **演示页面** (`/demos`)

#### 特性
- ✅ 完整的Vue文件路径映射
- ✅ 层级菜单结构
- ✅ 权限操作控制
- ✅ 图标和样式支持
- ✅ 重定向配置

## API接口

### 认证接口

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/v1/passport/login` | 用户登录 |
| GET | `/api/v1/passport/logout` | 用户登出 |
| POST | `/api/v1/passport/owner/selection` | Owner切换 |

### 用户接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/v1/passport/user/info` | 获取用户信息 |
| GET | `/api/v1/passport/menu/user/menus` | 获取用户菜单 |
| GET | `/api/v1/passport/role/user/roles` | 获取用户角色 |

### 菜单接口

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/v1/passport/menu/tree-list` | 获取菜单树列表 |

### 兼容接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/menu/all` | 获取所有菜单（向后兼容） |
| GET | `/api/auth/codes` | 获取权限码（向后兼容） |

## Mock数据

### 用户账号

| 用户名 | 密码 | 角色 | 说明 |
|--------|------|------|------|
| `admin` | `123456` | 管理员 | 完整权限 |
| `user` | `123456` | 普通用户 | 基础权限 |

### 应用配置

- **默认应用**: `MERCHANT_MANAGE_WEB_PC`
- **账号类型**: `LOGIN_ID`
- **Owner类型**: `MERCHANT`

## 启动服务

```bash
# 安装依赖
pnpm install

# 启动开发服务
pnpm dev

# 构建生产版本
pnpm build

# 启动生产服务
pnpm start
```

服务将在 `http://localhost:5320` 启动。

## 测试

### 基本测试

```bash
# 测试登录接口
node test-playground-login.js

# 测试V1 API接口
node test-v1-api.js
```

### 测试账号

```bash
curl -X POST http://localhost:5320/api/v1/passport/login \
  -H "Content-Type: application/json" \
  -d '{
    "app_key": "MERCHANT_MANAGE_WEB_PC",
    "login_account": "admin",
    "password": "123456",
    "type": "LOGIN_ID"
  }'
```

## 配置说明

### 端口配置

服务默认运行在端口 `5320`，可以通过环境变量或启动参数修改：

```bash
# 使用环境变量
PORT=3000 pnpm dev

# 使用启动参数
pnpm dev --port 3000
```

### 代理配置

前端应用可以通过以下代理配置访问mock服务：

```javascript
// vite.config.js
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5320',
        changeOrigin: true
      }
    }
  }
})
```

## 数据结构

### 登录响应

```typescript
interface LoginResponse {
  jwt_token: {
    jwt_token: string;
    token_id: string;
    token_type: string;
    expires_in: number;
  };
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
```

### 功能权限树

```typescript
interface FunctionTree {
  id: number;
  name: string;
  key: string;
  function: {
    function_key: string;
    actions: Action[];
    menu: MenuItem;
  };
  sub_function_trees: FunctionTree[] | null;
}
```

## 开发说明

### 添加新接口

1. 在 `api/` 目录下创建新的接口文件
2. 使用 `defineEventHandler` 定义处理函数
3. 在 `utils/mock-data.ts` 中添加相应的mock数据
4. 更新README文档

### 修改菜单结构

1. 在 `generatePlaygroundFunctionTrees()` 函数中修改菜单数据
2. 确保 `component_paths` 与实际的Vue文件路径一致
3. 更新权限操作和菜单配置

## 注意事项

1. **端口冲突**: 确保端口5320没有被其他服务占用
2. **数据一致性**: Mock数据应该与前端期望的数据结构保持一致
3. **权限控制**: 功能权限树应该反映真实的业务权限结构
4. **路径映射**: Vue文件路径应该与路由配置保持一致

## 故障排除

### 常见问题

1. **服务无法启动**
   - 检查端口是否被占用
   - 确认依赖是否正确安装

2. **接口返回404**
   - 检查API文件路径是否正确
   - 确认文件命名是否符合Nitro规范

3. **数据格式错误**
   - 检查mock数据结构
   - 确认接口响应格式

### 调试技巧

1. 使用 `console.log` 在接口中添加调试信息
2. 检查浏览器开发者工具的网络请求
3. 查看服务端控制台日志

## 更新日志

### v1.1.0
- ✨ 新增playground专用菜单系统
- 🔧 优化功能权限树结构
- 📝 完善API文档和测试脚本

### v1.0.0
- 🎉 初始版本发布
- 🔐 基础认证接口
- 👤 用户管理功能
