<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950/30">
    <div class="flex items-center justify-between mb-6">
      <div>
        <div class="flex items-center gap-4 mb-2">
          <div class="w-1 h-8 bg-gradient-to-b from-primary to-accent rounded-full"></div>
          <h1 class="font-display text-3xl font-bold text-slate-900 dark:text-white">用户管理</h1>
        </div>
        <p class="text-slate-600 dark:text-slate-400 ml-5">管理系统用户和权限</p>
      </div>
      <button class="btn-glass btn-glass--primary" @click="showAddDialog = true">
        <UIcon name="lucide:user-plus" class="w-4 h-4" />
        添加用户
      </button>
    </div>

    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-4 mb-6">
      <div class="flex flex-wrap items-center gap-4">
        <div class="relative w-64">
          <UIcon name="lucide:search" class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            v-model="searchKeyword" 
            placeholder="搜索用户名/邮箱..." 
            class="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          />
        </div>
        <USelect v-model="roleFilter" :options="roleOptions" class="w-40" />
        <USelect v-model="statusFilter" :options="statusOptions" class="w-40" />
        <div class="flex-1"></div>
        <button class="btn-glass" @click="resetFilters">
          重置筛选
        </button>
      </div>
    </div>

    <!-- 错误提示 -->
    <div v-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 mb-6 flex items-center gap-3">
      <UIcon name="lucide:alert-circle" class="w-5 h-5 text-red-500 flex-shrink-0" />
      <p class="text-sm text-red-700 dark:text-red-400">{{ error }}</p>
      <button class="ml-auto text-sm text-red-600 dark:text-red-400 hover:underline flex-shrink-0" @click="fetchUsers">重试</button>
    </div>

    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden relative">
      <!-- 加载遮罩 -->
      <div v-if="loading" class="absolute inset-0 bg-white/60 dark:bg-slate-800/60 z-10 flex items-center justify-center">
        <div class="flex items-center gap-2 text-slate-600 dark:text-slate-400">
          <UIcon name="lucide:loader-2" class="w-5 h-5 animate-spin" />
          <span class="text-sm">加载中...</span>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-500 w-12">
                <UCheckbox />
              </th>
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-500">用户</th>
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-500 w-24">角色</th>
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-500 w-24">状态</th>
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-500 w-32">注册时间</th>
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-500 w-32">最后登录</th>
              <th class="text-right px-6 py-4 text-sm font-medium text-slate-500 w-24">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="user in filteredUsers"
              :key="user.id"
              class="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <td class="px-6 py-4">
                <UCheckbox />
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <UAvatar :text="user.nickname?.charAt(0) || user.username.charAt(0)" size="sm" />
                  <div>
                    <div class="font-medium text-sm text-slate-900 dark:text-white">{{ user.nickname || user.username }}</div>
                    <div class="text-xs text-slate-500">{{ user.email }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <UBadge :variant="getRoleBadgeVariant(user.role)" size="sm">
                  {{ getRoleText(user.role) }}
                </UBadge>
              </td>
              <td class="px-6 py-4">
                <span
                  class="inline-flex items-center gap-1.5 text-sm"
                  :class="user.status === 'active' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'"
                >
                  <span
                    class="w-2 h-2 rounded-full"
                    :class="user.status === 'active' ? 'bg-green-500' : 'bg-red-500'"
                  ></span>
                  {{ user.status === 'active' ? '正常' : '禁用' }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-slate-500">{{ user.createdAt }}</td>
              <td class="px-6 py-4 text-sm text-slate-500">{{ user.lastLogin || '从未' }}</td>
              <td class="px-6 py-4 text-right">
                <UDropdownMenu>
                  <button class="btn-glass p-2">
                    <UIcon name="lucide:more-horizontal" class="w-4 h-4" />
                  </button>
                  <template #items>
                    <UDropdownMenuItem label="编辑用户" icon="lucide:edit" @click="openEditDialog(user)" />
                    <UDropdownMenuItem label="重置密码" icon="lucide:key" @click="openResetPasswordDialog(user)" />
                    <UDropdownMenuItem
                      v-if="user.status === 'active'"
                      label="禁用用户"
                      icon="lucide:user-x"
                      color="red"
                      @click="toggleUserStatus(user)"
                    />
                    <UDropdownMenuItem
                      v-else
                      label="启用用户"
                      icon="lucide:user-check"
                      color="green"
                      @click="toggleUserStatus(user)"
                    />
                    <UDropdownMenuItem label="删除用户" icon="lucide:trash-2" color="red" @click="deleteUserHandler(user)" />
                  </template>
                </UDropdownMenu>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="!loading && filteredUsers.length === 0" class="text-center py-12">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 mb-4">
          <UIcon name="lucide:users" class="w-8 h-8 text-slate-400" />
        </div>
        <p class="text-slate-500">{{ error ? '加载失败' : '未找到匹配的用户' }}</p>
      </div>

      <div class="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-700/30">
        <div class="text-sm text-slate-500">
          共 {{ totalUsers }} 位用户
        </div>
        <div class="flex items-center gap-2">
          <button class="btn-glass px-3 py-1.5 text-sm" :disabled="currentPage <= 1" @click="currentPage--; fetchUsers()">
            <UIcon name="lucide:chevron-left" class="w-4 h-4" />
          </button>
          <span class="text-sm font-medium text-slate-900 dark:text-white">第 {{ currentPage }} / {{ totalPages }} 页</span>
          <button class="btn-glass px-3 py-1.5 text-sm" :disabled="currentPage >= totalPages" @click="currentPage++; fetchUsers()">
            <UIcon name="lucide:chevron-right" class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Add/Edit User Dialog -->
    <UDialog v-model:open="showAddDialog" :title="editingUser ? '编辑用户' : '添加用户'">
      <template #body>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">用户名</label>
            <input
              v-model="formData.username"
              placeholder="请输入用户名"
              class="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
          </div>
          <div v-if="!editingUser">
            <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">密码</label>
            <input
              v-model="formData.password"
              type="password"
              placeholder="请输入密码"
              class="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">昵称</label>
            <input
              v-model="formData.nickname"
              placeholder="请输入昵称"
              class="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">邮箱</label>
            <input
              v-model="formData.email"
              type="email"
              placeholder="请输入邮箱"
              class="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">角色</label>
            <USelect v-model="formData.role" :options="roleOptions.slice(1)" />
          </div>
        </div>
      </template>
      <template #footer>
        <button class="btn-glass" @click="showAddDialog = false">取消</button>
        <button class="btn-glass btn-glass--primary" @click="saveUser">
          {{ editingUser ? '保存' : '创建' }}
        </button>
      </template>
    </UDialog>

    <!-- Reset Password Dialog -->
    <UDialog v-model:open="showResetDialog" title="重置密码">
      <template #body>
        <p class="text-sm text-slate-600 dark:text-slate-400 mb-4">
          正在为 <strong class="text-slate-900 dark:text-white">{{ resetTargetUser?.nickname || resetTargetUser?.username }}</strong> 重置密码
        </p>
        <div>
          <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">新密码</label>
          <input
            v-model="resetPassword"
            type="password"
            placeholder="请输入新密码"
            class="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          />
        </div>
      </template>
      <template #footer>
        <button class="btn-glass" @click="showResetDialog = false">取消</button>
        <button class="btn-glass btn-glass--primary" @click="confirmResetPassword">
          确认重置
        </button>
      </template>
    </UDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  setUserStatus,
  resetUserPassword,
  autoResetUserPassword,
} from '~/composables/api/core'
import type { UserInfo, PaginatedResult } from '~/composables/api/core'

definePageMeta({
  layout: 'console',
})

// ====== 本地类型（适配模板） ======
interface User {
  id: string
  username: string
  nickname: string
  email: string
  role: string
  status: 'active' | 'disabled'
  createdAt: string
  lastLogin: string
}

// ====== 状态 ======
const searchKeyword = ref('')
const roleFilter = ref('all')
const statusFilter = ref('all')
const currentPage = ref(1)
const pageSize = ref(10)

const users = ref<User[]>([])
const totalUsers = ref(0)
const loading = ref(false)
const error = ref<string | null>(null)

const totalPages = computed(() => Math.ceil(totalUsers.value / pageSize.value) || 1)

// ====== 下拉选项 ======
const roleOptions = [
  { label: '全部角色', value: 'all' },
  { label: '超级管理员', value: '超级管理员' },
  { label: '管理员', value: '管理员' },
  { label: '普通用户', value: '普通用户' },
]

const statusOptions = [
  { label: '全部状态', value: 'all' },
  { label: '正常', value: 'active' },
  { label: '禁用', value: 'disabled' },
]

// ====== API 数据映射 ======
function mapUser(apiUser: UserInfo): User {
  return {
    id: apiUser.id,
    username: apiUser.username,
    nickname: apiUser.nickname || '',
    email: apiUser.email || '',
    role: apiUser.role?.name || '普通用户',
    status: apiUser.status === 1 ? 'active' : 'disabled',
    createdAt: apiUser.createdAt || '',
    lastLogin: apiUser.updatedAt || '',
  }
}

// ====== 获取用户列表 ======
async function fetchUsers() {
  loading.value = true
  error.value = null
  try {
    const params: {
      page: number
      pageSize: number
      keyword?: string
      status?: number
    } = {
      page: currentPage.value,
      pageSize: pageSize.value,
    }
    if (searchKeyword.value.trim()) {
      params.keyword = searchKeyword.value.trim()
    }
    if (statusFilter.value !== 'all') {
      params.status = statusFilter.value === 'active' ? 1 : 0
    }
    const result: PaginatedResult<UserInfo> = await getUsers(params)
    totalUsers.value = result.total
    users.value = (result.items || []).map(mapUser)
  } catch (e: any) {
    error.value = e.message || '加载用户列表失败'
    users.value = []
    totalUsers.value = 0
  } finally {
    loading.value = false
  }
}

// ====== 按角色本地过滤 ======
const filteredUsers = computed(() => {
  if (roleFilter.value === 'all') {
    return users.value
  }
  return users.value.filter(u => u.role === roleFilter.value)
})

// ====== 角色显示 ======
function getRoleText(role: string): string {
  return role
}

function getRoleBadgeVariant(role: string): 'default' | 'secondary' | 'outline' {
  const map: Record<string, 'default' | 'secondary' | 'outline'> = {
    '超级管理员': 'default',
    '管理员': 'secondary',
    '普通用户': 'outline',
  }
  return map[role] || 'outline'
}

// ====== 筛选 ======
function resetFilters() {
  searchKeyword.value = ''
  roleFilter.value = 'all'
  statusFilter.value = 'all'
  currentPage.value = 1
  fetchUsers()
}

// 搜索关键词变化时重新获取
let searchTimer: ReturnType<typeof setTimeout> | null = null
watch(searchKeyword, () => {
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    currentPage.value = 1
    fetchUsers()
  }, 400)
})

// 状态筛选变化时重新获取
watch(statusFilter, () => {
  currentPage.value = 1
  fetchUsers()
})

// ====== 对话框状态 ======
const showAddDialog = ref(false)
const showResetDialog = ref(false)
const editingUser = ref<User | null>(null)
const resetTargetUser = ref<User | null>(null)
const resetPassword = ref('')

interface UserFormData {
  username: string
  nickname: string
  email: string
  password: string
  role: string
}

const formData = ref<UserFormData>({
  username: '',
  nickname: '',
  email: '',
  password: '',
  role: '普通用户',
})

// ====== 编辑用户 ======
function openEditDialog(user: User) {
  editingUser.value = user
  formData.value = {
    username: user.username,
    nickname: user.nickname || '',
    email: user.email,
    password: '',
    role: user.role,
  }
  showAddDialog.value = true
}

async function saveUser() {
  try {
    if (editingUser.value) {
      await updateUser(editingUser.value.id, {
        username: formData.value.username,
        nickname: formData.value.nickname,
        email: formData.value.email,
        role: formData.value.role,
      })
    } else {
      await createUser({
        username: formData.value.username,
        nickname: formData.value.nickname,
        email: formData.value.email,
        password: formData.value.password,
        role: formData.value.role,
      })
    }
    showAddDialog.value = false
    editingUser.value = null
    formData.value = { username: '', nickname: '', email: '', password: '', role: '普通用户' }
    await fetchUsers()
  } catch (e: any) {
    error.value = e.message || '保存用户失败'
  }
}

// ====== 重置密码 ======
function openResetPasswordDialog(user: User) {
  resetTargetUser.value = user
  resetPassword.value = ''
  showResetDialog.value = true
}

async function confirmResetPassword() {
  if (!resetTargetUser.value) return
  try {
    if (resetPassword.value.trim()) {
      await resetUserPassword(resetTargetUser.value.id, resetPassword.value)
    } else {
      await autoResetUserPassword(resetTargetUser.value.id)
    }
    showResetDialog.value = false
    resetTargetUser.value = null
    resetPassword.value = ''
  } catch (e: any) {
    error.value = e.message || '重置密码失败'
  }
}

// ====== 切换用户状态 ======
async function toggleUserStatus(user: User) {
  const newStatus = user.status === 'active' ? 0 : 1
  try {
    await setUserStatus(user.id, newStatus)
    user.status = user.status === 'active' ? 'disabled' : 'active'
  } catch (e: any) {
    error.value = e.message || '更新用户状态失败'
  }
}

// ====== 删除用户 ======
async function deleteUserHandler(user: User) {
  try {
    await deleteUser(user.id)
    users.value = users.value.filter(u => u.id !== user.id)
    totalUsers.value = Math.max(0, totalUsers.value - 1)
  } catch (e: any) {
    error.value = e.message || '删除用户失败'
  }
}

// ====== 初始化 ======
fetchUsers()
</script>