import { getData } from '@/actions/todoActions'
import Todos from '@/components/Todos'
import { todoType } from '@/types/todo'
// import { preload } from 'swr'

// preload('api/todos', () => {
//   console.log('preload')
//   return getData()
// })

export default async function Home() {
  // load server-side
  // const dataInfo = await useTodoData()
  // console.log('Home->data', dataInfo)

  const data = await getData()

  return <Todos initialData={data} />
}
