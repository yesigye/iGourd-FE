import { useI18n } from '@igourd/locales'
import Decimal from 'decimal.js'

// 1.验证只能输入字母和数字的正则表达式
export function validateAlphaNumeric(
  i18n: (s: string) => string,
  rule,
  value,
  callback,
) {
  const reg = /^[A-Za-z0-9]+$/
  if (value && !reg.test(value)) {
    callback(new Error(i18n('common.pleaseEnterAlphaNumeric')))
  } else {
    callback()
  }
}

// 2. 只能输入英文和汉字
export const validateAlphaChinese = (rule, value, callback) => {
  const { t } = useI18n()
  const reg = /^[\u4e00-\u9fa5a-zA-Z]+$/
  if (value && !reg.test(value)) {
    callback(new Error(t('common.pleaseEnterEnglishOrChinese')))
  } else {
    return callback()
  }
}

// 3. 只能输入数字和汉字
export const validateNumericChinese = (rule, value, callback) => {
  const reg = /^[\u4e00-\u9fa5\d]+$/
  const { t } = useI18n()
  if (value && !reg.test(value)) {

    callback(new Error(t('common.pleaseEnterNumericChinese')))
  } else {
    return callback()
  }
}

// 4. 只能输入英文
export const validateEnglish = (rule, value, callback) => {
  const reg = /^[A-Za-z]+$/
  if (value && !reg.test(value)) {
    callback(new Error(t('common.pleaseEnterEnglish')))
  } else {
    return callback()
  }
}

// 6. 只能输入汉字
export const validateChinese = (rule, value, callback) => {
  const reg = /^[\u4e00-\u9fa5]+$/
  if (value && !reg.test(value)) {
    callback(new Error(t('common.pleaseEnterChinese')))
  } else {
    callback()
  }
}
// 7. 验证字符串是否包含空白字符
export const validateNoWhitespace = (rule, value, callback) => {
  if (value && /\s/.test(value)) {
    const { t } = useI18n()
    callback(new Error(t('common.pleaseEnterNoWhitespace')))
  } else {
    callback()
  }
}

// 8.验证字符串长度
export const validateLength = (rule, value, callback) => {
  if (value && value.length > 40) {
    const { t } = useI18n()
    callback(new Error(t('common.pleaseEnterLessThan40Characters')))
  } else {
    callback()
  }
}
// 9.验证字符串是否包含特殊字符
export function validateNoSpecialChar(rule, value, callback) {
  const reg =
    /[`~!@#$%^&*()_\-+=<>?:"{}|,./;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：""【】、；''，。、]/
  if (value && reg.test(value)) {
    const { t } = useI18n()
    callback(new Error(t('common.pleaseEnterNoSpecialChar')))
  } else {
    callback()
  }
}
// 10.验证邮箱
export function validateEmail(t: (s: string) => string, rule, value, callback) {
  // More strict email regex
  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  if (!value) {
    callback()
  } else if (!emailRegex.test(value)) {
    const { t } = useI18n()
    callback(new Error(t('common.pleaseEnterCorrectEmail')))
  } else {
    callback()
  }
}
// 11. 验证手机号
export function validatePhone(
  i18n: (s: string) => string,
  rule,
  value,
  callback,
) {
  // More flexible regex for international phone numbers
  const phoneRegex = /^(\+\d{1,3}[- ]?)?\d{10,14}$/

  if (value && !phoneRegex.test(value)) {
    callback(new Error(i18n('common.pleaseEnterCorrectPhone'))) // Please enter a valid phone number
  } else {
    callback()
  }
}

// 12.验证只能输入英文、汉字和空格
export const validateAlphaChineseWithSpace = (rule, value, callback) => {
  const reg = /^[\u4e00-\u9fa5a-zA-Z\s]+$/
  if (value && !reg.test(value)) {
    const { t } = useI18n()
    callback(new Error(t('common.pleaseEnterEnglishOrChineseWithSpace')))
  } else {
    return callback()
  }
}

// 13. 验证只能输入英文、汉字、空格和数字
export const validateAlphaNumericChineseWithSpace = (rule, value, callback) => {
  const reg = /^[\u4e00-\u9fa5a-zA-Z0-9\s]+$/
  if (value && !reg.test(value)) {
    const { t } = useI18n()
    callback(new Error(t('common.pleaseEnterEnglishChineseNumericWithSpace')))
  } else {
    return callback()
  }
}
// 14.验证金额输入
export const validateAmount = (rule, value, callback) => {
  const reg = /^(([1-9]\d*)|\d)(\.\d{1,2})?$/
  if (value && !reg.test(value)) {
    const { t } = useI18n()
    callback(new Error(t('common.validate.amountFormat', { value: 2 })))
  } else {
    callback()
  }
}
export const validateAlphaNumericChinese = value => {
  // 返回过滤后的值
  return value.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, '')
}

/**
 *  @rule 手机号
 */
export function checkPhoneNumber(
  rule: any,
  value: any,
  callback: any,
  t: Function,
) {

  const regexp =
    /^(((13[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(17[3-8]{1})|(18[0-9]{1})|(19[0-9]{1})|(14[5-7]{1}))+\d{8})$/
  if (value === '') callback(t('common.pleaseEnterPhoneNumber'))
  if (!regexp.test(value)) {
    callback(new Error(t('common.pleaseEnterCorrectPhoneNumber')))
  } else {
    return callback()
  }
}

/**
 * 必填字段验证
 * @param directory 目录名
 * @param fieldName 字段名
 * @returns
 */
export const EnterRequestOrValidator = (
  directory: string,
  fieldName: string,
  t: Function,
) => ({
  required: true,
  message: t(`${directory}.pleaseEnter${fieldName}`),
  trigger: 'blur',
})

/**
 * 必填字段验证
 * @param directory 目录名
 * @param fieldName 字段名
 * @returns
 */
export const SelectRequestOrValidator = (
  directory: string,
  fieldName: string,
  t: Function,
) => ({
  required: true,
  message: t(`${directory}.pleaseSelect${fieldName}`),
  trigger: 'blur',
})
/**
 * 日期选择验证函数
 */
export const dateValidator = (t: Function) => ({
  required: true,
  message: t('common.pleaseSelectDate'),
  trigger: 'blur',
})

/**
 * 创建一个自定义验证函数
 * @param validatorFn 验证函数
 * @param errorMessage 错误信息
 * @returns
 */
export const createCustomValidator = (
  validatorFn: Function,
  errorMessage: string,
  t: Function,
) => ({
  required: true,
  validator: validatorFn,
  trigger: 'blur',
  message: t(errorMessage),
})
// import { ref } from 'vue';
// import { validateChar, validateNumeric, validateEmailAll, validatePhoneAll } from '@/utils/eleValidate';
// 5. 只能输入数字
export const validateNumeric = (rule, value, callback) => {
  const reg = /^\d+$/
  if (value && !reg.test(value)) {
    const { t } = useI18n()
    callback(new Error(t('common.pleaseEnterNumeric')))
  } else {
    callback()
  }
}
// 最多输入8位小数
export const validateEightNumeric = (rule, value, callback) => {
  const reg = /^-?\d{1,8}([.]\d{1,8})?$/
  if (!rule) {
    return value && !reg.test(value)
  }
  if (value && !reg.test(value)) {
    const { t } = useI18n()
    callback(new Error(t('common.pleaseEnterEightNumeric')))
  } else {
    callback()
  }
}
/**
 *
 * @param num 需要保留小数位数的数字
 * @param dec 小数位数
 * @returns
 */
export const retainDecimal8 = (num, dec) => {
  console.log('num', num, dec)
  if (!num) return 0
  num = num.toString()
  const index = num.indexOf('.')
  if (index !== -1) {
    num = num.substring(0, dec + index + 1)
  } else {
    num = num.substring(0)
  }
  const str = parseFloat(num).toFixed(dec)
  if (dec == 8) {
    return str.replace(/\.?0{1,8}$/, '') * 1
  }
  return str.replace(/\.?0{1,2}$/, '') * 1
}

/**
 * 向下取整到指定小数位
 * @param num 需要处理的数字
 * @param decimalPlaces 小数位数
 * @returns 向下取整后的数字
 */
export const floorDecimal = (
  num: number | string,
  decimalPlaces: number = 2,
): number => {
  if (!num && num !== 0) return 0
  const decimal = new Decimal(num)
  return decimal.toDecimalPlaces(decimalPlaces, Decimal.ROUND_DOWN).toNumber()
  // return decimal.floor().toNumber();
}

/**
 * 名称校验 - 最大64字符
 * @param rule 校验规则对象
 * @param value 校验值
 * @param callback 回调函数
 */
export const validateChar =
  (maxLength: number, i18n: (s: string) => string) =>
    (rule: any, value: string | undefined, callback: Function) => {
      const specialChars = /[!~#^`<>+=\\|?/]/
      if (value && (value.length > maxLength || specialChars.test(value))) {
        callback(
          new Error(
            i18n('common.validate.maxLengthAndNoSpecialChars', {
              length: maxLength,
            }),
          ),
        )
      } else {
        callback()
      }
    }

/**
 * 地址校验 - 最大256字符
 * @param rule 校验规则对象
 * @param value 校验值
 * @param callback 回调函数
 */
export const validateAddress = (
  rule: any,
  value: string | undefined,
  callback: Function,
) => {
  const specialChars = /[!~#^`<>+=\\|?/]/
  if (value && (value.length > 256 || specialChars.test(value))) {
    const { t } = useI18n()
    callback(
      new Error(
        t('common.validate.maxLengthAndNoSpecialChars', { length: 256 }),
      ),
    )
  } else {
    callback()
  }
}

/**
 * 邮箱格式校验
 * @param rule 校验规则对象
 * @param value 校验值
 * @param callback 回调函数
 */
export const validateEmailAll = (
  rule: any,
  value: string | undefined,
  callback: Function,
) => {
  if (!value) {
    callback()
    return
  }
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
  if (!emailRegex.test(value)) {
    const { t } = useI18n()
    callback(new Error(t('common.validate.emailFormat')))
  } else {
    callback()
  }
}

/**
 * 手机号码校验 - 支持国际格式
 * @param countryCode 国家代码 (例如: '+86')
 * @returns 校验函数
 */
export const validatePhoneAll = (countryCode: string) => {
  console.log('countryCode', countryCode)
  return (rule: any, value: string | undefined, callback: Function) => {
    if (!value) {
      callback()
      return
    }

    // if (!/^\d+$/.test(value)) {
    //   callback(new Error(t('common.validate.onlyNumbersAllowed')));
    //   return;
    // }

    const phoneFormats: Record<string, { pattern: RegExp; country: string }> = {
      '+86': { pattern: /^1\d{10}$/, country: '中国' },
      '+81': { pattern: /^(080|090)\d{8}$/, country: '日本' },
      '+886': { pattern: /^09\d{8}$/, country: '台湾' },
      '+1': { pattern: /^\d{10}$/, country: 'USA' },
      '+33': { pattern: /^[1-9]\d{8}$/, country: 'France' },
      '+256': { pattern: /^[7]\d{8}$/, country: 'Uganda' },
      DEFAULT: { pattern: /^\d{7,11}$/, country: 'Unknown' },
    }

    const format = phoneFormats[countryCode] || phoneFormats.DEFAULT
    if (!format.pattern.test(value)) {
      const { t } = useI18n()
      callback(new Error(t('common.validate.phoneFormat')))
    } else {
      callback()
    }
  }
}

/**
 * 金额校验 - 数字和小数点(最多两位小数)
 * @param rule 校验规则对象
 * @param value 校验值
 * @param callback 回调函数
 */
const validateAmountAll = (
  rule: any,
  value: string | number | undefined,
  callback: Function,
) => {
  if (!value) {
    callback()
    return
  }
  const pattern = /^\d+(\.\d{1,2})?$/
  if (!pattern.test(String(value))) {
    const { t } = useI18n()
    callback(new Error(t('common.validate.amountFormat', { value: 2 })))
  } else {
    callback()
  }
}

/**
 * 密码校验 - 6-20位
 * @param rule 校验规则对象
 * @param value 校验值
 * @param callback 回调函数
 */
const validatePassword = (
  rule: any,
  value: string | undefined,
  callback: Function,
) => {
  if (!value) {
    callback()
    return
  }
  if (value.length < 6 || value.length > 20) {
    callback(new Error('密码长度必须在6-20位之间'))
  } else {
    callback()
  }
}

/**
 * 特殊字符校验
 * @param rule 校验规则对象
 * @param value 校验值
 * @param callback 回调函数
 */
const validateSpecialChars = (
  rule: any,
  value: string | undefined,
  callback: Function,
) => {
  if (!value) {
    callback()
    return
  }
  const specialChars = /[!~#^`<>+=\\|?/]/
  if (specialChars.test(value)) {
    const { t } = useI18n()
    callback(new Error(t('common.validate.noSpecialChars')))
  } else {
    callback()
  }
}

/**
 * 验证手机号和区号
 * @param form 表单对象
 * @returns 校验函数
 */
export const validatePhoneAndCode = (form: any) => {
  return (rule: any, value: any, callback: Function) => {
    const { t } = useI18n()
    if (!form.contact_country_area_code) {
      return callback(new Error(t('common.validate.countryCodeRequired')))
    }

    if (!form.contact_telephone) {
      return callback(new Error(t('common.validate.phoneRequired')))
    }

    const phoneFormats: Record<string, { pattern: RegExp; message: string }> = {
      '+86': {
        pattern: /^1\d{10}$/,
        message: t('common.validate.invalidChinesePhone'),
      },
      '+1': {
        pattern: /^\d{10}$/,
        message: t('common.validate.invalidUSPhone'),
      },
      DEFAULT: {
        pattern: /^\d{7,15}$/,
        message: t('common.validate.invalidPhone'),
      },
    }

    const format =
      phoneFormats[form.contact_country_area_code] || phoneFormats.DEFAULT
    if (!format.pattern.test(form.contact_telephone)) {
      return callback(new Error(format.message))
    }

    callback()
  }
}
//防止两数相乘出现精度丢失
export const stayFloatMul = (arg1, arg2) => {
  let m = 0
  const s1 = arg1.toString()
  const s2 = arg2.toString()
  try {
    m += s1.split('.')?.[1]?.length
  } catch (e) {
    console.log(e)
  }
  try {
    m += s2.split('.')?.[1]?.length
  } catch (e) {
    console.log(e)
  }
  return (
    (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) /
    Math.pow(10, m)
  )
}
//防止两数相减出现精度丢失
export const stayFloatSub = (num1, num2) => {
  let r1, r2
  try {
    r1 = num1.toString().split('.')[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = num2.toString().split('.')[1].length
  } catch (e) {
    r2 = 0
  }
  const m = Math.pow(10, Math.max(r1, r2))
  const n = r1 >= r2 ? r1 : r2
  return (Math.round(num1 * m - num2 * m) / m).toFixed(n)
}
