import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Task, TaskFilter, TaskStats } from '../types'
import { storage, generateId, initialTasks } from '../utils/storage'

function isOverdue(dueDate: string | null): boolean {
  if (!dueDate) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const due = new Date(dueDate)
  return due < today
}

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>([])
  const filter = ref<TaskFilter>({ status: 'all', priority: 'all' })

  const filteredTasks = computed(() => {
    return tasks.value.filter((task) => {
      let statusMatch = true

      switch (filter.value.status) {
        case 'completed':
          statusMatch = task.completed
          break
        case 'pending':
          statusMatch = !task.completed
          break
        case 'overdue':
          statusMatch = !task.completed && isOverdue(task.dueDate)
          break
        default:
          statusMatch = true
      }

      const priorityMatch =
        filter.value.priority === 'all' || task.priority === filter.value.priority
      return statusMatch && priorityMatch
    })
  })

  const stats = computed<TaskStats>(() => {
    const total = tasks.value.length
    const completed = tasks.value.filter((t) => t.completed).length
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0
    return { total, completed, rate }
  })

  function loadTasks() {
    const saved = storage.getTasks()
    if (saved.length === 0) {
      tasks.value = [...initialTasks]
      saveTasks()
    } else {
      tasks.value = saved.map((task) => ({
        ...task,
        startDate: task.startDate ?? null,
        dueDate: task.dueDate ?? null,
      }))
    }
  }

  function saveTasks() {
    storage.saveTasks(tasks.value)
  }

  function addTask(data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) {
    const now = Date.now()
    const task: Task = {
      ...data,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    }
    tasks.value.unshift(task)
    saveTasks()
  }

  function updateTask(id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) {
    const index = tasks.value.findIndex((t) => t.id === id)
    if (index !== -1) {
      tasks.value[index] = {
        ...tasks.value[index],
        ...updates,
        updatedAt: Date.now(),
      }
      saveTasks()
    }
  }

  function deleteTask(id: string) {
    tasks.value = tasks.value.filter((t) => t.id !== id)
    saveTasks()
  }

  function toggleTask(id: string) {
    const task = tasks.value.find((t) => t.id === id)
    if (task) {
      updateTask(id, { completed: !task.completed })
    }
  }

  function setFilter(newFilter: Partial<TaskFilter>) {
    filter.value = { ...filter.value, ...newFilter }
  }

  function reorderTasks(newOrder: Task[]) {
    tasks.value = newOrder.map((task) => ({
      ...task,
      updatedAt: Date.now(),
    }))
    saveTasks()
  }

  return {
    tasks,
    filter,
    filteredTasks,
    stats,
    loadTasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    setFilter,
    reorderTasks,
  }
})
