<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950/30">
    <div class="flex items-center justify-between mb-6">
      <div>
        <div class="flex items-center gap-4 mb-2">
          <div class="w-1 h-8 bg-gradient-to-b from-primary to-accent rounded-full"></div>
          <h1 class="font-display text-3xl font-bold text-slate-900 dark:text-white">CDK 设置</h1>
        </div>
        <p class="text-slate-600 dark:text-slate-400 ml-5">配置 CDK 默认规则和使用限制</p>
      </div>
      <div class="flex gap-3">
        <NuxtLink to="/admin/operation/cdk/management" class="btn-glass">
          <UIcon name="lucide:arrow-left" class="w-4 h-4" />
          返回
        </NuxtLink>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-6">
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
        <div class="mb-6">
          <h2 class="text-lg font-semibold text-slate-900 dark:text-white">有效期设置</h2>
          <p class="text-sm mt-1 text-slate-500">配置 CDK 生成后默认的有效期规则</p>
        </div>
        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">默认有效期天数</label>
            <div class="grid grid-cols-2 gap-4">
              <UInput v-model.number="settings.defaultExpireDays" type="number" placeholder="365" />
            </div>
            <p class="text-xs mt-1 text-slate-500">生成 CDK 后 N 天内有效，0 表示永不过期</p>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">是否自动过期</label>
            <USelect v-model="settings.autoExpire" :options="yesNoOptions" />
            <p class="text-xs mt-1 text-slate-500">过期后 CDK 将无法再被兑换</p>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">过期提醒提前天数</label>
            <UInput v-model.number="settings.expireRemindDays" type="number" placeholder="7" />
            <p class="text-xs mt-1 text-slate-500">到期前 N 天给用户发送提醒通知</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
        <div class="mb-6">
          <h2 class="text-lg font-semibold text-slate-900 dark:text-white">生成规则</h2>
          <p class="text-sm mt-1 text-slate-500">配置 CDK 生成格式和长度</p>
        </div>
        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">CDK 长度</label>
            <USelect v-model="settings.codeLength" :options="lengthOptions" />
            <p class="text-xs mt-1 text-slate-500">总长度不包含分隔符</p>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">字符集</label>
            <div class="space-y-2">
              <label class="flex items-center gap-2 cursor-pointer">
                <UCheckbox v-model="settings.charset.uppercase" />
                <span class="text-sm text-slate-700 dark:text-slate-300">大写字母 (A-Z)</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <UCheckbox v-model="settings.charset.lowercase" />
                <span class="text-sm text-slate-700 dark:text-slate-300">小写字母 (a-z)</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <UCheckbox v-model="settings.charset.numbers" />
                <span class="text-sm text-slate-700 dark:text-slate-300">数字 (0-9)</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <UCheckbox v-model="settings.charset.symbols" />
                <span class="text-sm text-slate-700 dark:text-slate-300">符号 (-_)</span>
              </label>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">分组格式</label>
            <USelect v-model="settings.groupFormat" :options="groupFormatOptions" />
            <p class="text-xs mt-1 text-slate-500">使用分隔符分组，方便用户输入</p>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">单次批量生成上限</label>
            <UInput v-model.number="settings.batchMaxCount" type="number" placeholder="1000" />
            <p class="text-xs mt-1 text-slate-500">防止生成过多对系统造成压力</p>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">前缀（可选）</label>
            <UInput v-model="settings.prefix" placeholder="例如：PRO-" />
            <p class="text-xs mt-1 text-slate-500">可根据类型设置不同前缀，便于识别</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
        <div class="mb-6">
          <h2 class="text-lg font-semibold text-slate-900 dark:text-white">使用限制</h2>
          <p class="text-sm mt-1 text-slate-500">配置 CDK 使用的限制规则</p>
        </div>
        <div class="space-y-6">
          <div class="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
            <div>
              <h3 class="font-medium text-sm text-slate-900 dark:text-white">同一个 CDK 是否只能使用一次</h3>
              <p class="text-xs mt-0.5 text-slate-500">启用后 CDK 使用一次后自动标记为已使用</p>
            </div>
            <UCheckbox v-model="settings.oneTimeUse" />
          </div>
          <div class="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
            <div>
              <h3 class="font-medium text-sm text-slate-900 dark:text-white">限制每个用户使用数量</h3>
              <p class="text-xs mt-0.5 text-slate-500">每个用户最多可以使用多少个 CDK</p>
            </div>
            <div class="w-32">
              <UInput v-model.number="settings.userMaxCount" type="number" placeholder="0 不限制" />
            </div>
          </div>
          <div class="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
            <div>
              <h3 class="font-medium text-sm text-slate-900 dark:text-white">是否需要注册后才能使用</h3>
              <p class="text-xs mt-0.5 text-slate-500">游客用户无法兑换 CDK</p>
            </div>
            <UCheckbox v-model="settings.requireRegistered" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">使用前须知文案</label>
            <UTextarea v-model="settings.usageNotice" placeholder="请在兑换前仔细阅读使用条款..." rows="3" />
            <p class="text-xs mt-1 text-slate-500">兑换页面显示的注意事项</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
        <div class="mb-6">
          <h2 class="text-lg font-semibold text-slate-900 dark:text-white">通知设置</h2>
          <p class="text-sm mt-1 text-slate-500">配置 CDK 相关通知规则</p>
        </div>
        <div class="space-y-6">
          <div class="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
            <div>
              <h3 class="font-medium text-sm text-slate-900 dark:text-white">兑换成功给用户发送通知</h3>
              <p class="text-xs mt-0.5 text-slate-500">通过邮件/站内信通知用户</p>
            </div>
            <UCheckbox v-model="settings.notifyOnRedeem" />
          </div>
          <div class="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
            <div>
              <h3 class="font-medium text-sm text-slate-900 dark:text-white">管理员生成 CDK 后发送日志</h3>
              <p class="text-xs mt-0.5 text-slate-500">记录操作日志便于追溯</p>
            </div>
            <UCheckbox v-model="settings.logOnGenerate" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Webhook 地址（可选）</label>
            <UInput v-model="settings.webhookUrl" placeholder="https://your-domain.com/webhook/cdk" />
            <p class="text-xs mt-1 text-slate-500">CDK 兑换成功后会回调此地址</p>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-end gap-3 pt-4">
        <button class="btn-glass">重置</button>
        <button class="btn-glass btn-glass--primary" @click="saveSettings">
          保存设置
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

definePageMeta({
  layout: 'console',
})

interface CharsetSettings {
  uppercase: boolean
  lowercase: boolean
  numbers: boolean
  symbols: boolean
}

interface CdkSettings {
  defaultExpireDays: number
  autoExpire: boolean
  expireRemindDays: number
  codeLength: number
  charset: CharsetSettings
  groupFormat: string
  batchMaxCount: number
  prefix: string
  oneTimeUse: boolean
  userMaxCount: number
  requireRegistered: boolean
  usageNotice: string
  notifyOnRedeem: boolean
  logOnGenerate: boolean
  webhookUrl: string
}

const yesNoOptions = [
  { label: '是', value: true },
  { label: '否', value: false },
]

const lengthOptions = [
  { label: '8 位', value: 8 },
  { label: '12 位', value: 12 },
  { label: '16 位', value: 16 },
  { label: '20 位', value: 20 },
  { label: '32 位', value: 32 },
]

const groupFormatOptions = [
  { label: '不分组', value: 'none' },
  { label: '4 个字符一组 (XXXX-XXXX-...)', value: '4' },
  { label: '5 个字符一组 (XXXXX-XXXXX-...)', value: '5' },
  { label: '6 个字符一组 (XXXXXX-XXXXXX)', value: '6' },
]

const settings = reactive<CdkSettings>({
  defaultExpireDays: 365,
  autoExpire: true,
  expireRemindDays: 7,
  codeLength: 16,
  charset: {
    uppercase: true,
    lowercase: false,
    numbers: true,
    symbols: false,
  },
  groupFormat: '4',
  batchMaxCount: 1000,
  prefix: '',
  oneTimeUse: true,
  userMaxCount: 3,
  requireRegistered: true,
  usageNotice: '1. 每个 CDK 只能使用一次\n2. 请在有效期内使用，过期后将无法兑换\n3. CDK 兑换后权益不可退款\n4. 活动 CDK 请遵守活动规则',
  notifyOnRedeem: true,
  logOnGenerate: true,
  webhookUrl: '',
})

function saveSettings() {
  console.log('保存 CDK 设置:', settings)
  // 这里可以添加实际保存逻辑
}
</script>