# Sass 变量引用问题修复记录

## 问题描述

在迁移到 Element Plus v2 的过程中，发现多个样式文件存在 Sass 变量未定义的问题，导致编译失败。

## 已修复的文件

### 1. form-item/grid.scss
**问题**: 使用了 `$form-item-prefix` 变量但没有引入
**修复**: 添加了必要的 `@use` 语句
```scss
// 修复前
.#{$form-item-prefix}-item-col-24 { ... }

// 修复后
@use '../__builtins__/styles/common.scss' as *;
@use './var.scss' as *;
.#{$form-item-prefix}-item-col-24 { ... }
```

### 2. form-item/animation.scss
**问题**: 使用了 `$form-item-prefix` 变量但没有引入
**修复**: 添加了必要的 `@use` 语句
```scss
// 修复前
.#{$form-item-prefix}-help-appear { ... }

// 修复后
@use '../__builtins__/styles/common.scss' as *;
@use './var.scss' as *;
.#{$form-item-prefix}-help-appear { ... }
```

### 3. array-base/style.scss
**问题**: 使用了过时的 `$--` 前缀变量
**修复**: 替换为 Element Plus v2 的 CSS 变量
```scss
// 修复前
transition: $--all-transition;
font-size: var(--font-size-base);

// 修复后
transition: var(--el-transition-all);
font-size: var(--el-font-size-base);
```

### 4. array-cards/style.scss
**问题**: 使用了过时的 `$--` 前缀变量
**修复**: 替换为 Element Plus v2 的 CSS 变量
```scss
// 修复前
border: $--border-width-base dashed $--border-color-base;
background-color: $--color-white;
border-color: $--border-color-hover;
border-color: $--color-primary;

// 修复后
border: var(--el-border-width, 1px) dashed var(--el-border-color);
background-color: var(--el-color-white);
border-color: var(--el-border-color-hover);
border-color: var(--el-color-primary);
```

### 5. array-collapse/style.scss
**问题**: 使用了过时的 `$--` 前缀变量
**修复**: 替换为 Element Plus v2 的 CSS 变量
```scss
// 修复前
border: $--border-width-base dashed $--border-color-base;
background-color: $--color-white;
border-color: $--border-color-hover;
border-color: $--color-primary;

// 修复后
border: var(--el-border-width, 1px) dashed var(--el-border-color);
background-color: var(--el-color-white);
border-color: var(--el-border-color-hover);
border-color: var(--el-color-primary);
```

### 6. array-items/style.scss
**问题**: 使用了过时的 `$--` 前缀变量
**修复**: 替换为 Element Plus v2 的 CSS 变量
```scss
// 修复前
border: $--border-width-base dashed $--border-color-base;
background: $--color-white;
border-color: $--border-color-hover;
border-color: $--color-primary;
border: 1px solid $--card-border-color;
box-shadow: 0 0 10px $--border-color-base;

// 修复后
border: var(--el-border-width, 1px) dashed var(--el-border-color);
background: var(--el-color-white);
border-color: var(--el-border-color-hover);
border-color: var(--el-color-primary);
border: 1px solid var(--el-border-color);
box-shadow: 0 0 10px var(--el-border-color);
```

### 7. array-table/style.scss
**问题**: 使用了过时的 `$--` 前缀变量
**修复**: 替换为 Element Plus v2 的 CSS 变量
```scss
// 修复前
border-color: $--color-danger !important;
background: #fff;
box-shadow: 0 0 10px #eee;
border: $--border-width-base dashed $--border-color-base;
background-color: $--color-white;
border-color: $--border-color-hover;
border-color: $--color-primary;
color: $--color-danger;
font-weight: $--font-weight-primary;

// 修复后
border-color: var(--el-color-danger) !important;
background: var(--el-color-white);
box-shadow: 0 0 10px var(--el-border-color-light);
border: var(--el-border-width, 1px) dashed var(--el-border-color);
background-color: var(--el-color-white);
border-color: var(--el-border-color-hover);
border-color: var(--el-color-primary);
color: var(--el-color-danger);
font-weight: var(--el-font-weight-primary, 500);
```

### 8. editable/style.scss
**问题**: 使用了过时的 `$--` 前缀变量
**修复**: 替换为 Element Plus v2 的 CSS 变量
```scss
// 修复前
color: $--color-primary;

// 修复后
color: var(--el-color-primary);
```

### 9. common.scss 变量定义完善
**问题**: 缺少多个必要的变量定义
**修复**: 在 `common.scss` 中添加了所有必要的变量
```scss
// 添加的变量包括：
$--color-text-primary: $--text-color-primary !default;
$--color-text-secondary: $--text-color-secondary !default;
$--border-base: 1px solid var(--el-border-color) !default;
$--form-font-size: var(--el-font-size-base) !default;
$--form-item-large-line-height: 40px !default;
$--form-item-medium-line-height: 32px !default;
$--form-item-small-line-height: 24px !default;
$--form-item-label-top-line-height: 40px !default;
$--form-error-line-height: 22px !default;
$--form-item-margin-bottom: $--form-error-line-height !default;
```

### 10. form-item/style.scss 变量引用修复
**问题**: 使用了多个未定义的 `$--` 前缀变量
**修复**: 将所有变量引用替换为具体的值或 CSS 变量
```scss
// 修复前
margin-bottom: $--form-item-margin-bottom;
line-height: $--form-item-medium-line-height;
font-size: $--form-font-size;
color: $--color-text-secondary;
transition: $--color-transition-base;
border: $--border-base;
border-radius: $--border-radius-base;

// 修复后
margin-bottom: 22px;
line-height: 32px;
font-size: var(--el-font-size-base);
color: var(--el-text-color-secondary);
transition: var(--el-transition-color);
border: 1px solid var(--el-border-color);
border-radius: var(--el-border-radius-base);
```

## 修复原则

1. **变量引入**: 确保所有使用 Sass 变量的文件都正确引入了必要的模块
2. **CSS 变量优先**: 优先使用 Element Plus v2 的 CSS 变量系统
3. **向后兼容**: 保留必要的兼容性变量，但标记为 `!default`
4. **统一标准**: 所有组件都使用相同的变量引用方式
5. **集中管理**: 将所有变量定义集中在 `common.scss` 中，避免重复定义
6. **直接值替换**: 对于频繁使用的变量，直接使用具体的值避免引用问题

## 验证方法

1. 运行构建命令，确保没有 Sass 编译错误
2. 检查生成的 CSS 文件，确认变量正确解析
3. 在浏览器中测试组件样式，确保视觉效果正常

## 注意事项

- 所有新创建的样式文件都应该使用 Element Plus v2 的 CSS 变量
- 避免创建新的 `$--` 前缀变量，除非有特殊需求
- 使用 `@use` 语句引入模块，避免 `@import` 的全局污染问题
- 所有变量定义都集中在 `common.scss` 中，便于维护和更新
- 对于频繁使用的变量值，考虑直接使用具体值而不是变量引用

## 更新日志

- **v2.2.0**: 修复了 form-item 样式文件中的所有变量引用问题
- **v2.1.0**: 完善了所有变量定义，修复了变量未定义错误
- **v2.0.0**: 完全兼容 Element Plus v2
- **v1.0.0**: 初始版本，基于 Element Plus v1
