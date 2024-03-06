import { getData } from '@/actions/todoActions'
import Todos from '@/components/Todos'

export default async function Home() {
  // load server-side
  const data = await getData()
  console.log('Home->data', data)
  return <Todos todos={data} />
}
