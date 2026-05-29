<script setup lang="ts">
import { Pencil, Trash2, CheckCircle2, Circle } from 'lucide-vue-next'
import type { Task } from '../types'

defineProps<{
  task: Task
}>()

const emit = defineEmits<{
  (e: 'toggle', id: string): void
  (e: 'edit', task: Task): void
  (e: 'delete', id: string): void
}>()

const priorityConfig = {
  low: { label: '低', class: 'bg-gray-100 text-gray-600' },
  medium: { label: '中', class: 'bg-yellow-100 text-yellow-700' },
  high: { label: '高', class: 'bg-red-100 text-red-600' },
}

function formatDate(timestamp: number): string {
  const date = new Date(timestamp)
  return date.toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<template>
  <div
    class="bg-white rounded-xl shadow-sm p-5 transition-all duration-300 hover:shadow-md animate-slide-up cursor-pointer"
    :class="{ 'opacity-60': task.completed }"
    @click="emit('toggle', task.id)"
  >
    <div class="flex items-start gap-4">
      <button
        class="flex-shrink-0 mt-1 transition-transform hover:scale-110"
        @click.stop="emit('toggle', task.id)"
      >
        <CheckCircle2
          v-if="task.completed"
          class="w-6 h-6 text-success"
        />
        <Circle v-else class="w-6 h-6 text-gray-300 hover:text-primary transition-colors" />
      </button>

      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-1">
          <span
            class="px-2 py-0.5 text-xs font-medium rounded-full"
            :class="priorityConfig[task.priority].class"
          >
            {{ priorityConfig[task.priority].label }}优先级
          </span>
          <span class="text-xs text-gray-400">
            {{ formatDate(task.updatedAt) }}
          </span>
        </div>

        <h3
          class="text-base font-medium mb-2 transition-all"
          :class="task.completed ? 'line-through text-gray-400' : 'text-gray-800'"
        >
          {{ task.title }}
        </h3>

        <p
          v-if="task.description"
          class="text-sm text-gray-500 line-clamp-2"
          :class="{ 'line-through': task.completed }"
        >
          {{ task.description }}
        </p>
      </div>

      <div class="flex-shrink-0 flex items-center gap-2">
        <button
          class="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
          @click.stop="emit('edit', task)"
        >
          <Pencil class="w-4 h-4" />
        </button>
        <button
          class="p-2 text-gray-400 hover:text-danger hover:bg-danger/5 rounded-lg transition-all"
          @click.stop="emit('delete', task.id)"
        >
          <Trash2 class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</template>
