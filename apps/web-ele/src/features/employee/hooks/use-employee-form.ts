import { computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdForm } from '@igourd/common-ui';
import { employeeApi } from '../apis';
import type { ISchema } from '@igourd/common-ui';

// 定义表单数据类型
interface EmployeeFormData {
  add_user_source_type: string;
  type: string;
  name: string;
  login_id: string;
  password: string;
  repeatPassword: string;
  email: string;
  phone_number: string;
  country_area_code: string;
  country_id: string;
  role_id: string;
  email_verification_code: string;
  sms_verification_code: string;
}

export function useEmployeeForm() {
  const { t } = useI18n();

  // 表单 Schema - 基于原有的员工表单结构
  const formSchema: ISchema = {
    type: 'object',
    properties: {
      // 用户来源类型选择
      add_user_source_type: {
        type: 'string',
        title: "{{t('employee.userSourceType')}}",
        required: true,
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Radio',
        'x-component-props': {
          options: [
            { label: "{{t('employee.createExistedUser')}}", value: 'PLATFORM_EXISTED_USER' },
            { label: "{{t('employee.createNewUser')}}", value: 'PLATFORM_NEW_REGISTER_USER' },
          ],
        },
        'x-validator': [
          {
            required: true,
            message: "{{t('employee.pleaseSelectUserSourceType')}}",
          },
        ],
        'x-reactions': [
          {
            dependencies: ['.'],
            fulfill: {
              state: {
                'password.visible': '{{$self.value === "PLATFORM_NEW_REGISTER_USER"}}',
                'repeatPassword.visible': '{{$self.value === "PLATFORM_NEW_REGISTER_USER"}}',
                'email_verification_code.visible': '{{$self.value === "PLATFORM_NEW_REGISTER_USER"}}',
                'sms_verification_code.visible': '{{$self.value === "PLATFORM_NEW_REGISTER_USER"}}',
              },
            },
          },
        ],
      },

      // 已存在用户表单
      existedUserForm: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('employee.existedUserInformation')}}",
          defaultOpen: true,
        },
        properties: {
          type: {
            type: 'string',
            title: "{{t('employee.accountType')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Radio',
            'x-component-props': {
              options: [
                { label: "{{t('employee.loginId')}}", value: 'LOGIN_ID' },
                { label: "{{t('employee.email')}}", value: 'EMAIL' },
                { label: "{{t('employee.phoneNumber')}}", value: 'PHONE_NUMBER' },
              ],
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('employee.pleaseSelectAccountType')}}",
              },
            ],
          },
          email: {
            type: 'string',
            title: "{{t('employee.email')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Input',
            'x-component-props': {
              placeholder: "{{t('employee.pleaseInputEmail')}}",
              clearable: true,
            },
            'x-validator': [
              {
                format: 'email',
                message: "{{t('employee.pleaseEnterValidEmail')}}",
              },
            ],
          },
          phone_number: {
            type: 'string',
            title: "{{t('employee.phoneNumber')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Input',
            'x-component-props': {
              placeholder: "{{t('employee.pleaseInputPhoneNumber')}}",
              clearable: true,
            },
            'x-validator': [
              {
                pattern: /^[0-9]+$/,
                message: "{{t('employee.pleaseEnterValidPhoneNumber')}}",
              },
            ],
          },
          login_id: {
            type: 'string',
            title: "{{t('employee.loginId')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Input',
            'x-component-props': {
              placeholder: "{{t('employee.pleaseInputLoginId')}}",
              clearable: true,
            },
          },
          email_verification_code: {
            type: 'string',
            title: "{{t('employee.emailVerificationCode')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Input',
            'x-component-props': {
              placeholder: "{{t('employee.pleaseInputEmailVerificationCode')}}",
              clearable: true,
            },
          },
          sms_verification_code: {
            type: 'string',
            title: "{{t('employee.smsVerificationCode')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Input',
            'x-component-props': {
              placeholder: "{{t('employee.pleaseInputSmsVerificationCode')}}",
              clearable: true,
            },
          },
        },
      },

      // 新注册用户表单
      newUserForm: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('employee.newUserInformation')}}",
          defaultOpen: true,
        },
        properties: {
          name: {
            type: 'string',
            title: "{{t('employee.name')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Input',
            'x-component-props': {
              placeholder: "{{t('employee.pleaseInputName')}}",
              maxlength: 50,
              clearable: true,
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('employee.pleaseInputName')}}",
              },
              {
                max: 50,
                message: "{{t('employee.nameTooLong')}}",
              },
            ],
          },
          login_id: {
            type: 'string',
            title: "{{t('employee.loginId')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Input',
            'x-component-props': {
              placeholder: "{{t('employee.pleaseInputLoginId')}}",
              clearable: true,
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('employee.pleaseInputLoginId')}}",
              },
            ],
          },
          password: {
            type: 'string',
            title: "{{t('employee.password')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Password',
            'x-component-props': {
              placeholder: "{{t('employee.pleaseInputPassword')}}",
              showPassword: true,
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('employee.pleaseInputPassword')}}",
              },
              {
                min: 6,
                message: "{{t('employee.passwordTooShort')}}",
              },
            ],
          },
          repeatPassword: {
            type: 'string',
            title: "{{t('employee.repeatPassword')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Password',
            'x-component-props': {
              placeholder: "{{t('employee.pleaseInputRepeatPassword')}}",
              showPassword: true,
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('employee.pleaseInputRepeatPassword')}}",
              },
              {
                validator: (value, rule, callback) => {
                  const password = formApi.getValues().password;
                  if (value !== password) {
                    callback(new Error(t('employee.passwordNotMatch')));
                  } else {
                    callback();
                  }
                },
              },
            ],
          },
          email: {
            type: 'string',
            title: "{{t('employee.email')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Input',
            'x-component-props': {
              placeholder: "{{t('employee.pleaseInputEmail')}}",
              clearable: true,
            },
            'x-validator': [
              {
                format: 'email',
                message: "{{t('employee.pleaseEnterValidEmail')}}",
              },
            ],
          },
          phone_number: {
            type: 'string',
            title: "{{t('employee.phoneNumber')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Input',
            'x-component-props': {
              placeholder: "{{t('employee.pleaseInputPhoneNumber')}}",
              clearable: true,
            },
            'x-validator': [
              {
                pattern: /^[0-9]+$/,
                message: "{{t('employee.pleaseEnterValidPhoneNumber')}}",
              },
            ],
          },
        },
      },

      // 角色和地区信息
      roleAndRegionInfo: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('employee.roleAndRegion')}}",
          defaultOpen: true,
        },
        properties: {
          role_id: {
            type: 'string',
            title: "{{t('employee.role')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Select',
            'x-component-props': {
              placeholder: "{{t('employee.pleaseSelectRole')}}",
              filterable: true,
              clearable: true,
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('employee.pleaseSelectRole')}}",
              },
            ],
          },
          country_area_code: {
            type: 'string',
            title: "{{t('employee.countryAreaCode')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Select',
            'x-component-props': {
              placeholder: "{{t('employee.pleaseSelectCountryAreaCode')}}",
              filterable: true,
              clearable: true,
            },
          },
          country_id: {
            type: 'string',
            title: "{{t('employee.country')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Select',
            'x-component-props': {
              placeholder: "{{t('employee.pleaseSelectCountry')}}",
              filterable: true,
              clearable: true,
            },
          },
        },
      },
    },
  };

  // 使用 useIgourdForm
  const { Form, formApi } = useIgourdForm({
    schema: formSchema,
    initialValues: {
      add_user_source_type: 'PLATFORM_EXISTED_USER',
      type: 'LOGIN_ID',
      name: '',
      login_id: '',
      password: '',
      repeatPassword: '',
      email: '',
      phone_number: '',
      country_area_code: '',
      country_id: '',
      role_id: '',
      email_verification_code: '',
      sms_verification_code: '',
    },
    useI18n
  });

  // 表单提交处理
  const handleSubmit = async (values: EmployeeFormData) => {
    try {
      // 根据用户来源类型处理不同的表单数据
      let formattedValues = { ...values };

      if (values.add_user_source_type === 'PLATFORM_EXISTED_USER') {
        // 已存在用户，移除新用户特有字段
        delete formattedValues.name;
        delete formattedValues.password;
        delete formattedValues.repeatPassword;
      } else {
        // 新注册用户，移除已存在用户特有字段
        delete formattedValues.email_verification_code;
        delete formattedValues.sms_verification_code;
      }

      // 调用 API
      const response = await employeeApi.createOrUpdateEmployee(formattedValues);
      return response;
    } catch (error) {
      console.error('Employee form submission error:', error);
      throw error;
    }
  };

  // 表单重置
  const resetForm = () => {
    formApi.reset();
  };

  // 表单验证
  const validateForm = async () => {
    return await formApi.validate();
  };

  // 设置表单值
  const setFormValues = (values: Partial<EmployeeFormData>) => {
    formApi.setValues(values);
  };

  // 获取表单值
  const getFormValues = () => {
    return formAPI.values
  };

  // 生成登录ID
  const generateLoginId = () => {
    const randomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    formApi.setValues({
      login_id: randomId,
    });
  };

  return {
    // 组件
    Form,
    formApi,

    // 配置
    formSchema,

    // 方法
    handleSubmit,
    resetForm,
    validateForm,
    setFormValues,
    getFormValues,
    generateLoginId,
  };
}
