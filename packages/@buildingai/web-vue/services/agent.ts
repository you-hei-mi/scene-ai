import type { Agent } from '../types'
import { apiGet, apiPost, apiPatch, apiDelete } from './client'

interface PaginatedResult<T> {
  items: T[]
  total: number
}

interface ListParams {
  page?: number
  pageSize?: number
  search?: string
}

class AgentService {
  /** 获取我的智能体列表 */
  async list(params?: ListParams): Promise<PaginatedResult<Agent>> {
    return apiGet<PaginatedResult<Agent>>('/api/ai-agents/my-created', {
      query: params,
    })
  }

  /** 获取智能体详情 */
  async get(id: string): Promise<Agent> {
    return apiGet<Agent>(`/api/ai-agents/${id}`)
  }

  /** 创建智能体 */
  async create(data: Partial<Agent> & { name: string; description?: string }): Promise<Agent> {
    return apiPost<Agent>('/api/ai-agents', data)
  }

  /** 更新智能体 */
  async update(id: string, data: Partial<Agent>): Promise<Agent> {
    return apiPatch<Agent>(`/api/ai-agents/${id}`, data)
  }

  /** 删除智能体 */
  async delete(id: string): Promise<void> {
    await apiDelete(`/api/ai-agents/${id}`)
  }
}

export default new AgentService()