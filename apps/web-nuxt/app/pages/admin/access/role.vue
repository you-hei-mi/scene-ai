<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950/30">
    <div class="flex items-center justify-between mb-6">
      <div>
        <div class="flex items-center gap-4 mb-2">
          <div class="w-1 h-8 bg-gradient-to-b from-primary to-accent rounded-full"></div>
          <h1 class="font-display text-3xl font-bold text-slate-900 dark:text-white">权限管理</h1>
        </div>
        <p class="text-slate-600 dark:text-slate-400 ml-5">角色管理</p>
      </div>
      <button class="btn-glass btn-glass--primary" @click="openAddDialog">
        <UIcon name="lucide:plus" class="w-4 h-4" />
        添加角色
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
        <p class="text-slate-500 text-sm">正在加载角色数据...</p>
      </div>
    </div>

    <!-- 错误状态 -->
    <div v-if="error" class="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center gap-3">
      <UIcon name="lucide:alert-circle" class="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
      <div class="flex-1">
        <p class="text-sm font-medium text-red-700 dark:text-red-400">加载失败</p>
        <p class="text-xs text-red-500 mt-0.5">{{ error }}</p>
      </div>
      <button class="btn-glass text-sm px-3 py-1.5" @click="fetchRoles">重试</button>
    </div>

    <div v-if="!loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <div
        v-for="role in roles"
        :key="role.id"
        class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 transition-all duration-300 hover:shadow-lg group"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-2xl flex items-center justify-center" :class="role.iconBg">
              <UIcon :name="role.icon" class="w-6 h-6" :class="role.iconColor" />
            </div>
            <div>
              <h3 class="font-semibold text-slate-900 dark:text-white">{{ role.name }}</h3>
              <span class="text-xs text-slate-500 mt-0.5 block">{{ role.description }}</span>
            </div>
          </div>
          <UDropdownMenu>
            <button class="btn-glass p-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <UIcon name="lucide:more-horizontal" class="w-4 h-4" />
            </button>
            <template #items>
              <UDropdownMenuItem label="编辑角色" icon="lucide:edit" @click="openEditDialog(role)" />
              <UDropdownMenuItem label="权限配置" icon="lucide:shield" @click="openPermissionConfig(role)" />
              <UDropdownMenuItem
                v-if="!role.isSystem"
                label="删除角色"
                icon="lucide:trash-2"
                color="red"
                @click="deleteRole(role)"
              />
            </template>
          </UDropdownMenu>
        </div>

        <div class="flex items-center gap-6 mb-4">
          <div class="flex items-center gap-2">
            <UIcon name="lucide:users" class="w-4 h-4 text-slate-400" />
            <span class="text-sm text-slate-600 dark:text-slate-400">{{ role.memberCount }} 人</span>
          </div>
          <div class="flex items-center gap-2">
            <UIcon name="lucide:shield" class="w-4 h-4 text-slate-400" />
            <span class="text-sm text-slate-600 dark:text-slate-400">{{ role.permissionCount }} 项权限</span>
          </div>
        </div>

        <div class="flex flex-wrap gap-2">
          <span
            v-for="perm in role.permissionTags"
            :key="perm"
            class="px-2 py-0.5 text-xs rounded-lg bg-primary/10 text-primary border border-primary/20"
          >
            {{ perm }}
          </span>
        </div>

        <div v-if="role.isSystem" class="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
          <UBadge variant="secondary" size="sm">系统角色</UBadge>
        </div>
      </div>
    </div>

    <div v-if="!loading && roles.length === 0" class="text-center py-12">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 mb-4">
        <UIcon name="lucide:users" class="w-8 h-8 text-slate-400" />
      </div>
      <p class="text-slate-500">暂无角色</p>
    </div>

    <UDialog v-model="showRoleDialog" :title="editingRole ? '编辑角色' : '添加角色'" size="md">
      <div class="space-y-5">
        <div>
          <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">角色名称 <span class="text-red-500">*</span></label>
          <UInput v-model="roleForm.name" placeholder="例如：管理员、编辑者" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">描述</label>
          <UTextarea v-model="roleForm.description" placeholder="角色描述信息" rows="2" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">角色图标</label>
          <USelect v-model="roleForm.icon" :options="roleIconOptions" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">权限分配</label>
          <div class="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
            <label
              v-for="perm in availablePermissions"
              :key="perm.id"
              class="flex items-center gap-2 cursor-pointer"
            >
              <UCheckbox
                :model-value="roleForm.permissionIds.includes(perm.id)"
                @update:model-value="(val: boolean) => togglePermission(perm.id, val)"
              />
              <span class="text-sm text-slate-700 dark:text-slate-300">{{ perm.name }}</span>
            </label>
          </div>
        </div>
      </div>
      <template #footer>
        <button class="btn-glass" @click="showRoleDialog = false">取消</button>
        <button class="btn-glass btn-glass--primary" @click="saveRole">
          {{ editingRole ? '保存修改' : '创建角色' }}
        </button>
      </template>
    </UDialog>

    <UDialog v-model="showPermissionDialog" title="权限配置" size="lg">
      <div v-if="configRole" class="space-y-4">
        <div class="flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center" :class="configRole.iconBg">
            <UIcon :name="configRole.icon" class="w-5 h-5" :class="configRole.iconColor" />
          </div>
          <div>
            <p class="font-medium text-slate-900 dark:text-white">{{ configRole.name }}</p>
            <p class="text-xs text-slate-500">{{ configRole.description }}</p>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
          <label
            v-for="perm in availablePermissions"
            :key="perm.id"
            class="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <UCheckbox
              :model-value="configRole.permissionIds.includes(perm.id)"
              @update:model-value="(val: boolean) => toggleConfigPermission(perm.id, val)"
            />
            <div>
              <span class="text-sm font-medium text-slate-900 dark:text-white">{{ perm.name }}</span>
              <span class="text-xs text-slate-500 block">{{ perm.code }}</span>
            </div>
          </label>
        </div>
      </div>
      <template #footer>
        <button class="btn-glass" @click="showPermissionDialog = false">取消</button>
        <button class="btn-glass btn-glass--primary" @click="savePermissionConfig">保存配置</button>
      </template>
    </UDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue'
import { getRoles, createRole, updateRole, deleteRole as deleteRoleApi, getPermissions } from '~/composables/api/order-finance-access'

definePageMeta({
  layout: 'console',
})

interface Role {
  id: string
  name: string
  description: string
  icon: string
  iconBg: string
  iconColor: string
  memberCount: number
  permissionCount: number
  isSystem: boolean
  permissionIds: string[]
  permissionTags: string[]
}

interface AvailablePermission {
  id: string
  code: string
  name: string
}

const activeTab = ref('role')
const showRoleDialog = ref(false)
const showPermissionDialog = ref(false)
const editingRole = ref<Role | null>(null)
const configRole = ref<Role | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const tabs = [
  { key: 'menu', label: '菜单管理', icon: 'lucide:menu' },
  { key: 'permission', label: '权限管理', icon: 'lucide:shield' },
  { key: 'role', label: '角色管理', icon: 'lucide:users' },
]

const roleIconOptions = [
  { label: '盾牌', value: 'lucide:shield' },
  { label: '用户', value: 'lucide:users' },
  { label: '设置', value: 'lucide:settings' },
  { label: '编辑', value: 'lucide:edit' },
  { label: '眼睛', value: 'lucide:eye' },
  { label: '锁', value: 'lucide:lock' },
  { label: '星', value: 'lucide:star' },
  { label: '皇冠', value: 'lucide:crown' },
  { label: '旗帜', value: 'lucide:flag' },
]

const roleForm = reactive({
  name: '',
  description: '',
  icon: 'lucide:shield',
  permissionIds: [] as string[],
})

const roleIconColorMap: Record<string, { bg: string; color: string }> = {
  'lucide:shield': { bg: 'bg-blue-100 dark:bg-blue-900/30', color: 'text-blue-600 dark:text-blue-400' },
  'lucide:users': { bg: 'bg-green-100 dark:bg-green-900/30', color: 'text-green-600 dark:text-green-400' },
  'lucide:settings': { bg: 'bg-slate-100 dark:bg-slate-700/50', color: 'text-slate-600 dark:text-slate-400' },
  'lucide:edit': { bg: 'bg-purple-100 dark:bg-purple-900/30', color: 'text-purple-600 dark:text-purple-400' },
  'lucide:eye': { bg: 'bg-cyan-100 dark:bg-cyan-900/30', color: 'text-cyan-600 dark:text-cyan-400' },
  'lucide:lock': { bg: 'bg-red-100 dark:bg-red-900/30', color: 'text-red-600 dark:text-red-400' },
  'lucide:star': { bg: 'bg-amber-100 dark:bg-amber-900/30', color: 'text-amber-600 dark:text-amber-400' },
  'lucide:crown': { bg: 'bg-yellow-100 dark:bg-yellow-900/30', color: 'text-yellow-600 dark:text-yellow-400' },
  'lucide:flag': { bg: 'bg-orange-100 dark:bg-orange-900/30', color: 'text-orange-600 dark:text-orange-400' },
}

const roles = ref<Role[]>([])
const availablePermissions = ref<AvailablePermission[]>([])

async function fetchRoles() {
  loading.value = true
  error.value = null
  try {
    const data = await getRoles()
    roles.value = (data || []).map((item: any) => {
      const icons = roleIconColorMap['lucide:shield'] || { bg: 'bg-blue-100 dark:bg-blue-900/30', color: 'text-blue-600 dark:text-blue-400' }
      return {
        id: item.id,
        name: item.name,
        description: item.description || '',
        icon: 'lucide:shield',
        iconBg: icons.bg,
        iconColor: icons.color,
        memberCount: item.memberCount || 0,
        permissionCount: item.permissionCount || (item.permissions ? item.permissions.length : 0),
        isSystem: item.name === 'admin' || item.name === '超级管理员',
        permissionIds: item.permissions ? item.permissions.map((p: any) => p.id || p) : [],
        permissionTags: item.permissions ? item.permissions.slice(0, 3).map((p: any) => typeof p === 'string' ? p : p.name || p.code) : [],
      }
    })
  } catch (e: any) {
    error.value = e.message || '获取角色数据失败'
  } finally {
    loading.value = false
  }
}

async function fetchAvailablePermissions() {
  try {
    const data = await getPermissions()
    availablePermissions.value = (data || []).map((item: any) => ({
      id: item.id,
      code: item.code,
      name: item.name,
    }))
  } catch {
    // 静默失败，权限列表加载失败不影响角色展示
  }
}

onMounted(() => {
  fetchRoles()
  fetchAvailablePermissions()
})

function togglePermission(id: string, val: boolean) {
  if (val) {
    if (!roleForm.permissionIds.includes(id)) roleForm.permissionIds.push(id)
  } else {
    roleForm.permissionIds = roleForm.permissionIds.filter(pid => pid !== id)
  }
}

function toggleConfigPermission(id: string, val: boolean) {
  if (!configRole.value) return
  if (val) {
    if (!configRole.value.permissionIds.includes(id)) configRole.value.permissionIds.push(id)
  } else {
    configRole.value.permissionIds = configRole.value.permissionIds.filter(pid => pid !== id)
  }
}

function openAddDialog() {
  editingRole.value = null
  roleForm.name = ''
  roleForm.description = ''
  roleForm.icon = 'lucide:shield'
  roleForm.permissionIds = []
  showRoleDialog.value = true
}

function openEditDialog(role: Role) {
  editingRole.value = role
  roleForm.name = role.name
  roleForm.description = role.description
  roleForm.icon = role.icon
  roleForm.permissionIds = [...role.permissionIds]
  showRoleDialog.value = true
}

async function saveRole() {
  if (!roleForm.name.trim()) return

  const payload = {
    name: roleForm.name,
    description: roleForm.description,
    permissions: roleForm.permissionIds,
  }

  try {
    if (editingRole.value) {
      await updateRole(editingRole.value.id, payload)
    } else {
      await createRole(payload)
    }
    showRoleDialog.value = false
    await fetchRoles()
  } catch (e: any) {
    error.value = e.message || '保存角色失败'
  }
}

async function deleteRole(role: Role) {
  try {
    await deleteRoleApi(role.id)
    await fetchRoles()
  } catch (e: any) {
    error.value = e.message || '删除角色失败'
  }
}

function openPermissionConfig(role: Role) {
  configRole.value = { ...role, permissionIds: [...role.permissionIds] }
  showPermissionDialog.value = true
}

async function savePermissionConfig() {
  if (!configRole.value) return

  try {
    await updateRole(configRole.value.id, {
      permissions: configRole.value.permissionIds,
    })
    showPermissionDialog.value = false
    await fetchRoles()
  } catch (e: any) {
    error.value = e.message || '保存权限配置失败'
  }
}
</script>