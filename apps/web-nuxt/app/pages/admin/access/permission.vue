<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950/30">
    <div class="flex items-center justify-between mb-6">
      <div>
        <div class="flex items-center gap-4 mb-2">
          <div class="w-1 h-8 bg-gradient-to-b from-primary to-accent rounded-full"></div>
          <h1 class="font-display text-3xl font-bold text-slate-900 dark:text-white">权限管理</h1>
        </div>
        <p class="text-slate-600 dark:text-slate-400 ml-5">权限管理</p>
      </div>
      <button class="btn-glass btn-glass--primary" @click="openAddDialog">
        <UIcon name="lucide:plus" class="w-4 h-4" />
        添加权限
      </button>
    </div>

    <div class="flex items-center gap-2 mb-6 p-1.5 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 w-fit">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        class="px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
        :class="activeTab === tab.key
          ? 'bg-gradient-to-r from-primary to-accent text-white shadow-md'
          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700'"
        @click="activeTab = tab.key"
      >
        <UIcon :name="tab.icon" class="w-4 h-4 inline-block mr-1.5" />
        {{ tab.label }}
      </button>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="flex flex-col items-center gap-4">
        <UIcon name="lucide:loader-2" class="w-10 h-10 text-primary animate-spin" />
        <p class="text-slate-500 text-sm">正在加载权限数据...</p>
      </div>
    </div>

    <!-- 错误状态 -->
    <div v-if="error" class="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center gap-3">
      <UIcon name="lucide:alert-circle" class="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
      <div class="flex-1">
        <p class="text-sm font-medium text-red-700 dark:text-red-400">加载失败</p>
        <p class="text-xs text-red-500 mt-0.5">{{ error }}</p>
      </div>
      <button class="btn-glass text-sm px-3 py-1.5" @click="fetchPermissions">重试</button>
    </div>

    <div v-if="!loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div
        v-for="group in permissionGroups"
        :key="group.id"
        class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 transition-all duration-300 hover:shadow-lg"
      >
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center" :class="group.bgColor">
              <UIcon :name="group.icon" class="w-5 h-5" :class="group.iconColor" />
            </div>
            <div>
              <p class="font-semibold text-sm text-slate-900 dark:text-white">{{ group.name }}</p>
              <p class="text-xs text-slate-500">{{ group.permissionCount }} 项权限</p>
            </div>
          </div>
        </div>
        <div class="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700">
          <span class="text-xs text-slate-500">
            <span class="font-medium text-slate-700 dark:text-slate-300">{{ group.activeCount }}</span> 已启用
          </span>
          <button
            class="text-xs font-medium px-3 py-1 rounded-lg transition-colors"
            :class="group.allEnabled ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'"
            @click="toggleGroup(group)"
          >
            {{ group.allEnabled ? '全部启用' : '部分启用' }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="!loading" class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-4 mb-6">
      <div class="flex flex-wrap items-center gap-4">
        <div class="relative w-64">
          <UIcon name="lucide:search" class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            v-model="searchKeyword"
            placeholder="搜索权限标识/名称..."
            class="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          />
        </div>
        <USelect v-model="groupFilter" :options="groupFilterOptions" class="w-44" />
        <div class="flex-1"></div>
        <button class="btn-glass" @click="resetFilters">
          重置筛选
        </button>
      </div>
    </div>

    <div v-if="!loading" class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-500">权限标识</th>
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-500">名称</th>
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-500">描述</th>
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-500">所属模块</th>
              <th class="text-right px-6 py-4 text-sm font-medium text-slate-500">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="permission in filteredPermissions"
              :key="permission.id"
              class="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <td class="px-6 py-4">
                <code class="text-sm bg-slate-100 dark:bg-slate-700 px-2.5 py-1 rounded text-primary font-mono">{{ permission.code }}</code>
              </td>
              <td class="px-6 py-4">
                <span class="font-medium text-sm text-slate-900 dark:text-white">{{ permission.name }}</span>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm text-slate-500">{{ permission.description }}</span>
              </td>
              <td class="px-6 py-4">
                <UBadge variant="secondary" size="sm">{{ permission.module }}</UBadge>
              </td>
              <td class="px-6 py-4 text-right">
                <UDropdownMenu>
                  <button class="btn-glass p-2">
                    <UIcon name="lucide:more-horizontal" class="w-4 h-4" />
                  </button>
                  <template #items>
                    <UDropdownMenuItem label="编辑权限" icon="lucide:edit" @click="openEditDialog(permission)" />
                    <UDropdownMenuItem label="删除权限" icon="lucide:trash-2" color="red" @click="deletePermission(permission)" />
                  </template>
                </UDropdownMenu>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="filteredPermissions.length === 0" class="text-center py-12">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 mb-4">
          <UIcon name="lucide:shield" class="w-8 h-8 text-slate-400" />
        </div>
        <p class="text-slate-500">未找到匹配的权限</p>
      </div>

      <div class="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-700/30">
        <div class="text-sm text-slate-500">
          共 {{ filteredPermissions.length }} 项权限
        </div>
        <div class="flex items-center gap-2">
          <button class="btn-glass px-3 py-1.5 text-sm">
            <UIcon name="lucide:chevron-left" class="w-4 h-4" />
          </button>
          <span class="text-sm font-medium text-slate-900 dark:text-white">第 {{ currentPage }} / {{ totalPages }} 页</span>
          <button class="btn-glass px-3 py-1.5 text-sm">
            <UIcon name="lucide:chevron-right" class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <UDialog v-model="showDialog" :title="editingPermission ? '编辑权限' : '添加权限'" size="md">
      <div class="space-y-5">
        <div>
          <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">权限标识 <span class="text-red-500">*</span></label>
          <UInput v-model="formData.code" placeholder="例如：user:create" />
          <p class="text-xs mt-1 text-slate-500">格式：模块:操作，如 user:create、order:delete</p>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">权限名称 <span class="text-red-500">*</span></label>
          <UInput v-model="formData.name" placeholder="例如：创建用户" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">描述</label>
          <UTextarea v-model="formData.description" placeholder="权限描述信息" rows="2" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">所属模块</label>
          <USelect v-model="formData.module" :options="moduleOptions" />
        </div>
      </div>
      <template #footer>
        <button class="btn-glass" @click="showDialog = false">取消</button>
        <button class="btn-glass btn-glass--primary" @click="savePermission">
          {{ editingPermission ? '保存修改' : '创建权限' }}
        </button>
      </template>
    </UDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue'
import { getPermissions, createPermission, updatePermission, deletePermission as deletePermissionApi } from '~/composables/api/order-finance-access'

definePageMeta({
  layout: 'console',
})

interface Permission {
  id: string
  code: string
  name: string
  description: string
  module: string
}

interface PermissionGroup {
  id: string
  name: string
  icon: string
  iconColor: string
  bgColor: string
  permissionCount: number
  activeCount: number
  allEnabled: boolean
}

const activeTab = ref('permission')
const searchKeyword = ref('')
const groupFilter = ref('all')
const currentPage = ref(1)
const showDialog = ref(false)
const editingPermission = ref<Permission | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const tabs = [
  { key: 'menu', label: '菜单管理', icon: 'lucide:menu' },
  { key: 'permission', label: '权限管理', icon: 'lucide:shield' },
  { key: 'role', label: '角色管理', icon: 'lucide:users' },
]

const moduleOptions = [
  { label: '用户管理', value: '用户管理' },
  { label: '财务管理', value: '财务管理' },
  { label: '权限管理', value: '权限管理' },
  { label: '渠道管理', value: '渠道管理' },
  { label: '系统设置', value: '系统设置' },
  { label: '数据分析', value: '数据分析' },
  { label: '对话管理', value: '对话管理' },
  { label: '运营管理', value: '运营管理' },
]

const groupFilterOptions = [
  { label: '全部模块', value: 'all' },
  { label: '用户管理', value: '用户管理' },
  { label: '财务管理', value: '财务管理' },
  { label: '权限管理', value: '权限管理' },
  { label: '渠道管理', value: '渠道管理' },
  { label: '系统设置', value: '系统设置' },
  { label: '数据分析', value: '数据分析' },
  { label: '对话管理', value: '对话管理' },
  { label: '运营管理', value: '运营管理' },
]

const formData = reactive({
  code: '',
  name: '',
  description: '',
  module: '用户管理',
})

const groupIconMap: Record<string, { icon: string; iconColor: string; bgColor: string }> = {
  '用户管理': { icon: 'lucide:users', iconColor: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
  '财务管理': { icon: 'lucide:wallet', iconColor: 'text-green-600 dark:text-green-400', bgColor: 'bg-green-100 dark:bg-green-900/30' },
  '权限管理': { icon: 'lucide:shield', iconColor: 'text-purple-600 dark:text-purple-400', bgColor: 'bg-purple-100 dark:bg-purple-900/30' },
  '系统设置': { icon: 'lucide:settings', iconColor: 'text-slate-600 dark:text-slate-400', bgColor: 'bg-slate-100 dark:bg-slate-700/50' },
}

const permissions = ref<Permission[]>([])

const permissionGroups = computed<PermissionGroup[]>(() => {
  const moduleMap = new Map<string, Permission[]>()
  permissions.value.forEach(p => {
    const mod = p.module || '其他'
    if (!moduleMap.has(mod)) moduleMap.set(mod, [])
    moduleMap.get(mod)!.push(p)
  })
  return Array.from(moduleMap.entries()).map(([mod, perms], idx) => {
    const icons = groupIconMap[mod] || { icon: 'lucide:folder', iconColor: 'text-slate-500', bgColor: 'bg-slate-100 dark:bg-slate-700/50' }
    return {
      id: String(idx + 1),
      name: mod,
      icon: icons.icon,
      iconColor: icons.iconColor,
      bgColor: icons.bgColor,
      permissionCount: perms.length,
      activeCount: perms.length,
      allEnabled: true,
    }
  })
})

async function fetchPermissions() {
  loading.value = true
  error.value = null
  try {
    const data = await getPermissions()
    permissions.value = (data || []).map((item: any) => ({
      id: item.id,
      code: item.code,
      name: item.name,
      description: item.description || '',
      module: item.module || item.group || '其他',
    }))
  } catch (e: any) {
    error.value = e.message || '获取权限数据失败'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchPermissions()
})

const filteredPermissions = computed(() => {
  let result = [...permissions.value]

  if (searchKeyword.value.trim()) {
    const kw = searchKeyword.value.toLowerCase()
    result = result.filter(
      p =>
        p.code.toLowerCase().includes(kw) ||
        p.name.toLowerCase().includes(kw) ||
        p.description.toLowerCase().includes(kw)
    )
  }

  if (groupFilter.value !== 'all') {
    result = result.filter(p => p.module === groupFilter.value)
  }

  return result
})

const totalPages = computed(() => Math.ceil(filteredPermissions.value.length / 10) || 1)

function toggleGroup(group: PermissionGroup) {
  group.allEnabled = !group.allEnabled
  group.activeCount = group.allEnabled ? group.permissionCount : 0
}

function openAddDialog() {
  editingPermission.value = null
  formData.code = ''
  formData.name = ''
  formData.description = ''
  formData.module = '用户管理'
  showDialog.value = true
}

function openEditDialog(permission: Permission) {
  editingPermission.value = permission
  formData.code = permission.code
  formData.name = permission.name
  formData.description = permission.description
  formData.module = permission.module
  showDialog.value = true
}

async function savePermission() {
  if (!formData.code.trim() || !formData.name.trim()) return

  const payload = {
    code: formData.code,
    name: formData.name,
    description: formData.description,
    module: formData.module,
  }

  try {
    if (editingPermission.value) {
      await updatePermission(editingPermission.value.id, payload)
    } else {
      await createPermission(payload)
    }
    showDialog.value = false
    await fetchPermissions()
  } catch (e: any) {
    error.value = e.message || '保存权限失败'
  }
}

async function deletePermission(permission: Permission) {
  try {
    await deletePermissionApi(permission.id)
    await fetchPermissions()
  } catch (e: any) {
    error.value = e.message || '删除权限失败'
  }
}

function resetFilters() {
  searchKeyword.value = ''
  groupFilter.value = 'all'
  currentPage.value = 1
}
</script>