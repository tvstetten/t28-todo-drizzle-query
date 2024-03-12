'use client'

import Todo from './Todo'
import AddTodo from './AddTodo'
import { addTodo, deleteTodo, editTodo, getData, toggleTodo } from '@/actions/todoActions'
import useSWR from 'swr'
import { todoType } from '@/types/todo'

const SWR_KEY = 'api/todos'

export const useTodoData = () => {
  return useSWR(SWR_KEY, () => getData())
}

const Todos = ({ initialData }: { initialData: todoType[] }) => {
  // State to manage the list of todo items
  const {
    data: todoItems,
    mutate,
    error,
    isValidating,
    isLoading,
  } = useSWR(SWR_KEY, () => getData(), {
    fallbackData: initialData,
    refreshInterval: 0,
    revalidateOnFocus: false,
  })
  console.log('Todos->todosInfo', todoItems, error, isValidating, isLoading)

  if (isLoading || todoItems === undefined) return <div>Loading...</div>
  // if (isValidating) return <div>Validating...</div>

  // Function to create a new todo item
  const createTodo = (text: string) => {
    const id = (todoItems.at(-1)?.id || 0) + 1
    addTodo(id, text)
    // setTodoItems(prev => [...prev, { id: id, text, done: false }])
    // todoItems.push({ id, text, done: false })
    mutate(todoItems, { revalidate: true })
  }

  // Function to change the text of a todo item
  const changeTodoText = (id: number, text: string) => {
    // setTodoItems(prev => prev.map(todo => (todo.id === id ? { ...todo, text } : todo)))
    const i = todoItems.findIndex(todo => todo.id === id)
    if (i >= 0) {
      mutate(
        async () => {
          todoItems[i].text = todoItems[i].text
          editTodo(id, text)
          return todoItems
        },
        { optimisticData: todoItems, revalidate: false, rollbackOnError: true },
      )
    }
  }

  // Function to toggle the "done" status of a todo item
  const toggleIsTodoDone = (id: number) => {
    toggleTodo(id)
    // ------------
    // Update only the changed property
    const i = todoItems.findIndex(todo => todo.id === id)
    if (i >= 0) todoItems[i].done = !todoItems[i].done
    mutate(todoItems, { revalidate: false })
  }

  // Function to delete a todo item
  const deleteTodoItem = (id: number) => {
    // setTodoItems(prev => prev.filter(todo => todo.id !== id))
    deleteTodo(id)
    mutate(
      todoItems.filter(todo => todo.id !== id),
      { revalidate: false },
    )
  }

  // Rendering the Todo List component
  return (
    <main className="flex mx-auto max-w-xl w-full min-h-screen flex-col items-center p-16">
      <div className="text-5xl font-medium">To-do app</div>
      <div className="w-full flex flex-col mt-8 gap-2">
        {/* Mapping through todoItems and rendering Todo component for each */}
        {console.log('build')}
        {todoItems.map(todo => (
          <Todo
            key={todo.id}
            todo={todo}
            changeTodoText={changeTodoText}
            toggleIsTodoDone={toggleIsTodoDone}
            deleteTodoItem={deleteTodoItem}
          />
        ))}
      </div>
      {/* Adding Todo component for creating new todos */}
      <AddTodo createTodo={createTodo} />
    </main>
  )
}

export default Todos
