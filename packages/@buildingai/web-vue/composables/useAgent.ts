import { ref, computed } from 'vue'

interface Agent {
  id: string
  name: string
  description: string
  model: string
  status: 'running' | 'stopped' | 'error'
  createdAt: string
}

interface UseAgentReturn {
  agents: ref<Agent[]>
  loading: ref<boolean>
  currentAgent: ref<Agent | null>
  fetchAgents: () => Promise<void>
  getAgentById: (id: string) => Agent | undefined
  setCurrentAgent: (agent: Agent | null) => void
}

export default function useAgent(): UseAgentReturn {
  const agents = ref<Agent[]>([])
  const loading = ref(false)
  const currentAgent = ref<Agent | null>(null)

  async function fetchAgents() {
    loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      agents.value = [
        { id: '1', name: '文档助手', description: '帮助你处理文档相关的问题', model: 'gpt-4o', status: 'running', createdAt: '2024-01-15' },
        { id: '2', name: '代码助手', description: '帮助你编写和调试代码', model: 'claude-3-5-sonnet', status: 'running', createdAt: '2024-01-20' },
        { id: '3', name: '翻译助手', description: '支持多语言翻译', model: 'gemini-1.5-pro', status: 'stopped', createdAt: '2024-02-01' },
      ]
    } finally {
      loading.value = false
    }
  }

  function getAgentById(id: string) {
    return agents.value.find(a => a.id === id)
  }

  function setCurrentAgent(agent: Agent | null) {
    currentAgent.value = agent
  }

  return {
    agents,
    loading,
    currentAgent,
    fetchAgents,
    getAgentById,
    setCurrentAgent,
  }
}
