export type Priority = 'low' | 'medium' | 'high'

export interface Task {
  id: string
  title: string
  description: string
  priority: Priority
  completed: boolean
  startDate: string | null
  dueDate: string | null
  createdAt: number
  updatedAt: number
}

export interface TaskFilter {
  status: 'all' | 'pending' | 'completed' | 'overdue'
  priority: 'all' | Priority
}

export interface TaskStats {
  total: number
  completed: number
  rate: number
}
