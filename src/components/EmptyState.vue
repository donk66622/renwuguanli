<script setup lang="ts">
import { ClipboardList } from 'lucide-vue-next'

defineProps<{
  filterApplied?: boolean
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center py-16 animate-fade-in">
    <div class="relative mb-6">
      <div class="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
        <ClipboardList class="w-12 h-12 text-primary/60" />
      </div>
      <div class="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-success flex items-center justify-center animate-pulse-slow">
        <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
      </div>
    </div>
    <h3 class="text-xl font-semibold text-gray-700 mb-2">
      {{ filterApplied ? '没有匹配的任务' : '还没有任务' }}
    </h3>
    <p class="text-gray-500 text-center max-w-xs">
      {{ filterApplied ? '尝试调整筛选条件，看看其他任务吧' : '点击下方按钮创建你的第一个任务' }}
    </p>
  </div>
</template>
