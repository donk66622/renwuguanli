<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowLeft, Pencil, Trash2, CheckCircle2, Circle, Calendar, AlertCircle } from 'lucide-vue-next'
import { useTasksStore } from '../stores/tasks'
import type { Priority } from '../types'

const router = useRouter()
const route = useRoute()
const store = useTasksStore()

const taskId = route.params.id as string
const task = computed(() => store.tasks.find(t => t.id === taskId))

const isEditing = ref(false)
const editedTitle = ref('')
const editedDescription = ref('')
const editedPriority = ref<Priority>('medium')
const editedStartDate = ref<string | null>(null)
const editedDueDate = ref<string | null>(null)

function startEdit() {
  if (task.value) {
    editedTitle.value = task.value.title
    editedDescription.value = task.value.description
    editedPriority.value = task.value.priority
    editedStartDate.value = task.value.startDate
    editedDueDate.value = task.value.dueDate
    isEditing.value = true
  }
}

function cancelEdit() {
  isEditing.value = false
}

function saveEdit() {
  if (task.value && editedTitle.value.trim()) {
    store.updateTask(task.value.id, {
      title: editedTitle.value.trim(),
      description: editedDescription.value.trim(),
      priority: editedPriority.value,
      startDate: editedStartDate.value,
      dueDate: editedDueDate.value,
    })
    isEditing.value = false
  }
}

function deleteTask() {
  if (task.value && confirm('确定要删除这个任务吗？')) {
    store.deleteTask(task.value.id)
    router.push('/tasks')
  }
}

function toggleComplete() {
  if (task.value) {
    store.toggleTask(task.value.id)
  }
}

function goBack() {
  router.push('/tasks')
}

const priorityConfig = {
  low: { label: '低', class: 'bg-gray-100 text-gray-600' },
  medium: { label: '中', class: 'bg-yellow-100 text-yellow-700' },
  high: { label: '高', class: 'bg-red-100 text-red-600' },
}

function formatDate(dateString: string | null): string {
  if (!dateString) return '未设置'
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function checkOverdue(dueDate: string | null): boolean {
  if (!dueDate) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const due = new Date(dueDate)
  return due < today
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
    <header class="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40">
      <div class="max-w-2xl mx-auto px-4 py-4">
        <div class="flex items-center gap-4">
          <button
            class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
            @click="goBack"
          >
            <ArrowLeft class="w-5 h-5" />
          </button>
          <h1 class="text-xl font-bold text-gray-800">任务详情</h1>
        </div>
      </div>
    </header>

    <main v-if="task" class="max-w-2xl mx-auto px-4 py-6">
      <div class="bg-white rounded-2xl shadow-sm p-6 animate-slide-up">
        <div v-if="!isEditing">
          <div class="flex items-start justify-between mb-6">
            <div class="flex items-center gap-3">
              <button
                class="p-2 rounded-xl transition-all hover:scale-110"
                @click="toggleComplete"
              >
                <CheckCircle2
                  v-if="task.completed"
                  class="w-8 h-8 text-success"
                />
                <Circle v-else class="w-8 h-8 text-gray-300 hover:text-primary transition-colors" />
              </button>
              <div>
                <h2
                  class="text-2xl font-bold"
                  :class="task.completed ? 'line-through text-gray-400' : 'text-gray-800'"
                >
                  {{ task.title }}
                </h2>
                <span
                  class="inline-block px-2 py-0.5 text-xs font-medium rounded-full mt-1"
                  :class="priorityConfig[task.priority].class"
                >
                  {{ priorityConfig[task.priority].label }}优先级
                </span>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <button
                class="p-2 text-gray-500 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                @click="startEdit"
              >
                <Pencil class="w-5 h-5" />
              </button>
              <button
                class="p-2 text-gray-500 hover:text-danger hover:bg-danger/5 rounded-lg transition-all"
                @click="deleteTask"
              >
                <Trash2 class="w-5 h-5" />
              </button>
            </div>
          </div>

          <div v-if="task.description" class="mb-6">
            <h3 class="text-sm font-medium text-gray-500 mb-2">描述</h3>
            <p
              class="text-gray-700 whitespace-pre-wrap"
              :class="{ 'line-through text-gray-400': task.completed }"
            >
              {{ task.description }}
            </p>
          </div>

          <div class="grid grid-cols-2 gap-4 mb-6">
            <div class="bg-gray-50 rounded-xl p-4">
              <div class="flex items-center gap-2 text-gray-500 mb-1">
                <Calendar class="w-4 h-4" />
                <span class="text-sm">开始时间</span>
              </div>
              <p class="text-gray-800 font-medium">{{ formatDate(task.startDate) }}</p>
            </div>
            <div class="bg-gray-50 rounded-xl p-4">
              <div class="flex items-center gap-2 text-gray-500 mb-1">
                <Calendar class="w-4 h-4" />
                <span class="text-sm">截止时间</span>
              </div>
              <p
                class="font-medium"
                :class="checkOverdue(task.dueDate) ? 'text-red-500' : 'text-gray-800'"
              >
                {{ formatDate(task.dueDate) }}
                <span v-if="checkOverdue(task.dueDate)" class="ml-1 text-xs text-red-500">(已逾期)</span>
              </p>
            </div>
          </div>

          <div v-if="task.completed" class="flex items-center gap-2 text-green-600 bg-green-50 rounded-xl p-4">
            <CheckCircle2 class="w-5 h-5" />
            <span class="font-medium">任务已完成</span>
          </div>
          <div v-else-if="checkOverdue(task.dueDate)" class="flex items-center gap-2 text-red-600 bg-red-50 rounded-xl p-4">
            <AlertCircle class="w-5 h-5" />
            <span class="font-medium">任务已逾期，请尽快完成</span>
          </div>
        </div>

        <div v-else>
          <h2 class="text-xl font-semibold text-gray-800 mb-6">编辑任务</h2>
          <form @submit.prevent="saveEdit" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">任务标题</label>
              <input
                v-model="editedTitle"
                type="text"
                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">任务描述</label>
              <textarea
                v-model="editedDescription"
                rows="4"
                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">优先级</label>
              <div class="flex gap-3">
                <label
                  v-for="p in (['low', 'medium', 'high'] as Priority[])"
                  :key="p"
                  class="flex-1 cursor-pointer"
                >
                  <input
                    v-model="editedPriority"
                    type="radio"
                    :value="p"
                    class="sr-only peer"
                  />
                  <div
                    class="px-4 py-2 text-center text-sm font-medium rounded-lg border transition-all peer-checked:border-primary peer-checked:bg-primary/5"
                    :class="{
                      'border-gray-200 text-gray-500': editedPriority !== p,
                      'border-primary text-primary': editedPriority === p,
                    }"
                  >
                    {{ p === 'low' ? '低' : p === 'medium' ? '中' : '高' }}优先级
                  </div>
                </label>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">开始时间</label>
                <input
                  v-model="editedStartDate"
                  type="date"
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">截止时间</label>
                <input
                  v-model="editedDueDate"
                  type="date"
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
              </div>
            </div>

            <div class="flex gap-3 pt-4">
              <button
                type="button"
                class="flex-1 px-4 py-3 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all font-medium"
                @click="cancelEdit"
              >
                取消
              </button>
              <button
                type="submit"
                class="flex-1 px-4 py-3 text-white bg-primary rounded-xl hover:bg-primary/90 transition-all font-medium"
              >
                保存修改
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>

    <div v-else class="max-w-2xl mx-auto px-4 py-16 text-center">
      <p class="text-gray-500">任务不存在</p>
      <button
        class="mt-4 px-6 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all"
        @click="goBack"
      >
        返回任务列表
      </button>
    </div>
  </div>
</template>
