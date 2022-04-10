import { AppResponse } from '~/classes/util/AppTypes';

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
};

export interface AppTask {
    id: number
    description: string
    complete: boolean
    deadline: string | null
    parentId: number | null
    goalListId: number
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
    moveTask: string
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

export type DetailedTaskResponse = [ DetailedTask ];

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

export type MoveTaskResponse = AppResponse<{
    move: boolean
}>;

export type MoveTaskArg = {
    listId: number
    taskId: number
}
