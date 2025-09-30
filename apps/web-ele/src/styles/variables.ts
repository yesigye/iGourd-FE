// 新的css样式规范 仅供变量使用
export const themeVariables = {
  white: '#fff',
  // ==========================================
  // 1. 核心基础色 (Core Base Colors)
  // ==========================================
  primary: '#0D9EFF', // 主色基准
  success: '#67C23A', // 成功色基准
  warning: '#E6A23C', // 警告色基准 - 更新为 uno.config.ts 中的值
  error: '#F56C6C', // 错误色基准
  info: '#909399', // 信息色基准

  // ==========================================
  // 2. 扩展色阶 (Extended Color Gradients)
  // ==========================================
  // 主色扩展
  'primary-50': '#ECF5FF', // 主色-最浅
  'primary-100': '#D9ECFF', // 主色-较浅
  'primary-200': '#C6E2FF', // 主色-浅 - 更新为 uno.config.ts 中的值
  'primary-300': '#9FCEFF', // 主色- hover态 - 更新为 uno.config.ts 中的值
  'primary-700': '#79BBFF', // 主色-加深 - 更新为 uno.config.ts 中的值
  'primary-900': '#0084E3', // 主色-最深

  // 成功色扩展
  'success-50': '#F0F9EB', // 成功-最浅
  'success-100': '#E1F3D8', // 成功-较浅
  'success-200': '#D1EDC4', // 成功-浅 - 新增 uno.config.ts 中的值
  'success-300': '#B3E09C', // 成功- hover态 - 更新为 uno.config.ts 中的值
  'success-700': '#95D475', // 成功-加深 - 更新为 uno.config.ts 中的值
  'success-900': '#529B2E', // 成功-最深

  // 警告色扩展
  'warning-50': '#E6A23C', // 警告-最浅 - 更新为 uno.config.ts 中的值
  'warning-100': '#FAECD8', // 警告-较浅 - 更新为 uno.config.ts 中的值
  'warning-200': '#F8E3C5', // 警告-浅 - 新增 uno.config.ts 中的值
  'warning-300': '#F2D09D', // 警告- hover态 - 更新为 uno.config.ts 中的值
  'warning-700': '#EEBE77', // 警告-加深 - 更新为 uno.config.ts 中的值
  'warning-900': '#B88230', // 警告-最深 - 更新为 uno.config.ts 中的值

  // 错误色扩展
  'error-50': '#FEF0F0', // 错误-最浅
  'error-100': '#FDE2E2', // 错误-较浅 - 更新为 uno.config.ts 中的值
  'error-200': '#FCD3D3', // 错误-浅 - 新增 uno.config.ts 中的值
  'error-300': '#FAB5B5', // 错误- hover态 - 更新为 uno.config.ts 中的值
  'error-700': '#F89898', // 错误-加深 - 更新为 uno.config.ts 中的值
  'error-900': '#C45656', // 错误-最深 - 更新为 uno.config.ts 中的值

  // 信息色扩展
  'info-50': '#F4F4F5', // 信息-最浅
  'info-100': '#E9E9EB', // 信息-较浅
  'info-200': '#DEDFE0', // 信息-浅 - 新增 uno.config.ts 中的值
  'info-300': '#C7C9CC', // 信息- hover态 - 更新为 uno.config.ts 中的值
  'info-700': '#B1B3B8', // 信息-加深 - 更新为 uno.config.ts 中的值
  'info-900': '#73767A', // 信息-最深 - 更新为 uno.config.ts 中的值

  // ==========================================
  // 3. 状态指示色 (Status Indicators)
  // ==========================================
  'status-pending': '#2196F3', // 待处理/激活
  'status-completed': '#4CAF50', // 完成/终结
  'status-partial': '#FF9800', // 部分异常
  'status-terminated': '#D32F2F', // 流程终止
  'status-blocked': '#D32F2F', // 受阻可恢复 - 更新为 uno.config.ts 中的值
  'status-disabled': '#9E9E9E', // 关闭/失效

  // ==========================================
  // 4. 中性色系 (Neutral Palette)
  // ==========================================
  // 文本色彩
  'text-primary': '#303133', // 主要文本
  'text-secondary': '#606266', // 次要文本
  'text-tertiary': '#909399', // 第三级文本
  'text-placeholder': '#A8ABB2', // 占位文本 - 更新为 uno.config.ts 中的值
  'text-disabled': '#C0C4CC', // 禁用文本 - 更新为 uno.config.ts 中的值

  // 填充色彩
  'fill-ultra-light': '#FAFAFA', // 超浅填充 - 更新为 uno.config.ts 中的值
  'fill-light': '#F5F7FA', // 浅填充
  'fill-regular': '#FAFCFF', // 常规填充 - 更新为 uno.config.ts 中的值
  'fill-medium': '#EBEDF0', // 中等填充 - 更新为 uno.config.ts 中的值
  'fill-dark': '#E6E8EB', // 深色填充 - 更新为 uno.config.ts 中的值

  // 边框色彩
  'border-light': '#EDEDED', // 浅色边框
  'border-regular': '#DCDDE0', // 常规边框
  'border-dark': '#C9CDD4', // 深色边框
  'border-hover': '#009EFF', // 交互边框（关联主色）
  'border-disabled': '#E5E6EB', // 禁用边框

  // 背景色彩
  'bg-page': '#F2F3F5', // 页面背景 - 更新为 uno.config.ts 中的值
  'bg-card': '#ffffff', // 卡片背景 - 更新为 uno.config.ts 中的值
  'bg-selected': '#E6E6E6', // 选中背景 - 更新为 uno.config.ts 中的值
  'bg-hover': '#F5F7FA', // 悬浮背景
  'bg-mask': 'rgba(0, 0, 0, 0.5)', // 遮罩背景

  // ==========================================
  // 5. 组件样式 (Component Styles)
  // ==========================================
  // 按钮样式
  'btn-primary-bg': '#009EFF', // 主按钮背景（关联主色）
  'btn-primary-hover': '#7BBEFF', // 主按钮hover（关联主色扩展）
  'btn-primary-active': '#0084E3', // 主按钮激活（关联主色扩展）
  'btn-primary-disabled': '#DCDDE0', // 主按钮禁用

  // 表单样式
  'form-label-color': '#606266', // 表单标签色（关联次要文本）
  'form-input-border': '#DCDDE0', // 输入框边框
  'form-input-focus': '#009EFF', // 输入框聚焦（关联主色）
  'form-error': '#F56C6C', // 表单错误（关联错误色）

  // 表格样式
  'table-header-bg': '#F5F7FA', // 表头背景（关联浅填充）
  'table-header-color': '#606266', // 表头文字（关联次要文本）
  'table-row-hover': '#F2F6FC', // 行hover背景
  'table-stripe': '#F9FAFB', // 条纹背景
  'table-border': '#DCDDE0', // 表格边框

  // ==========================================
  // 6. 形态样式 (Shape Properties)
  // ==========================================
  // 圆角半径
  'radius-xs': '2px', // 极小圆角
  'radius-sm': '4px', // 小圆角
  'radius-md': '6px', // 中等圆角
  'radius-lg': '8px', // 大圆角
  'radius-xl': '12px', // 超大圆角
  'radius-2xl': '20px', // 新增 uno.config.ts 中的值
  'radius-full': '9999px', // 全圆角

  // 阴影效果
  'shadow-xs': '0px 0px 6px 0px #0000001F', // 极浅阴影 - 更新为 uno.config.ts 中的值
  'shadow-sm': '0px 0px 12px 0px #0000001F', // 浅阴影 - 更新为 uno.config.ts 中的值
  'shadow-md': '0px 8px 20px 0px #00000014', // 中等阴影 - 更新为 uno.config.ts 中的值
  'shadow-lg': '0 4px 16px rgba(0, 0, 0, 0.12)', // 深阴影
  'shadow-xl': '0px 8px 16px -8px #00000029', // 极深阴影 - 更新为 uno.config.ts 中的值
  'shadow-inner': 'inset 0 2px 4px rgba(0, 0, 0, 0.05)', // 内阴影

  // 边框宽度
  'border-width-hairline': '1px', // 极细边框
  'border-width-thin': '2px', // 细边框
  'border-width-regular': '3px', // 常规边框
  'font-size-12': '12px',
  'font-size-14': '14px',
  'font-size-16': '16px',
}
export const themeStyles = {
  errorBtnColor: '#fc5c65',
  warningColor: '#e6a23c',
  warningSize: '16px',
}
// 表头样式
export const tableHeaderStyle = {
  background: '#F6F8FC',
  color: '#323232',
  height: '30px',
}
// 提醒警告中表格高度
export const warningTableHeight = 360
// 警告图标颜色
export const warningIconColor = '#e6a23c'
// 提示框的文本颜色
export const tipTextColor = '#606266'
// 上传icon颜色
export const uploadIconColor = '#8c939d'
// button颜色
export const buttonErrorColor = '#FCD3D3'
export const buttomSkyMistColor = '#C6E2FF'
export const buttomCoralColor = '#F56C6C'

// 上传图标颜色
export const ArrowUpBoldIconColor = '#909399'
export const ArrowUpBoldIconColorActive = '#95D475'

//按钮颜色
export const buttonAzureColor = '#0D99FF'
export const buttonWatermelonColor = '#FC5C65'
