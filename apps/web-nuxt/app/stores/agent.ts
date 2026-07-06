import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Agent {
  id: string
  name: string
  description: string
  avatar?: string
  tags: string[]
  model: string
  prompt?: string
  temperature: number
  maxTokens?: number
  visibility: 'private' | 'public' | 'team'
  status: 'draft' | 'published' | 'archived'
  createdAt: Date
  updatedAt: Date
  usageCount?: number
  likes?: number
  author?: {
    id: string
    name: string
    avatar?: string
  }
}

export interface AgentListParams {
  keyword?: string
  tagId?: string
  page?: number
  pageSize?: number
  visibility?: string
}

export const useAgentStore = defineStore('agent', () => {
  const agents = ref<Agent[]>([])
  const currentAgent = ref<Agent | null>(null)
  const loading = ref(false)
  const total = ref(0)
  const page = ref(1)
  const pageSize = ref(20)

  const hasMore = computed(() => agents.value.length < total.value)

  const mockAgents: Agent[] = [
    {
      id: '1',
      name: '通用 AI 助手',
      description: '一个功能全面的通用 AI 助手，可以回答各种问题、提供建议和帮助解决问题。',
      tags: ['通用', '助手'],
      model: 'deepseek-chat',
      temperature: 0.7,
      visibility: 'public',
      status: 'published',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-06-20'),
      usageCount: 12580,
      likes: 892,
      author: { id: '1', name: 'BuildingAI' },
    },
    {
      id: '2',
      name: '代码助手',
      description: '专业的编程助手，支持多种编程语言，可以帮你写代码、调试、优化和解释代码。',
      tags: ['编程', '开发'],
      model: 'gpt-4o',
      temperature: 0.3,
      visibility: 'public',
      status: 'published',
      createdAt: new Date('2024-02-10'),
      updatedAt: new Date('2024-06-18'),
      usageCount: 8930,
      likes: 654,
      author: { id: '1', name: 'BuildingAI' },
    },
    {
      id: '3',
      name: '写作助手',
      description: '帮助你进行各类写作，包括文章、邮件、报告、创意写作等，提供专业的写作建议。',
      tags: ['写作', '创意'],
      model: 'deepseek-chat',
      temperature: 0.8,
      visibility: 'public',
      status: 'published',
      createdAt: new Date('2024-03-05'),
      updatedAt: new Date('2024-06-15'),
      usageCount: 6720,
      likes: 423,
      author: { id: '1', name: 'BuildingAI' },
    },
    {
      id: '4',
      name: '翻译专家',
      description: '多语言翻译助手，支持中英日韩法德等多种语言互译，翻译准确自然。',
      tags: ['翻译', '语言'],
      model: 'deepseek-chat',
      temperature: 0.5,
      visibility: 'public',
      status: 'published',
      createdAt: new Date('2024-02-28'),
      updatedAt: new Date('2024-06-10'),
      usageCount: 15230,
      likes: 1023,
      author: { id: '1', name: 'BuildingAI' },
    },
    {
      id: '5',
      name: '数据分析助手',
      description: '专业的数据分析助手，帮助你分析数据、生成报告、制作可视化图表。',
      tags: ['数据', '分析'],
      model: 'gpt-4o',
      temperature: 0.2,
      visibility: 'team',
      status: 'published',
      createdAt: new Date('2024-04-12'),
      updatedAt: new Date('2024-06-22'),
      usageCount: 2340,
      likes: 156,
      author: { id: '2', name: '数据团队' },
    },
    {
      id: '6',
      name: '产品经理助手',
      description: '产品经理专属助手，帮助写需求文档、用户故事、竞品分析、产品规划等。',
      tags: ['产品', '管理'],
      model: 'deepseek-chat',
      temperature: 0.6,
      visibility: 'private',
      status: 'draft',
      createdAt: new Date('2024-05-01'),
      updatedAt: new Date('2024-06-25'),
      usageCount: 156,
      likes: 0,
    },
  ]

  function initMockData() {
    agents.value = mockAgents
    total.value = mockAgents.length
  }

  async function fetchAgents(params: AgentListParams = {}) {
    loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 300))
      
      let filtered = [...mockAgents]
      
      if (params.keyword) {
        const keyword = params.keyword.toLowerCase()
        filtered = filtered.filter(
          a => a.name.toLowerCase().includes(keyword) || 
               a.description.toLowerCase().includes(keyword)
        )
      }
      
      if (params.visibility && params.visibility !== 'all') {
        filtered = filtered.filter(a => a.visibility === params.visibility)
      }
      
      total.value = filtered.length
      agents.value = filtered
      return filtered
    } finally {
      loading.value = false
    }
  }

  async function fetchAgentDetail(id: string) {
    loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 200))
      const agent = mockAgents.find(a => a.id === id)
      currentAgent.value = agent || null
      return agent
    } finally {
      loading.value = false
    }
  }

  async function createAgent(data: Partial<Agent>) {
    loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      const newAgent: Agent = {
        id: Date.now().toString(),
        name: data.name || '新 Agent',
        description: data.description || '',
        tags: data.tags || [],
        model: data.model || 'deepseek-chat',
        temperature: data.temperature ?? 0.7,
        visibility: data.visibility || 'private',
        status: 'draft',
        createdAt: new Date(),
        updatedAt: new Date(),
        usageCount: 0,
        likes: 0,
      }
      agents.value.unshift(newAgent)
      total.value++
      return newAgent
    } finally {
      loading.value = false
    }
  }

  async function updateAgent(id: string, data: Partial<Agent>) {
    loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 300))
      const index = agents.value.findIndex(a => a.id === id)
      if (index > -1) {
        agents.value[index] = {
          ...agents.value[index],
          ...data,
          updatedAt: new Date(),
        }
        if (currentAgent.value?.id === id) {
          currentAgent.value = agents.value[index]
        }
        return agents.value[index]
      }
      return null
    } finally {
      loading.value = false
    }
  }

  async function deleteAgent(id: string) {
    loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 300))
      const index = agents.value.findIndex(a => a.id === id)
      if (index > -1) {
        agents.value.splice(index, 1)
        total.value--
      }
      if (currentAgent.value?.id === id) {
        currentAgent.value = null
      }
      return true
    } finally {
      loading.value = false
    }
  }

  function setCurrentAgent(agent: Agent | null) {
    currentAgent.value = agent
  }

  return {
    agents,
    currentAgent,
    loading,
    total,
    page,
    pageSize,
    hasMore,
    initMockData,
    fetchAgents,
    fetchAgentDetail,
    createAgent,
    updateAgent,
    deleteAgent,
    setCurrentAgent,
  }
})
