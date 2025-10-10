<script lang="tsx">
import type { Placement } from 'element-plus';

import type { CSSProperties, PropType, VNodeChild } from 'vue';

import type { JSX } from '#/common/typeing';

import { computed, defineComponent, unref } from 'vue';

import { QuestionFilled } from '@element-plus/icons-vue';
import { ElIcon, ElTooltip } from 'element-plus';

import { getPopupContainer } from '#/common/utils';
import { getSlot } from '#/common/utils/helper/tsxHelper';
import { isString } from '#/common/utils/is';

const props = {
  /**
   * Help text max-width
   * @default: 600px
   */
  maxWidth: { type: String, default: '600px' },
  /**
   * Whether to display the serial number
   * @default: false
   */
  showIndex: { type: Boolean },
  /**
   * Help text font color
   * @default: #ffffff
   */
  color: { type: String, default: '#ffffff' },
  /**
   * Help text font size
   * @default: 14px
   */
  fontSize: { type: String, default: '14px' },
  /**
   * Help text list
   */
  placement: { type: String as PropType<Placement>, default: 'right' },
  /**
   * Help text list
   */
  text: {
    type: [Array, String, Object] as PropType<
      JSX.Element | string | string[] | VNodeChild
    >,
  },
};

export default defineComponent({
  name: 'BasicHelp',
  components: { ElTooltip },
  props,
  setup(props, { slots }) {
    // const getTooltipStyle = computed((): CSSProperties => ({ color: props.color, fontSize: props.fontSize }));

    const getOverlayStyle = computed(
      (): CSSProperties => ({ maxWidth: props.maxWidth }),
    );

    function renderTitle() {
      const textList = props.text;

      if (isString(textList)) return textList;
    }

    return () => {
      return (
        <ElTooltip
          autoAdjustOverflow={true}
          content={renderTitle()}
          getPopupContainer={() => getPopupContainer()}
          overlayClassName="overlay-class"
          overlayStyle={unref(getOverlayStyle)}
          placement={props.placement as 'right'}
        >
          <span class="ml-1.5">
            {getSlot(slots) || (
              <ElIcon color={'#7D90B2'} size={18}>
                <QuestionFilled />
              </ElIcon>
            )}
          </span>
        </ElTooltip>
      );
    };
  },
});
</script>

<style>
.overlay-class {
  p {
    margin-bottom: 0;
  }
}
</style>
