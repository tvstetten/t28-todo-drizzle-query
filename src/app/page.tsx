import Todos from '@/components/Todos'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import { getData } from '@/actions/todoActions'
import { QUERY_KEY } from '@/types/todo'

export default async function Home() {
  const queryClient = new QueryClient()

  // Manual server side data loading and transferring to the Server
  const data = await getData()
  console.log('🚀 ~ Home ~ data:', data)

  // await queryClient.prefetchQuery({
  //   queryKey: [QUERY_KEY],
  //   queryFn: () => {
  //     console.log('🎇 loading on the server')
  //     return getData()
  //   },
  //   // queryFn: getData,
  // })

  // Instead do this, which ensures each request has its own cache:
  return (
    <>
      {/* <HydrationBoundary state={dehydrate(queryClient)}> */}
      <Todos initialData={data} />
      {/* </HydrationBoundary> */}
    </>
  )
}
