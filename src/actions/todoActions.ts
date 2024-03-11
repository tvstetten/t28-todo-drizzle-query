'use server'

import db from '@/db'
import { todo } from '@/db/schema'
import { asc, eq, not } from 'drizzle-orm'

export const getData = async () => {
  return await db.select().from(todo).orderBy(asc(todo.id))
}

export const addTodo = async (id: number, text: string) => {
  return await db.insert(todo).values({
    id: id,
    text: text,
  })
}

export const editTodo = async (id: number, text: string) => {
  return await db
    .update(todo)
    .set({
      text: text,
    })
    .where(eq(todo.id, id))
}

export const toggleTodo = async (id: number) => {
  await db
    .update(todo)
    .set({
      done: not(todo.done),
    })
    .where(eq(todo.id, id))
}

export const deleteTodo = async (id: number) => {
  console.log('deleteTodo', id)
  await db.delete(todo).where(eq(todo.id, id))
}
