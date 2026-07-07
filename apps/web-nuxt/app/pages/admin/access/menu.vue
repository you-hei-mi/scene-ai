<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950/30">
    <div class="flex items-center justify-between mb-6">
      <div>
        <div class="flex items-center gap-4 mb-2">
          <div class="w-1 h-8 bg-gradient-to-b from-primary to-accent rounded-full"></div>
          <h1 class="font-display text-3xl font-bold text-slate-900 dark:text-white">权限管理</h1>
        </div>
        <p class="text-slate-600 dark:text-slate-400 ml-5">菜单管理</p>
      </div>
      <button class="btn-glass btn-glass--primary" @click="openAddMenuDialog(null)">
        <UIcon name="lucide:plus" class="w-4 h-4" />
        添加菜单
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

    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-4 mb-6">
      <div class="flex items-center gap-4">
        <button class="btn-glass text-sm" @click="expandAll">
          <UIcon name="lucide:unfold-vertical" class="w-4 h-4" />
          全部展开
        </button>
        <button class="btn-glass text-sm" @click="collapseAll">
          <UIcon name="lucide:fold-vertical" class="w-4 h-4" />
          全部折叠
        </button>
        <div class="flex-1"></div>
        <button class="btn-glass btn-glass--primary text-sm" @click="saveMenuOrder">
          <UIcon name="lucide:save" class="w-4 h-4" />
          保存排序
        </button>
      </div>
    </div>

    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
      <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
        <div class="grid grid-cols-12 gap-4 text-sm font-medium text-slate-500">
          <div class="col-span-5">菜单名称</div>
          <div class="col-span-2">路径</div>
          <div class="col-span-1">图标</div>
          <div class="col-span-1">排序</div>
          <div class="col-span-1">显示</div>
          <div class="col-span-2 text-right">操作</div>
        </div>
      </div>

      <div class="divide-y divide-slate-100 dark:divide-slate-700">
        <template v-for="menu in menuTree" :key="menu.id">
          <div class="px-6 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
            <div class="grid grid-cols-12 gap-4 items-center">
              <div class="col-span-5 flex items-center gap-3">
                <button
                  v-if="menu.children && menu.children.length > 0"
                  class="btn-glass p-1"
                  @click="toggleExpand(menu)"
                >
                  <UIcon
                    :name="menu.expanded ? 'lucide:chevron-down' : 'lucide:chevron-right'"
                    class="w-4 h-4"
                  />
                </button>
                <span v-else class="w-7"></span>
                <button class="btn-glass p-1 cursor-grab" @mousedown="startDrag(menu, $event)">
                  <UIcon name="lucide:grip-vertical" class="w-4 h-4 text-slate-400" />
                </button>
                <UIcon :name="menu.icon" class="w-5 h-5" :class="menu.iconColor || 'text-primary'" />
                <div>
                  <div class="font-medium text-sm text-slate-900 dark:text-white">{{ menu.name }}</div>
                  <div v-if="menu.children && menu.children.length > 0" class="text-xs text-slate-400">
                    {{ menu.children.length }} 个子菜单
                  </div>
                </div>
              </div>
              <div class="col-span-2">
                <code class="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-slate-600 dark:text-slate-300">{{ menu.path }}</code>
              </div>
              <div class="col-span-1">
                <UIcon :name="menu.icon" class="w-4 h-4 text-slate-500" />
              </div>
              <div class="col-span-1">
                <span class="text-sm text-slate-500">{{ menu.sort }}</span>
              </div>
              <div class="col-span-1">
                <span
                  class="inline-flex items-center gap-1.5 text-sm"
                  :class="menu.visible ? 'text-green-600 dark:text-green-400' : 'text-slate-400'"
                >
                  <span
                    class="w-2 h-2 rounded-full"
                    :class="menu.visible ? 'bg-green-500' : 'bg-slate-400'"
                  ></span>
                  {{ menu.visible ? '显示' : '隐藏' }}
                </span>
              </div>
              <div class="col-span-2 text-right flex items-center justify-end gap-1">
                <button class="btn-glass p-1.5" @click="openAddMenuDialog(menu)">
                  <UIcon name="lucide:plus" class="w-3.5 h-3.5" />
                </button>
                <button class="btn-glass p-1.5" @click="openEditMenuDialog(menu)">
                  <UIcon name="lucide:edit" class="w-3.5 h-3.5" />
                </button>
                <button class="btn-glass p-1.5 text-red-500" @click="deleteMenu(menu)">
                  <UIcon name="lucide:trash-2" class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          <template v-if="menu.children && menu.children.length > 0 && menu.expanded">
            <div
              v-for="child in menu.children"
              :key="child.id"
              class="px-6 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors bg-slate-50/50 dark:bg-slate-700/30"
            >
              <div class="grid grid-cols-12 gap-4 items-center">
                <div class="col-span-5 flex items-center gap-3 pl-14">
                  <button class="btn-glass p-1 cursor-grab" @mousedown="startDrag(child, $event)">
                    <UIcon name="lucide:grip-vertical" class="w-4 h-4 text-slate-400" />
                  </button>
                  <UIcon :name="child.icon" class="w-4 h-4 text-slate-400" />
                  <span class="text-sm text-slate-700 dark:text-slate-300">{{ child.name }}</span>
                </div>
                <div class="col-span-2">
                  <code class="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-slate-600 dark:text-slate-300">{{ child.path }}</code>
                </div>
                <div class="col-span-1">
                  <UIcon :name="child.icon" class="w-4 h-4 text-slate-400" />
                </div>
                <div class="col-span-1">
                  <span class="text-sm text-slate-500">{{ child.sort }}</span>
                </div>
                <div class="col-span-1">
                  <span
                    class="inline-flex items-center gap-1.5 text-sm"
                    :class="child.visible ? 'text-green-600 dark:text-green-400' : 'text-slate-400'"
                  >
                    <span
                      class="w-2 h-2 rounded-full"
                      :class="child.visible ? 'bg-green-500' : 'bg-slate-400'"
                    ></span>
                    {{ child.visible ? '显示' : '隐藏' }}
                  </span>
                </div>
                <div class="col-span-2 text-right flex items-center justify-end gap-1">
                  <button class="btn-glass p-1.5" @click="openEditMenuDialog(child)">
                    <UIcon name="lucide:edit" class="w-3.5 h-3.5" />
                  </button>
                  <button class="btn-glass p-1.5 text-red-500" @click="deleteMenu(child)">
                    <UIcon name="lucide:trash-2" class="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </template>
        </template>
      </div>

      <div v-if="menuTree.length === 0" class="text-center py-12">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 mb-4">
          <UIcon name="lucide:menu" class="w-8 h-8 text-slate-400" />
        </div>
        <p class="text-slate-500">暂无菜单项</p>
      </div>
    </div>

    <UDialog v-model="showMenuDialog" :title="editingMenu ? '编辑菜单' : addingChildMenu ? `添加子菜单 - ${addingChildMenu.name}` : '添加菜单'" size="md">
      <div class="space-y-5">
        <div>
          <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">菜单名称 <span class="text-red-500">*</span></label>
          <UInput v-model="menuForm.name" placeholder="菜单显示名称" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">路由路径</label>
          <UInput v-model="menuForm.path" placeholder="/admin/example" />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">图标</label>
            <USelect v-model="menuForm.icon" :options="iconOptions" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">父级菜单</label>
            <USelect v-model="menuForm.parentId" :options="parentOptions" />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">排序</label>
            <UInput v-model.number="menuForm.sort" type="number" placeholder="0" />
          </div>
          <div class="flex items-end pb-1">
            <label class="flex items-center gap-2 cursor-pointer">
              <UCheckbox v-model="menuForm.visible" />
              <span class="text-sm text-slate-700 dark:text-slate-300">显示菜单</span>
            </label>
          </div>
        </div>
      </div>
      <template #footer>
        <button class="btn-glass" @click="showMenuDialog = false">取消</button>
        <button class="btn-glass btn-glass--primary" @click="saveMenu">确认</button>
      </template>
    </UDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'

definePageMeta({
  layout: 'console',
})

interface MenuItem {
  id: string
  name: string
  path: string
  icon: string
  iconColor?: string
  sort: number
  visible: boolean
  parentId: string | null
  children?: MenuItem[]
  expanded?: boolean
}

const activeTab = ref('menu')
const showMenuDialog = ref(false)
const editingMenu = ref<MenuItem | null>(null)
const addingChildMenu = ref<MenuItem | null>(null)

const tabs = [
  { key: 'menu', label: '菜单管理', icon: 'lucide:menu' },
  { key: 'permission', label: '权限管理', icon: 'lucide:shield' },
  { key: 'role', label: '角色管理', icon: 'lucide:users' },
]

const iconOptions = [
  { label: '仪表盘', value: 'lucide:layout-dashboard' },
  { label: '用户', value: 'lucide:users' },
  { label: '设置', value: 'lucide:settings' },
  { label: '对话', value: 'lucide:message-circle' },
  { label: '钱包', value: 'lucide:wallet' },
  { label: '图表', value: 'lucide:bar-chart-3' },
  { label: '文件', value: 'lucide:files' },
  { label: '盾牌', value: 'lucide:shield' },
  { label: '通知', value: 'lucide:bell' },
  { label: '商店', value: 'lucide:shopping-cart' },
  { label: '标签', value: 'lucide:tags' },
  { label: '链接', value: 'lucide:link' },
]

const menuForm = reactive({
  name: '',
  path: '',
  icon: 'lucide:link',
  parentId: '' as string | null,
  sort: 0,
  visible: true,
})

const parentOptions = computed(() => {
  const options = [{ label: '无 (顶级菜单)', value: '' }]
  menuTree.value.forEach(m => {
    options.push({ label: m.name, value: m.id })
  })
  return options
})

const menuTree = ref<MenuItem[]>([
  {
    id: '1',
    name: '仪表盘',
    path: '/admin',
    icon: 'lucide:layout-dashboard',
    iconColor: 'text-primary',
    sort: 1,
    visible: true,
    parentId: null,
    expanded: true,
  },
  {
    id: '2',
    name: '用户管理',
    path: '/admin/users',
    icon: 'lucide:users',
    iconColor: 'text-blue-600 dark:text-blue-400',
    sort: 2,
    visible: true,
    parentId: null,
    expanded: true,
    children: [
      { id: '2-1', name: '用户列表', path: '/admin/users', icon: 'lucide:list', sort: 1, visible: true, parentId: '2' },
      { id: '2-2', name: '用户角色', path: '/admin/users/roles', icon: 'lucide:shield', sort: 2, visible: true, parentId: '2' },
    ],
  },
  {
    id: '3',
    name: '财务管理',
    path: '/admin/financial',
    icon: 'lucide:wallet',
    iconColor: 'text-green-600 dark:text-green-400',
    sort: 3,
    visible: true,
    parentId: null,
    expanded: true,
    children: [
      { id: '3-1', name: '财务分析', path: '/admin/financial/analysis', icon: 'lucide:bar-chart-3', sort: 1, visible: true, parentId: '3' },
      { id: '3-2', name: '余额明细', path: '/admin/financial/balance-details', icon: 'lucide:list', sort: 2, visible: true, parentId: '3' },
    ],
  },
  {
    id: '4',
    name: '渠道管理',
    path: '/admin/channel',
    icon: 'lucide:share-2',
    iconColor: 'text-purple-600 dark:text-purple-400',
    sort: 4,
    visible: true,
    parentId: null,
    expanded: true,
    children: [
      { id: '4-1', name: '微信公众号', path: '/admin/channel/wechat-oa', icon: 'lucide:link', sort: 1, visible: true, parentId: '4' },
    ],
  },
  {
    id: '5',
    name: '权限管理',
    path: '/admin/access',
    icon: 'lucide:shield',
    iconColor: 'text-red-600 dark:text-red-400',
    sort: 5,
    visible: true,
    parentId: null,
    expanded: true,
    children: [
      { id: '5-1', name: '菜单管理', path: '/admin/access/menu', icon: 'lucide:menu', sort: 1, visible: true, parentId: '5' },
      { id: '5-2', name: '权限管理', path: '/admin/access/permission', icon: 'lucide:key', sort: 2, visible: true, parentId: '5' },
      { id: '5-3', name: '角色管理', path: '/admin/access/role', icon: 'lucide:users', sort: 3, visible: true, parentId: '5' },
    ],
  },
  {
    id: '6',
    name: '系统设置',
    path: '/admin/settings',
    icon: 'lucide:settings',
    iconColor: 'text-slate-600 dark:text-slate-400',
    sort: 6,
    visible: true,
    parentId: null,
    expanded: false,
  },
])

function toggleExpand(menu: MenuItem) {
  menu.expanded = !menu.expanded
}

function expandAll() {
  menuTree.value.forEach(m => { m.expanded = true })
}

function collapseAll() {
  menuTree.value.forEach(m => { m.expanded = false })
}

function openAddMenuDialog(parent: MenuItem | null) {
  editingMenu.value = null
  addingChildMenu.value = parent
  menuForm.name = ''
  menuForm.path = ''
  menuForm.icon = 'lucide:link'
  menuForm.parentId = parent ? parent.id : ''
  menuForm.sort = 0
  menuForm.visible = true
  showMenuDialog.value = true
}

function openEditMenuDialog(menu: MenuItem) {
  editingMenu.value = menu
  addingChildMenu.value = null
  menuForm.name = menu.name
  menuForm.path = menu.path
  menuForm.icon = menu.icon
  menuForm.parentId = menu.parentId
  menuForm.sort = menu.sort
  menuForm.visible = menu.visible
  showMenuDialog.value = true
}

function saveMenu() {
  if (!menuForm.name.trim()) return

  const newItem: MenuItem = {
    id: editingMenu.value?.id || Date.now().toString(),
    name: menuForm.name,
    path: menuForm.path,
    icon: menuForm.icon,
    sort: menuForm.sort,
    visible: menuForm.visible,
    parentId: menuForm.parentId || null,
    expanded: true,
  }

  if (editingMenu.value) {
    const isChild = editingMenu.value.parentId !== null
    if (isChild) {
      for (const parent of menuTree.value) {
        if (parent.children) {
          const idx = parent.children.findIndex(c => c.id === editingMenu.value!.id)
          if (idx > -1) {
            parent.children[idx] = { ...parent.children[idx], ...newItem }
            break
          }
        }
      }
    } else {
      const idx = menuTree.value.findIndex(m => m.id === editingMenu.value!.id)
      if (idx > -1) {
        menuTree.value[idx] = { ...menuTree.value[idx], ...newItem, children: menuTree.value[idx].children }
      }
    }
  } else {
    if (menuForm.parentId) {
      const parent = menuTree.value.find(m => m.id === menuForm.parentId)
      if (parent) {
        if (!parent.children) parent.children = []
        parent.children.push(newItem)
      }
    } else {
      menuTree.value.push(newItem)
    }
  }

  showMenuDialog.value = false
}

function deleteMenu(menu: MenuItem) {
  if (menu.parentId !== null) {
    for (const parent of menuTree.value) {
      if (parent.children) {
        const idx = parent.children.findIndex(c => c.id === menu.id)
        if (idx > -1) {
          parent.children.splice(idx, 1)
          break
        }
      }
    }
  } else {
    const idx = menuTree.value.findIndex(m => m.id === menu.id)
    if (idx > -1) {
      menuTree.value.splice(idx, 1)
    }
  }
}

function startDrag(menu: MenuItem, _event: MouseEvent) {
  console.log('开始拖拽:', menu.name)
}

function saveMenuOrder() {
  console.log('保存菜单排序:', menuTree.value)
}
</script>