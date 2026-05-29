<script setup lang="ts">
import { computed } from 'vue'
import { CheckCircle, Circle, TrendingUp } from 'lucide-vue-next'
import type { TaskStats } from '../types'

const props = defineProps<{
  stats: TaskStats
}>()

const circumference = 2 * Math.PI * 40
const strokeDashoffset = computed(() => {
  return circumference - (props.stats.rate / 100) * circumference
})
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm p-6 animate-slide-up">
    <div class="flex items-center gap-2 mb-6">
      <TrendingUp class="w-5 h-5 text-primary" />
      <span class="font-medium text-gray-700">任务统计</span>
    </div>

    <div class="flex flex-col items-center mb-6">
      <div class="relative w-24 h-24">
        <svg class="w-full h-full -rotate-90">
          <circle
            cx="48"
            cy="48"
            r="40"
            stroke="#E5E7EB"
            stroke-width="8"
            fill="none"
          />
          <circle
            cx="48"
            cy="48"
            r="40"
            stroke="url(#gradient)"
            stroke-width="8"
            fill="none"
            stroke-linecap="round"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="strokeDashoffset"
            class="transition-all duration-500"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#3B82F6" />
              <stop offset="100%" stop-color="#10B981" />
            </linearGradient>
          </defs>
        </svg>
        <div class="absolute inset-0 flex flex-col items-center justify-center">
          <span class="text-2xl font-bold text-gray-800">{{ stats.rate }}%</span>
          <span class="text-xs text-gray-500">完成率</span>
        </div>
      </div>
    </div>

    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <Circle class="w-4 h-4 text-gray-400" />
          <span class="text-sm text-gray-600">总任务</span>
        </div>
        <span class="text-lg font-semibold text-gray-800">{{ stats.total }}</span>
      </div>

      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <CheckCircle class="w-4 h-4 text-success" />
          <span class="text-sm text-gray-600">已完成</span>
        </div>
        <span class="text-lg font-semibold text-success">{{ stats.completed }}</span>
      </div>

      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <Circle class="w-4 h-4 text-primary" />
          <span class="text-sm text-gray-600">待完成</span>
        </div>
        <span class="text-lg font-semibold text-primary">{{ stats.total - stats.completed }}</span>
      </div>
    </div>
  </div>
</template>
