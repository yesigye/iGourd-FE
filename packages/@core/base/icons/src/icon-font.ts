import { defineComponent, h } from 'vue';

const IconFontIcon = defineComponent({
  name: `IconFontIcon`,
  props: {
    icon: {
      type: String,
      reuired: true,
    },
  },
  setup(props, { attrs }) {
    return () =>
      h('i', { ...props, ...attrs, class: ['iconfont', props.icon] });
  },
});

export { IconFontIcon };
