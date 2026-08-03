import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as tasksApi from '../../api/tasks';
import type { CreateTaskInput, UpdateTaskInput } from '../../api/tasks';

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

export function useUpdateTask(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateTaskInput }) =>
      tasksApi.updateTask(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all(projectId) });
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