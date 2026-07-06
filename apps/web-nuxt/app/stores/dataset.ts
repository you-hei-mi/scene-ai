import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Dataset {
  id: string
  name: string
  description: string
  icon?: string
  type: 'public' | 'private'
  docCount: number
  chunkCount: number
  size: number
  status: 'active' | 'indexing' | 'error'
  createdAt: Date
  updatedAt: Date
  owner?: {
    id: string
    name: string
    avatar?: string
  }
  members?: {
    id: string
    name: string
    role: 'owner' | 'admin' | 'member'
  }[]
}

export interface DatasetDocument {
  id: string
  name: string
  type: 'file' | 'url' | 'text'
  size: number
  status: 'completed' | 'parsing' | 'error'
  chunkCount: number
  createdAt: Date
  updatedAt: Date
}

export const useDatasetStore = defineStore('dataset', () => {
  const datasets = ref<Dataset[]>([])
  const currentDataset = ref<Dataset | null>(null)
  const documents = ref<DatasetDocument[]>([])
  const loading = ref(false)
  const total = ref(0)
  const page = ref(1)
  const pageSize = ref(20)

  const mockDatasets: Dataset[] = [
    {
      id: '1',
      name: '产品文档库',
      description: '公司产品相关的所有技术文档和用户手册',
      type: 'private',
      docCount: 156,
      chunkCount: 2340,
      size: 125 * 1024 * 1024,
      status: 'active',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-06-20'),
    },
    {
      id: '2',
      name: '技术知识库',
      description: '技术团队内部知识库，包含各种技术方案和最佳实践',
      type: 'private',
      docCount: 342,
      chunkCount: 5680,
      size: 456 * 1024 * 1024,
      status: 'active',
      createdAt: new Date('2024-02-10'),
      updatedAt: new Date('2024-06-22'),
    },
    {
      id: '3',
      name: 'FAQ 常见问题',
      description: '客户常见问题及解答',
      type: 'public',
      docCount: 89,
      chunkCount: 340,
      size: 45 * 1024 * 1024,
      status: 'active',
      createdAt: new Date('2024-03-05'),
      updatedAt: new Date('2024-06-18'),
    },
    {
      id: '4',
      name: '客户服务手册',
      description: '客户服务团队使用的标准操作流程和话术库',
      type: 'private',
      docCount: 67,
      chunkCount: 420,
      size: 78 * 1024 * 1024,
      status: 'indexing',
      createdAt: new Date('2024-04-12'),
      updatedAt: new Date('2024-06-25'),
    },
    {
      id: '5',
      name: '培训资料',
      description: '新员工入职培训和技能提升培训资料',
      type: 'private',
      docCount: 234,
      chunkCount: 1890,
      size: 234 * 1024 * 1024,
      status: 'active',
      createdAt: new Date('2024-02-28'),
      updatedAt: new Date('2024-06-15'),
    },
    {
      id: '6',
      name: '法律法规库',
      description: '行业相关法律法规和政策文件',
      type: 'public',
      docCount: 56,
      chunkCount: 1230,
      size: 89 * 1024 * 1024,
      status: 'active',
      createdAt: new Date('2024-05-01'),
      updatedAt: new Date('2024-06-10'),
    },
  ]

  const mockDocuments: DatasetDocument[] = [
    {
      id: 'doc1',
      name: '产品需求文档 v2.0.pdf',
      type: 'file',
      size: 2.5 * 1024 * 1024,
      status: 'completed',
      chunkCount: 45,
      createdAt: new Date('2024-06-20'),
      updatedAt: new Date('2024-06-20'),
    },
    {
      id: 'doc2',
      name: 'API 接口文档.md',
      type: 'file',
      size: 156 * 1024,
      status: 'completed',
      chunkCount: 23,
      createdAt: new Date('2024-06-18'),
      updatedAt: new Date('2024-06-18'),
    },
    {
      id: 'doc3',
      name: 'https://docs.buildingai.cc/guide',
      type: 'url',
      size: 0,
      status: 'parsing',
      chunkCount: 0,
      createdAt: new Date('2024-06-25'),
      updatedAt: new Date('2024-06-25'),
    },
    {
      id: 'doc4',
      name: '用户操作手册.docx',
      type: 'file',
      size: 5.8 * 1024 * 1024,
      status: 'completed',
      chunkCount: 67,
      createdAt: new Date('2024-06-15'),
      updatedAt: new Date('2024-06-15'),
    },
    {
      id: 'doc5',
      name: '常见问题整理.txt',
      type: 'text',
      size: 45 * 1024,
      status: 'error',
      chunkCount: 0,
      createdAt: new Date('2024-06-22'),
      updatedAt: new Date('2024-06-22'),
    },
  ]

  function initMockData() {
    datasets.value = mockDatasets
    total.value = mockDatasets.length
    documents.value = mockDocuments
  }

  async function fetchDatasets(params: { keyword?: string; type?: string } = {}) {
    loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 300))
      
      let filtered = [...mockDatasets]
      
      if (params.keyword) {
        const keyword = params.keyword.toLowerCase()
        filtered = filtered.filter(
          d => d.name.toLowerCase().includes(keyword) || 
               d.description.toLowerCase().includes(keyword)
        )
      }
      
      if (params.type && params.type !== 'all') {
        filtered = filtered.filter(d => d.type === params.type)
      }
      
      total.value = filtered.length
      datasets.value = filtered
      return filtered
    } finally {
      loading.value = false
    }
  }

  async function fetchDatasetDetail(id: string) {
    loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 200))
      const dataset = mockDatasets.find(d => d.id === id)
      currentDataset.value = dataset || null
      documents.value = mockDocuments
      return dataset
    } finally {
      loading.value = false
    }
  }

  async function createDataset(data: Partial<Dataset>) {
    loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      const newDataset: Dataset = {
        id: Date.now().toString(),
        name: data.name || '新知识库',
        description: data.description || '',
        type: (data.type as 'public' | 'private') || 'private',
        docCount: 0,
        chunkCount: 0,
        size: 0,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      datasets.value.unshift(newDataset)
      total.value++
      return newDataset
    } finally {
      loading.value = false
    }
  }

  async function deleteDataset(id: string) {
    loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 300))
      const index = datasets.value.findIndex(d => d.id === id)
      if (index > -1) {
        datasets.value.splice(index, 1)
        total.value--
      }
      if (currentDataset.value?.id === id) {
        currentDataset.value = null
      }
      return true
    } finally {
      loading.value = false
    }
  }

  function formatSize(bytes: number): string {
    if (bytes >= 1024 * 1024 * 1024) {
      return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB'
    }
    if (bytes >= 1024 * 1024) {
      return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
    }
    if (bytes >= 1024) {
      return (bytes / 1024).toFixed(2) + ' KB'
    }
    return bytes + ' B'
  }

  return {
    datasets,
    currentDataset,
    documents,
    loading,
    total,
    page,
    pageSize,
    initMockData,
    fetchDatasets,
    fetchDatasetDetail,
    createDataset,
    deleteDataset,
    formatSize,
  }
})
