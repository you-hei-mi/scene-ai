<template>
  <div>
    <!-- 页面标题和操作 -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold">用户管理</h1>
        <p class="text-muted-foreground text-sm mt-1">管理系统用户和权限</p>
      </div>
      <UButton>
        <template #icon>
          <UIcon name="lucide:user-plus" class="w-4 h-4" />
        </template>
        添加用户
      </UButton>
    </div>

    <!-- 筛选和搜索 -->
    <UCard class="mb-6">
      <div class="flex flex-wrap items-center gap-4">
        <UInput v-model="searchKeyword" placeholder="搜索用户名/邮箱..." class="w-64">
          <template #leading>
            <UIcon name="lucide:search" class="w-4 h-4 text-muted-foreground" />
          </template>
        </UInput>
        <USelect v-model="roleFilter" :options="roleOptions" class="w-40" />
        <USelect v-model="statusFilter" :options="statusOptions" class="w-40" />
        <div class="flex-1"></div>
        <UButton variant="outline" @click="resetFilters">
          重置筛选
        </UButton>
      </div>
    </UCard>

    <!-- 用户列表表格 -->
    <UCard class="p-0">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-border">
              <th class="text-left px-4 py-3 text-sm font-medium text-muted-foreground w-12">
                <UCheckbox />
              </th>
              <th class="text-left px-4 py-3 text-sm font-medium text-muted-foreground">用户</th>
              <th class="text-left px-4 py-3 text-sm font-medium text-muted-foreground w-24">角色</th>
              <th class="text-left px-4 py-3 text-sm font-medium text-muted-foreground w-24">状态</th>
              <th class="text-left px-4 py-3 text-sm font-medium text-muted-foreground w-32">注册时间</th>
              <th class="text-left px-4 py-3 text-sm font-medium text-muted-foreground w-32">最后登录</th>
              <th class="text-right px-4 py-3 text-sm font-medium text-muted-foreground w-24">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="user in filteredUsers"
              :key="user.id"
              class="border-b border-border last:border-0 hover:bg-accent/30"
            >
              <td class="px-4 py-3">
                <UCheckbox />
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <UAvatar :text="user.nickname?.charAt(0) || user.username.charAt(0)" size="sm" />
                  <div>
                    <div class="font-medium text-sm">{{ user.nickname || user.username }}</div>
                    <div class="text-xs text-muted-foreground">{{ user.email }}</div>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3">
                <UBadge :variant="getRoleBadgeVariant(user.role)" size="sm">
                  {{ getRoleText(user.role) }}
                </UBadge>
              </td>
              <td class="px-4 py-3">
                <span
                  class="inline-flex items-center gap-1.5 text-sm"
                  :class="user.status === 'active' ? 'text-green-600' : 'text-red-600'"
                >
                  <span
                    class="w-2 h-2 rounded-full"
                    :class="user.status === 'active' ? 'bg-green-500' : 'bg-red-500'"
                  ></span>
                  {{ user.status === 'active' ? '正常' : '禁用' }}
                </span>
              </td>
              <td class="px-4 py-3 text-sm text-muted-foreground">{{ user.createdAt }}</td>
              <td class="px-4 py-3 text-sm text-muted-foreground">{{ user.lastLogin || '从未' }}</td>
              <td class="px-4 py-3 text-right">
                <UDropdownMenu>
                  <UButton variant="ghost" size="sm" icon="lucide:more-horizontal" />
                  <template #items>
                    <UDropdownMenuItem label="编辑用户" icon="lucide:edit" />
                    <UDropdownMenuItem label="重置密码" icon="lucide:key" />
                    <UDropdownMenuItem
                      v-if="user.status === 'active'"
                      label="禁用用户"
                      icon="lucide:user-x"
                      color="red"
                    />
                    <UDropdownMenuItem
                      v-else
                      label="启用用户"
                      icon="lucide:user-check"
                      color="green"
                    />
                    <UDropdownMenuItem label="删除用户" icon="lucide:trash-2" color="red" />
                  </template>
                </UDropdownMenu>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 空状态 -->
      <div v-if="filteredUsers.length === 0" class="text-center py-12">
        <UIcon name="lucide:users" class="w-12 h-12 mx-auto text-muted-foreground mb-3" />
        <p class="text-muted-foreground">未找到匹配的用户</p>
      </div>

      <!-- 分页 -->
      <div class="flex items-center justify-between px-4 py-3 border-t border-border">
        <div class="text-sm text-muted-foreground">
          共 {{ totalUsers }} 位用户
        </div>
        <div class="flex items-center gap-2">
          <UButton variant="outline" size="sm" icon="lucide:chevron-left" />
          <span class="text-sm">第 {{ currentPage }} / {{ totalPages }} 页</span>
          <UButton variant="outline" size="sm" icon="lucide:chevron-right" />
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

definePageMeta({
  layout: 'console',
})

/**
 * 用户接口定义
 */
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

/**
 * 搜索关键词
 */
const searchKeyword = ref('')

/**
 * 角色筛选
 */
const roleFilter = ref('all')

/**
 * 状态筛选
 */
const statusFilter = ref('all')

/**
 * 当前页码
 */
const currentPage = ref(1)

/**
 * 角色筛选选项
 */
const roleOptions = [
  { label: '全部角色', value: 'all' },
  { label: '超级管理员', value: 'super_admin' },
  { label: '管理员', value: 'admin' },
  { label: '普通用户', value: 'user' },
]

/**
 * 状态筛选选项
 */
const statusOptions = [
  { label: '全部状态', value: 'all' },
  { label: '正常', value: 'active' },
  { label: '禁用', value: 'disabled' },
]

/**
 * 模拟用户数据
 */
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

/**
 * 总用户数
 */
const totalUsers = computed(() => filteredUsers.value.length)

/**
 * 总页数
 */
const totalPages = computed(() => Math.ceil(totalUsers.value / 10) || 1)

/**
 * 根据筛选条件过滤后的用户列表
 */
const filteredUsers = computed(() => {
  let result = [...users.value]

  // 关键词搜索
  if (searchKeyword.value.trim()) {
    const kw = searchKeyword.value.toLowerCase()
    result = result.filter(
      u =>
        u.username.toLowerCase().includes(kw) ||
        u.nickname?.toLowerCase().includes(kw) ||
        u.email.toLowerCase().includes(kw)
    )
  }

  // 角色筛选
  if (roleFilter.value !== 'all') {
    result = result.filter(u => u.role === roleFilter.value)
  }

  // 状态筛选
  if (statusFilter.value !== 'all') {
    result = result.filter(u => u.status === statusFilter.value)
  }

  return result
})

/**
 * 获取角色显示文本
 * @param role - 角色标识符
 * @returns 角色显示名称
 */
function getRoleText(role: string): string {
  const map: Record<string, string> = {
    super_admin: '超级管理员',
    admin: '管理员',
    user: '普通用户',
  }
  return map[role] || role
}

/**
 * 获取角色徽章的样式变体
 * @param role - 角色标识符
 * @returns UBadge 的 variant 属性值
 */
function getRoleBadgeVariant(role: string): 'default' | 'secondary' | 'outline' {
  const map: Record<string, 'default' | 'secondary' | 'outline'> = {
    super_admin: 'default',
    admin: 'secondary',
    user: 'outline',
  }
  return map[role] || 'outline'
}

/**
 * 重置所有筛选条件
 */
function resetFilters() {
  searchKeyword.value = ''
  roleFilter.value = 'all'
  statusFilter.value = 'all'
  currentPage.value = 1
}
</script>
