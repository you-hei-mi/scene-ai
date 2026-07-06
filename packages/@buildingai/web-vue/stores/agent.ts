import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface Agent {
  id: string
  name: string
  description: string
  model: string
  status: 'running' | 'stopped' | 'error'
  createdAt: string
}

export const useAgentStore = defineStore('agent', () => {
  const agents = ref<Agent[]>([])
  const currentAgent = ref<Agent | null>(null)
  const loading = ref(false)

  const runningAgents = computed(() => agents.value.filter(a => a.status === 'running'))

  async function fetchAgents() {
    loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      agents.value = [
        { id: '1', name: '文档助手', description: '帮助处理文档问题', model: 'gpt-4o', status: 'running', createdAt: '2024-01-15' },
        { id: '2', name: '代码助手', description: '帮助编写代码', model: 'claude-3-5-sonnet', status: 'running', createdAt: '2024-01-20' },
        { id: '3', name: '翻译助手', description: '多语言翻译', model: 'gemini-1.5-pro', status: 'stopped', createdAt: '2024-02-01' },
      ]
    } finally {
      loading.value = false
    }
  }

  function setCurrentAgent(agent: Agent | null) {
    currentAgent.value = agent
  }

  function getAgentById(id: string) {
    return agents.value.find(a => a.id === id)
  }

  async function createAgent(name: string, description: string, model: string) {
    const newAgent: Agent = {
      id: Date.now().toString(),
      name,
      description,
      model,
      status: 'running',
      createdAt: new Date().toISOString().split('T')[0],
    }
    agents.value.unshift(newAgent)
    return newAgent
  }

  function updateAgent(id: string, updates: Partial<Agent>) {
    const index = agents.value.findIndex(a => a.id === id)
    if (index > -1) {
      agents.value[index] = { ...agents.value[index], ...updates }
    }
  }

  function deleteAgent(id: string) {
    const index = agents.value.findIndex(a => a.id === id)
    if (index > -1) {
      agents.value.splice(index, 1)
      if (currentAgent.value?.id === id) {
        currentAgent.value = null
      }
    }
  }

  return {
    agents,
    currentAgent,
    loading,
    runningAgents,
    fetchAgents,
    setCurrentAgent,
    getAgentById,
    createAgent,
    updateAgent,
    deleteAgent,
  }
})
