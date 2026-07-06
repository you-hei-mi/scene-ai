<template>
  <div
    ref="containerRef"
    class="overflow-auto"
    :style="{ height: `${height}px` }"
    @scroll="handleScroll"
  >
    <!-- 占位元素，撑开滚动区域的总高度 -->
    <div :style="{ height: `${totalHeight}px`, position: 'relative' }">
      <!-- 可见区域的列表项 -->
      <div
        v-for="item in visibleItems"
        :key="getKey(item.item)"
        :style="{
          position: 'absolute',
          top: `${item.offset}px`,
          width: '100%',
        }"
      >
        <slot :item="item.item" :index="item.index" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T">
/**
 * VirtualList 虚拟滚动组件
 *
 * 用于高效渲染长列表，只渲染可视区域内的元素，大幅减少 DOM 节点数量。
 * 适用于大数据量的列表渲染场景（如消息列表、用户列表等）。
 *
 * @example
 * <VirtualList :items="dataList" :item-height="60" :height="500">
 *   <template #default="{ item }">
 *     <div>{{ item.name }}</div>
 *   </template>
 * </VirtualList>
 */

/**
 * 组件 Props 定义
 */
interface Props {
  /** 列表数据数组 */
  items: T[]
  /** 每个列表项的固定高度（像素） */
  itemHeight: number
  /** 容器的可视高度（像素） */
  height: number
  /** 可视区域外额外渲染的项数，用于减少滚动时的闪烁 */
  overscan?: number
  /** 获取每项唯一 key 的函数，用于 v-for 优化 */
  getKey?: (item: T) => string | number
}

const props = withDefaults(defineProps<Props>(), {
  overscan: 5,
  getKey: (_item: T) => Math.random().toString(),
})

/**
 * 容器 DOM 引用
 */
const containerRef = ref<HTMLElement | null>(null)

/**
 * 当前滚动位置（顶部偏移量）
 */
const scrollTop = ref(0)

/**
 * 列表总高度
 */
const totalHeight = computed(() => props.items.length * props.itemHeight)

/**
 * 可视区域内渲染的起始索引
 */
const startIndex = computed(() => {
  const index = Math.floor(scrollTop.value / props.itemHeight) - props.overscan
  return Math.max(0, index)
})

/**
 * 可视区域内渲染的结束索引
 */
const endIndex = computed(() => {
  const visibleCount = Math.ceil(props.height / props.itemHeight)
  const index = startIndex.value + visibleCount + props.overscan * 2
  return Math.min(props.items.length, index)
})

/**
 * 可见区域的列表项数据
 */
const visibleItems = computed(() => {
  const result: { item: T, index: number, offset: number }[] = []
  for (let i = startIndex.value; i < endIndex.value; i++) {
    result.push({
      item: props.items[i],
      index: i,
      offset: i * props.itemHeight,
    })
  }
  return result
})

/**
 * 处理滚动事件，更新滚动位置
 * @param event - 滚动事件对象
 */
function handleScroll(event: Event) {
  const target = event.target as HTMLElement
  scrollTop.value = target.scrollTop
}

/**
 * 滚动到指定索引位置
 * @param index - 目标项索引
 */
function scrollToIndex(index: number) {
  if (containerRef.value) {
    containerRef.value.scrollTop = index * props.itemHeight
  }
}

/**
 * 暴露方法给父组件
 */
defineExpose({ scrollToIndex })
</script>
