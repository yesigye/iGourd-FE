# Common UI 组件样式系统

## 概述

本项目的样式系统已经完全兼容 Element Plus v2，使用了最新的 CSS 变量系统和 Sass 模块化架构。

## 文件结构

```
components/
├── __builtins__/
│   └── styles/
│       └── common.scss          # 全局变量和 mixins
├── form-item/
│   ├── style.scss               # 表单项样式
│   ├── var.scss                 # 表单项变量
│   └── grid.scss                # 网格系统
├── button/
│   └── style.scss               # 按钮样式
├── input/
│   └── style.scss               # 输入框样式
├── space/
│   └── style.scss               # 间距组件样式
└── style.ts                     # 样式入口文件
```

## 核心特性

### 1. Element Plus v2 兼容性

- 使用 `@use 'element-plus/theme-chalk/src/common/var.scss' as *;` 引入最新变量
- 所有颜色、字体、边框等变量都基于 Element Plus v2 的 CSS 变量
- 支持主题切换和自定义主题

### 2. CSS 变量优先

```scss
// ✅ 推荐：使用 CSS 变量
color: var(--el-color-primary);
border-color: var(--el-border-color-hover);

// ❌ 避免：直接使用 Sass 变量
color: $--color-primary;
border-color: $--border-color-hover;
```

### 3. 兼容性变量

为了保持向后兼容，我们提供了基于 Element Plus v2 的兼容性变量：

```scss
// 在 common.scss 中定义
$--color-primary: var(--el-color-primary) !default;
$--color-success: var(--el-color-success) !default;
$--border-width-base: var(--el-border-width, 1px) !default;
```

### 4. Mixins

```scss
@mixin focus {
  border-color: var(--el-color-primary);
  outline: 0;
  box-shadow: 0 0 0 2px var(--el-color-primary-light-9);
}

@mixin hover {
  border-color: var(--el-border-color-hover);
  outline: 0;
  border-right-width: var(--el-border-width, 1px) !important;
}
```

## 使用指南

### 1. 引入样式

```scss
@use '../__builtins__/styles/common.scss' as *;
@use './var.scss' as *;
```

### 2. 使用变量

```scss
.my-component {
  color: var(--el-text-color-regular);
  background-color: var(--el-color-white);
  border: 1px solid var(--el-border-color);
  border-radius: var(--el-border-radius-base);
  font-size: var(--el-font-size-base);
  transition: var(--el-transition-all);
}
```

### 3. 使用 mixins

```scss
.my-input {
  &:focus {
    @include focus;
  }
  
  &:hover {
    @include hover;
  }
}
```

### 4. 响应式设计

```scss
@media (max-width: $--sm) {
  .my-component {
    // 小屏幕样式
  }
}

@media (min-width: $--md) {
  .my-component {
    // 中等屏幕样式
  }
}
```

## 主题定制

### 1. CSS 变量覆盖

```css
:root {
  --el-color-primary: #409eff;
  --el-color-success: #67c23a;
  --el-color-warning: #e6a23c;
  --el-color-danger: #f56c6c;
}
```

### 2. 暗色主题

```css
[data-theme="dark"] {
  --el-color-primary: #409eff;
  --el-bg-color: #1a1a1a;
  --el-text-color-primary: #ffffff;
}
```

## 最佳实践

### 1. 变量命名

- 使用 Element Plus v2 的变量名：`--el-color-primary`
- 避免创建新的变量，优先使用现有变量
- 如需自定义，使用 `!default` 标记

### 2. 样式组织

- 按功能分组样式
- 使用 BEM 命名规范
- 保持样式的可维护性

### 3. 性能优化

- 避免过度嵌套
- 使用 CSS 变量而非 Sass 计算
- 合理使用 `@extend` 和 `@mixin`

## 迁移指南

### 从 Element Plus v1 迁移

1. 更新变量引用：
   ```scss
   // 旧版本
   color: $--color-primary;
   
   // 新版本
   color: var(--el-color-primary);
   ```

2. 更新 mixins：
   ```scss
   // 旧版本
   @include el-focus();
   
   // 新版本
   @include focus;
   ```

3. 检查过时的变量：
   - `$--color-white` → `var(--el-color-white)`
   - `$--border-radius-base` → `var(--el-border-radius-base)`
   - `$--font-size-base` → `var(--el-font-size-base)`

## 故障排除

### 常见问题

1. **变量未定义**：确保正确引入了 `common.scss`
2. **样式不生效**：检查 CSS 变量是否正确设置
3. **主题切换失败**：验证 CSS 变量覆盖是否正确

### 调试技巧

1. 使用浏览器开发者工具检查 CSS 变量值
2. 验证 Sass 编译输出
3. 检查变量作用域和优先级

## 更新日志

- **v2.0.0**: 完全兼容 Element Plus v2
- **v1.0.0**: 初始版本，基于 Element Plus v1
