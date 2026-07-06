import type { Dataset } from '../types'

class DatasetService {
  async list(params?: { page?: number; pageSize?: number; search?: string }): Promise<{ data: Dataset[]; total: number }> {
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
      data: [
        { id: '1', name: '产品文档', description: '产品相关文档', docCount: 25, chunkCount: 1280, status: 'ready', createdAt: '2024-01-10' },
        { id: '2', name: '技术手册', description: '技术开发手册', docCount: 15, chunkCount: 850, status: 'indexing', createdAt: '2024-02-01' },
      ],
      total: 2,
    }
  }

  async get(id: string): Promise<Dataset> {
    await new Promise(resolve => setTimeout(resolve, 300))
    return {
      id,
      name: '产品文档',
      description: '产品相关文档',
      docCount: 25,
      chunkCount: 1280,
      status: 'ready',
      createdAt: '2024-01-10',
    }
  }

  async create(data: Partial<Dataset>): Promise<Dataset> {
    await new Promise(resolve => setTimeout(resolve, 300))
    return {
      id: Date.now().toString(),
      name: data.name || '新知识库',
      description: data.description || '',
      docCount: 0,
      chunkCount: 0,
      status: 'ready',
      createdAt: new Date().toISOString().split('T')[0],
    }
  }

  async delete(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200))
  }
}

export default new DatasetService()
