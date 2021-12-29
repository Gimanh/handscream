export interface Task {
    id: number
    description: string
    complete: boolean
    deadline: string | null
    parentId: number | null
    note: string | null
    subtasks: Task[]
}

export type Tasks = Task[];

export type TaskAddArg = {
    description: string
    componentId: number
    parentId?: number
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
    deleteTask: string
    fetchTaskDetails: string
    updateTaskNote: string
    updateTaskDeadline: string
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

export type TaskDeleteResponse = {
    delete: boolean
};

export type TaskIdArg = number;

export interface ResponsibleUser {
    id: number
    login: string
    email: string
}

export interface DetailedTask extends Task {
    dateComplete: string | null
    dateCreation: string
    responsibleUser: ResponsibleUser | null
}

export type TaskNoteValue = Task['note'];

export type TaskNoteUpdateResponse = { update: boolean };

export type TaskNoteUpdateArg = {
    taskId: Task['id']
    note: Task['note']
};

export type TaskDeadlineUpdateArg = {
    taskId: Task['id']
    deadline: Task['deadline']
};

export type TaskDeadlineUpdateResponse = { update: boolean };
