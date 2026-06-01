<script setup lang="ts">
import { Filter, ListFilter } from 'lucide-vue-next'
import type { TaskFilter, Priority } from '../types'

defineProps<{
  filter: TaskFilter
}>()

const emit = defineEmits<{
  (e: 'update:filter', filter: Partial<TaskFilter>): void
}>()

const statusOptions = [
  { value: 'all', label: '全部' },
  { value: 'pending', label: '待完成' },
  { value: 'overdue', label: '逾期' },
  { value: 'completed', label: '已完成' },
] as const

const priorityOptions = [
  { value: 'all', label: '全部' },
  { value: 'low', label: '低优先级' },
  { value: 'medium', label: '中优先级' },
  { value: 'high', label: '高优先级' },
] as const

function handleStatusChange(event: Event) {
  const target = event.target as HTMLSelectElement
  emit('update:filter', { status: target.value as TaskFilter['status'] })
}

function handlePriorityChange(event: Event) {
  const target = event.target as HTMLSelectElement
  emit('update:filter', { priority: target.value as 'all' | Priority })
}
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm p-4 mb-6 animate-slide-up">
    <div class="flex items-center gap-2 mb-4">
      <Filter class="w-5 h-5 text-primary" />
      <span class="font-medium text-gray-700">筛选任务</span>
    </div>
    <div class="flex flex-wrap gap-4">
      <div class="flex items-center gap-2">
        <ListFilter class="w-4 h-4 text-gray-400" />
        <select
          :value="filter.status"
          @change="handleStatusChange"
          class="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all cursor-pointer"
        >
          <option v-for="opt in statusOptions" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </option>
        </select>
      </div>
      <div class="flex items-center gap-2">
        <svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <select
          :value="filter.priority"
          @change="handlePriorityChange"
          class="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all cursor-pointer"
        >
          <option v-for="opt in priorityOptions" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>
