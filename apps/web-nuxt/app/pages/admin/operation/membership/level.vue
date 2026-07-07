<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950/30">
    <div class="flex items-center justify-between mb-6">
      <div>
        <div class="flex items-center gap-4 mb-2">
          <div class="w-1 h-8 bg-gradient-to-b from-primary to-accent rounded-full"></div>
          <h1 class="font-display text-3xl font-bold text-slate-900 dark:text-white">会员等级管理</h1>
        </div>
        <p class="text-slate-600 dark:text-slate-400 ml-5">管理会员等级体系、经验值规则和等级权益</p>
      </div>
      <button class="btn-glass btn-glass--primary" @click="openCreateDialog">
        <UIcon name="lucide:plus" class="w-4 h-4" />
        新增等级
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <div
        v-for="level in levels"
        :key="level.id"
        class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 transition-all duration-300 hover:shadow-lg"
      >
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 rounded-xl flex items-center justify-center"
              :style="{ backgroundColor: level.color + '20', color: level.color }"
            >
              <UIcon :name="level.icon" class="w-5 h-5" />
            </div>
            <div>
              <p class="font-semibold text-slate-900 dark:text-white">{{ level.name }}</p>
              <p class="text-xs text-slate-500">Lv.{{ level.sortOrder }}</p>
            </div>
          </div>
          <span
            class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
            :class="level.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'"
          >
            {{ level.status === 'active' ? '启用' : '禁用' }}
          </span>
        </div>
        <div class="space-y-2 mb-4">
          <div class="flex items-center justify-between text-sm">
            <span class="text-slate-500">所需经验</span>
            <span class="font-medium text-slate-900 dark:text-white">{{ level.expRequired.toLocaleString() }} XP</span>
          </div>
          <div class="flex items-center justify-between text-sm">
            <span class="text-slate-500">成员数</span>
            <span class="font-medium text-slate-900 dark:text-white">{{ level.memberCount.toLocaleString() }}</span>
          </div>
        </div>
        <div class="pt-3 border-t border-slate-100 dark:border-slate-700">
          <p class="text-xs text-slate-500 line-clamp-2">{{ level.benefits }}</p>
        </div>
        <div class="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-700">
          <button class="btn-glass flex-1 text-xs py-1.5" @click="openEditDialog(level)">
            <UIcon name="lucide:edit" class="w-3 h-3" />
            编辑
          </button>
          <button
            class="btn-glass flex-1 text-xs py-1.5"
            :class="level.status === 'active' ? 'text-amber-600' : 'text-green-600'"
            @click="toggleStatus(level)"
          >
            <UIcon :name="level.status === 'active' ? 'lucide:eye-off' : 'lucide:eye'" class="w-3 h-3" />
            {{ level.status === 'active' ? '禁用' : '启用' }}
          </button>
        </div>
      </div>
    </div>

    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-500">等级名称</th>
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-500">等级图标</th>
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-500">所需经验值</th>
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-500">权益描述</th>
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-500">成员数</th>
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-500">状态</th>
              <th class="text-right px-6 py-4 text-sm font-medium text-slate-500">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="level in levels"
              :key="level.id"
              class="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div
                    class="w-8 h-8 rounded-lg flex items-center justify-center"
                    :style="{ backgroundColor: level.color + '20', color: level.color }"
                  >
                    <UIcon :name="level.icon" class="w-4 h-4" />
                  </div>
                  <span class="font-medium text-sm text-slate-900 dark:text-white">{{ level.name }}</span>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-slate-500">
                <code class="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">{{ level.icon }}</code>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm font-medium text-slate-900 dark:text-white">{{ level.expRequired.toLocaleString() }} XP</span>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm text-slate-500 max-w-xs line-clamp-2">{{ level.benefits }}</span>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm font-medium text-slate-900 dark:text-white">{{ level.memberCount.toLocaleString() }}</span>
              </td>
              <td class="px-6 py-4">
                <span
                  class="inline-flex items-center gap-1.5 text-sm"
                  :class="level.status === 'active' ? 'text-green-600 dark:text-green-400' : 'text-slate-500 dark:text-slate-400'"
                >
                  <span
                    class="w-2 h-2 rounded-full"
                    :class="level.status === 'active' ? 'bg-green-500' : 'bg-slate-400'"
                  ></span>
                  {{ level.status === 'active' ? '启用' : '禁用' }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <UDropdownMenu>
                  <button class="btn-glass p-2">
                    <UIcon name="lucide:more-horizontal" class="w-4 h-4" />
                  </button>
                  <template #items>
                    <UDropdownMenuItem label="编辑等级" icon="lucide:edit" @click="openEditDialog(level)" />
                    <UDropdownMenuItem
                      v-if="level.status === 'active'"
                      label="禁用等级"
                      icon="lucide:eye-off"
                      color="amber"
                      @click="toggleStatus(level)"
                    />
                    <UDropdownMenuItem
                      v-else
                      label="启用等级"
                      icon="lucide:eye"
                      color="green"
                      @click="toggleStatus(level)"
                    />
                    <UDropdownMenuItem label="删除等级" icon="lucide:trash-2" color="red" @click="deleteLevel(level)" />
                  </template>
                </UDropdownMenu>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="levels.length === 0" class="text-center py-12">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 mb-4">
          <UIcon name="lucide:medal" class="w-8 h-8 text-slate-400" />
        </div>
        <p class="text-slate-500">暂未创建会员等级</p>
      </div>
    </div>

    <UDialog v-model="showDialog" :title="editingItem ? '编辑会员等级' : '新增会员等级'" size="lg">
      <div class="space-y-5">
        <div>
          <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">等级名称 <span class="text-red-500">*</span></label>
          <UInput v-model="formData.name" placeholder="例如：黄金会员" />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">排序序号</label>
            <UInput v-model.number="formData.sortOrder" type="number" placeholder="1" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">所需经验值</label>
            <UInput v-model.number="formData.expRequired" type="number" placeholder="1000" />
            <p class="text-xs mt-1 text-slate-500">达到该经验值自动升级</p>
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">等级图标</label>
          <USelect v-model="formData.icon" :options="iconOptions" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">标识颜色</label>
          <div class="flex items-center gap-3">
            <UInput v-model="formData.color" placeholder="#8b5cf6" class="flex-1" />
            <div class="w-10 h-10 rounded-xl border-2 border-slate-200 dark:border-slate-600" :style="{ backgroundColor: formData.color }"></div>
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">权益描述</label>
          <UTextarea v-model="formData.benefits" placeholder="描述该等级享有的权益，每行一条" rows="4" />
          <p class="text-xs mt-1 text-slate-500">每行一条权益，支持换行输入</p>
        </div>
        <div>
          <label class="flex items-center gap-2 cursor-pointer">
            <UCheckbox v-model="formData.status" :checked="formData.status === 'active'" @change="formData.status = formData.status === 'active' ? 'disabled' : 'active'" />
            <span class="text-sm text-slate-700 dark:text-slate-300">启用该等级</span>
          </label>
        </div>
      </div>
      <template #footer>
        <button class="btn-glass" @click="showDialog = false">取消</button>
        <button class="btn-glass btn-glass--primary" @click="saveLevel">
          {{ editingItem ? '保存修改' : '创建等级' }}
        </button>
      </template>
    </UDialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

definePageMeta({
  layout: 'console',
})

interface MembershipLevel {
  id: string
  name: string
  icon: string
  color: string
  sortOrder: number
  expRequired: number
  benefits: string
  memberCount: number
  status: 'active' | 'disabled'
}

const showDialog = ref(false)
const editingItem = ref<MembershipLevel | null>(null)

const formData = ref({
  name: '',
  icon: 'lucide:star',
  color: '#6366f1',
  sortOrder: 1,
  expRequired: 0,
  benefits: '',
  status: 'active' as 'active' | 'disabled',
})

const iconOptions = [
  { label: '星星', value: 'lucide:star' },
  { label: '盾牌', value: 'lucide:shield' },
  { label: '皇冠', value: 'lucide:crown' },
  { label: '奖章', value: 'lucide:medal' },
  { label: '钻石', value: 'lucide:gem' },
  { label: '奖杯', value: 'lucide:trophy' },
  { label: '火花', value: 'lucide:sparkles' },
  { label: '火箭', value: 'lucide:rocket' },
  { label: '火焰', value: 'lucide:flame' },
  { label: '闪电', value: 'lucide:zap' },
  { label: '心形', value: 'lucide:heart' },
  { label: '太阳', value: 'lucide:sun' },
]

const levels = ref<MembershipLevel[]>([
  {
    id: '1',
    name: '普通会员',
    icon: 'lucide:star',
    color: '#6b7280',
    sortOrder: 1,
    expRequired: 0,
    benefits: '基础对话功能\n每日 50 次对话额度\n基础模型访问权限\n社区支持',
    memberCount: 4497,
    status: 'active',
  },
  {
    id: '2',
    name: '白银会员',
    icon: 'lucide:shield',
    color: '#94a3b8',
    sortOrder: 2,
    expRequired: 500,
    benefits: '每日 200 次对话额度\n高级模型访问权限\n知识库容量 1GB\n邮件优先支持',
    memberCount: 4498,
    status: 'active',
  },
  {
    id: '3',
    name: '黄金会员',
    icon: 'lucide:crown',
    color: '#f59e0b',
    sortOrder: 3,
    expRequired: 2000,
    benefits: '每日 1000 次对话额度\n所有模型访问权限\n知识库容量 10GB\nAgent 创建权限\n专属客服通道',
    memberCount: 2827,
    status: 'active',
  },
  {
    id: '4',
    name: '钻石会员',
    icon: 'lucide:gem',
    color: '#8b5cf6',
    sortOrder: 4,
    expRequired: 10000,
    benefits: '无限对话额度\n所有模型访问权限\n知识库容量 100GB\nAgent 创建与发布权限\nAPI 访问权限\n专属客户经理\n优先体验新功能',
    memberCount: 1028,
    status: 'active',
  },
])

function openCreateDialog() {
  editingItem.value = null
  formData.value = {
    name: '',
    icon: 'lucide:star',
    color: '#6366f1',
    sortOrder: levels.value.length + 1,
    expRequired: 0,
    benefits: '',
    status: 'active',
  }
  showDialog.value = true
}

function openEditDialog(level: MembershipLevel) {
  editingItem.value = level
  formData.value = {
    name: level.name,
    icon: level.icon,
    color: level.color,
    sortOrder: level.sortOrder,
    expRequired: level.expRequired,
    benefits: level.benefits,
    status: level.status,
  }
  showDialog.value = true
}

function saveLevel() {
  if (!formData.value.name.trim()) return

  if (editingItem.value) {
    const index = levels.value.findIndex(l => l.id === editingItem.value!.id)
    if (index > -1) {
      levels.value[index] = {
        ...levels.value[index],
        name: formData.value.name,
        icon: formData.value.icon,
        color: formData.value.color,
        sortOrder: formData.value.sortOrder,
        expRequired: formData.value.expRequired,
        benefits: formData.value.benefits,
        status: formData.value.status,
      }
    }
  } else {
    const newLevel: MembershipLevel = {
      id: Date.now().toString(),
      name: formData.value.name,
      icon: formData.value.icon,
      color: formData.value.color,
      sortOrder: formData.value.sortOrder,
      expRequired: formData.value.expRequired,
      benefits: formData.value.benefits,
      memberCount: 0,
      status: formData.value.status,
    }
    levels.value.push(newLevel)
  }

  showDialog.value = false
}

function toggleStatus(level: MembershipLevel) {
  level.status = level.status === 'active' ? 'disabled' : 'active'
}

function deleteLevel(level: MembershipLevel) {
  const index = levels.value.findIndex(l => l.id === level.id)
  if (index > -1) {
    levels.value.splice(index, 1)
  }
}
</script>