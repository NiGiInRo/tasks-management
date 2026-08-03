import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as tasksApi from '../../api/tasks';
import type { CreateTaskInput, Task, UpdateTaskInput } from '../../api/tasks';

export const taskKeys = {
  all: (projectId: string) => ['tasks', projectId] as const,
};

export function useTasks(projectId: string) {
  return useQuery({
    queryKey: taskKeys.all(projectId),
    queryFn: () => tasksApi.listTasks(projectId),
    enabled: Boolean(projectId),
  });
}

export function useCreateTask(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateTaskInput) => tasksApi.createTask(projectId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all(projectId) });
    },
  });
}

interface UpdateTaskContext {
  previousTasks?: Task[];
}

export function useUpdateTask(projectId: string) {
  const queryClient = useQueryClient();
  const queryKey = taskKeys.all(projectId);

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateTaskInput }) =>
      tasksApi.updateTask(id, input),
    onMutate: async ({ id, input }): Promise<UpdateTaskContext> => {
      await queryClient.cancelQueries({ queryKey });
      const previousTasks = queryClient.getQueryData<Task[]>(queryKey);

      queryClient.setQueryData<Task[]>(queryKey, (old) =>
        old?.map((task) => (task.id === id ? { ...task, ...input } : task)),
      );

      return { previousTasks };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(queryKey, context.previousTasks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}

export function useDeleteTask(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => tasksApi.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all(projectId) });
    },
  });
}