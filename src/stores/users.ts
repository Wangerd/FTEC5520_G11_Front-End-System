import { defineStore } from 'pinia'
import {
  addUser,
  type Filters,
  getUsers,
  Pagination,
  removeUser,
  Sorting,
  updateUser,
  uploadAvatar,
} from '../data/pages/users'
import { User } from '../pages/users/types'
//defineStore：Pinia 提供的函数，用于定义一个 store
export const useUsersStore = defineStore('users', {
  //定义state也就是store初始部分，() => { ... }：一个工厂函数，返回状态对象
  //as User[] 是 TypeScript 的类型断言，表示 items 是一个 User 类型的数组
  //断言：使用类型断言来明确指定类型，只是帮助 TypeScript 在编译时进行类型检查
  state: () => {
    return {
      items: [] as User[],
      pagination: { page: 1, perPage: 10, total: 0 },
    }
  },

  actions: {
    async getAll(options: { pagination?: Pagination; sorting?: Sorting; filters?: Partial<Filters> }) {
      const { data, pagination } = await getUsers({
        //使用对象展开运算符（...）将 options.filters、options.sorting 和 options.pagination 合并为一个对象。
        ...options.filters,
        ...options.sorting,
        ...options.pagination,
      })
      this.items = data
      this.pagination = pagination
    },

    async add(user: User) {
      // const [newUser] = await addUser(user)
      const newUser = await addUser(user) // 调用修改后的 addUser 函数
      this.items.unshift(newUser)
      // this.pagination.total += 1; // 更新总用户数
      return newUser
    },

    async update(user: User) {
      // const [updatedUser] = await updateUser(user)
      const updatedUser = await updateUser(user)
      const index = this.items.findIndex(({ id }) => id === user.id)
      this.items.splice(index, 1, updatedUser)
      return updatedUser
    },

    async remove(user: User) {
      const isRemoved = await removeUser(user)

      if (isRemoved) {
        const index = this.items.findIndex(({ id }) => id === user.id)
        this.items.splice(index, 1)
      }
    },

    async uploadAvatar(formData: FormData) {
      return uploadAvatar(formData)
    },
  },
})
