import { apiClient } from './client'

// 会员等级
export interface MembershipLevel {
  id: string
  name: string
  level: number
  requiredPoints: number
  icon: string
  color: string
  description: string
  permissions: string[]
  isEnabled: boolean
  memberCount: number
  createdAt: string
}

export interface MembershipPlan {
  id: string
  name: string
  description: string
  price: number
  discountPrice: number
  cycle: 'month' | 'year' | 'lifetime'
  features: string[]
  levelId: string
  isEnabled: boolean
  createdAt: string
}

// CDK
export interface CDKItem {
  id: string
  code: string
  type: 'recharge' | 'membership'
  value: number
  membershipPlanId?: string
  status: 'unused' | 'used'
  userId?: string
  usedAt?: string
  expireAt?: string
  createdAt: string
}

export interface CDKUsageRecord {
  id: string
  code: string
  userId: string
  username: string
  amount: number
  usedAt: string
  type: string
}

// 充值档位
export interface RechargeTier {
  id: string
  amount: number
  giftAmount: number
  discount: number
  isEnabled: boolean
  isRecommended: boolean
}

// 会员等级 API
export function getMembershipLevels() {
  return apiClient<MembershipLevel[]>('/consoleapi/operation/membership-levels', {
    method: 'GET',
  })
}

export function createMembershipLevel(data: Partial<MembershipLevel>) {
  return apiClient<MembershipLevel>('/consoleapi/operation/membership-levels', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function updateMembershipLevel(id: string, data: Partial<MembershipLevel>) {
  return apiClient<MembershipLevel>(`/consoleapi/operation/membership-levels/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export function deleteMembershipLevel(id: string) {
  return apiClient<void>(`/consoleapi/operation/membership-levels/${id}`, {
    method: 'DELETE',
  })
}

// 会员套餐 API
export function getMembershipPlans() {
  return apiClient<MembershipPlan[]>('/consoleapi/operation/membership-plans', {
    method: 'GET',
  })
}

export function createMembershipPlan(data: Partial<MembershipPlan>) {
  return apiClient<MembershipPlan>('/consoleapi/operation/membership-plans', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function updateMembershipPlan(id: string, data: Partial<MembershipPlan>) {
  return apiClient<MembershipPlan>(`/consoleapi/operation/membership-plans/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export function deleteMembershipPlan(id: string) {
  return apiClient<void>(`/consoleapi/operation/membership-plans/${id}`, {
    method: 'DELETE',
  })
}

// CDK API
export function getCDKList(params: { page?: number; pageSize?: number; status?: string }) {
  return apiClient<{ items: CDKItem[]; total: number }>('/consoleapi/operation/cdk/list', {
    method: 'POST',
    body: JSON.stringify(params),
  })
}

export function generateCDK(data: {
  quantity: number
  type: 'recharge' | 'membership'
  value?: number
  membershipPlanId?: string
  expireDays?: number
}) {
  return apiClient<CDKItem[]>('/consoleapi/operation/cdk/generate', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function deleteCDK(id: string) {
  return apiClient<void>(`/consoleapi/operation/cdk/${id}`, {
    method: 'DELETE',
  })
}

export function getCDKUsageRecords(params: { page?: number; pageSize?: number }) {
  return apiClient<{ items: CDKUsageRecord[]; total: number }>('/consoleapi/operation/cdk/records', {
    method: 'POST',
    body: JSON.stringify(params),
  })
}

// 充值配置 API
export function getRechargeTiers() {
  return apiClient<RechargeTier[]>('/consoleapi/operation/recharge-tiers', {
    method: 'GET',
  })
}

export function createRechargeTier(data: Partial<RechargeTier>) {
  return apiClient<RechargeTier>('/consoleapi/operation/recharge-tiers', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function updateRechargeTier(id: string, data: Partial<RechargeTier>) {
  return apiClient<RechargeTier>(`/consoleapi/operation/recharge-tiers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export function deleteRechargeTier(id: string) {
  return apiClient<void>(`/consoleapi/operation/recharge-tiers/${id}`, {
    method: 'DELETE',
  })
}
