export type GoalListItem = {
    id: number
    name: string
    permissions: GoalListItemPermissions
};

export type GoalListItemPermissions = {
    // eslint-disable-next-line camelcase
    component_can_add_tasks?: boolean
    // eslint-disable-next-line camelcase
    component_can_delete?: boolean
    // eslint-disable-next-line camelcase
    component_can_edit?: boolean
    // eslint-disable-next-line camelcase
    component_can_edit_all_tasks?: boolean
    // eslint-disable-next-line camelcase
    component_can_edit_their_tasks?: boolean
    // eslint-disable-next-line camelcase
    component_can_watch_content?: boolean
    // eslint-disable-next-line camelcase
    component_can_add_subtasks?: boolean
}

export type GoalListItems = GoalListItem[];
export type GoalListsStoreState = {
    urls: {
        addListUrl: string
        fetchLists: string
        updateList: string
        deleteList: string
    },
    lists: GoalListItems
}

export type GoalListAddArg = {
    goalId: number
    name: string
}

export type GoalListAddResponse = {
    add: boolean
    component?: GoalListItem
}

export type GoalListEventMoreMenu = {
    activator: HTMLElement,
    list: GoalListItem
}

export type GoalListActionsItemsEvents = 'editList' | 'deleteList';

export type GoalListActionsItems = {
    id: number
    name: string
    eventName: GoalListActionsItemsEvents
}[]

export type GoalListDeleteResponse = {
    delete: boolean
}

export type GoalListUpdateArg = {
    id: number
    name: string
}

export type GoalListUpdateResponse = {
    update: boolean
    component?: GoalListItem
}
