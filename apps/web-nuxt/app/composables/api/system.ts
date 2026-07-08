import { apiClient } from './client'

// ====== 系统配置 ======
export interface Agreement {
  id: string
  name: string
  type: 'user_agreement' | 'privacy_policy' | 'service_terms'
  content: string
  isEnabled: boolean
  updatedAt: string
}

export interface LoginConfig {
  loginMethods: { password: boolean; phone: boolean; email: boolean; wechat: boolean; oauth: boolean }
  registration: { openRegistration: boolean; reviewRequired: boolean; defaultRole: string }
  security: { maxLoginAttempts: number; lockoutMinutes: number; captchaEnabled: boolean; sessionTimeout: number }
}

export interface PayConfig {
  alipay: { appId: string; privateKey: string; publicKey: string; callbackUrl: string }
  wechatPay: { merchantId: string; apiKey: string; certPath: string }
  paymentSwitch: { alipay: boolean; wechatPay: boolean }
}

export interface WebsiteConfig {
  basic: { siteName: string; logoUrl: string; faviconUrl: string; description: string }
  seo: { keywords: string; description: string; icpNo: string }
  contact: { email: string; phone: string; address: string }
  social: { wechat: string; weibo: string; github: string }
}

export interface StorageConfig {
  storageType: 'local' | 'oss' | 'cos' | 's3'
  region: string
  bucket: string
  accessKey: string
  secretKey: string
  maxFileSize: number
  allowedFileTypes: string[]
  totalStorageUsed: number
  totalFiles: number
}

export interface LogRotateConfig {
  keepDays: number
  maxFileSize: string
  rotateInterval: 'daily' | 'hourly' | 'minutely'
  compressOldLogs: boolean
  logLevels: string[]
  storagePath: string
}

export interface LogRotateRecord {
  id: string
  time: string
  status: 'success' | 'failed'
  logCount: number
  freedSpace: string
  duration: string
}

export function getAgreements() {
  return apiClient<Agreement[]>('/consoleapi/system/agreements', { method: 'GET' })
}

export function updateAgreement(id: string, data: Partial<Agreement>) {
  return apiClient<Agreement>(`/consoleapi/system/agreements/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export function getLoginConfig() {
  return apiClient<LoginConfig>('/consoleapi/system/login-config', { method: 'GET' })
}

export function updateLoginConfig(data: Partial<LoginConfig>) {
  return apiClient<LoginConfig>('/consoleapi/system/login-config', {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export function getPayConfig() {
  return apiClient<PayConfig>('/consoleapi/system/pay-config', { method: 'GET' })
}

export function updatePayConfig(data: Partial<PayConfig>) {
  return apiClient<PayConfig>('/consoleapi/system/pay-config', {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export function getWebsiteConfig() {
  return apiClient<WebsiteConfig>('/consoleapi/system/website-config', { method: 'GET' })
}

export function updateWebsiteConfig(data: Partial<WebsiteConfig>) {
  return apiClient<WebsiteConfig>('/consoleapi/system/website-config', {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export function getStorageConfig() {
  return apiClient<StorageConfig>('/consoleapi/system/storage-config', { method: 'GET' })
}

export function updateStorageConfig(data: Partial<StorageConfig>) {
  return apiClient<StorageConfig>('/consoleapi/system/storage-config', {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export function getLogRotateConfig() {
  return apiClient<LogRotateConfig>('/consoleapi/system/log-rotate-config', { method: 'GET' })
}

export function updateLogRotateConfig(data: Partial<LogRotateConfig>) {
  return apiClient<LogRotateConfig>('/consoleapi/system/log-rotate-config', {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export function runLogRotate() {
  return apiClient<{ success: boolean }>('/consoleapi/system/log-rotate/run', { method: 'POST' })
}

export function getLogRotateRecords() {
  return apiClient<LogRotateRecord[]>('/consoleapi/system/log-rotate/records', { method: 'GET' })
}

// ====== 通知管理 ======
export interface SMSTemplate {
  id: string
  name: string
  templateId: string
  type: string
  content: string
  status: 'active' | 'inactive'
}

export interface SMSSendRecord {
  id: string
  phone: string
  templateName: string
  templateId: string
  status: 'success' | 'failed'
  sentAt: string
  responseCode: string
}

export interface NotificationSettings {
  channels: {
    inApp: { enabled: boolean }
    email: { enabled: boolean }
    sms: { enabled: boolean }
    wechat: { enabled: boolean }
  }
  events: {
    system: { enabled: boolean; channels: string[]; subEvents: Record<string, boolean> }
    order: { enabled: boolean; channels: string[]; subEvents: Record<string, boolean> }
    agent: { enabled: boolean; channels: string[]; subEvents: Record<string, boolean> }
    security: { enabled: boolean; channels: string[]; subEvents: Record<string, boolean> }
  }
}

export function getSMSTemplates() {
  return apiClient<SMSTemplate[]>('/consoleapi/notice/sms-templates', { method: 'GET' })
}

export function sendTestSMS(templateId: string, phone: string) {
  return apiClient<{ success: boolean }>('/consoleapi/notice/sms/test', {
    method: 'POST',
    body: JSON.stringify({ templateId, phone }),
  })
}

export function getSMSSendRecords(params: { page?: number; pageSize?: number }) {
  return apiClient<{ items: SMSSendRecord[]; total: number }>('/consoleapi/notice/sms-records', {
    method: 'POST',
    body: JSON.stringify(params),
  })
}

export function getNotificationSettings() {
  return apiClient<NotificationSettings>('/consoleapi/notice/notification-settings', { method: 'GET' })
}

export function updateNotificationSettings(data: Partial<NotificationSettings>) {
  return apiClient<NotificationSettings>('/consoleapi/notice/notification-settings', {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

// ====== 渠道管理 ======
export interface WeChatOAConfig {
  name: string
  appId: string
  appSecret: string
  token: string
  encodingAESKey: string
  isConnected: boolean
  stats: { followers: number; todayMessages: number; menus: number }
}

export interface WeChatMenu {
  id: string
  name: string
  type: 'click' | 'view' | 'miniprogram' | 'parent'
  key: string
  url: string
  parentId: string | null
  children?: WeChatMenu[]
}

export interface AutoReplyConfig {
  followReply: { enabled: boolean; content: string }
  keywordReplies: { keyword: string; replyType: string; content: string }[]
  defaultReply: { enabled: boolean; content: string }
}

export function getWeChatOAConfig() {
  return apiClient<WeChatOAConfig>('/consoleapi/channel/wechat-oa', { method: 'GET' })
}

export function updateWeChatOAConfig(data: Partial<WeChatOAConfig>) {
  return apiClient<WeChatOAConfig>('/consoleapi/channel/wechat-oa', {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export function testWeChatOAConnection() {
  return apiClient<{ success: boolean; message: string }>('/consoleapi/channel/wechat-oa/test', { method: 'POST' })
}

export function getWeChatMenus() {
  return apiClient<WeChatMenu[]>('/consoleapi/channel/wechat-oa/menus', { method: 'GET' })
}

export function updateWeChatMenus(menus: WeChatMenu[]) {
  return apiClient<WeChatMenu[]>('/consoleapi/channel/wechat-oa/menus', {
    method: 'PUT',
    body: JSON.stringify({ menus }),
  })
}

export function getAutoReplyConfig() {
  return apiClient<AutoReplyConfig>('/consoleapi/channel/wechat-oa/auto-reply', { method: 'GET' })
}

export function updateAutoReplyConfig(data: Partial<AutoReplyConfig>) {
  return apiClient<AutoReplyConfig>('/consoleapi/channel/wechat-oa/auto-reply', {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

// ====== 对话管理 ======
export interface ChatRecord {
  id: string
  user: { id: string; name: string; avatar?: string }
  title: string
  agentName: string
  messageCount: number
  lastActive: string
}

export interface ChatConfig {
  defaultModel: string
  alternativeModels: string[]
  contextLength: number
  maxOutputLength: number
  temperature: number
  topP: number
  frequencyPenalty: number
  presencePenalty: number
  systemPrompt: string
  welcomeMessage: string
  streamingEnabled: boolean
  citeSources: boolean
  contentModeration: boolean
  ratingEnabled: boolean
}

export function getChatRecords(params: {
  page?: number
  pageSize?: number
  keyword?: string
  agentId?: string
  startDate?: string
  endDate?: string
}) {
  return apiClient<{ items: ChatRecord[]; total: number }>('/consoleapi/chat/records', {
    method: 'POST',
    body: JSON.stringify(params),
  })
}

export function getChatDetail(id: string) {
  return apiClient<{ conversation: ChatRecord; messages: any[] }>(`/consoleapi/chat/records/${id}`, { method: 'GET' })
}

export function deleteChat(id: string) {
  return apiClient<void>(`/consoleapi/chat/records/${id}`, { method: 'DELETE' })
}

export function getChatConfig() {
  return apiClient<ChatConfig>('/consoleapi/chat/config', { method: 'GET' })
}

export function updateChatConfig(data: Partial<ChatConfig>) {
  return apiClient<ChatConfig>('/consoleapi/chat/config', {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

// ====== 装修中心 ======
export interface DecorateApp {
  id: string
  name: string
  icon: string
  description: string
  category: string
  thumbnailColor: string
  isVisible: boolean
  sortOrder: number
}

export interface DecorateLayout {
  headerStyle: string
  headerHeight: string
  showSearch: boolean
  fixedHeader: boolean
  sidebarPosition: 'left' | 'right'
  sidebarWidth: string
  defaultCollapsed: boolean
  footerStyle: string
  copyright: string
  showIcp: boolean
  colorScheme: string
  themeMode: 'light' | 'dark' | 'system'
}

export interface DecorateAgent {
  id: string
  name: string
  icon: string
  description: string
  category: string
  isFeatured: boolean
  isVisible: boolean
  sortOrder: number
}

export function getDecorateApps() {
  return apiClient<DecorateApp[]>('/consoleapi/decorate/apps', { method: 'GET' })
}

export function updateDecorateApp(id: string, data: Partial<DecorateApp>) {
  return apiClient<DecorateApp>(`/consoleapi/decorate/apps/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export function reorderDecorateApps(ids: string[]) {
  return apiClient<void>('/consoleapi/decorate/apps/reorder', {
    method: 'PUT',
    body: JSON.stringify({ ids }),
  })
}

export function getDecorateLayout() {
  return apiClient<DecorateLayout>('/consoleapi/decorate/layout', { method: 'GET' })
}

export function updateDecorateLayout(data: Partial<DecorateLayout>) {
  return apiClient<DecorateLayout>('/consoleapi/decorate/layout', {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export function getDecorateAgents() {
  return apiClient<DecorateAgent[]>('/consoleapi/decorate/agents', { method: 'GET' })
}

export function updateDecorateAgent(id: string, data: Partial<DecorateAgent>) {
  return apiClient<DecorateAgent>(`/consoleapi/decorate/agents/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export function reorderDecorateAgents(ids: string[]) {
  return apiClient<void>('/consoleapi/decorate/agents/reorder', {
    method: 'PUT',
    body: JSON.stringify({ ids }),
  })
}