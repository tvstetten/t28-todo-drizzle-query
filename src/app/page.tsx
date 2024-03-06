import { getData } from '@/actions/todoActions'
import Todos from '@/components/Todos'
import { todoType } from '@/types/todo'
import useSWR from 'swr'

export default async function Home() {
  // load server-side
  // const dataInfo = await useTodoData()
  // console.log('Home->data', dataInfo)

  return <Todos />
}
