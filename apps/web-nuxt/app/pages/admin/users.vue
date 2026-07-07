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

    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
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
                    <UDropdownMenuItem label="删除用户" icon="lucide:trash-2" color="red" @click="deleteUser(user)" />
                  </template>
                </UDropdownMenu>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="filteredUsers.length === 0" class="text-center py-12">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 mb-4">
          <UIcon name="lucide:users" class="w-8 h-8 text-slate-400" />
        </div>
        <p class="text-slate-500">未找到匹配的用户</p>
      </div>

      <div class="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-700/30">
        <div class="text-sm text-slate-500">
          共 {{ totalUsers }} 位用户
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
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

definePageMeta({
  layout: 'console',
})

interface User {
  id: string
  username: string
  nickname?: string
  email: string
  role: 'super_admin' | 'admin' | 'user'
  status: 'active' | 'disabled'
  createdAt: string
  lastLogin?: string
}

const searchKeyword = ref('')
const roleFilter = ref('all')
const statusFilter = ref('all')
const currentPage = ref(1)

const roleOptions = [
  { label: '全部角色', value: 'all' },
  { label: '超级管理员', value: 'super_admin' },
  { label: '管理员', value: 'admin' },
  { label: '普通用户', value: 'user' },
]

const statusOptions = [
  { label: '全部状态', value: 'all' },
  { label: '正常', value: 'active' },
  { label: '禁用', value: 'disabled' },
]

const users = ref<User[]>([
  {
    id: '1',
    username: 'admin',
    nickname: '系统管理员',
    email: 'admin@buildingai.cc',
    role: 'super_admin',
    status: 'active',
    createdAt: '2024-01-01',
    lastLogin: '2024-06-26 10:30',
  },
  {
    id: '2',
    username: 'zhangsan',
    nickname: '张三',
    email: 'zhangsan@example.com',
    role: 'admin',
    status: 'active',
    createdAt: '2024-02-15',
    lastLogin: '2024-06-26 09:15',
  },
  {
    id: '3',
    username: 'lisi',
    nickname: '李四',
    email: 'lisi@example.com',
    role: 'user',
    status: 'active',
    createdAt: '2024-03-10',
    lastLogin: '2024-06-25 16:45',
  },
  {
    id: '4',
    username: 'wangwu',
    nickname: '王五',
    email: 'wangwu@example.com',
    role: 'user',
    status: 'active',
    createdAt: '2024-03-20',
    lastLogin: '2024-06-24 14:20',
  },
  {
    id: '5',
    username: 'zhaoliu',
    nickname: '赵六',
    email: 'zhaoliu@example.com',
    role: 'user',
    status: 'disabled',
    createdAt: '2024-04-05',
    lastLogin: '2024-05-20 11:30',
  },
  {
    id: '6',
    username: 'qianqi',
    nickname: '钱七',
    email: 'qianqi@example.com',
    role: 'admin',
    status: 'active',
    createdAt: '2024-04-18',
    lastLogin: '2024-06-26 08:00',
  },
  {
    id: '7',
    username: 'sunba',
    nickname: '孙八',
    email: 'sunba@example.com',
    role: 'user',
    status: 'active',
    createdAt: '2024-05-02',
    lastLogin: '2024-06-23 19:15',
  },
  {
    id: '8',
    username: 'zhoujiu',
    nickname: '周九',
    email: 'zhoujiu@example.com',
    role: 'user',
    status: 'active',
    createdAt: '2024-05-15',
    lastLogin: '2024-06-26 07:45',
  },
])

const totalUsers = computed(() => filteredUsers.value.length)
const totalPages = computed(() => Math.ceil(totalUsers.value / 10) || 1)

const filteredUsers = computed(() => {
  let result = [...users.value]

  if (searchKeyword.value.trim()) {
    const kw = searchKeyword.value.toLowerCase()
    result = result.filter(
      u =>
        u.username.toLowerCase().includes(kw) ||
        u.nickname?.toLowerCase().includes(kw) ||
        u.email.toLowerCase().includes(kw)
    )
  }

  if (roleFilter.value !== 'all') {
    result = result.filter(u => u.role === roleFilter.value)
  }

  if (statusFilter.value !== 'all') {
    result = result.filter(u => u.status === statusFilter.value)
  }

  return result
})

function getRoleText(role: string): string {
  const map: Record<string, string> = {
    super_admin: '超级管理员',
    admin: '管理员',
    user: '普通用户',
  }
  return map[role] || role
}

function getRoleBadgeVariant(role: string): 'default' | 'secondary' | 'outline' {
  const map: Record<string, 'default' | 'secondary' | 'outline'> = {
    super_admin: 'default',
    admin: 'secondary',
    user: 'outline',
  }
  return map[role] || 'outline'
}

function resetFilters() {
  searchKeyword.value = ''
  roleFilter.value = 'all'
  statusFilter.value = 'all'
  currentPage.value = 1
}

// Dialog state
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
  role: 'user',
})

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

function saveUser() {
  if (editingUser.value) {
    const idx = users.value.findIndex(u => u.id === editingUser.value!.id)
    if (idx !== -1) {
      users.value[idx] = {
        ...users.value[idx],
        username: formData.value.username,
        nickname: formData.value.nickname,
        email: formData.value.email,
        role: formData.value.role as 'super_admin' | 'admin' | 'user',
      }
    }
  } else {
    const newUser: User = {
      id: String(Date.now()),
      username: formData.value.username,
      nickname: formData.value.nickname,
      email: formData.value.email,
      role: formData.value.role as 'super_admin' | 'admin' | 'user',
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
    }
    users.value.unshift(newUser)
  }
  showAddDialog.value = false
  editingUser.value = null
  formData.value = { username: '', nickname: '', email: '', password: '', role: 'user' }
}

function openResetPasswordDialog(user: User) {
  resetTargetUser.value = user
  resetPassword.value = ''
  showResetDialog.value = true
}

function confirmResetPassword() {
  showResetDialog.value = false
  resetTargetUser.value = null
  resetPassword.value = ''
}

function toggleUserStatus(user: User) {
  user.status = user.status === 'active' ? 'disabled' : 'active'
}

function deleteUser(user: User) {
  const idx = users.value.findIndex(u => u.id === user.id)
  if (idx !== -1) {
    users.value.splice(idx, 1)
  }
}
</script>