<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTasksStore } from '../stores/tasks'
import { ClipboardList, ArrowRight, Star, Target, Calendar, CheckCircle2 } from 'lucide-vue-next'

const router = useRouter()
const store = useTasksStore()
const isLoaded = ref(false)

onMounted(() => {
  store.loadTasks()
  setTimeout(() => {
    isLoaded.value = true
  }, 100)
})

const features = [
  {
    icon: Target,
    title: '任务管理',
    description: '高效管理日常任务，支持增删改查',
    color: 'bg-blue-500',
  },
  {
    icon: Star,
    title: '优先级分类',
    description: '按优先级组织任务，重要事项优先处理',
    color: 'bg-yellow-500',
  },
  {
    icon: Calendar,
    title: '数据统计',
    description: '可视化完成率，追踪任务进度',
    color: 'bg-green-500',
  },
  {
    icon: CheckCircle2,
    title: '本地存储',
    description: '数据自动保存，安全可靠',
    color: 'bg-purple-500',
  },
]
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
    <nav class="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40">
      <div class="max-w-6xl mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
              <ClipboardList class="w-5 h-5 text-white" />
            </div>
            <span class="text-xl font-bold text-gray-800">任务管理</span>
          </div>
          <button
            class="px-5 py-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all font-medium shadow-lg shadow-primary/25"
            @click="router.push('/tasks')"
          >
            开始管理
          </button>
        </div>
      </div>
    </nav>

    <main class="max-w-6xl mx-auto px-4 py-12">
      <section
        class="text-center py-16 animate-slide-up"
        :class="{ 'opacity-100 translate-y-0': isLoaded, 'opacity-0 translate-y-4': !isLoaded }"
        style="transition: all 0.6s ease-out"
      >
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-blue-600 shadow-xl shadow-primary/30 mb-8">
          <ClipboardList class="w-10 h-10 text-white" />
        </div>
        <h1 class="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          高效管理你的
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">日常任务</span>
        </h1>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
          一款简洁优雅的任务管理应用，帮助你更好地规划和完成工作，提高生产力
        </p>
        <button
          class="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all font-medium shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-1"
          @click="router.push('/tasks')"
        >
          <ClipboardList class="w-5 h-5" />
          进入任务管理
          <ArrowRight class="w-5 h-5" />
        </button>
      </section>

      <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-12">
        <div
          v-for="(feature, index) in features"
          :key="feature.title"
          class="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-2"
          :style="{ transitionDelay: `${index * 100}ms` }"
          :class="{ 'opacity-100': isLoaded, 'opacity-0': !isLoaded }"
        >
          <div :class="[feature.color, 'w-12 h-12 rounded-xl flex items-center justify-center mb-4']">
            <component :is="feature.icon" class="w-6 h-6 text-white" />
          </div>
          <h3 class="text-lg font-semibold text-gray-800 mb-2">{{ feature.title }}</h3>
          <p class="text-gray-500 text-sm">{{ feature.description }}</p>
        </div>
      </section>

      <section class="bg-white rounded-2xl p-8 shadow-sm">
        <div class="flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 class="text-2xl font-bold text-gray-800 mb-3">当前任务概览</h2>
            <p class="text-gray-600">查看你的任务完成情况</p>
          </div>
          <div class="flex items-center gap-8">
            <div class="text-center">
              <div class="text-3xl font-bold text-primary">{{ store.stats.total }}</div>
              <div class="text-sm text-gray-500">总任务</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-success">{{ store.stats.completed }}</div>
              <div class="text-sm text-gray-500">已完成</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-gray-800">{{ store.stats.rate }}%</div>
              <div class="text-sm text-gray-500">完成率</div>
            </div>
          </div>
          <button
            class="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all font-medium"
            @click="router.push('/tasks')"
          >
            查看详情
          </button>
        </div>
      </section>

      <section class="text-center py-12">
        <p class="text-gray-500">使用 Vue3 + Vite + Pinia + TailwindCSS 构建</p>
      </section>
    </main>
  </div>
</template>
