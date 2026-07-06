<script setup lang="ts">
// 根布局组件，目前仅作为插槽容器，后续可扩展全局导航或通知
</script>

<template>
    <div class="ic-root-layout">
        <slot />
    </div>
</template>

<style scoped>
.ic-root-layout {
    min-height: 100vh;
}
</style>
