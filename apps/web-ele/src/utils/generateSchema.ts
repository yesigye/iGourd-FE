import { useI18n } from '@igourd/locales';

interface Item {}
// input
const generateInput = (item: Item) => {
  const fieldJson = {
    type: 'string',
    title: item.name,
    'x-decorator': 'FormItem',
    'x-component': 'Input',
    'x-component-props': {
      placeholder: item.name,
    },
  };
  if (item.is_compulsory) {
    fieldJson['x-validator'] = [
      {
        required: true,
      },
    ];
  }

  return fieldJson;
};
// select
const generateSelect = (item: Item) => {
  const selectionOptions = [];
  if (item.options) {
    const options = JSON.parse(item.options);
    options.forEach((option) => {
      selectionOptions.push({
        value: option,
        label: option,
      });
    });
  }
  const fieldJson = {
    type: 'string',
    title: item.name,
    'x-decorator': 'FormItem',
    'x-component': 'Select',
    'x-component-props': {
      style: {
        'min-width': '100px',
      },
    },
    enum: selectionOptions,
  };
  if (item.is_compulsory) {
    fieldJson['x-validator'] = [
      {
        required: true,
      },
    ];
  }
  return fieldJson;
};
const createLayout = (key, properties) => {

  const obj = {
    type: 'void',
    'x-component': 'FormLayout',
    'x-component-props': {
      labelCol: 6,
      wrapperCol: 14,
    },
    properties:{}
  };
  obj.properties[key] = properties
  return obj;
};

export const generateSchema = (list) => {
  const obj = {};
  list.forEach((element) => {
    const type = element.type;
    const keyString = element.key + '__layout';
    if (type === 'INPUT') {
      obj[keyString] = createLayout(element.key, generateInput(element));
    } else if (type === 'SELECT') {
      obj[keyString] = createLayout(element.key, generateSelect(element));
    }
  });
  return obj;
};
