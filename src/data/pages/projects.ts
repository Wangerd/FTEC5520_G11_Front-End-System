import { Project } from '../../pages/projects/types'

export type Pagination = {
  page: number
  perPage: number
  total: number
}

export type Sorting = {
  sortBy: 'project_owner' | 'team' | 'created_at'
  sortingOrder: 'asc' | 'desc' | null
}

export const getProjects = async (options: Partial<Sorting> & Pagination) => {
  // const projects: Project[] = await fetch(api.allProjects()).then((r) => r.json())
  const projects: Project[] = [
    {
      id: '550e8400-e29b-41d4-a716-446655440001',
      project_name: 'DAO Organization Member',
      project_owner: '550e8400-e29b-41d4-a716-446655440000',
      team: ['550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003'],
      status: 'in progress',
      created_at: '2025-03-21T09:00:00Z',
      expiration_date: '2025-4-31',
      did: 'Core Identity DID',
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440002',
      project_name: 'Joint Login',
      project_owner: '550e8400-e29b-41d4-a716-446655440001',
      team: ['550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440005'],
      status: 'important',
      created_at: '2025-03-12T14:30:00Z',
      expiration_date: '2025-4-10',
      did: 'Asset Related DID',
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440003',
      project_name: 'Data Migration',
      project_owner: '550e8400-e29b-41d4-a716-446655440002',
      team: ['550e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440007'],
      status: 'completed',
      created_at: '2025-03-07T11:15:00Z',
      expiration_date: '2025-4-31',
      did: 'Asset Related DID',
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440004',
      project_name: 'Cross Industry Identity Recognition',
      project_owner: '550e8400-e29b-41d4-a716-446655440007',
      team: ['550e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440009'],
      status: 'archived',
      created_at: '2025-03-05T16:45:00Z',
      expiration_date: '2025-4-18',
      did: 'Regional Compliance DID',
    },
  ]
  return {
    data: projects,
    pagination: {
      page: options.page,
      perPage: options.perPage,
      total: projects.length,
    },
  }
}

export const addProject = async (project: Omit<Project, 'id' | 'created_at'>) => {
  // const headers = new Headers()
  // headers.append('Content-Type', 'application/json')
  //
  // return fetch(api.allProjects(), { method: 'POST', body: JSON.stringify(project), headers }).then((r) => r.json())
  // 模拟异步操作
  return new Promise<Project>((resolve) => {
    setTimeout(() => {
      // 生成一个唯一的 ID 和创建时间
      const newProject: Project = {
        ...project,
        id: crypto.randomUUID(), // 生成唯一 ID
        created_at: new Date().toISOString(), // 生成当前时间
      }
      resolve(newProject) // 返回新项目
    }, 1000) // 模拟 1 秒的延迟
  })
}

export const updateProject = async (project: Omit<Project, 'created_at'>) => {
  // const headers = new Headers()
  // headers.append('Content-Type', 'application/json')
  // return fetch(api.project(project.id), { method: 'PUT', body: JSON.stringify(project), headers }).then((r) => r.json())
  // 模拟异步操作
  return new Promise<Project>((resolve) => {
    setTimeout(() => {
      // 生成一个唯一的 ID 和创建时间
      const newProject: Project = {
        ...project,
        id: crypto.randomUUID(), // 生成唯一 ID
        created_at: new Date().toISOString(), // 生成当前时间
      }
      resolve(newProject) // 返回新项目
    }, 1000) // 模拟 1 秒的延迟
  })
}

export const removeProject = async () => {
  // return fetch(api.project(project.id), { method: 'DELETE' })
  // 模拟异步操作
  return new Promise<boolean>((resolve) => {
    setTimeout(() => {
      resolve(true) // 直接返回 true，表示删除成功
    }, 1000) // 模拟 1 秒的延迟
  })
}
