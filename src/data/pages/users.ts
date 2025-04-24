import { User } from '../../pages/users/types'
import api from '../../services/api'

export type Pagination = {
  page: number
  perPage: number
  total: number
}

export type Sorting = {
  sortBy: keyof User | undefined
  sortingOrder: 'asc' | 'desc' | null
}

export type Filters = {
  isActive: boolean
  search: string
}

//async异步，里面可以使用await/设置filters参数，类型为Filters和Pagination和Sorting联合类型，Partial表示可选（只传递部分
export const getUsers = async (filters: Partial<Filters & Pagination & Sorting>) => {
  //从 filters 参数中解构出 isActive 和 search，并将它们的值分别赋给同名的变量 isActive 和 search
  //等价于const isActive = filters.isActive’const search = filters.search;
  const { isActive, search } = filters
  //fetch向地址发送一个get请求，then表示对返回的response进一步处理，这里r参数指代了response，实际可以设置成任何参数
  // let filteredUsers: User[] = await fetch(api.allUsers()).then((r) => r.json())
  // 固定用户数据
  let filteredUsers: User[] = [
    {
      id: '550e8400-e29b-41d4-a716-446655440000',
      fullname: 'John Doe',
      email: 'john.doe@example.com',
      username: 'johndoe',
      role: 'admin',
      avatar: 'https://example.com/avatar1.jpg',
      projects: ['550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000'],
      notes: 'This is a sample user.',
      active: true,
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440001',
      fullname: 'Jane Smith',
      email: 'jane.smith@example.com',
      username: 'janesmith',
      role: 'user',
      avatar: 'https://example.com/avatar2.jpg',
      projects: ['550e8400-e29b-41d4-a716-446655440000'],
      notes: 'Another sample user.',
      active: false,
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440001',
      fullname: 'Jane Smith',
      email: 'jane.smith@example.com',
      username: 'janesmith',
      role: 'user',
      avatar: 'https://example.com/avatar2.jpg',
      projects: ['550e8400-e29b-41d4-a716-446655440001'],
      notes: 'Another sample user.',
      active: true,
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440002',
      fullname: 'Alice Johnson',
      email: 'alice.johnson@example.com',
      username: 'alicej',
      role: 'owner',
      avatar: 'https://example.com/avatar3.jpg',
      projects: ['550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003'],
      notes: 'Project manager.',
      active: true,
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440003',
      fullname: 'Bob Brown',
      email: 'bob.brown@example.com',
      username: 'bobb',
      role: 'admin',
      avatar: 'https://example.com/avatar4.jpg',
      projects: ['550e8400-e29b-41d4-a716-446655440004'],
      notes: 'System administrator.',
      active: false,
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440004',
      fullname: 'Charlie Davis',
      email: 'charlie.davis@example.com',
      username: 'charlied',
      role: 'user',
      avatar: 'https://example.com/avatar5.jpg',
      projects: ['550e8400-e29b-41d4-a716-446655440005'],
      notes: 'Software developer.',
      active: true,
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440005',
      fullname: 'Diana Evans',
      email: 'diana.evans@example.com',
      username: 'dianae',
      role: 'owner',
      avatar: 'https://example.com/avatar6.jpg',
      projects: ['550e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440007'],
      notes: 'Product owner.',
      active: true,
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440006',
      fullname: 'Ethan Harris',
      email: 'ethan.harris@example.com',
      username: 'ethanh',
      role: 'admin',
      avatar: 'https://example.com/avatar7.jpg',
      projects: ['550e8400-e29b-41d4-a716-446655440008'],
      notes: 'Database administrator.',
      active: false,
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440007',
      fullname: 'Fiona Clark',
      email: 'fiona.clark@example.com',
      username: 'fionac',
      role: 'user',
      avatar: 'https://example.com/avatar8.jpg',
      projects: ['550e8400-e29b-41d4-a716-446655440009'],
      notes: 'UI/UX designer.',
      active: true,
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440008',
      fullname: 'George Lewis',
      email: 'george.lewis@example.com',
      username: 'georgel',
      role: 'owner',
      avatar: 'https://example.com/avatar9.jpg',
      projects: ['550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440011'],
      notes: 'Team lead.',
      active: true,
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440009',
      fullname: 'Hannah Walker',
      email: 'hannah.walker@example.com',
      username: 'hannahw',
      role: 'admin',
      avatar: 'https://example.com/avatar10.jpg',
      projects: ['550e8400-e29b-41d4-a716-446655440012'],
      notes: 'System architect.',
      active: false,
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440010',
      fullname: 'Ian Hall',
      email: 'ian.hall@example.com',
      username: 'ianh',
      role: 'user',
      avatar: 'https://example.com/avatar11.jpg',
      projects: ['550e8400-e29b-41d4-a716-446655440013'],
      notes: 'Backend developer.',
      active: true,
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440011',
      fullname: 'Jessica Young',
      email: 'jessica.young@example.com',
      username: 'jessicay',
      role: 'owner',
      avatar: 'https://example.com/avatar12.jpg',
      projects: ['550e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440015'],
      notes: 'Scrum master.',
      active: true,
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440012',
      fullname: 'Kevin King',
      email: 'kevin.king@example.com',
      username: 'kevink',
      role: 'admin',
      avatar: 'https://example.com/avatar13.jpg',
      projects: ['550e8400-e29b-41d4-a716-446655440016'],
      notes: 'DevOps engineer.',
      active: false,
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440013',
      fullname: 'Laura Scott',
      email: 'laura.scott@example.com',
      username: 'lauras',
      role: 'user',
      avatar: 'https://example.com/avatar14.jpg',
      projects: ['550e8400-e29b-41d4-a716-446655440017'],
      notes: 'Frontend developer.',
      active: true,
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440014',
      fullname: 'Michael Green',
      email: 'michael.green@example.com',
      username: 'michaelg',
      role: 'owner',
      avatar: 'https://example.com/avatar15.jpg',
      projects: ['550e8400-e29b-41d4-a716-446655440018', '550e8400-e29b-41d4-a716-446655440019'],
      notes: 'Project lead.',
      active: true,
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440015',
      fullname: 'Natalie Adams',
      email: 'natalie.adams@example.com',
      username: 'nataliea',
      role: 'admin',
      avatar: 'https://example.com/avatar16.jpg',
      projects: ['550e8400-e29b-41d4-a716-446655440020'],
      notes: 'Security specialist.',
      active: false,
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440016',
      fullname: 'Oscar Baker',
      email: 'oscar.baker@example.com',
      username: 'oscarb',
      role: 'user',
      avatar: 'https://example.com/avatar17.jpg',
      projects: ['550e8400-e29b-41d4-a716-446655440021'],
      notes: 'Mobile developer.',
      active: true,
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440017',
      fullname: 'Penelope Carter',
      email: 'penelope.carter@example.com',
      username: 'penelopec',
      role: 'owner',
      avatar: 'https://example.com/avatar18.jpg',
      projects: ['550e8400-e29b-41d4-a716-446655440022', '550e8400-e29b-41d4-a716-446655440023'],
      notes: 'Product manager.',
      active: true,
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440018',
      fullname: 'Quentin Diaz',
      email: 'quentin.diaz@example.com',
      username: 'quentind',
      role: 'admin',
      avatar: 'https://example.com/avatar19.jpg',
      projects: ['550e8400-e29b-41d4-a716-446655440024'],
      notes: 'Cloud engineer.',
      active: false,
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440019',
      fullname: 'Rachel Evans',
      email: 'rachel.evans@example.com',
      username: 'rachele',
      role: 'user',
      avatar: 'https://example.com/avatar20.jpg',
      projects: ['550e8400-e29b-41d4-a716-446655440025'],
      notes: 'QA engineer.',
      active: true,
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440020',
      fullname: 'Samuel Foster',
      email: 'samuel.foster@example.com',
      username: 'samuelf',
      role: 'owner',
      avatar: 'https://example.com/avatar21.jpg',
      projects: ['550e8400-e29b-41d4-a716-446655440026', '550e8400-e29b-41d4-a716-446655440027'],
      notes: 'Technical lead.',
      active: true,
    },
  ]

  filteredUsers = filteredUsers.filter((user) => user.active === isActive)

  if (search) {
    filteredUsers = filteredUsers.filter((user) => user.fullname.toLowerCase().includes(search.toLowerCase()))
  }

  const { page = 1, perPage = 10 } = filters || {}
  return {
    data: filteredUsers,
    pagination: {
      page,
      perPage,
      total: filteredUsers.length,
    },
  }
}

export const addUser = async (user: User) => {
  // const headers = new Headers()
  // headers.append('Content-Type', 'application/json')
  //
  // const result = await fetch(api.allUsers(), { method: 'POST', body: JSON.stringify(user), headers }).then((r) =>
  //   r.json(),
  // )
  //
  // if (!result.error) {
  //   return result
  // }
  //
  // throw new Error(result.error)
  // 模拟异步操作
  return new Promise<User>((resolve) => {
    setTimeout(() => {
      // 生成一个唯一的 ID（如果需要）
      const newUser = { ...user, id: crypto.randomUUID() }
      resolve(newUser) // 返回新用户
    }, 1000) // 模拟 1 秒的延迟
  })
}

export const updateUser = async (user: User) => {
  // const headers = new Headers()
  // headers.append('Content-Type', 'application/json')
  //
  // const result = await fetch(api.user(user.id), { method: 'PUT', body: JSON.stringify(user), headers }).then((r) =>
  //   r.json(),
  // )
  //
  // if (!result.error) {
  //   return result
  // }
  //
  // throw new Error(result.error)
  // 模拟异步操作
  return new Promise<User>((resolve) => {
    setTimeout(() => {
      resolve(user) // 返回更新后的用户
    }, 1000) // 模拟 1 秒的延迟
  })
}

export const removeUser = async (user: User) => {
  return fetch(api.user(user.id), { method: 'DELETE' })
}

export const uploadAvatar = async (body: FormData) => {
  return fetch(api.avatars(), { method: 'POST', body, redirect: 'follow' }).then((r) => r.json())
}
