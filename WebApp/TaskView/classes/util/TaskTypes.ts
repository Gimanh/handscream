import { AppResponse } from '~/classes/util/AppTypes';
import { TagItem } from '~/classes/util/TagsTypes';

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
};

export interface ResponsibleUser {
    id: number
    login: string
    email: string
}

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
    priorityId: number
    tags: number[]
    dateComplete: string | null
    dateCreation: string
    responsibleUser?: ResponsibleUser | null
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
    allPriorities: string
    updatePriority: string
    taskHistory: string
    taskHistoryRecovery: string
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

export interface DetailedTask extends AppTask {

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

export type FetchTasksArg = {
    componentId: number
    page: number
    showCompleted: 1 | 0
    searchText: string
}

export type TTaskPriority = {
    id: number,
    code: 'low' | 'high' | 'medium'
};

export type TaskHistoryId = number;

export interface AppTaskHistoryItem extends AppTask {
    // eslint-disable-next-line camelcase
    historyId: TaskHistoryId
    // eslint-disable-next-line camelcase
    canNotRecovery: boolean
}

export type TaskPriorities = TTaskPriority[];

export type TaskPrioritiesResponse = AppResponse<TaskPriorities>;

export type TaskPriorityUpdateResponse = AppResponse<{ update: boolean }>;

export type UpdateTaskPriorityArg = { priorityId: number, taskId: number, taskParentId: AppTask['parentId'] };

export type AddTagToTaskArg = { taskId: TaskIdArg, tagId: TagItem['id'], taskParentId: AppTask['parentId'] };

export type DeleteTagFromTask = { taskId: TaskIdArg, tagId: TagItem['id'], taskParentId: AppTask['parentId'] };

export type TaskHistoryResponse = AppResponse<{ history: AppTaskHistoryItem[] }>;

export type TaskHistoryState = { taskId: AppTask['id'], items: AppTaskHistoryItem[] };

export type TaskHistoryRecoveryResponse = AppResponse<{ recovery: boolean }>;
