<script lang="tsx">
// import type { PropType, VNodeChild } from 'vue';
// import type { JSX } from '@/common/typeing';
import { defineComponent } from 'vue';

import { ElButton, ElTooltip } from 'element-plus';

import { getSlot } from '#/common/utils/helper/tsxHelper';

const props = {
  icon: { type: String },

  type: { type: String, default: 'primary' },
  height: { type: String, default: '36px' },

  // /**
  //  * Help text max-width
  //  * @default: 600px
  //  */
  // maxWidth: { type: String, default: '600px' },
  // /**
  //  * Whether to display the serial number
  //  * @default: false
  //  */
  // showIndex: { type: Boolean },
  // /**
  //  * Help text font color
  //  * @default: #ffffff
  //  */
  // color: { type: String, default: '#ffffff' },
  // /**
  //  * Help text font size
  //  * @default: 14px
  //  */
  // fontSize: { type: String, default: '14px' },
  // /**
  //  * Help text list
  //  */
  // placement: { type: String as PropType<Placement>, default: 'right' },
  // /**
  //  * Help text list
  //  */
  // text: {
  //   type: [Array, String, Object] as PropType<string[] | string | VNodeChild | JSX.Element>
  // }
};

export default defineComponent({
  name: 'BasicButton',
  components: { ElTooltip, ElButton },
  props,
  setup(props, { slots }) {
    const { icon, height, ...other } = props;

    const style = { height };

    function renderIcon(icon?: string) {
      if (icon) {
        return <i class={['iconfont', icon]} />;
      }
      return '';
    }

    return () => {
      return (
        <ElButton {...other} class="basic-button" style={style}>
          {{
            icon: () => renderIcon(icon),
            default: () => getSlot(slots),
          }}
        </ElButton>
      );
    };
  },
});
</script>

<style lang="scss" scoped>
.basic-button {
  padding: 0 12px;

  .iconfont {
    font-size: 14px;
  }
}
</style>
