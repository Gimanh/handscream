export interface IGoal {
    id: number
    name: string
    description: string
    date_creation: number
    owner: string
    order_key: number
    color: string
    archive: number
    progress: number
}

export interface IGoalItem {
    id: number
    name: string
    description: string
    date_creation: number
    parent: number
    owner: string
    expanded: number
    service?: number
    order_key: number
}

export interface IGoalNestedItem {
    id: number
    description: string
    checked: 0 | 1
    parent_id: number
    date_creation: string
    order_key: number
    date_complete: number
}

export interface IGoalNestedItemWithCommentAndReminder extends IGoalNestedItem {
    item_comment_text: string
    item_comment_id: number
    item_comment_date_creation: number
    item_comment_parent_id: number
    item_comment_owner: string
    item_reminder_id: number
    item_reminder_parent_id: number
    item_reminder_exp_date: number | null
    item_reminder_date_creation: number
    item_reminder_owner: string
    labels: IAppLabels
}

export interface IAppAddLabel {
    name: string
    color: string
    date_creation: number
}

export interface IAppLabel {
    id: number
    name: string
    color: string
    date_creation: number
}

export interface IAppVTableHeaderItem {
    text: string
    align?: string
    sortable?: boolean
    visible?: boolean
    value: string
    styles?: {
        width: number
    }
}

export type TaskItem = IGoalNestedItemWithCommentAndReminder;
export type TasksOrderItems = { id: number, order_key: number }[];

export type IAppLabels = IAppLabel[];
export type IGoals = IGoal[];
export type IGoalNestedItems = IGoalNestedItemWithCommentAndReminder[];//checklist_items
export type IGoalItems = IGoalItem[];//checklist_headers
export type IGoalChangeItemsOrder = { id: number, order_key: number }[];
