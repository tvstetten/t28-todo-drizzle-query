'use client'

import { addTodo, deleteTodo, editTodo, getData, toggleTodo } from '@/actions/todoActions'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEY, todoType } from '@/types/todo'
import Todo from './Todo'
import AddTodo from './AddTodo'

export const useTodoData = () => {
  console.log('🚀 ~ useTodoData')
  return useQuery({ queryKey: [QUERY_KEY], queryFn: () => getData(), staleTime: 60000 })
}

const Todos = ({ initialData }: { initialData: todoType[] }) => {
  console.log('Todos-Function-enter', initialData)
  // State to manage the list of todo items
  // const { data: todoItems, mutate, error, isValidating, isLoading } = useTodoData()
  const queryClient = useQueryClient()
  queryClient.setQueryData([QUERY_KEY], initialData)
  const { status, data: todoItems, error, isLoading } = useTodoData()
  const createMutation = useMutation({
    mutationFn: async ({ text }: Pick<todoType, 'text'>) => {
      const id = (todoItems!.at(-1)?.id || 0) + 1
      // setTodoItems(prev => [...prev, { id: id, text, done: false }])
      todoItems!.push({ id, text, done: false })
      return addTodo(id, text)
      // createMutation.mutate(todoItems, { revalidate: true })
    },
    onError: () => {
      queryClient.invalidateQueries({ predicate: query => query.queryKey[0] === QUERY_KEY })
    },
  })
  const updateTextMutation = useMutation({
    mutationFn: async ({ id, text }: Pick<todoType, 'id' | 'text'>) => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEY] })

      const previousTodo = queryClient.getQueryData([QUERY_KEY])

      const i = todoItems!.findIndex(todo => todo.id === id)
      if (i >= 0) {
        todoItems![i].text = todoItems![i].text
        // Optimistically update to the new value
        queryClient.setQueryData([QUERY_KEY], () => todoItems)
        editTodo(id, text)
      }
      // { optimisticData: todoItems, revalidate: false, rollbackOnError: true },
      // }
      return { todoItems, previousTodo }
    },
    onMutate: variables => {
      console.log(`onMutate`)
    },
    onError: (error, variables, context) => {
      // An error happened!
      console.log(`rolling back optimistic update with id ${variables.id}`)
    },
    onSuccess: (data, variables, context) => {
      console.log(`onSuccess`, data, variables, context)
    },
    onSettled: (data, error, variables, context) => {
      console.log(`onSettled`)
      // Error or success... doesn't matter!
    },
  })

  const updateDoneMutation = useMutation({
    mutationFn: async ({ id }: Pick<todoType, 'id'>) => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEY, id] })

      const i = todoItems!.findIndex(todo => todo.id === id)
      if (i >= 0) {
        todoItems![i].done = !todoItems![i].done
        toggleTodo(id)
      }
      return todoItems
    },
    onMutate: variables => {
      console.log(`onMutate`)
    },
    onError: (error, variables, context) => {
      // An error happened!
      console.log(`rolling back optimistic update with id ${context.id}`)
    },
    onSuccess: (data, variables, context) => {
      console.log(`onSuccess`)
    },
    onSettled: (data, error, variables, context) => {
      console.log(`onSettled`)
      // Error or success... doesn't matter!
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async ({ id }: Pick<todoType, 'id'>) => {
      deleteTodo(id)
      todoItems!.filter(todo => todo.id !== id)
      queryClient.setQueryData([QUERY_KEY], () => todoItems!.filter(todo => todo.id !== id))
      return todoItems
    },
    onMutate: variables => {
      console.log(`onMutate - delete`)
    },
    onError: (error, variables, context) => {
      // An error happened!
      console.log(`rolling back optimistic update with id ${variables.id}`)
    },
    onSuccess: (data, variables, context) => {
      console.log(`onSuccess`)
      queryClient.setQueryData([QUERY_KEY], () =>
        todoItems!.filter(todo => todo.id !== variables.id),
      )
      // queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
    onSettled: (data, error, variables, context) => {
      console.log(`onSettled`)
      // Error or success... doesn't matter!
    },
  })

  console.log('Todos->todosInfo', todoItems, status, error, '🟠isLoading:', isLoading)

  // Rendering the Todo List component
  return (
    <main className="flex mx-auto max-w-xl w-full min-h-screen flex-col items-center p-16">
      <div className="text-5xl font-medium">To-do app</div>
      <div className="w-full flex flex-col mt-8 gap-2">
        {(isLoading || todoItems === undefined) && <div>Loading...</div>}
        {todoItems &&
          todoItems.map(todo => (
            <Todo
              key={todo.id}
              todo={todo}
              changeTodoText={updateTextMutation.mutate}
              toggleIsTodoDone={updateDoneMutation.mutate}
              deleteTodoItem={deleteMutation.mutate}
            />
          ))}
      </div>
      {/* Adding Todo component for creating new todos */}
      <p></p>
      <AddTodo createTodo={createMutation.mutate} />
      <div>{JSON.stringify(todoItems, null, 2)}</div>
    </main>
  )
}

export default Todos
