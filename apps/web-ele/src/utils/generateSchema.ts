import { useI18n } from '@igourd/locales';

interface Item {}
// input
const generateInput = (item: Item) => {
  const fieldJson = {
    type: 'string',
    title: item.name,
    required: item.is_compulsory,
    'x-decorator': 'FormItem',
    'x-component': 'Input',
    'x-component-props': {},
  };
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
  return {
    type: 'string',
    title: item.name,
    required: item.is_compulsory,
    'x-decorator': 'FormItem',
    'x-component': 'Select',
    'x-component-props': {},
    enum: selectionOptions,
  };
};

export const generateSchema = (list) => {
  const obj = {};
  list.forEach((element) => {
    const type = element.type.value;
    if (type === 'INPUT') {
      obj[element.key] = generateInput(element);
    } else if (type === 'SELECT') {
      obj[element.key] = generateSelect(element);
    }
  });
  return obj;
};
