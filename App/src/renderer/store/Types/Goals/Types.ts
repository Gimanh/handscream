import { IAppLabel, TaskItem, } from '@/interfaces/IApp';
import { SortBy } from '@/components/Tasks/Types';

export type IArgCheckboxUpdate = {
    status: number
    item: TaskItem
    date_complete: number | null
}

export type IArgItemDate = {
    date: number,
    item: TaskItem
};

export type IArgItemComment = {
    comment: string,
    item: TaskItem
};

export type IArgItemDescription = {
    description: string,
    item: TaskItem
};

export type IArgItemName = {
    name: string,
    id: number
};

export type IArgAddGoal = {
    name: string
    description: string
    color: string
};

export type IArgUpdateGoal = {
    id: number
    name: string
    description: string
    color: string
};

export type IArgAddGoalItem = {
    goalId: number
    name: string
    description: string
}

export type IArgAddTask = {
    order_key: number
    parentId: number,
    description: string,
    insertAfterItem?: number
}

export type IArgUpdateArchiveGoalStatus = {
    goalId: number
    archiveStatus: number
};

export type ArgFetchTasks = {
    listId: number
    limit: number
    offset: number
    checked: number
    description?: string
    sortBy: SortBy
}

export type IArgSetGoalProgress = {
    goalId: number
    progress: number
};

export type IArgReport = {
    start: number
    end: number
    labels: number[]
};

export type IReportResultItem = {
    id: number
    description: string
    checked: number
    parent_id: number
    date_creation: number
    order_key: number
    date_complete: number
    list_name: string
    list_description: string
    goal_name: string
    goal_description: string
    label_name: string
    label_color: string
    deadline: number
    work_start: number
    work_end: number
}

export type IReportResult = IReportResultItem[];

export interface IReportResultCleanItem extends Omit<IReportResultItem, 'label_name' | 'label_color' | 'work_start' | 'work_end'> {
    labels: Omit<IAppLabel, 'id' | 'date_creation'>[]
    date_creation_locale: string
    date_complete_locale: string
    deadline_locale: string
    totalTime: number
    formatTotalTime: string
}

export type IReportResultClean = IReportResultCleanItem[];

export type TMoveTaskArg = { taskId: number; newParentListId: number };

export type NoMoreTasks = true;

export type IArgAddTaskInMutation = {
    item: TaskItem,
    insertAfterItem?: number
};

