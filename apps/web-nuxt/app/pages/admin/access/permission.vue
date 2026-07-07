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

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-4 mb-6">
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

    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
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
import { ref, computed, reactive } from 'vue'

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

const permissionGroups = ref<PermissionGroup[]>([
  {
    id: '1',
    name: '用户管理',
    icon: 'lucide:users',
    iconColor: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    permissionCount: 8,
    activeCount: 8,
    allEnabled: true,
  },
  {
    id: '2',
    name: '财务管理',
    icon: 'lucide:wallet',
    iconColor: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
    permissionCount: 6,
    activeCount: 4,
    allEnabled: false,
  },
  {
    id: '3',
    name: '权限管理',
    icon: 'lucide:shield',
    iconColor: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    permissionCount: 5,
    activeCount: 5,
    allEnabled: true,
  },
  {
    id: '4',
    name: '系统设置',
    icon: 'lucide:settings',
    iconColor: 'text-slate-600 dark:text-slate-400',
    bgColor: 'bg-slate-100 dark:bg-slate-700/50',
    permissionCount: 4,
    activeCount: 3,
    allEnabled: false,
  },
])

const permissions = ref<Permission[]>([
  { id: '1', code: 'user:view', name: '查看用户', description: '查看用户列表和详情', module: '用户管理' },
  { id: '2', code: 'user:create', name: '创建用户', description: '创建新用户账号', module: '用户管理' },
  { id: '3', code: 'user:edit', name: '编辑用户', description: '修改用户信息和资料', module: '用户管理' },
  { id: '4', code: 'user:delete', name: '删除用户', description: '删除用户账号', module: '用户管理' },
  { id: '5', code: 'user:status', name: '管理用户状态', description: '启用/禁用用户账号', module: '用户管理' },
  { id: '6', code: 'user:role', name: '分配角色', description: '为用户分配角色', module: '用户管理' },
  { id: '7', code: 'user:export', name: '导出用户', description: '导出用户数据', module: '用户管理' },
  { id: '8', code: 'user:import', name: '导入用户', description: '批量导入用户', module: '用户管理' },
  { id: '9', code: 'financial:view', name: '查看财务', description: '查看财务数据和报表', module: '财务管理' },
  { id: '10', code: 'financial:export', name: '导出财务', description: '导出财务数据', module: '财务管理' },
  { id: '11', code: 'financial:recharge', name: '充值管理', description: '管理用户充值记录', module: '财务管理' },
  { id: '12', code: 'financial:refund', name: '退款管理', description: '处理退款申请', module: '财务管理' },
  { id: '13', code: 'financial:balance', name: '余额管理', description: '管理用户余额', module: '财务管理' },
  { id: '14', code: 'financial:order', name: '订单管理', description: '查看和管理订单', module: '财务管理' },
  { id: '15', code: 'access:menu', name: '菜单管理', description: '管理后台菜单结构', module: '权限管理' },
  { id: '16', code: 'access:permission', name: '权限管理', description: '管理系统权限项', module: '权限管理' },
  { id: '17', code: 'access:role', name: '角色管理', description: '管理角色和权限分配', module: '权限管理' },
  { id: '18', code: 'access:assign', name: '权限分配', description: '为用户分配权限', module: '权限管理' },
  { id: '19', code: 'access:audit', name: '操作审计', description: '查看权限操作日志', module: '权限管理' },
  { id: '20', code: 'settings:view', name: '查看设置', description: '查看系统设置', module: '系统设置' },
  { id: '21', code: 'settings:edit', name: '修改设置', description: '修改系统配置', module: '系统设置' },
  { id: '22', code: 'settings:mail', name: '邮件配置', description: '配置邮件服务', module: '系统设置' },
  { id: '23', code: 'settings:storage', name: '存储配置', description: '配置文件存储', module: '系统设置' },
])

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

function savePermission() {
  if (!formData.code.trim() || !formData.name.trim()) return

  if (editingPermission.value) {
    const idx = permissions.value.findIndex(p => p.id === editingPermission.value!.id)
    if (idx > -1) {
      permissions.value[idx] = {
        ...permissions.value[idx],
        code: formData.code,
        name: formData.name,
        description: formData.description,
        module: formData.module,
      }
    }
  } else {
    permissions.value.push({
      id: Date.now().toString(),
      code: formData.code,
      name: formData.name,
      description: formData.description,
      module: formData.module,
    })
  }

  showDialog.value = false
}

function deletePermission(permission: Permission) {
  const idx = permissions.value.findIndex(p => p.id === permission.id)
  if (idx > -1) {
    permissions.value.splice(idx, 1)
  }
}

function resetFilters() {
  searchKeyword.value = ''
  groupFilter.value = 'all'
  currentPage.value = 1
}
</script>