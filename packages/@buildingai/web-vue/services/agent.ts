import type { Agent } from '../types'

class AgentService {
  async list(params?: { page?: number; pageSize?: number; search?: string }): Promise<{ data: Agent[]; total: number }> {
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
      data: [
        { id: '1', name: '文档助手', description: '帮助处理文档', model: 'gpt-4o', status: 'running', createdAt: '2024-01-15' },
        { id: '2', name: '代码助手', description: '帮助编写代码', model: 'claude-3-5-sonnet', status: 'running', createdAt: '2024-01-20' },
      ],
      total: 2,
    }
  }

  async get(id: string): Promise<Agent> {
    await new Promise(resolve => setTimeout(resolve, 300))
    return {
      id,
      name: '文档助手',
      description: '帮助处理文档问题',
      model: 'gpt-4o',
      status: 'running',
      createdAt: '2024-01-15',
    }
  }

  async create(data: Partial<Agent>): Promise<Agent> {
    await new Promise(resolve => setTimeout(resolve, 300))
    return {
      id: Date.now().toString(),
      name: data.name || '新智能体',
      description: data.description || '',
      model: data.model || 'gpt-4o',
      status: 'running',
      createdAt: new Date().toISOString().split('T')[0],
    }
  }

  async update(id: string, data: Partial<Agent>): Promise<Agent> {
    await new Promise(resolve => setTimeout(resolve, 300))
    return {
      id,
      name: data.name || '智能体',
      description: data.description || '',
      model: data.model || 'gpt-4o',
      status: data.status || 'running',
      createdAt: '2024-01-15',
    }
  }

  async delete(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200))
  }
}

export default new AgentService()
