import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Todo } from '../components/todos/types';

export const todosApi = createApi({
  reducerPath: 'todosApi',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL }),
  tagTypes: ['Todos'],
  endpoints: (builder) => ({
    getTodos: builder.query<Todo[], void>({
      query: () => '',
      providesTags: ['Todos'],
    }),

    addTodo: builder.mutation<Todo, Omit<Todo, 'id' | 'createdAt'>>({
      query: (newTodo) => ({
        url: '',
        method: 'POST',
        body: newTodo,
      }),
      invalidatesTags: ['Todos'],
    }),

    updateTodo: builder.mutation<Todo, Pick<Todo, 'id'> & Partial<Todo>>({
      query: ({ id, ...todo }) => ({
        url: `${id}`,
        method: 'PUT',
        body: todo,
      }),
      invalidatesTags: ['Todos'],

      async onQueryStarted({ id, ...updates }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          todosApi.util.updateQueryData('getTodos', undefined, (draft) => {
            const todo = draft.find((t) => t.id === id);
            if (todo) {
              Object.assign(todo, updates);
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    deleteTodo: builder.mutation<void, string>({
      query: (id) => ({
        url: `${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Todos'],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          todosApi.util.updateQueryData('getTodos', undefined, (draft) => {
            const index = draft.findIndex((t) => t.id === id);
            if (index !== -1) {
              draft.splice(index, 1);
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const { useGetTodosQuery, useAddTodoMutation, useUpdateTodoMutation, useDeleteTodoMutation } = todosApi;
