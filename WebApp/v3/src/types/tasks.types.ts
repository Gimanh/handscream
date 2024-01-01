export type AppTaskPermissions = {
    // eslint-disable-next-line
    task_can_add_subtasks?: true
    // eslint-disable-next-line
    task_can_delete?: true
    // eslint-disable-next-line
    task_can_edit_deadline?: true
    // eslint-disable-next-line
    task_can_edit_description?: true
    // eslint-disable-next-line
    task_can_edit_note?: true
    // eslint-disable-next-line
    task_can_edit_status?: true
    // eslint-disable-next-line
    task_can_watch_details?: true
    // eslint-disable-next-line
    task_can_watch_subtasks?: true
    // eslint-disable-next-line
    task_can_edit_tags?: true
    // eslint-disable-next-line
    task_can_watch_tags?: true
    // eslint-disable-next-line
    task_can_watch_priority?: true
    // eslint-disable-next-line
    task_can_edit_priority?: true
    // eslint-disable-next-line
    task_can_access_history?: true
    // eslint-disable-next-line
    task_can_recovery_history?: true
};

export interface TaskResponsibleUser {
    id: number
    login: string
    email: string
}

export type TaskItem = {
    id: number
    description: string
    complete: boolean
    deadline: string | null
    parentId: number | null
    goalListId: number
    note: string | null
    subtasks: TaskItem[]
    permissions: AppTaskPermissions
    priorityId: number
    tags: number[]
    dateComplete: string | null
    dateCreation: string
    responsibleUser?: TaskResponsibleUser | null
};

export type TaskItems = TaskItem[];

export type TasksStoreState = {
    urls: {
        addTaskUrl: string,
        fetchTasks: string,
        updateStatus: string,
        updateDescription: string,
        deleteTask: string,
        fetchTaskDetails: string,
        updateTaskNote: string,
        updateTaskDeadline: string,
        fetchSubtasks: string,
        moveTask: string,
        allPriorities: string,
        updatePriority: string,
        taskHistory: string,
        taskHistoryRecovery: string,
    },
    tasks: TaskItem[]
}


export type TaskAddResponse = {
    add: boolean
    task: TaskItem
}

export type TaskAddArg = {
    description: string
    componentId: number
};

export type FetchTasksArg = {
    componentId: number
    page: number
    showCompleted: 1 | 0
    searchText: string
}
