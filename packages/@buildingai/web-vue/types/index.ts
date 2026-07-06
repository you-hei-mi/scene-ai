export interface User {
  id: string
  username: string
  nickname: string
  email: string
  avatar?: string
  role: 'user' | 'admin' | 'super_admin'
}

export interface Agent {
  id: string
  name: string
  description: string
  model: string
  status: 'running' | 'stopped' | 'error'
  createdAt: string
}

export interface Dataset {
  id: string
  name: string
  description: string
  docCount: number
  chunkCount: number
  status: 'indexing' | 'ready' | 'error'
  createdAt: string
}

export interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: string
}

export interface Model {
  id: string
  name: string
  modelId: string
  provider: string
  type: 'chat' | 'completion' | 'embedding' | 'image' | 'audio'
  contextLength: number
  inputPrice: number
  outputPrice: number
  enabled: boolean
}

export interface Announcement {
  id: string
  title: string
  content: string
  type: 'system' | 'update' | 'activity' | 'maintenance'
  status: 'published' | 'draft' | 'expired'
  createdAt: string
}

export interface Notification {
  id: string
  title: string
  content: string
  type: 'system' | 'chat' | 'agent' | 'dataset' | 'team'
  isRead: boolean
  createdAt: string
}

export interface ApiResponse<T = any> {
  code: number
  data: T
  message: string
}

export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}

export type ChatRole = 'user' | 'assistant' | 'system'
