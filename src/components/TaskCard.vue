<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Trash2, CheckCircle2, Circle } from 'lucide-vue-next'
import type { Task } from '../types'

const props = defineProps<{
  task: Task
}>()

const emit = defineEmits<{
  (e: 'toggle', id: string): void
  (e: 'delete', id: string): void
  (e: 'drag-start', id: string, event: DragEvent): void
  (e: 'drag-end'): void
}>()

const router = useRouter()
const isDragging = ref(false)
const hasDragged = ref(false)

function handleDragStart(e: DragEvent) {
  isDragging.value = true
  hasDragged.value = true
  emit('drag-start', props.task.id, e)
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', props.task.id)
  }
}

function handleDragEnd(e: DragEvent) {
  isDragging.value = false
  emit('drag-end')
  setTimeout(() => {
    hasDragged.value = false
  }, 100)
}

function handleClick() {
  if (!hasDragged.value) {
    router.push(`/tasks/${props.task.id}`)
  }
}

function handleToggle(e: Event) {
  e.stopPropagation()
  emit('toggle', props.task.id)
}

function handleDelete(e: Event) {
  e.stopPropagation()
  emit('delete', props.task.id)
}

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

function formatSimpleDate(dateString: string | null): string {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function isOverdue(dueDate: string | null, completed: boolean): boolean {
  if (!dueDate || completed) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const due = new Date(dueDate)
  return due < today
}
</script>

<template>
  <div
    :draggable="true"
    class="bg-white rounded-xl shadow-sm p-5 transition-all duration-200 hover:shadow-md animate-slide-up select-none cursor-pointer"
    :class="{
      'opacity-60': task.completed,
      'cursor-grabbing scale-105 shadow-lg': isDragging,
    }"
    @click="handleClick"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
  >
    <div class="flex items-start gap-4">
      <button
        class="flex-shrink-0 mt-1 transition-transform hover:scale-110"
        @click.stop="handleToggle"
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

        <div v-if="task.startDate || task.dueDate" class="flex flex-wrap gap-2 mt-2">
          <div
            v-if="task.startDate"
            class="flex items-center gap-1 text-xs text-gray-400"
          >
            <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            开始: {{ formatSimpleDate(task.startDate) }}
          </div>
          <div
            v-if="task.dueDate"
            class="flex items-center gap-1 text-xs"
            :class="isOverdue(task.dueDate, task.completed) ? 'text-danger' : 'text-gray-400'"
          >
            <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            截止: {{ formatSimpleDate(task.dueDate) }}
            <span v-if="isOverdue(task.dueDate, task.completed)" class="ml-1">(已逾期)</span>
          </div>
        </div>
      </div>

      <div class="flex-shrink-0">
        <button
          class="p-2 text-gray-400 hover:text-danger hover:bg-danger/5 rounded-lg transition-all"
          @click.stop="handleDelete"
          title="删除任务"
        >
          <Trash2 class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</template>
