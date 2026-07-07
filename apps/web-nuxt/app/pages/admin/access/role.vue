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
      <button class="btn-glass btn-glass--primary" @click="openAddRoleDialog">
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

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div
        v-for="role in roles"
        :key="role.id"
        class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden transition-all duration-300 hover:shadow-lg group"
      >
        <div class="p-6">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-12 h-12 rounded-xl flex items-center justify-center" :class="role.iconBg">
              <UIcon :name="role.icon" class="w-6 h-6" :class="role.iconColor" />
            </div>
            <div>
              <h3 class="text-lg font-semibold text-slate-900 dark:text-white">{{ role.name }}</h3>
              <p class="text-xs text-slate-500">{{ role.description }}</p>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3 mb-4">
            <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50">
              <p class="text-xs text-slate-500">成员数</p>
              <p class="text-xl font-bold text-slate-900 dark:text-white mt-0.5">{{ role.memberCount }}</p>
            </div>
            <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50">
              <p class="text-xs text-slate-500">权限数</p>
              <p class="text-xl font-bold text-slate-900 dark:text-white mt-0.5">{{ role.permissionCount }}</p>
            </div>
          </div>

          <div class="flex items-center gap-2 pt-4 border-t border-slate-100 dark:border-slate-700">
            <button class="btn-glass flex-1 text-sm" @click="openEditRoleDialog(role)">
              <UIcon name="lucide:edit" class="w-4 h-4" />
              编辑
            </button>
            <button
              v-if="!role.isSystem"
              class="btn-glass flex-1 text-sm text-red-500"
              @click="deleteRole(role)"
            >
              <UIcon name="lucide:trash-2" class="w-4 h-4" />
              删除
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
      <div class="mb-4 flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
        <h3 class="font-semibold text-lg text-slate-900 dark:text-white">角色详情</h3>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-500">角色名称</th>
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-500">标识</th>
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-500">描述</th>
              <th class="text-center px-6 py-4 text-sm font-medium text-slate-500">成员数</th>
              <th class="text-center px-6 py-4 text-sm font-medium text-slate-500">权限数</th>
              <th class="text-center px-6 py-4 text-sm font-medium text-slate-500">系统角色</th>
              <th class="text-right px-6 py-4 text-sm font-medium text-slate-500">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="role in roles"
              :key="role.id"
              class="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg flex items-center justify-center" :class="role.iconBg">
                    <UIcon :name="role.icon" class="w-4 h-4" :class="role.iconColor" />
                  </div>
                  <span class="font-medium text-sm text-slate-900 dark:text-white">{{ role.name }}</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <code class="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-slate-600 dark:text-slate-300">{{ role.code }}</code>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm text-slate-500">{{ role.description }}</span>
              </td>
              <td class="px-6 py-4 text-center">
                <span class="text-sm font-medium text-slate-900 dark:text-white">{{ role.memberCount }}</span>
              </td>
              <td class="px-6 py-4 text-center">
                <span class="text-sm font-medium text-slate-900 dark:text-white">{{ role.permissionCount }}</span>
              </td>
              <td class="px-6 py-4 text-center">
                <span
                  class="inline-flex items-center gap-1.5 text-sm"
                  :class="role.isSystem ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400'"
                >
                  <UIcon :name="role.isSystem ? 'lucide:shield-check' : 'lucide:shield'" class="w-3.5 h-3.5" />
                  {{ role.isSystem ? '是' : '否' }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <UDropdownMenu>
                  <button class="btn-glass p-2">
                    <UIcon name="lucide:more-horizontal" class="w-4 h-4" />
                  </button>
                  <template #items>
                    <UDropdownMenuItem label="编辑角色" icon="lucide:edit" @click="openEditRoleDialog(role)" />
                    <UDropdownMenuItem label="查看成员" icon="lucide:users" />
                    <UDropdownMenuItem v-if="!role.isSystem" label="删除角色" icon="lucide:trash-2" color="red" @click="deleteRole(role)" />
                  </template>
                </UDropdownMenu>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <UDialog v-model="showRoleDialog" :title="editingRole ? '编辑角色' : '添加角色'" size="lg">
      <div class="space-y-5">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">角色名称 <span class="text-red-500">*</span></label>
            <UInput v-model="roleForm.name" placeholder="例如：内容编辑" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">角色标识 <span class="text-red-500">*</span></label>
            <UInput v-model="roleForm.code" placeholder="例如：editor" :disabled="editingRole?.isSystem" />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">角色描述</label>
          <UTextarea v-model="roleForm.description" placeholder="描述该角色的职责和权限范围" rows="2" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-3 text-slate-700 dark:text-slate-300">权限分配</label>
          <div class="space-y-4 max-h-64 overflow-y-auto pr-2">
            <div
              v-for="group in permissionTree"
              :key="group.id"
              class="p-4 rounded-xl border border-slate-200 dark:border-slate-700"
            >
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2">
                  <UIcon :name="group.icon" class="w-4 h-4 text-slate-500" />
                  <span class="text-sm font-medium text-slate-900 dark:text-white">{{ group.name }}</span>
                </div>
                <label class="flex items-center gap-1 cursor-pointer">
                  <UCheckbox
                    :modelValue="isGroupAllChecked(group)"
                    @change="toggleGroupPermissions(group)"
                  />
                  <span class="text-xs text-slate-500">全选</span>
                </label>
              </div>
              <div class="grid grid-cols-2 gap-2">
                <label
                  v-for="perm in group.permissions"
                  :key="perm.id"
                  class="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer"
                >
                  <UCheckbox
                    :modelValue="roleForm.permissionIds.includes(perm.id)"
                    @change="togglePermission(perm.id)"
                  />
                  <span class="text-sm text-slate-700 dark:text-slate-300">{{ perm.name }}</span>
                </label>
              </div>
            </div>
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

definePageMeta({
  layout: 'console',
})

interface Role {
  id: string
  name: string
  code: string
  description: string
  icon: string
  iconBg: string
  iconColor: string
  memberCount: number
  permissionCount: number
  isSystem: boolean
  permissionIds: string[]
}

interface PermissionItem {
  id: string
  name: string
}

interface PermissionGroup {
  id: string
  name: string
  icon: string
  permissions: PermissionItem[]
}

const activeTab = ref('role')
const showRoleDialog = ref(false)
const editingRole = ref<Role | null>(null)

const tabs = [
  { key: 'menu', label: '菜单管理', icon: 'lucide:menu' },
  { key: 'permission', label: '权限管理', icon: 'lucide:shield' },
  { key: 'role', label: '角色管理', icon: 'lucide:users' },
]

const roleForm = reactive({
  name: '',
  code: '',
  description: '',
  permissionIds: [] as string[],
})

const permissionTree = ref<PermissionGroup[]>([
  {
    id: '1',
    name: '用户管理',
    icon: 'lucide:users',
    permissions: [
      { id: 'user:view', name: '查看用户' },
      { id: 'user:create', name: '创建用户' },
      { id: 'user:edit', name: '编辑用户' },
      { id: 'user:delete', name: '删除用户' },
      { id: 'user:status', name: '管理状态' },
      { id: 'user:role', name: '分配角色' },
      { id: 'user:export', name: '导出用户' },
      { id: 'user:import', name: '导入用户' },
    ],
  },
  {
    id: '2',
    name: '财务管理',
    icon: 'lucide:wallet',
    permissions: [
      { id: 'financial:view', name: '查看财务' },
      { id: 'financial:export', name: '导出财务' },
      { id: 'financial:recharge', name: '充值管理' },
      { id: 'financial:refund', name: '退款管理' },
      { id: 'financial:balance', name: '余额管理' },
      { id: 'financial:order', name: '订单管理' },
    ],
  },
  {
    id: '3',
    name: '权限管理',
    icon: 'lucide:shield',
    permissions: [
      { id: 'access:menu', name: '菜单管理' },
      { id: 'access:permission', name: '权限管理' },
      { id: 'access:role', name: '角色管理' },
      { id: 'access:assign', name: '权限分配' },
      { id: 'access:audit', name: '操作审计' },
    ],
  },
  {
    id: '4',
    name: '系统设置',
    icon: 'lucide:settings',
    permissions: [
      { id: 'settings:view', name: '查看设置' },
      { id: 'settings:edit', name: '修改设置' },
      { id: 'settings:mail', name: '邮件配置' },
      { id: 'settings:storage', name: '存储配置' },
    ],
  },
])

const roles = ref<Role[]>([
  {
    id: '1',
    name: '超级管理员',
    code: 'super_admin',
    description: '拥有系统所有权限，可管理所有功能和数据',
    icon: 'lucide:crown',
    iconBg: 'bg-amber-100 dark:bg-amber-900/30',
    iconColor: 'text-amber-600 dark:text-amber-400',
    memberCount: 2,
    permissionCount: 23,
    isSystem: true,
    permissionIds: permissionTree.value.flatMap(g => g.permissions.map(p => p.id)),
  },
  {
    id: '2',
    name: '管理员',
    code: 'admin',
    description: '拥有大部分管理权限，可管理用户、财务和运营',
    icon: 'lucide:shield',
    iconBg: 'bg-blue-100 dark:bg-blue-900/30',
    iconColor: 'text-blue-600 dark:text-blue-400',
    memberCount: 5,
    permissionCount: 18,
    isSystem: true,
    permissionIds: ['user:view', 'user:create', 'user:edit', 'user:status', 'user:export', 'financial:view', 'financial:export', 'financial:recharge', 'financial:balance', 'financial:order', 'access:menu', 'access:permission', 'access:role', 'access:assign', 'access:audit', 'settings:view', 'settings:edit', 'settings:mail'],
  },
  {
    id: '3',
    name: '普通用户',
    code: 'user',
    description: '基础用户权限，仅可查看个人信息和基础功能',
    icon: 'lucide:user',
    iconBg: 'bg-slate-100 dark:bg-slate-700/50',
    iconColor: 'text-slate-600 dark:text-slate-400',
    memberCount: 1280,
    permissionCount: 3,
    isSystem: true,
    permissionIds: ['user:view', 'financial:view', 'settings:view'],
  },
  {
    id: '4',
    name: '内容编辑',
    code: 'editor',
    description: '可管理内容、公告和运营相关功能',
    icon: 'lucide:edit',
    iconBg: 'bg-green-100 dark:bg-green-900/30',
    iconColor: 'text-green-600 dark:text-green-400',
    memberCount: 8,
    permissionCount: 10,
    isSystem: false,
    permissionIds: ['user:view', 'user:export', 'financial:view', 'access:menu', 'access:permission', 'access:audit', 'settings:view', 'financial:order', 'user:status', 'financial:export'],
  },
])

function isGroupAllChecked(group: PermissionGroup): boolean {
  return group.permissions.every(p => roleForm.permissionIds.includes(p.id))
}

function toggleGroupPermissions(group: PermissionGroup) {
  const allIds = group.permissions.map(p => p.id)
  const allChecked = isGroupAllChecked(group)

  if (allChecked) {
    roleForm.permissionIds = roleForm.permissionIds.filter(id => !allIds.includes(id))
  } else {
    const newIds = allIds.filter(id => !roleForm.permissionIds.includes(id))
    roleForm.permissionIds.push(...newIds)
  }
}

function togglePermission(permId: string) {
  const idx = roleForm.permissionIds.indexOf(permId)
  if (idx > -1) {
    roleForm.permissionIds.splice(idx, 1)
  } else {
    roleForm.permissionIds.push(permId)
  }
}

function openAddRoleDialog() {
  editingRole.value = null
  roleForm.name = ''
  roleForm.code = ''
  roleForm.description = ''
  roleForm.permissionIds = []
  showRoleDialog.value = true
}

function openEditRoleDialog(role: Role) {
  editingRole.value = role
  roleForm.name = role.name
  roleForm.code = role.code
  roleForm.description = role.description
  roleForm.permissionIds = [...role.permissionIds]
  showRoleDialog.value = true
}

function saveRole() {
  if (!roleForm.name.trim() || !roleForm.code.trim()) return

  if (editingRole.value) {
    const idx = roles.value.findIndex(r => r.id === editingRole.value!.id)
    if (idx > -1) {
      roles.value[idx] = {
        ...roles.value[idx],
        name: roleForm.name,
        code: roleForm.code,
        description: roleForm.description,
        permissionIds: [...roleForm.permissionIds],
        permissionCount: roleForm.permissionIds.length,
      }
    }
  } else {
    const iconMap: Record<number, { icon: string; iconBg: string; iconColor: string }> = {
      0: { icon: 'lucide:star', iconBg: 'bg-purple-100 dark:bg-purple-900/30', iconColor: 'text-purple-600 dark:text-purple-400' },
      1: { icon: 'lucide:zap', iconBg: 'bg-orange-100 dark:bg-orange-900/30', iconColor: 'text-orange-600 dark:text-orange-400' },
      2: { icon: 'lucide:heart', iconBg: 'bg-red-100 dark:bg-red-900/30', iconColor: 'text-red-600 dark:text-red-400' },
      3: { icon: 'lucide:gem', iconBg: 'bg-cyan-100 dark:bg-cyan-900/30', iconColor: 'text-cyan-600 dark:text-cyan-400' },
    }
    const iconIdx = roles.value.filter(r => !r.isSystem).length % 4
    const icons = iconMap[iconIdx]

    roles.value.push({
      id: Date.now().toString(),
      name: roleForm.name,
      code: roleForm.code,
      description: roleForm.description,
      icon: icons.icon,
      iconBg: icons.iconBg,
      iconColor: icons.iconColor,
      memberCount: 0,
      permissionCount: roleForm.permissionIds.length,
      isSystem: false,
      permissionIds: [...roleForm.permissionIds],
    })
  }

  showRoleDialog.value = false
}

function deleteRole(role: Role) {
  if (role.isSystem) return
  const idx = roles.value.findIndex(r => r.id === role.id)
  if (idx > -1) {
    roles.value.splice(idx, 1)
  }
}
</script>