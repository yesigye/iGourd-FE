<script lang="tsx">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'DrawerClose',
  props: {},
  emits: ['close'],
  setup(props, { emit }) {
    const handleClose = () => {
      emit('close');
    };
    return () => {
      return (
        <div class="close-icon" onClick={handleClose}>
          <i class="iconfont icon-guanbi" />
        </div>
      );
    };
  },
});
</script>
<style lang="scss" scoped>
.close-icon {
  position: absolute;
  top: 50%;
  left: -30px;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  cursor: pointer;
  background-color: #fff;
  border-radius: 50%;
  transform: translateY(-30px);

  .icon-guanbi {
    font-size: 20px;
    color: #f00;
  }
}
</style>
