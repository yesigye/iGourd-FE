<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

type Mode = 'DAILY' | 'HOUR' | 'MONTHLY' | 'WEEKLY';

type Props = {
  /** 禁用交互 */
  disabled?: boolean;
  /** 顶部右侧展示类型：'text' | 'mode-select' */
  headerRight?: 'mode-select' | 'text';

  hiddenPicker?: boolean;

  hoursPerRow?: number;

  /** 每行列数（优先 itemsPerRow，其次 hoursPerRow，否则按模式默认） */
  itemsPerRow?: number;

  /** 左侧说明 */
  label?: string;

  /** 模式：hour(0-23) / weekday(0-6) / monthday(1-31) / month(1-12) */
  mode?: Mode;
  /** 选中值数组（与 mode 对应） */
  modelValue?: number[];

  /** 下拉可选模式 */
  modeOptions?: Array<{ label: string; value: Mode }>;

  monthNames?: string[];

  /** 切换 mode 时是否清空（默认 true） */
  resetOnModeChange?: boolean;

  /** Formily 友好：value / onUpdate:value 同步支持 */
  value?: number[];
  /** 自定义星期/月份显示名 */
  weekdayNames?: string[];
};

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [], // ✅ require-default-prop
  value: undefined, // ✅ 定义默认（即使通常不同时使用）
  mode: 'HOUR',
  headerRight: 'text',
  modeOptions: () => [
    // { label: 'Hour', value: 'HOUR' },
    { label: 'Weekday', value: 'WEEKLY' },
    { label: 'Day', value: 'DAILY' },
    { label: 'Month', value: 'MONTHLY' },
  ],
  hiddenPicker: false,
  itemsPerRow: undefined,
  hoursPerRow: undefined,
  label: 'Promotion Period',
  disabled: false,
  resetOnModeChange: true,
  weekdayNames: () => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  monthNames: () => [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ],
});

const emit = defineEmits<{
  (e: 'update:modelValue', v: number[]): void;
  (e: 'update:value', v: number[]): void; // Formily
  (e: 'change', v: number[]): void;
  (e: 'item-click', payload: { selected: boolean; value: number }): void;
  (e: 'itemClick', payload: { selected: boolean; value: number }): void;
  (e: 'update:mode', v: Mode): void; // 受控模式
  (e: 'modeChange', v: Mode): void;
}>();

/** 当前模式（受控） */
const currentMode = computed<Mode>({
  get: () => props.mode!,
  set: (m) => {
    emit('update:mode', m);
    emit('modeChange', m);
  },
});

/** —— 保证 computed 一定 return：用函数封装 —— */
function getConfig(m: Mode) {
  if (m === 'HOUR') {
    return {
      size: 24,
      valueOf: (i: number) => i, // 0..23
      labelOf: String,
      isValid: (n: number) => Number.isInteger(n) && n >= 0 && n <= 23,
      defaultCols: 12,
      segmentText: (s: number, e: number) => {
        const pad2 = (x: number) => String(x).padStart(2, '0');
        const fmt = (h: number, end: boolean) =>
          `${pad2(h)}:${end ? '59' : '00'}`;
        return `${fmt(s, false)}-${fmt(e, true)}`;
      },
      ariaPrefix: 'hour',
    };
  }
  if (m === 'WEEKLY') {
    return {
      size: 7,
      valueOf: (i: number) => i, // 0..6
      labelOf: (i: number) => props.weekdayNames![i] ?? String(i),
      isValid: (n: number) => Number.isInteger(n) && n >= 0 && n <= 6,
      defaultCols: 7,
      segmentText: (s: number, e: number) => {
        const n = props.weekdayNames!;
        return s === e ? n[s] : `${n[s]}-${n[e]}`;
      },
      ariaPrefix: 'weekday',
    };
  }
  if (m === 'MONTHLY') {
    return {
      size: 31,
      valueOf: (i: number) => i + 1, // 1..31
      labelOf: (i: number) => String(i + 1),
      isValid: (n: number) => Number.isInteger(n) && n >= 1 && n <= 31,
      defaultCols: 7,
      segmentText: (s: number, e: number) => (s === e ? `${s}` : `${s}-${e}`),
      ariaPrefix: 'day',
    };
  }
  // month（兜底）
  return {
    size: 12,
    valueOf: (i: number) => i + 1, // 1..12
    labelOf: (i: number) => props.monthNames![i] ?? String(i + 1),
    isValid: (n: number) => Number.isInteger(n) && n >= 1 && n <= 12,
    defaultCols: 12,
    segmentText: (s: number, e: number) => {
      const n = props.monthNames!;
      const idx = (mm: number) => Math.max(1, Math.min(12, mm)) - 1;
      return s === e ? n[idx(s)] : `${n[idx(s)]}-${n[idx(e)]}`;
    },
    ariaPrefix: 'month',
  };
}
const cfg = computed(() => getConfig(currentMode.value)); // ✅ return-in-computed-property

/** 列数 */
const cols = computed(
  () => props.itemsPerRow ?? props.hoursPerRow ?? cfg.value.defaultCols,
);

/** 选中集合（兼容 modelValue/value；并保证合法域） */
const selected = computed<number[]>({
  get() {
    const raw = (props.modelValue ?? props.value ?? []) as number[];
    const valid = (raw ?? []).filter((element) => cfg.value.isValid(element));
    const uniq = [...new Set(valid)].sort((a, b) => a - b);
    return uniq;
  },
  set(v) {
    emit('update:modelValue', v);
    emit('update:value', v);
    emit('change', v);
  },
});

/** 切换 mode 时，清空或过滤越界 */
watch(currentMode, () => {
  selected.value = props.resetOnModeChange
    ? []
    : selected.value.filter((element) => cfg.value.isValid(element));
});

/** —— 交互：仅 mousedown，避免与 click 双触发 —— */
const has = (val: number) => selected.value.includes(val);

function toggleByKey(val: number) {
  if (props.disabled) return;
  const set = new Set(selected.value);
  const on = !set.has(val);
  on ? set.add(val) : set.delete(val);
  selected.value = [...set].sort((a, b) => a - b);
  emit('itemClick', { value: val, selected: on }); // ✅ kebab-case
}

const isDragging = ref(false);
const dragMode = ref<'add' | 'remove'>('add');

function onPress(i: number) {
  if (props.disabled) return;
  const val = cfg.value.valueOf(i);
  isDragging.value = true;
  dragMode.value = has(val) ? 'remove' : 'add';
  applyDrag(i); // 按下即切一次（=点击）
  emit('itemClick', { value: val, selected: dragMode.value === 'add' });
}
function onEnter(i: number) {
  if (props.disabled || !isDragging.value) return;
  applyDrag(i);
}
function applyDrag(i: number) {
  const val = cfg.value.valueOf(i);
  const set = new Set(selected.value);
  if (dragMode.value === 'add') set.add(val);
  else set.delete(val);
  const next = [...set].sort((a, b) => a - b);
  if (next.join(',') !== selected.value.join(',')) {
    selected.value = next;
  }
}
function stopDrag() {
  isDragging.value = false;
}

onMounted(() => {
  window.addEventListener('mouseup', stopDrag);
  window.addEventListener('mouseleave', stopDrag);
  window.addEventListener('blur', stopDrag);
});
onBeforeUnmount(() => {
  window.removeEventListener('mouseup', stopDrag);
  window.removeEventListener('mouseleave', stopDrag);
  window.removeEventListener('blur', stopDrag);
});

/** 顶部右侧：把选中值合并成连续段并格式化 */
const rangesText = computed(() => {
  const vals = selected.value;
  if (vals.length === 0) return '';
  const segs: Array<[number, number]> = [];
  let p = vals[0];
  let s = vals[0];
  for (let i = 1; i < vals.length; i++) {
    const v = vals[i];
    // @ts-ignore
    if (v === p + 1) {
      p = v;
      continue;
    }
    // @ts-ignore
    segs.push([s, p]);
    s = p = v;
  }
  // @ts-ignore
  segs.push([s, p]);
  return segs.map(([a, b]) => cfg.value.segmentText(a, b)).join(' ; ');
});
</script>

<template>
  <div class="w-full">
    <!-- 头部：左标题 + 右侧（文本 / 模式下拉） -->
    <div class="mb-2 grid grid-cols-[max-content_1fr] items-baseline gap-2">
      <div
        class="text-foreground shrink-0 self-start text-sm font-medium leading-5"
      >
        {{ label }}
      </div>

      <div class="justify-self-end text-right">
        <!-- 文本模式 -->
        <div
          v-if="headerRight === 'text'"
          class="text-primary whitespace-normal break-words text-sm leading-5"
        >
          <span v-if="rangesText.length > 0">{{ rangesText }}</span>
          <span v-else class="text-gray-400">—</span>
        </div>

        <!-- 模式下拉 -->
        <div v-else class="inline-flex items-center gap-2">
          <label class="text-foreground/70 text-xs">Type</label>
          <select
            class="text-foreground focus:ring-primary/50 rounded border border-slate-300 bg-white px-2 py-1 text-sm focus:outline-none focus:ring-2"
            :value="currentMode"
            @change="
              currentMode = ($event.target as HTMLSelectElement).value as Mode
            "
          >
            <option
              v-for="opt in modeOptions"
              :key="opt.value"
              :value="opt.value"
            >
              {{ opt.label }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- 单边框网格 -->
    <div
      v-if="!props.hiddenPicker"
      class="rounded border border-slate-300 bg-slate-300 p-[1px]"
    >
      <div
        class="grid gap-[1px] bg-slate-300"
        :style="{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }"
      >
        <button
          v-for="i in cfg.size"
          :key="i - 1"
          type="button"
          class="focus-visible:ring-primary/60 select-none rounded-[2px] py-1 text-center text-sm transition-colors focus:outline-none focus-visible:ring-2"
          :class="[
            disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
            selected.includes(cfg.valueOf(i - 1))
              ? 'bg-primary text-white'
              : 'text-foreground bg-white hover:bg-slate-100',
          ]"
          @mousedown.left.prevent="onPress(i - 1)"
          @mouseenter="onEnter(i - 1)"
          @keydown.enter.prevent="toggleByKey(cfg.valueOf(i - 1))"
          @keydown.space.prevent="toggleByKey(cfg.valueOf(i - 1))"
          role="switch"
          :aria-pressed="selected.includes(cfg.valueOf(i - 1))"
          :aria-label="`${cfg.ariaPrefix} ${cfg.valueOf(i - 1)}`"
        >
          {{ cfg.labelOf(i - 1) }}
        </button>
      </div>
    </div>
  </div>
</template>
