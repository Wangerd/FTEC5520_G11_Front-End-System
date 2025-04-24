import { User } from '../users/types'

export type UUID = `${string}-${string}-${string}-${string}-${string}`

export type Project = {
  id: UUID
  project_name: string
  project_owner: User['id']
  team: User['id'][]
  status: 'important' | 'archived' | 'in progress' | 'completed'
  created_at: string
  expiration_date: string // 新增字段，格式建议为 ISO 字符串（如 "2023-12-31"）
  did: string //did选择
}

export type EmptyProject = Omit<Project, 'id' | 'project_owner' | 'created_at' | 'status'> & {
  project_owner: Project['project_owner'] | undefined
  status: Project['status'] | undefined
}
