import { $t } from '@igourd/locales';

import { connect, mapProps, mapReadPretty, useFieldSchema } from '@formily/vue';
import { ElInput } from 'element-plus';

import { composeExport, transformComponent } from '../__builtins__';
import { PreviewText } from '../preview-text';

export type InputProps = typeof ElInput;
const validationKeys = new Set(['maxLength']);

const mergeValidationProperties = (target: any, source: any) => {
  Object.keys(source).forEach((key) => {
    if (validationKeys.has(key)) {
      target[key] = source[key];
    }
  });
  return target;
};
const isEmpty = (obj: any) => {
  return !obj || Object.keys(obj).length === 0;
};
const checkProperties = (source: any) => {
  if (isEmpty(source)) {
    return;
  }
  let flag = false;
  Object.keys(source).forEach((key) => {
    if (validationKeys.has(key)) {
      flag = true;
    }
  });
  return flag;
};

const defaultInputValidator = {
  maxLength: 128,
};
// 默认TextArea 校验    'x-component': 'Input.TextArea'
const defaultTextAreaValidator = {
  maxLength: 256,
};

const TransformElInput = transformComponent<InputProps>(ElInput, {
  change: 'update:modelValue',
});

const InnerInput = connect(
  TransformElInput,
  mapProps(
    {
      value: 'modelValue',
      readOnly: 'readonly',
    },
    (props) => {
      const bannedWords = [
        $t('common.banned-words-1'),
        $t('common.banned-words-2'),
      ];

      const handleBlur = (val: string) => {
        const includesBannedWors: string[] = [];
        console.log(bannedWords);
        bannedWords.forEach((keyword) => {
          if (val.includes(keyword)) {
            includesBannedWors.push(keyword);
          }
        });

        if (includesBannedWors.length > 0) {
          return $t('common.banned-words-label', {
            word: includesBannedWors.join('、'),
          });
        }
      };
      const customValidator = {
        bannedWords: true,
        triggerType: 'onBlur',
        validator: handleBlur,
      };
      const schemaRef = useFieldSchema();
      let validator = schemaRef.value['x-validator'] || [];
      // 过滤掉空的
      validator = validator.filter((item: any) => !isEmpty(item));
      if (validator.length === 0) {
        validator.push(defaultInputValidator);
      } else {
        let isExist = true;
        validator.forEach((rule: any, index: number) => {
          if (checkProperties(rule)) {
            validator[index] = mergeValidationProperties(
              defaultInputValidator,
              rule,
            );
          } else {
            isExist = false;
          }
        });

        if (!isExist && !validator.some((v: any) => v.maxLength)) {
          validator.push(defaultInputValidator);
        }
      }
      // 添加违禁词验证
      if (!validator.some((v: any) => v.bannedWords)) {
        validator.push(customValidator);
      }
      console.log('validator', validator);
      schemaRef.value.setProperties({ 'x-validator': validator });
      return props;
    },
  ),
  mapReadPretty(PreviewText.Input),
);

const TextArea = connect(
  InnerInput,
  mapProps((props) => {
    const bannedWords = [
      $t('common.banned-words-1'),
      $t('common.banned-words-2'),
    ];
    const handleBlur = (val: string) => {
      const includesBannedWors: string[] = [];
      bannedWords.forEach((keyword) => {
        if (val.includes(keyword)) {
          includesBannedWors.push(keyword);
        }
      });

      if (includesBannedWors.length > 0) {
        return $t('common.banned-words-label', {
          word: includesBannedWors.join('、'),
        });
      }
    };
    const customValidator = {
      bannedWords: true,
      triggerType: 'onBlur',
      validator: handleBlur,
    };
    const schemaRef = useFieldSchema();
    let validator = schemaRef.value['x-validator'] || [];
    // 过滤掉空的
    validator = validator.filter((item: any) => !isEmpty(item));
    if (validator.length === 0) {
      validator.push(defaultInputValidator);
    } else {
      let isExist = true;
      validator.forEach((rule: any, index: number) => {
        if (checkProperties(rule)) {
          validator[index] = mergeValidationProperties(
            defaultTextAreaValidator,
            rule,
          );
        } else {
          isExist = false;
        }
      });

      if (!isExist && !validator.some((v) => v.maxLength)) {
        validator.push(defaultTextAreaValidator);
      }
    }
    // 添加违禁词验证
    if (!validator.some((v: any) => v.bannedWords)) {
      validator.push(customValidator);
    }
    schemaRef.value.setProperties({ 'x-validator': validator });

    return {
      resize: 'none',
      ...props,
      type: 'textarea',
    };
  }),
  mapReadPretty(PreviewText.Input),
);

export const Input = composeExport(InnerInput, {
  TextArea,
});

export default Input;
