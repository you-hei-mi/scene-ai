import { apiClient } from './client'

// ====== 订单管理 ======
export interface OrderMembership {
  id: string
  orderNo: string
  userId: string
  username: string
  userAvatar?: string
  planName: string
  amount: number
  paymentMethod: string
  status: 'paid' | 'pending' | 'refunded' | 'cancelled'
  createdAt: string
  paidAt?: string
}

export interface OrderRecharge {
  id: string
  orderNo: string
  userId: string
  username: string
  amount: number
  giftAmount: number
  actualAmount: number
  paymentMethod: string
  status: 'paid' | 'pending' | 'refunded' | 'cancelled'
  createdAt: string
}

export function getMembershipOrders(params: {
  page?: number
  pageSize?: number
  keyword?: string
  status?: string
  startDate?: string
  endDate?: string
}) {
  return apiClient<{ items: OrderMembership[]; total: number }>('/consoleapi/order/membership', {
    method: 'POST',
    body: JSON.stringify(params),
  })
}

export function getRechargeOrders(params: {
  page?: number
  pageSize?: number
  keyword?: string
  status?: string
}) {
  return apiClient<{ items: OrderRecharge[]; total: number }>('/consoleapi/order/recharge', {
    method: 'POST',
    body: JSON.stringify(params),
  })
}

export function getOrderDetail(id: string) {
  return apiClient<OrderMembership | OrderRecharge>(`/consoleapi/order/${id}`, {
    method: 'GET',
  })
}

// ====== 财务管理 ======
export interface FinancialStats {
  totalRevenue: number
  monthlyRevenue: number
  monthlyExpense: number
  netProfit: number
  revenueTrend: { month: string; revenue: number; expense: number; profit: number }[]
  revenueByCategory: { category: string; amount: number; percentage: number }[]
}

export interface BalanceRecord {
  id: string
  userId: string
  username: string
  userAvatar?: string
  currentBalance: number
  totalRecharge: number
  totalConsume: number
  lastChangeTime: string
}

export interface BalanceChange {
  id: string
  userId: string
  amount: number
  type: 'recharge' | 'consume' | 'refund' | 'gift'
  description: string
  balance: number
  createdAt: string
}

export function getFinancialStats(period: string = 'month') {
  return apiClient<FinancialStats>(`/consoleapi/financial/analysis?period=${period}`, {
    method: 'GET',
  })
}

export function getBalanceDetails(params: {
  page?: number
  pageSize?: number
  keyword?: string
  minBalance?: number
  maxBalance?: number
}) {
  return apiClient<{ items: BalanceRecord[]; total: number }>('/consoleapi/financial/balance-details', {
    method: 'POST',
    body: JSON.stringify(params),
  })
}

export function getBalanceChanges(userId: string) {
  return apiClient<BalanceChange[]>(`/consoleapi/financial/balance-changes/${userId}`, {
    method: 'GET',
  })
}

// ====== 权限管理 ======
export interface MenuItem {
  id: string
  name: string
  path: string
  icon?: string
  parentId: string | null
  sort: number
  isVisible: boolean
  children?: MenuItem[]
}

export interface Permission {
  id: string
  code: string
  name: string
  description: string
  module: string
  group: string
}

export interface Role {
  id: string
  name: string
  description: string
  memberCount: number
  permissionCount: number
  permissions: string[]
  createdAt: string
}

export function getMenus() {
  return apiClient<MenuItem[]>('/consoleapi/access/menus', {
    method: 'GET',
  })
}

export function createMenu(data: Partial<MenuItem>) {
  return apiClient<MenuItem>('/consoleapi/access/menus', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function updateMenu(id: string, data: Partial<MenuItem>) {
  return apiClient<MenuItem>(`/consoleapi/access/menus/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export function deleteMenu(id: string) {
  return apiClient<void>(`/consoleapi/access/menus/${id}`, {
    method: 'DELETE',
  })
}

export function getPermissions() {
  return apiClient<Permission[]>('/consoleapi/access/permissions', {
    method: 'GET',
  })
}

export function createPermission(data: Partial<Permission>) {
  return apiClient<Permission>('/consoleapi/access/permissions', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function updatePermission(id: string, data: Partial<Permission>) {
  return apiClient<Permission>(`/consoleapi/access/permissions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export function deletePermission(id: string) {
  return apiClient<void>(`/consoleapi/access/permissions/${id}`, {
    method: 'DELETE',
  })
}

export function getRoles() {
  return apiClient<Role[]>('/consoleapi/access/roles', {
    method: 'GET',
  })
}

export function createRole(data: Partial<Role>) {
  return apiClient<Role>('/consoleapi/access/roles', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function updateRole(id: string, data: Partial<Role>) {
  return apiClient<Role>(`/consoleapi/access/roles/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export function deleteRole(id: string) {
  return apiClient<void>(`/consoleapi/access/roles/${id}`, {
    method: 'DELETE',
  })
}