<script setup lang="ts">
import { ref } from 'vue'
import type { Task } from '../types'
import TaskCard from './TaskCard.vue'
import EmptyState from './EmptyState.vue'

const props = defineProps<{
  tasks: Task[]
  filterApplied: boolean
}>()

const emit = defineEmits<{
  (e: 'toggle', id: string): void
  (e: 'delete', id: string): void
  (e: 'reorder', newOrder: Task[]): void
}>()

const dragOverIndex = ref<number | null>(null)
const draggingId = ref<string | null>(null)

function handleDragStart(taskId: string) {
  draggingId.value = taskId
}

function handleDragEnd() {
  draggingId.value = null
  dragOverIndex.value = null
}

function handleDragOver(e: DragEvent, index: number) {
  e.preventDefault()
  if (draggingId.value) {
    dragOverIndex.value = index
  }
}

function handleDragLeave() {
  dragOverIndex.value = null
}

function handleDrop(e: DragEvent, targetIndex: number) {
  e.preventDefault()
  if (draggingId.value === null) return
  
  const dragIndex = props.tasks.findIndex(t => t.id === draggingId.value)
  if (dragIndex === -1 || dragIndex === targetIndex) {
    dragOverIndex.value = null
    draggingId.value = null
    return
  }

  const newTasks = [...props.tasks]
  const [draggedTask] = newTasks.splice(dragIndex, 1)
  newTasks.splice(targetIndex, 0, draggedTask)
  
  emit('reorder', newTasks)
  dragOverIndex.value = null
  draggingId.value = null
}
</script>

<template>
  <div class="space-y-4">
    <div
      v-for="(task, index) in tasks"
      :key="task.id"
      class="transition-all duration-200"
      :class="{
        'opacity-50': draggingId === task.id,
      }"
      @dragover="handleDragOver($event, index)"
      @dragleave="handleDragLeave"
      @drop="handleDrop($event, index)"
    >
      <div
        v-if="dragOverIndex === index && draggingId !== task.id"
        class="h-2 bg-primary rounded-full mb-2"
      ></div>
      <TaskCard
        :task="task"
        @toggle="emit('toggle', $event)"
        @delete="emit('delete', $event)"
        @drag-start="handleDragStart"
        @drag-end="handleDragEnd"
      />
    </div>

    <EmptyState v-if="tasks.length === 0" :filter-applied="filterApplied" />
  </div>
</template>
