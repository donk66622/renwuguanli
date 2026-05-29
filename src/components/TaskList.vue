<script setup lang="ts">
import type { Task } from '../types'
import TaskCard from './TaskCard.vue'
import EmptyState from './EmptyState.vue'

defineProps<{
  tasks: Task[]
  filterApplied: boolean
}>()

const emit = defineEmits<{
  (e: 'toggle', id: string): void
  (e: 'edit', task: Task): void
  (e: 'delete', id: string): void
}>()
</script>

<template>
  <div>
    <TransitionGroup name="list" tag="div" class="space-y-4">
      <TaskCard
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        @toggle="emit('toggle', $event)"
        @edit="emit('edit', $event)"
        @delete="emit('delete', $event)"
      />
    </TransitionGroup>

    <EmptyState v-if="tasks.length === 0" :filter-applied="filterApplied" />
  </div>
</template>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.list-move {
  transition: transform 0.3s ease;
}
</style>
