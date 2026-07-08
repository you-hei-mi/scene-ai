import type { UseMutationOptions, UseQueryOptions } from '@tanstack/react-query'

/**
 * Standard React Query options for a query that returns TData
 */
export type QueryOptionsUtil<TData = unknown> = Omit<
  UseQueryOptions<TData>,
  'queryKey' | 'queryFn'
>

/**
 * Paginated query options that include pagination params
 */
export type PaginatedQueryOptionsUtil<TItem = unknown> = QueryOptionsUtil<{
  items: TItem[]
  total: number
}>

/**
 * Standard React Query mutation options
 */
export type MutationOptionsUtil<
  TData = unknown,
  TError = Error,
  TVariables = void,
  TContext = unknown,
> = Omit<
  UseMutationOptions<TData, TError, TVariables, TContext>,
  'mutationKey' | 'mutationFn'
>

/**
 * Generic paginated response shape
 */
export interface PaginatedResponse<T> {
  items: T[]
  total: number
}