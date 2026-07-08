import type { Dataset } from '../types'
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

class DatasetService {
  /** 获取我的知识库列表 */
  async list(params?: ListParams): Promise<PaginatedResult<Dataset>> {
    return apiGet<PaginatedResult<Dataset>>('/api/ai-datasets/my-created', {
      query: params,
    })
  }

  /** 获取知识库详情 */
  async get(id: string): Promise<Dataset> {
    return apiGet<Dataset>(`/api/ai-datasets/${id}`)
  }

  /** 创建空知识库 */
  async create(data: { name: string; description?: string }): Promise<Dataset> {
    return apiPost<Dataset>('/api/ai-datasets/create-empty', data)
  }

  /** 更新知识库 */
  async update(id: string, data: Partial<Dataset>): Promise<Dataset> {
    return apiPatch<Dataset>(`/api/ai-datasets/${id}`, data)
  }

  /** 删除知识库 */
  async delete(id: string): Promise<{ success: boolean }> {
    return apiDelete<{ success: boolean }>(`/api/ai-datasets/${id}`)
  }
}

export default new DatasetService()