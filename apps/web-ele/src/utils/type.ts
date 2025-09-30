export type TableJsonTemplate = {
  column_option_code: string[];
  com: DefineComponent<any, any, any>;
  component_type: string;
  id: string;
  label: string;
  option: any;
  style: {
    textAlign: string;
  };
};
export type IdString = `${number}`;

export type PrintTemplateApiType = {
  column_option_code?: ColumnOptionCode[];
  component_type?: string;
  id: IdString;
  imageUrl?: string;
  style: Record<string, string> /** 目前只用到textAlign  */ & {
    textAlign: string;
  };
};
export const PRINT_TEMPLATE_OTHER_OPTION_CHILD = {
  id: '908',
  label: 'Divider',
  com: 'PrintDivider',
  component_type: 'PrintDivider',
  style: {},
  option: {},
};
export const PRINT_TEMPLATE_OTHER_OPTION_CHILD_RICH_TEXT = {
  id: '908',
  label: 'Divider',
  com: 'PrintRichTextEditor',
  component_type: 'PrintRichTextEditor',
  style: {},
  option: {},
};

export const PRINT_TEMPLATE_OTHER_OPTION = {
  id: `type-other`,
  name: 'other',
  children: [],
  isPenultimate: true,
};
