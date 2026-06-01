<script setup lang="ts">
import { ref, watch } from 'vue'
import { X, Plus } from 'lucide-vue-next'
import type { Task, Priority } from '../types'

const props = defineProps<{
  task: Task | null
  visible: boolean
}>()

const emit = defineEmits<{
  (e: 'submit', data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): void
  (e: 'cancel'): void
}>()

const title = ref('')
const description = ref('')
const priority = ref<Priority>('medium')
const startDate = ref<string | null>(null)
const dueDate = ref<string | null>(null)
const completed = ref(false)

watch(
  () => props.task,
  (newTask) => {
    if (newTask) {
      title.value = newTask.title
      description.value = newTask.description
      priority.value = newTask.priority
      startDate.value = newTask.startDate
      dueDate.value = newTask.dueDate
      completed.value = newTask.completed
    } else {
      resetForm()
    }
  }
)

function resetForm() {
  title.value = ''
  description.value = ''
  priority.value = 'medium'
  startDate.value = null
  dueDate.value = null
  completed.value = false
}

function handleSubmit() {
  if (!title.value.trim()) return
  emit('submit', {
    title: title.value.trim(),
    description: description.value.trim(),
    priority: priority.value,
    startDate: startDate.value,
    dueDate: dueDate.value,
    completed: completed.value,
  })
  resetForm()
}

function handleCancel() {
  resetForm()
  emit('cancel')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="visible"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="handleCancel"
      >
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-scale-in">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-semibold text-gray-800">
              {{ task ? '编辑任务' : '创建任务' }}
            </h2>
            <button
              class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
              @click="handleCancel"
            >
              <X class="w-5 h-5" />
            </button>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">任务标题</label>
              <input
                v-model="title"
                type="text"
                placeholder="请输入任务标题"
                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">任务描述</label>
              <textarea
                v-model="description"
                placeholder="请输入任务描述（可选）"
                rows="3"
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
                    v-model="priority"
                    type="radio"
                    :value="p"
                    class="sr-only peer"
                  />
                  <div
                    class="px-4 py-2 text-center text-sm font-medium rounded-lg border transition-all peer-checked:border-primary peer-checked:bg-primary/5"
                    :class="{
                      'border-gray-200 text-gray-500': priority !== p,
                      'border-primary text-primary': priority === p,
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
                  v-model="startDate"
                  type="date"
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">截止时间</label>
                <input
                  v-model="dueDate"
                  type="date"
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
              </div>
            </div>

            <div v-if="task" class="flex items-center gap-2">
              <input
                v-model="completed"
                type="checkbox"
                class="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <label class="text-sm text-gray-700 cursor-pointer">标记为已完成</label>
            </div>

            <div class="flex gap-3 pt-4">
              <button
                type="button"
                class="flex-1 px-4 py-3 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all font-medium"
                @click="handleCancel"
              >
                取消
              </button>
              <button
                type="submit"
                class="flex-1 px-4 py-3 text-white bg-primary rounded-xl hover:bg-primary/90 transition-all font-medium flex items-center justify-center gap-2"
              >
                <Plus class="w-4 h-4" />
                {{ task ? '保存修改' : '创建任务' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
