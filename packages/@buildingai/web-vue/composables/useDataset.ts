import { ref } from 'vue'

interface Dataset {
  id: string
  name: string
  description: string
  docCount: number
  chunkCount: number
  status: 'indexing' | 'ready' | 'error'
  createdAt: string
}

interface UseDatasetReturn {
  datasets: ref<Dataset[]>
  loading: ref<boolean>
  fetchDatasets: () => Promise<void>
  createDataset: (name: string, description: string) => Promise<void>
  deleteDataset: (id: string) => void
}

export default function useDataset(): UseDatasetReturn {
  const datasets = ref<Dataset[]>([])
  const loading = ref(false)

  async function fetchDatasets() {
    loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      datasets.value = [
        { id: '1', name: '产品文档', description: '公司产品相关的文档', docCount: 25, chunkCount: 1280, status: 'ready', createdAt: '2024-01-10' },
        { id: '2', name: '技术手册', description: '技术开发相关的手册', docCount: 15, chunkCount: 850, status: 'indexing', createdAt: '2024-02-01' },
        { id: '3', name: '知识库', description: '通用知识文档', docCount: 50, chunkCount: 2400, status: 'ready', createdAt: '2024-01-15' },
      ]
    } finally {
      loading.value = false
    }
  }

  async function createDataset(name: string, description: string) {
    loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 300))
      const newDataset: Dataset = {
        id: Date.now().toString(),
        name,
        description,
        docCount: 0,
        chunkCount: 0,
        status: 'ready',
        createdAt: new Date().toISOString().split('T')[0],
      }
      datasets.value.unshift(newDataset)
    } finally {
      loading.value = false
    }
  }

  function deleteDataset(id: string) {
    const index = datasets.value.findIndex(d => d.id === id)
    if (index > -1) {
      datasets.value.splice(index, 1)
    }
  }

  return {
    datasets,
    loading,
    fetchDatasets,
    createDataset,
    deleteDataset,
  }
}
