import { connect, mapProps, mapReadPretty, useFieldSchema } from '@formily/vue';
import { ElInput } from 'element-plus';

import { composeExport, transformComponent } from '../__builtins__';
import { PreviewText } from '../preview-text';

export type InputProps = typeof ElInput;

const validationKeys = new Set(['max']);

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
// 默认TextArea 校验    'x-component': 'Input.TextArea'
const defaultTextAreaValidator = {
  maxLength: 512,
  message: '不能超过{max}个字符',
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
      const defaultInputValidator = {
        maxLength: 2,
        message: '不能超过{{maxLength}}个字符',
      };

      const schemaRef = useFieldSchema();
      const validator = schemaRef.value['x-validator'] || [];
      if (validator.length === 0) {
        validator.push(defaultInputValidator);
      } else {
        validator.forEach((rule: any, index: number) => {
          if (checkProperties(rule)) {
            validator[index] = mergeValidationProperties(
              defaultInputValidator,
              rule,
            );
          }
        });
      }
      // schemaRef.value['x-validator'] = validator;
      schemaRef.value.setProperties({ 'x-validator': validator });
      return props;
    },
  ),
  mapReadPretty(PreviewText.Input),
);

const TextArea = connect(
  InnerInput,
  mapProps((props) => {
    return {
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
