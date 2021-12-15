export type Task = {
    id: number
    task: string
    complete: boolean
}

export type Tasks = Task[];

export type TasksStoreStateUrls = {
    addTaskUrl: string
    fetchTasks: string
    updateTask: string
}
