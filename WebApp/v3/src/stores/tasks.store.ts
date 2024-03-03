import { defineStore } from 'pinia';
import type { FetchTasksArg, TaskAddArg, TaskAddResponse, TaskItem, TaskItems, TaskUrlToProp, TasksStoreState, UpdateTaskStatusArg } from '@/types/tasks.types';
import $api from '@/helpers/axios';
import type { AppResponse } from '@/types/global-app.types';
import qs from 'qs';

export const useTasksStore = defineStore('tasks', {
    state(): TasksStoreState {
        return {
            urls: {
                addTaskUrl: '/module/tasks/add',
                fetchTasks: '/module/tasks/fetch/tasks',
                updateStatus: '/module/tasks/update/status',
                updateDescription: '/module/tasks/update/description',
                deleteTask: '/module/tasks/delete',
                fetchTaskDetails: '/module/tasks/details',
                updateTaskNote: '/module/tasks/update/note',
                updateTaskDeadline: '/module/tasks/update/deadline',
                fetchSubtasks: '/module/tasks/fetch/subtasks',
                moveTask: '/module/tasks/move/task',
                allPriorities: '/module/tasks/fetch/all/priorities',
                updatePriority: '/module/tasks/update/priority',
                taskHistory: '/module/tasks/fetch/history',
                taskHistoryRecovery: '/module/tasks/recovery/history/state'
            },
            tasks: [],
            showCompleted: 0,
            currentListId: -1,
            endOfTasks: false,
            currentPage: 0,
        }
    },
    actions: {
        async addTask(task: TaskAddArg): Promise<boolean> {
            const result = await $api.post<AppResponse<TaskAddResponse>>(this.urls.addTaskUrl, qs.stringify(task))
                .catch(err => console.log(err));
            if (result) {
                if (result.data.response.add) {
                    this.tasks.unshift(result.data.response.task);
                    return true;
                }
            }
            return false;
        },

        clearTasks() {
            this.tasks = [];
        },

        appendTasks(items: TaskItems) {
            this.tasks = [...this.tasks, ...items];
        },

        async fetchTasks(data: FetchTasksArg): Promise<boolean> {
            let addMore: boolean = data.appendResults && this.currentListId == data.componentId;
            if (this.currentListId !== data.componentId) {
                addMore = false;
                this.clearTasks();
            }
            //fixme we can use all this property in store instead of tasks component
            const url = `${this.urls.fetchTasks}?componentId=${data.componentId}&page=${data.page}&showCompleted=${this.showCompleted}&searchText=${data.searchText}`;
            const result = await $api.get<AppResponse<TaskItems>>(url).catch(err => console.log(err));
            if (result && result.data.response) {
                if (addMore) {
                    this.endOfTasks = result.data.response.length < 1;
                    this.appendTasks(result.data.response);
                } else {
                    this.tasks = [...result.data.response];
                }
                return true;
            }
            return false;
        },

        // async updateTaskState<P extends keyof TaskItem, V extends TaskItem[P]>(property: P, value: V): Promise<boolean> {
        //     return false
        // }

        async updateTaskStatus(data: TaskUrlToProp['updateStatus']['actionArg']): Promise<boolean> {
            const result = await $api.post<AppResponse<TaskUrlToProp['updateStatus']['serverResponse']>>(this.urls.updateStatus, data).catch(err => console.log(err));
            if (result) {
                let taskIndex = -1;
                const task = this.tasks.find((task: TaskItem, index: number) => {
                    if (task.id === result.data.response.task.id) {
                        taskIndex = index;
                        return task;
                    }
                });
                if (task) {
                    task.complete = result.data.response.task.complete;
                    this.tasks.splice(taskIndex, 1);
                    return true;
                }
                console.warn('Can not find task in "task" with "id"', data, this.tasks);
            }
            return false;
        },

        async updateTaskDescription(data: TaskUrlToProp['updateDescription']['actionArg']): Promise<boolean> {
            const result = await $api.post<AppResponse<TaskUrlToProp['updateDescription']['serverResponse']>>(this.urls.updateDescription, data).catch(err => console.log(err));
            if (result) {
                const task = this.tasks.find(({ id }) => id === result.data.response.task.id);
                if (task) {
                    task.description = data.description;
                    return true;
                }
            }
            return false;
        },

        async deleteTask(data: TaskUrlToProp['deleteTask']['actionArg']): Promise<void> {
            const result = await $api.post<AppResponse<TaskUrlToProp['deleteTask']['serverResponse']>>(this.urls.deleteTask, data).catch(err => console.log(err));
            if (result) {
                let taskIndex = -1;
                const task = this.tasks.find(({ id }, index: number) => {
                    if (id === data.taskId) {
                        taskIndex = index;
                        return true;
                    }
                });
                if (task) {
                    this.tasks.splice(taskIndex, 1);
                } else {
                    console.warn('Can not find task for deletion');
                }
            }
        },
    }
});
