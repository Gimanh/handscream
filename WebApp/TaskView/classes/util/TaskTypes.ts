export type Task = {
    id: number
    description: string
    complete: boolean
}

export type Tasks = Task[];

export type TaskAddArg = {
    description: string
    componentId: number
}

export type TaskAddResponse = {
    add: boolean
    task: Task
}

export type TasksStoreStateUrls = {
    addTaskUrl: string
    fetchTasks: string
    updateTask: string
    updateStatus: string
    updateDescription: string
}

export type TaskCompleteChanged = {
    complete: boolean
    taskId: number
};

export type TaskCompleteChangedResponse = {
    task?: Task
};

export type TaskDescriptionChanged = {
    description: string
    taskId: number
};

export type TaskDescriptionChangedResponse = {
    task?: Task
};
