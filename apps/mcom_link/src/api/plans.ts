import { api } from './apiClient'
import type { Plan } from '../types'

export interface SchemaDescriptor {
    key: string
    label: string
    type: 'number' | 'boolean'
    unlimited?: boolean
}

export interface PlanSchema {
    quotas: SchemaDescriptor[]
    featureFlags: SchemaDescriptor[]
}

export type PlanInput = Omit<Plan, 'id' | 'createdAt' | 'updatedAt'>

export async function getPlans(): Promise<Plan[]> {
    return api.get<Plan[]>('/admin/plans')
}

export async function getPublicPlans(): Promise<Plan[]> {
    return api.get<Plan[]>('/api/v1/plans')
}

export async function getPublicPlanSchema(): Promise<PlanSchema> {
    return api.get<PlanSchema>('/api/v1/plans/schema')
}

export async function getPlanSchema(): Promise<PlanSchema> {
    return api.get<PlanSchema>('/admin/plans/schema')
}

export async function getPlan(id: string): Promise<Plan> {
    return api.get<Plan>(`/admin/plans/${id}`)
}

export async function createPlan(input: PlanInput): Promise<Plan> {
    return api.post<Plan>('/admin/plans', input)
}

export async function updatePlan(id: string, input: Partial<PlanInput>): Promise<Plan> {
    return api.patch<Plan>(`/admin/plans/${id}`, input)
}

export async function deletePlan(id: string): Promise<{ success: boolean }> {
    return api.delete<{ success: boolean }>(`/admin/plans/${id}`)
}