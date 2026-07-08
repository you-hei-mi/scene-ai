/**
 * 核心 API 服务层
 * 对应后端 Console 和 Web 控制器
 */
import { apiClient, apiGet, apiPost, apiPatch, apiDelete } from './client'

// ====== 通用类型 ======
export interface PaginatedResult<T> {
  items: T[]
  total: number
  page?: number
  pageSize?: number
  totalPages?: number
}

// ====== 用户/认证 API ======
export interface UserInfo {
  id: string
  username: string
  nickname: string
  avatar?: string
  email?: string
  phone?: string
  role?: { id: string; name: string }
  isRoot?: number
  status?: number
  permissions?: number
  membershipLevel?: { id: string; name: string; endTime?: string } | null
  createdAt?: string
  updatedAt?: string
}

export interface ConsoleUserInfo {
  user: UserInfo
  permissions: string[]
  menus: any[]
}

export interface AuthResponse {
  token: string
  user: UserInfo
}

// 登录
export function login(username: string, password: string) {
  return apiPost<AuthResponse>('/api/auth/login', {
    username,
    password,
    terminal: 1,
  })
}

// 注册
export function register(data: {
  username: string
  email: string
  password: string
  confirmPassword: string
}) {
  return apiPost<{ user: UserInfo }>('/api/auth/register', {
    ...data,
    terminal: 1,
  })
}

// 获取当前用户信息
export function getProfile() {
  return apiGet<UserInfo>('/api/user/info')
}

// 修改密码
export function changePassword(oldPassword: string, newPassword: string, confirmPassword: string) {
  return apiPost<void>('/api/auth/change-password', {
    oldPassword,
    newPassword,
    confirmPassword,
  })
}

// 退出登录
export function logout() {
  return apiPost<void>('/api/auth/logout')
}

// ====== 控制台用户管理 API ======
export function getConsoleUserInfo() {
  return apiGet<ConsoleUserInfo>('/consoleapi/users/info')
}

export function getUserList(params: {
  page?: number
  pageSize?: number
  keyword?: string
  status?: number
  roleId?: string
}) {
  return apiGet<PaginatedResult<UserInfo>>('/consoleapi/users', { headers: undefined })
}

// 注：getUserList 使用 query params，需要特殊处理
export async function getUsers(params?: {
  page?: number
  pageSize?: number
  keyword?: string
  status?: number
}) {
  const query = new URLSearchParams()
  if (params?.page) query.set('page', String(params.page))
  if (params?.pageSize) query.set('pageSize', String(params.pageSize))
  if (params?.keyword) query.set('keyword', params.keyword)
  if (params?.status !== undefined) query.set('status', String(params.status))
  const qs = query.toString()
  return apiGet<PaginatedResult<UserInfo>>(`/consoleapi/users${qs ? `?${qs}` : ''}`)
}

export function getUserDetail(id: string) {
  return apiGet<UserInfo & { membershipLevel: any; level: string; levelEndTime: string }>(`/consoleapi/users/${id}`)
}

export function createUser(data: any) {
  return apiPost<UserInfo>('/consoleapi/users', data)
}

export function updateUser(id: string, data: any) {
  return apiPatch<UserInfo>(`/consoleapi/users/${id}`, data)
}

export function deleteUser(id: string) {
  return apiDelete<void>(`/consoleapi/users/${id}`)
}

export function batchDeleteUsers(ids: string[]) {
  return apiPost<{ success: boolean }>('/consoleapi/users/batch-delete', { ids })
}

export function resetUserPassword(id: string, password: string) {
  return apiPost(`/consoleapi/users/reset-password/${id}`, { password })
}

export function autoResetUserPassword(id: string) {
  return apiPost<{ password: string }>(`/consoleapi/users/reset-password-auto/${id}`)
}

export function setUserStatus(id: string, status: number) {
  return apiPost(`/consoleapi/users/status/${id}`, { status })
}

export function changeUserBalance(id: string, dto: { amount: number; type: string; reason?: string }) {
  return apiPost(`/consoleapi/users/change-balance/${id}`, dto)
}

export function batchUpdateUsers(data: any) {
  return apiPost('/consoleapi/users/batch-update', data)
}

export function searchUsers(keyword: string) {
  return apiGet<any[]>(`/consoleapi/users/searchUser?keyword=${encodeURIComponent(keyword)}`)
}

export function getUserSubscriptions(id: string, params?: { page?: number; pageSize?: number }) {
  const query = new URLSearchParams()
  if (params?.page) query.set('page', String(params.page))
  if (params?.pageSize) query.set('pageSize', String(params.pageSize))
  const qs = query.toString()
  return apiGet<any>(`/consoleapi/users/${id}/subscriptions${qs ? `?${qs}` : ''}`)
}

// ====== 智能体管理 API ======
export interface AgentItem {
  id: string
  name: string
  description: string
  avatar?: string
  modelName?: string
  modelProvider?: string
  iconUrl?: string
  rolePrompt?: string
  openingStatement?: string
  openingQuestions?: string[]
  quickCommands?: string[]
  creatorName?: string
  publishedToSquare?: boolean
  squarePublishStatus?: string
  squareRejectReason?: string
  updatedAt?: string
  publishedAt?: string
  createMode?: string
  userCount?: number
  tags?: string[]
}

export function getAgentList(params?: {
  page?: number
  pageSize?: number
  keyword?: string
  status?: string
}) {
  const query = new URLSearchParams()
  if (params?.page) query.set('page', String(params.page))
  if (params?.pageSize) query.set('pageSize', String(params.pageSize))
  if (params?.keyword) query.set('keyword', params.keyword)
  if (params?.status) query.set('status', params.status)
  const qs = query.toString()
  return apiGet<PaginatedResult<AgentItem>>(`/consoleapi/agents${qs ? `?${qs}` : ''}`)
}

export function getAgentDashboard(id: string, params?: { startTime?: string; endTime?: string }) {
  const query = new URLSearchParams()
  if (params?.startTime) query.set('startTime', params.startTime)
  if (params?.endTime) query.set('endTime', params.endTime)
  const qs = query.toString()
  return apiGet<any>(`/consoleapi/agents/${id}/dashboard${qs ? `?${qs}` : ''}`)
}

export function approveSquarePublish(id: string) {
  return apiPost(`/consoleapi/agents/${id}/approve-square`)
}

export function rejectSquarePublish(id: string, reason: string) {
  return apiPost(`/consoleapi/agents/${id}/reject-square`, { reason })
}

export function publishSquareByAdmin(id: string) {
  return apiPost(`/consoleapi/agents/${id}/publish-square`)
}

export function unpublishSquareByAdmin(id: string) {
  return apiPost(`/consoleapi/agents/${id}/unpublish-square`)
}

export function deleteAgent(id: string) {
  return apiDelete(`/consoleapi/agents/${id}`)
}

// ====== 用户端智能体 API ======
export function getMyAgents(params?: { page?: number; pageSize?: number; search?: string }) {
  const query = new URLSearchParams()
  if (params?.page) query.set('page', String(params.page))
  if (params?.pageSize) query.set('pageSize', String(params.pageSize))
  if (params?.search) query.set('search', params.search)
  const qs = query.toString()
  return apiGet<PaginatedResult<AgentItem>>(`/api/ai-agents/my-created${qs ? `?${qs}` : ''}`)
}

export function getAgentDetail(id: string) {
  return apiGet<AgentItem>(`/api/ai-agents/${id}`)
}

export function createAgent(data: any) {
  return apiPost<AgentItem>('/api/ai-agents', data)
}

export function updateAgent(id: string, data: any) {
  return apiPatch<AgentItem>(`/api/ai-agents/${id}`, data)
}

export function deleteMyAgent(id: string) {
  return apiDelete(`/api/ai-agents/${id}`)
}

// ====== 模型管理 API ======
export interface ModelItem {
  id: string
  name: string
  modelType?: string
  providerId?: string
  provider?: { id: string; name: string; provider: string; iconUrl?: string }
  isActive?: boolean
  isDefault?: boolean
  createdAt?: string
  updatedAt?: string
}

export function getModelList(params?: { keyword?: string; providerId?: string; modelType?: string }) {
  const query = new URLSearchParams()
  if (params?.keyword) query.set('keyword', params.keyword)
  if (params?.providerId) query.set('providerId', params.providerId)
  if (params?.modelType) query.set('modelType', params.modelType)
  const qs = query.toString()
  return apiGet<ModelItem[]>(`/consoleapi/ai-models${qs ? `?${qs}` : ''}`)
}

export function getModelDetail(id: string) {
  return apiGet<ModelItem>(`/consoleapi/ai-models/${id}`)
}

export function createModel(data: any) {
  return apiPost<ModelItem>('/consoleapi/ai-models', data)
}

export function updateModel(id: string, data: any) {
  return apiPatch<ModelItem>(`/consoleapi/ai-models/${id}`, data)
}

export function deleteModel(id: string) {
  return apiDelete(`/consoleapi/ai-models/${id}`)
}

export function getAvailableModels() {
  return apiGet<ModelItem[]>('/api/ai-models')
}

export function getDefaultModel() {
  return apiGet<ModelItem | null>('/api/ai-models/default/current')
}

// ====== 数据分析/仪表盘 API ======
export function getDashboardData(params?: { userDays?: number; revenueDays?: number; tokenDays?: number }) {
  const query = new URLSearchParams()
  if (params?.userDays) query.set('userDays', String(params.userDays))
  if (params?.revenueDays) query.set('revenueDays', String(params.revenueDays))
  if (params?.tokenDays) query.set('tokenDays', String(params.tokenDays))
  const qs = query.toString()
  return apiGet<any>(`/consoleapi/analyse/dashboard${qs ? `?${qs}` : ''}`)
}

// ====== 系统配置 API ======
export function getSystemInfo() {
  return apiGet<any>('/consoleapi/system/initialize')
}

export function initializeSystem(data: any) {
  return apiPost<any>('/consoleapi/system/initialize', data)
}

export function getRuntimeInfo() {
  return apiGet<any>('/consoleapi/system/runtime')
}

export function restartApplication() {
  return apiPost('/consoleapi/system/restart')
}

// ====== 通知/公告 API ======
export function getSmsConfig(provider: 'aliyun' | 'tencent') {
  return apiGet<any>(`/consoleapi/notice/sms-config/${provider}`)
}

export function updateAliyunSmsConfig(data: any) {
  return apiPost('/consoleapi/notice/sms-config/aliyun', data)
}

export function updateTencentSmsConfig(data: any) {
  return apiPost('/consoleapi/notice/sms-config/tencent', data)
}

export function updateSmsConfigStatus(provider: string, data: { isEnabled: boolean }) {
  return apiPatch(`/consoleapi/notice/sms-config/${provider}/status`, data)
}

// ====== 扩展/应用 API ======
export function getExtensionList(params?: { keyword?: string; type?: number; isLocal?: boolean }) {
  const query = new URLSearchParams()
  if (params?.keyword) query.set('keyword', params.keyword)
  if (params?.type !== undefined) query.set('type', String(params.type))
  if (params?.isLocal !== undefined) query.set('isLocal', String(params.isLocal))
  const qs = query.toString()
  return apiGet<any[]>(`/api/extension${qs ? `?${qs}` : ''}`)
}

export function getExtensionDetail(identifier: string) {
  return apiGet<any>(`/api/extension/detail/${identifier}`)
}

// ====== MCP 服务 API ======
export function getMcpServerList(params?: {
  page?: number
  pageSize?: number
  type?: string
  name?: string
}) {
  const query = new URLSearchParams()
  if (params?.page) query.set('page', String(params.page))
  if (params?.pageSize) query.set('pageSize', String(params.pageSize))
  if (params?.type) query.set('type', params.type)
  if (params?.name) query.set('name', params.name)
  const qs = query.toString()
  return apiGet<PaginatedResult<any>>(`/api/ai-mcp-servers${qs ? `?${qs}` : ''}`)
}

export function createMcpServer(data: any) {
  return apiPost<any>('/api/ai-mcp-servers', data)
}

export function updateMcpServer(id: string, data: any) {
  return apiPut<any>(`/api/ai-mcp-servers/${id}`, data) // Web controller uses Put
}

export function deleteMcpServer(id: string) {
  return apiDelete(`/api/ai-mcp-servers/${id}`)
}

// ====== 知识库 API ======
export function getMyDatasets(params?: { page?: number; pageSize?: number; search?: string }) {
  const query = new URLSearchParams()
  if (params?.page) query.set('page', String(params.page))
  if (params?.pageSize) query.set('pageSize', String(params.pageSize))
  if (params?.search) query.set('search', params.search)
  const qs = query.toString()
  return apiGet<PaginatedResult<any>>(`/api/ai-datasets/my-created${qs ? `?${qs}` : ''}`)
}

export function getDatasetDetail(id: string) {
  return apiGet<any>(`/api/ai-datasets/${id}`)
}

export function createDataset(data: { name: string; description?: string }) {
  return apiPost<any>('/api/ai-datasets/create-empty', data)
}

export function updateDataset(id: string, data: any) {
  return apiPatch<any>(`/api/ai-datasets/${id}`, data)
}

export function deleteDataset(id: string) {
  return apiDelete<{ success: boolean }>(`/api/ai-datasets/${id}`)
}

// ====== 对话 API ======
export function getConversations(params?: { agentId?: string; limit?: number }) {
  const query = new URLSearchParams()
  if (params?.agentId) query.set('agentId', params.agentId)
  if (params?.limit) query.set('limit', String(params.limit))
  const qs = query.toString()
  return apiGet<any[]>(`/api/ai-conversations${qs ? `?${qs}` : ''}`)
}

export function getConversationDetail(id: string) {
  return apiGet<any>(`/api/ai-conversations/${id}`)
}

export function deleteConversation(id: string) {
  return apiDelete(`/api/ai-conversations/${id}`)
}