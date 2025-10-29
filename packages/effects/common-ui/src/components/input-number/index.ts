import { connect, mapProps, mapReadPretty, useField,useFieldSchema } from '@formily/vue';
import { ElInputNumber } from 'element-plus';

import { transformComponent } from '../__builtins__';
import { PreviewText } from '../preview-text';

export type InputNumberProps = typeof ElInputNumber;

const TransformElInputNumber = transformComponent<InputNumberProps>(
  ElInputNumber,
  {
    change: 'update:modelValue',
  },
);
const validationKeys = new Set([
  'exclusiveMaximum',
  'exclusiveMinimum',
  'max',
  'maximum',
  'min',
  'minimum',
]);

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

export const InputNumber = connect(
  TransformElInputNumber,
  mapProps(
    {
      value: 'modelValue',

      readOnly: 'readonly',
    },
    (props) => {
      // 默认 inputNumber
      const defaultInputNumbervalidator = {
        maximum: 6,
        // minimum: 0,
        // message: $t('ui.formRules.min-max-range', [0, 100]),
      };
      const field = useField();
      const schemaRef = useFieldSchema();
      let validator = schemaRef.value['x-validator'] || [];
      // 过滤掉空的
      validator = validator.filter((item: any) => !isEmpty(item));
      if (validator.length === 0) {
        validator.push(defaultInputNumbervalidator);
      } else {
        let isExist = true;
        validator.forEach((rule: any, index: number) => {
          if (checkProperties(rule)) {
            validator[index] = mergeValidationProperties(
              defaultInputNumbervalidator,
              rule,
            );
          } else {
            isExist = false;
          }
        });
        if (!isExist && !validator.some((v) => v.maximum)) {
          validator.push(defaultInputNumbervalidator);
        }
      }
      // console.log('validator input number', validator);
      field.value.setValidator( validator );
      let controlsPosition = 'right';

      if (props.controlsPosition) {
        controlsPosition = props.controlsPosition;
      }
      return {
        controls: Reflect.has(props, 'controls'),
        controlsPosition,
        modelValue: props.modelValue,
      };
    },
  ),
  mapReadPretty(PreviewText.Input),
);

export default InputNumber;
