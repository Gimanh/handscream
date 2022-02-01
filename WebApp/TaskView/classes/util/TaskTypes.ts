export type AppTaskPermissions = {
    editDescription: boolean
    editDeadline: boolean
    editNode: boolean
    editStatus: boolean
    watchDetails: boolean
    delete: boolean
    watchSubtasks: boolean
    addSubtasks: boolean
};

export interface AppTask {
    id: number
    description: string
    complete: boolean
    deadline: string | null
    parentId: number | null
    note: string | null
    subtasks: AppTask[]
    permissions: AppTaskPermissions
}

export type AppTasks = AppTask[];

export type AppTasksMap = Map<number, AppTask>;

export type TaskAddArg = {
    description: string
    componentId: number
    parentId?: number
}

export type TaskAddResponse = {
    add: boolean
    task: AppTask
}

export type TasksStoreStateUrls = {
    addTaskUrl: string
    fetchTasks: string
    updateStatus: string
    updateDescription: string
    deleteTask: string
    fetchTaskDetails: string
    updateTaskNote: string
    updateTaskDeadline: string
    fetchSubtasks: string
}

export type TaskCompleteChanged = {
    complete: boolean
    taskId: number
};

export type TaskCompleteChangedResponse = {
    task?: AppTask
};

export type TaskDescriptionChanged = {
    description: string
    taskId: number
};

export type TaskDescriptionChangedResponse = {
    task?: AppTask
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

export interface DetailedTask extends AppTask {
    dateComplete: string | null
    dateCreation: string
    responsibleUser: ResponsibleUser | null
}

export type DetailedTaskResponse = [DetailedTask];

export type TaskNoteValue = AppTask['note'];

export type TaskNoteUpdateResponse = { update: boolean };

export type TaskNoteUpdateArg = {
    taskId: AppTask['id']
    note: AppTask['note']
};

export type TaskDeadlineUpdateArg = {
    taskId: AppTask['id']
    deadline: AppTask['deadline']
};

export type TaskDeadlineUpdateResponse = { update: boolean };

export type SubtasksAddMutationArg = {
    taskId: AppTask['id']
    subtasks: AppTask['subtasks']
}
