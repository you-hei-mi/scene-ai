import { ref, computed } from 'vue'

interface UsePaginationReturn<T> {
  currentPage: ref<number>
  pageSize: ref<number>
  totalItems: ref<number>
  paginatedData: computed<T[]>
  goToPage: (page: number) => void
  nextPage: () => void
  prevPage: () => void
  setPageSize: (size: number) => void
}

export default function usePagination<T>(data: T[], pageSize: number = 10): UsePaginationReturn<T> {
  const currentPage = ref(1)
  const pageSizeRef = ref(pageSize)
  const totalItems = computed(() => data.length)

  const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * pageSizeRef.value
    const end = start + pageSizeRef.value
    return data.slice(start, end)
  })

  const totalPages = computed(() => Math.ceil(totalItems.value / pageSizeRef.value))

  function goToPage(page: number) {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
    }
  }

  function nextPage() {
    if (currentPage.value < totalPages.value) {
      currentPage.value++
    }
  }

  function prevPage() {
    if (currentPage.value > 1) {
      currentPage.value--
    }
  }

  function setPageSize(size: number) {
    pageSizeRef.value = size
    currentPage.value = 1
  }

  return {
    currentPage,
    pageSize: pageSizeRef,
    totalItems,
    paginatedData,
    goToPage,
    nextPage,
    prevPage,
    setPageSize,
  }
}
