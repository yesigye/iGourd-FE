import { transformComponent } from '../__builtins__';
import { connect, mapProps, mapReadPretty, useFieldSchema } from '@formily/vue';
import { ElInputNumber } from 'element-plus';
import { PreviewText } from '../preview-text';
import { $t } from '@igourd/locales';
export type InputNumberProps = typeof ElInputNumber;

const TransformElInputNumber = transformComponent<InputNumberProps>(
  ElInputNumber,
  {
    change: 'update:modelValue',
  },
);
const validationKeys = [
  'max',
  'maximum',
  'exclusiveMaximum',
  'exclusiveMinimum',
  'minimum',
  'min',
];

const mergeValidationProperties = (target: any, source: any) => {
  Object.keys(source).forEach((key) => {
    if (validationKeys.includes(key)) {
      target[key] = source[key];
    }
  });
  return target;
};
const checkProperties = (source: any) => {
  let flag = false;
  Object.keys(source).forEach((key) => {
    if (validationKeys.includes(key)) {
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
        maximum: 100,
        minimum: 0,
        message: $t('ui.formRules.min-max-range', [0, 100]),
      };
      const schemaRef = useFieldSchema();
      const validator = schemaRef.value['x-validator'] || [];
      if (validator.length == 0) {
        validator.push(defaultInputNumbervalidator);
      } else {
        validator.forEach((rule: any, index: number) => {
          if (checkProperties(rule)) {
            validator[index] = mergeValidationProperties(
              defaultInputNumbervalidator,
              rule,
            );
          }
        });
      }
      // schemaRef.value['x-validator'] = validator;
      schemaRef.value.setProperties('x-validator',validator);
      console.log(schemaRef.value['x-validator'] )
      let controlsPosition = 'right';
      if (props.controlsPosition) {
        controlsPosition = props.controlsPosition;
      }
      return {
        controlsPosition,
        modelValue: props.modelValue,
      };
    },
  ),
  mapReadPretty(PreviewText.Input),
);

export default InputNumber;
