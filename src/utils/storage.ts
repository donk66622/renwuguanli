import type { Task } from '../types'

const STORAGE_KEY = 'task-manager-tasks'

export const storage = {
  getTasks(): Task[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      return data ? JSON.parse(data) : []
    } catch {
      return []
    }
  },

  saveTasks(tasks: Task[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  },

  clearTasks(): void {
    localStorage.removeItem(STORAGE_KEY)
  },
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export const initialTasks: Task[] = [
  {
    id: '1',
    title: '完成项目文档',
    description: '编写项目需求文档和技术文档',
    priority: 'high',
    completed: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: '2',
    title: '代码审查',
    description: '审查团队成员提交的代码',
    priority: 'medium',
    completed: true,
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now() - 3600000,
  },
  {
    id: '3',
    title: '学习Vue3',
    description: '学习Vue3组合式API和Pinia状态管理',
    priority: 'low',
    completed: false,
    createdAt: Date.now() - 172800000,
    updatedAt: Date.now() - 172800000,
  },
]
