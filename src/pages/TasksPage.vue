<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Plus, ClipboardList, Home } from 'lucide-vue-next'
import { useTasksStore } from '../stores/tasks'
import type { Task, TaskFilter } from '../types'
import TaskList from '../components/TaskList.vue'
import TaskForm from '../components/TaskForm.vue'
import FilterBar from '../components/FilterBar.vue'
import StatsPanel from '../components/StatsPanel.vue'

const router = useRouter()
const store = useTasksStore()
const showForm = ref(false)
const editingTask = ref<Task | null>(null)

onMounted(() => {
  store.loadTasks()
})

const filterApplied = computed(() => {
  return store.filter.status !== 'all' || store.filter.priority !== 'all'
})

function handleAddTask() {
  editingTask.value = null
  showForm.value = true
}

function handleEditTask(task: Task) {
  editingTask.value = task
  showForm.value = true
}

function handleSubmitTask(data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) {
  if (editingTask.value) {
    store.updateTask(editingTask.value.id, data)
  } else {
    store.addTask(data)
  }
  showForm.value = false
}

function handleDeleteTask(id: string) {
  if (confirm('确定要删除这个任务吗？')) {
    store.deleteTask(id)
  }
}

function handleFilterChange(filter: Partial<TaskFilter>) {
  store.setFilter(filter)
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
    <header class="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40">
      <div class="max-w-6xl mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <button
              class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all hidden sm:block"
              @click="router.push('/')"
            >
              <Home class="w-5 h-5" />
            </button>
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
              <ClipboardList class="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-800">任务管理</h1>
              <p class="text-xs text-gray-500">高效管理你的日常任务</p>
            </div>
          </div>
          <button
            class="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all font-medium shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
            @click="handleAddTask"
          >
            <Plus class="w-5 h-5" />
            <span class="hidden sm:inline">创建任务</span>
          </button>
        </div>
      </div>
    </header>

    <main class="max-w-6xl mx-auto px-4 py-6">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2">
          <FilterBar :filter="store.filter" @update:filter="handleFilterChange" />
          <TaskList
            :tasks="store.filteredTasks"
            :filter-applied="filterApplied"
            @toggle="store.toggleTask"
            @edit="handleEditTask"
            @delete="handleDeleteTask"
          />
        </div>

        <div class="lg:col-span-1">
          <div class="sticky top-24">
            <StatsPanel :stats="store.stats" />
          </div>
        </div>
      </div>
    </main>

    <TaskForm
      :visible="showForm"
      :task="editingTask"
      @submit="handleSubmitTask"
      @cancel="showForm = false"
    />
  </div>
</template>
