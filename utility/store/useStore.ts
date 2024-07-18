import { create } from 'zustand'
import { users } from '@/utility/data'
import { User } from '@/utility/types'

type State = {
  users: User[],
  deleteUser: (id: number) => void,
  updateUser: (id: number, updatedUser: User) => void
}
export const useStore = create<State>((set) => ({
  users: users,
  deleteUser: (id: number) => set((state) => ({
    users: state.users.filter(user => user.id !== id)
  })),
  updateUser: (id: number, updatedUser: User) => set((state) => ({
    users: state.users.map(user => user.id === id ? updatedUser : user)
  }))
}))