<template>
  <div class="h-screen flex flex-col" style="background: var(--bg-deep)">
    <!-- 顶部导航栏 -->
    <header class="h-14 flex items-center justify-between px-4" style="border-bottom: 1px solid var(--glass-border); background: var(--glass-bg-nav)">
      <div class="flex items-center gap-3">
        <button class="btn-glass" @click="navigateTo('/chat')">
          <UIcon name="lucide:arrow-left" class="w-4 h-4" />
          返回
        </button>
        <h1 class="font-display font-semibold text-gradient" style="color: var(--text-primary)">设置</h1>
      </div>
    </header>

    <div class="flex-1 flex overflow-hidden">
      <!-- 左侧设置菜单 -->
      <aside class="w-56 border-r p-2" style="border-color: var(--glass-border); background: var(--glass-bg-nav)">
        <nav>
          <ul class="space-y-1">
            <li
              v-for="item in menuItems"
              :key="item.id"
              class="nav-item flex items-center gap-2 px-3 py-2 rounded-md text-sm cursor-pointer transition-colors"
              :class="activeTab === item.id ? 'nav-item--active' : ''"
              :style="activeTab === item.id ? { background: 'var(--nav-active-bg)', color: 'var(--text-primary)' } : { color: 'var(--text-secondary)' }"
              @click="activeTab = item.id"
            >
              <UIcon :name="item.icon" class="w-4 h-4" />
              <span>{{ item.label }}</span>
            </li>
          </ul>
        </nav>
      </aside>

      <!-- 右侧内容区 -->
      <div class="flex-1 overflow-y-auto">
        <div class="max-w-3xl mx-auto p-6">
          <!-- 个人信息 -->
          <template v-if="activeTab === 'profile'">
            <h2 class="font-display text-xl font-semibold mb-6" style="color: var(--text-primary)">个人信息</h2>
            <div class="glass-card mb-6 p-4">
              <div class="flex items-center gap-6 mb-6 pb-6" style="border-bottom: 1px solid var(--glass-border)">
                <!-- 头像上传 -->
                <div class="relative">
                  <div class="w-20 h-20 rounded-full flex items-center justify-center" style="background: var(--accent-soft-bg)">
                    <span class="text-2xl font-semibold" style="color: var(--accent-soft-text)">
                      {{ userStore.userInfo?.nickname?.charAt(0) || userStore.userInfo?.username?.charAt(0) || 'U' }}
                    </span>
                  </div>
                  <button
                    class="btn-glass absolute -bottom-2 -right-2 w-8 h-8 rounded-full p-0"
                  >
                    <UIcon name="lucide:camera" class="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <h3 class="text-lg font-medium" style="color: var(--text-primary)">{{ userStore.userInfo?.nickname || userStore.userInfo?.username }}</h3>
                  <p class="text-sm" style="color: var(--text-secondary)">{{ userStore.userInfo?.email }}</p>
                </div>
              </div>

              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium mb-1.5" style="color: var(--text-primary)">用户名</label>
                  <UInput v-model="profileForm.username" placeholder="请输入用户名" />
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1.5" style="color: var(--text-primary)">昵称</label>
                  <UInput v-model="profileForm.nickname" placeholder="请输入昵称" />
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1.5" style="color: var(--text-primary)">邮箱</label>
                  <UInput v-model="profileForm.email" type="email" placeholder="请输入邮箱" />
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1.5" style="color: var(--text-primary)">个人简介</label>
                  <textarea
                    v-model="profileForm.bio"
                    placeholder="介绍一下自己..."
                    class="w-full px-3 py-2 rounded-md focus:outline-none resize-none"
                    style="background: var(--glass-bg-1); border: 1px solid var(--glass-border); color: var(--text-primary); min-height: 80px"
                  ></textarea>
                </div>
              </div>
            </div>

            <div class="flex justify-end">
              <button class="btn-glass btn-glass--primary" :disabled="saving" @click="saveProfile">
                {{ saving ? '保存中...' : '保存修改' }}
              </button>
            </div>
          </template>

          <!-- 安全设置 -->
          <template v-if="activeTab === 'security'">
            <h2 class="font-display text-xl font-semibold mb-6" style="color: var(--text-primary)">安全设置</h2>
            <div class="glass-card mb-4 p-4">
              <div class="flex items-center justify-between py-3">
                <div>
                  <div class="font-medium" style="color: var(--text-primary)">修改密码</div>
                  <div class="text-sm" style="color: var(--text-secondary)">定期修改密码可以提高账户安全性</div>
                </div>
                <button class="btn-glass">修改</button>
              </div>
            </div>
            <div class="glass-card mb-4 p-4">
              <div class="flex items-center justify-between py-3">
                <div>
                  <div class="font-medium" style="color: var(--text-primary)">两步验证</div>
                  <div class="text-sm" style="color: var(--text-secondary)">使用手机验证码或身份验证器增强安全性</div>
                </div>
                <UBadge variant="outline" size="sm">未开启</UBadge>
              </div>
            </div>
            <div class="glass-card p-4">
              <div class="flex items-center justify-between py-3">
                <div>
                  <div class="font-medium" style="color: var(--text-primary)">登录设备管理</div>
                  <div class="text-sm" style="color: var(--text-secondary)">查看和管理当前登录的设备</div>
                </div>
                <button class="btn-glass">管理</button>
              </div>
            </div>
          </template>

          <!-- API 密钥 -->
          <template v-if="activeTab === 'api-keys'">
            <div class="flex items-center justify-between mb-6">
              <h2 class="font-display text-xl font-semibold" style="color: var(--text-primary)">API 密钥</h2>
              <button class="btn-glass btn-glass--primary" @click="showCreateKeyDialog = true">
                <UIcon name="lucide:plus" class="w-4 h-4" />
                创建新密钥
              </button>
            </div>

            <p class="text-sm mb-4" style="color: var(--text-secondary)">
              API 密钥用于通过编程方式访问 BuildingAI API。请妥善保管您的密钥，不要泄露给他人。
            </p>

            <div class="glass-card" style="padding: 0">
              <table class="w-full">
                <thead>
                  <tr style="border-bottom: 1px solid var(--glass-border)">
                    <th class="text-left px-4 py-3 text-sm font-medium" style="color: var(--text-secondary)">名称</th>
                    <th class="text-left px-4 py-3 text-sm font-medium" style="color: var(--text-secondary)">密钥</th>
                    <th class="text-left px-4 py-3 text-sm font-medium" style="color: var(--text-secondary)">创建时间</th>
                    <th class="text-left px-4 py-3 text-sm font-medium" style="color: var(--text-secondary)">最后使用</th>
                    <th class="text-right px-4 py-3 text-sm font-medium" style="color: var(--text-secondary)">操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(key, keyIndex) in apiKeys"
                    :key="key.id"
                    :style="{ borderBottom: keyIndex < apiKeys.length - 1 ? '1px solid var(--glass-border)' : 'none' }"
                  >
                    <td class="px-4 py-3 font-medium" style="color: var(--text-primary)">{{ key.name }}</td>
                    <td class="px-4 py-3">
                      <code class="text-sm font-mono" style="color: var(--text-secondary)">
                        {{ showKeyId === key.id ? key.value : maskKey(key.value) }}
                      </code>
                      <button
                        class="btn-glass ml-2"
                        @click="toggleKeyVisibility(key.id)"
                      >
                        <UIcon :name="showKeyId === key.id ? 'lucide:eye-off' : 'lucide:eye'" class="w-4 h-4" />
                      </button>
                    </td>
                    <td class="px-4 py-3 text-sm" style="color: var(--text-secondary)">{{ key.createdAt }}</td>
                    <td class="px-4 py-3 text-sm" style="color: var(--text-secondary)">{{ key.lastUsed || '从未' }}</td>
                    <td class="px-4 py-3 text-right">
                      <button
                        class="btn-glass"
                        @click="deleteApiKey(key.id)"
                      >
                        <UIcon name="lucide:trash-2" class="w-4 h-4" style="color: #ef4444" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div v-if="apiKeys.length === 0" class="text-center py-12">
                <UIcon name="lucide:key" class="w-12 h-12 mx-auto mb-3" style="color: var(--text-secondary)" />
                <p style="color: var(--text-secondary)">暂无 API 密钥</p>
              </div>
            </div>

            <UDialog v-model:open="showCreateKeyDialog" title="创建 API 密钥">
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium mb-1.5" style="color: var(--text-primary)">密钥名称</label>
                  <UInput v-model="newKeyName" placeholder="给密钥起个名字，方便识别" />
                </div>
              </div>
              <template #footer>
                <button class="btn-glass" @click="showCreateKeyDialog = false">
                  取消
                </button>
                <button class="btn-glass btn-glass--primary" @click="createApiKey">
                  创建
                </button>
              </template>
            </UDialog>
          </template>

          <!-- 模型设置 -->
          <template v-if="activeTab === 'models'">
            <h2 class="font-display text-xl font-semibold mb-6" style="color: var(--text-primary)">模型提供商</h2>
            <p class="text-sm mb-4" style="color: var(--text-secondary)">
              配置您的模型提供商 API Key，系统将使用您的密钥进行 API 调用。
            </p>

            <div class="space-y-4">
              <div
                v-for="provider in modelProviders"
                :key="provider.id"
                class="glass-card p-4 cursor-pointer"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-lg flex items-center justify-center" style="background: var(--glass-bg-1)">
                      <UIcon :name="provider.icon" class="w-5 h-5" style="color: var(--text-primary)" />
                    </div>
                    <div>
                      <div class="font-medium" style="color: var(--text-primary)">{{ provider.name }}</div>
                      <div class="text-sm" style="color: var(--text-secondary)">
                        {{ provider.status === 'configured' ? '已配置' : '未配置' }}
                      </div>
                    </div>
                  </div>
                  <UBadge
                    :variant="provider.status === 'configured' ? 'default' : 'outline'"
                    size="sm"
                  >
                    {{ provider.status === 'configured' ? '已启用' : '未启用' }}
                  </UBadge>
                </div>
                <div v-if="provider.status === 'configured'" class="mt-4 pt-4" style="border-top: 1px solid var(--glass-border)">
                  <div class="flex items-center gap-2">
                    <UInput
                      :value="maskApiKey(provider.apiKey || '')"
                      readonly
                      class="flex-1"
                    />
                    <button class="btn-glass" @click="editProvider(provider.id)">编辑</button>
                  </div>
                </div>
              </div>
            </div>
          </template>

          <!-- 团队管理 -->
          <template v-if="activeTab === 'team'">
            <div class="flex items-center justify-between mb-6">
              <h2 class="font-display text-xl font-semibold" style="color: var(--text-primary)">团队成员</h2>
              <button class="btn-glass btn-glass--primary">
                <UIcon name="lucide:user-plus" class="w-4 h-4" />
                邀请成员
              </button>
            </div>

            <div class="glass-card" style="padding: 0">
              <table class="w-full">
                <thead>
                  <tr style="border-bottom: 1px solid var(--glass-border)">
                    <th class="text-left px-4 py-3 text-sm font-medium" style="color: var(--text-secondary)">成员</th>
                    <th class="text-left px-4 py-3 text-sm font-medium" style="color: var(--text-secondary)">角色</th>
                    <th class="text-left px-4 py-3 text-sm font-medium" style="color: var(--text-secondary)">加入时间</th>
                    <th class="text-left px-4 py-3 text-sm font-medium" style="color: var(--text-secondary)">状态</th>
                    <th class="text-right px-4 py-3 text-sm font-medium" style="color: var(--text-secondary)">操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(member, memberIndex) in teamMembers"
                    :key="member.id"
                    :style="{ borderBottom: memberIndex < teamMembers.length - 1 ? '1px solid var(--glass-border)' : 'none' }"
                  >
                    <td class="px-4 py-3">
                      <div class="flex items-center gap-3">
                        <UAvatar :text="member.name.charAt(0)" size="sm" />
                        <div>
                          <div class="font-medium text-sm" style="color: var(--text-primary)">{{ member.name }}</div>
                          <div class="text-xs" style="color: var(--text-secondary)">{{ member.email }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-4 py-3">
                      <UBadge :variant="member.role === 'owner' ? 'default' : 'outline'" size="sm">
                        {{ roleText(member.role) }}
                      </UBadge>
                    </td>
                    <td class="px-4 py-3 text-sm" style="color: var(--text-secondary)">{{ member.joinedAt }}</td>
                    <td class="px-4 py-3">
                      <span class="inline-flex items-center gap-1.5 text-sm" style="color: var(--text-primary)">
                        <span
                          class="w-2 h-2 rounded-full"
                          style="background: #22c55e"
                        ></span>
                        {{ member.status }}
                      </span>
                    </td>
                    <td class="px-4 py-3 text-right">
                      <UDropdownMenu>
                        <button class="btn-glass">
                          <UIcon name="lucide:more-horizontal" class="w-4 h-4" />
                        </button>
                        <template #items>
                          <UDropdownMenuItem label="更改角色" icon="lucide:shield" />
                          <UDropdownMenuItem label="移除成员" icon="lucide:user-minus" color="red" />
                        </template>
                      </UDropdownMenu>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

/**
 * 用户存储 - 管理用户认证和个人信息
 */
const userStore = useUserStore()
const toast = useToast()

/**
 * 当前激活的设置标签页
 */
const activeTab = ref('profile')
const saving = ref(false)

/**
 * 左侧设置菜单项
 */
const menuItems = [
  { id: 'profile', label: '个人信息', icon: 'lucide:user' },
  { id: 'security', label: '安全设置', icon: 'lucide:shield' },
  { id: 'api-keys', label: 'API 密钥', icon: 'lucide:key' },
  { id: 'models', label: '模型设置', icon: 'lucide:cpu' },
  { id: 'team', label: '团队管理', icon: 'lucide:users' },
]

/**
 * 个人信息表单数据
 */
const profileForm = ref({
  username: '',
  nickname: '',
  email: '',
  bio: '',
})

/**
 * API 密钥列表
 */
const apiKeys = ref([
  {
    id: '1',
    name: '开发环境密钥',
    value: 'sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    createdAt: '2024-06-01',
    lastUsed: '2024-06-25',
  },
  {
    id: '2',
    name: '生产环境密钥',
    value: 'sk-yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy',
    createdAt: '2024-05-15',
    lastUsed: '2024-06-26',
  },
])

const showKeyId = ref<string | null>(null)
const showCreateKeyDialog = ref(false)
const newKeyName = ref('')

/**
 * 模型提供商配置
 */
const modelProviders = ref([
  {
    id: 'openai',
    name: 'OpenAI',
    icon: 'lucide:sparkles',
    status: 'configured' as const,
    apiKey: 'sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    icon: 'lucide:zap',
    status: 'configured' as const,
    apiKey: 'sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  },
  {
    id: 'anthropic',
    name: 'Anthropic Claude',
    icon: 'lucide:brain',
    status: 'unconfigured' as const,
    apiKey: '',
  },
  {
    id: 'qwen',
    name: '通义千问',
    icon: 'lucide:message-circle',
    status: 'unconfigured' as const,
    apiKey: '',
  },
])

/**
 * 团队成员列表
 */
const teamMembers = ref([
  {
    id: '1',
    name: '张三',
    email: 'zhangsan@example.com',
    role: 'owner',
    joinedAt: '2024-01-15',
    status: '活跃',
  },
  {
    id: '2',
    name: '李四',
    email: 'lisi@example.com',
    role: 'admin',
    joinedAt: '2024-02-20',
    status: '活跃',
  },
  {
    id: '3',
    name: '王五',
    email: 'wangwu@example.com',
    role: 'member',
    joinedAt: '2024-03-10',
    status: '活跃',
  },
  {
    id: '4',
    name: '赵六',
    email: 'zhaoliu@example.com',
    role: 'member',
    joinedAt: '2024-04-05',
    status: '待邀请',
  },
])

/**
 * 隐藏 API 密钥中间部分，只显示前后几位
 * @param key - 完整的 API 密钥
 * @returns 脱敏后的密钥字符串
 */
function maskKey(key: string): string {
  if (!key) return ''
  if (key.length <= 12) return key
  return key.slice(0, 6) + '...' + key.slice(-4)
}

/**
 * 切换 API 密钥的可见性
 * @param id - 密钥 ID
 */
function toggleKeyVisibility(id: string) {
  showKeyId.value = showKeyId.value === id ? null : id
}

/**
 * 隐藏完整 API 密钥，仅用于显示
 * @param key - 完整的 API 密钥
 * @returns 脱敏后的密钥
 */
function maskApiKey(key: string): string {
  return maskKey(key)
}

/**
 * 角色名称映射
 * @param role - 角色标识符
 * @returns 角色显示名称
 */
function roleText(role: string): string {
  const map: Record<string, string> = {
    owner: '所有者',
    admin: '管理员',
    member: '成员',
  }
  return map[role] || role
}

/**
 * 保存个人信息修改
 */
async function saveProfile() {
  saving.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    toast.add({ title: '保存成功', color: 'green' })
  } finally {
    saving.value = false
  }
}

/**
 * 创建新的 API 密钥
 */
async function createApiKey() {
  if (!newKeyName.value.trim()) {
    toast.add({ title: '请输入密钥名称', color: 'yellow' })
    return
  }
  
  const newKey = {
    id: Date.now().toString(),
    name: newKeyName.value,
    value: 'sk-' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
    createdAt: new Date().toISOString().split('T')[0],
    lastUsed: '从未',
  }
  
  apiKeys.value.unshift(newKey)
  showCreateKeyDialog.value = false
  newKeyName.value = ''
  toast.add({ title: '创建成功，请妥善保管密钥', color: 'green' })
}

/**
 * 删除 API 密钥
 * @param id - 密钥 ID
 */
function deleteApiKey(id: string) {
  const index = apiKeys.value.findIndex(k => k.id === id)
  if (index > -1) {
    apiKeys.value.splice(index, 1)
    toast.add({ title: '已删除', color: 'green' })
  }
}

/**
 * 编辑模型提供商配置
 * @param id - 提供商 ID
 */
function editProvider(id: string) {
  toast.add({ title: '编辑功能开发中', color: 'blue' })
}

/**
 * 组件挂载时初始化用户信息
 */
onMounted(() => {
  if (userStore.userInfo) {
    profileForm.value.username = userStore.userInfo.username
    profileForm.value.nickname = userStore.userInfo.nickname || ''
    profileForm.value.email = userStore.userInfo.email || ''
  }
})
</script>
