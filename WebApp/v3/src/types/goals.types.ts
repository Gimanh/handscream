export const DEFAULT_GOAL_ITEM: GoalItem = {
    id: -1,
    name: '',
    description: '',
    color: '',
    owner: -1,
    permissions: {}
}

export type GoalPermissions = {
    // eslint-disable-next-line
    goal_can_add_users?: true
    // eslint-disable-next-line
    goal_can_delete?: true
    // eslint-disable-next-line
    goal_can_edit?: true
}

export type GoalItem = {
    id: number
    name: string
    description: string
    owner: number
    color: string
    permissions: GoalPermissions
}

export type GoalsStoreState = {
    selectedItem: GoalItem['id'],
    goals: GoalItem[]
    urls: {
        addGoalUrl: string,
        fetchGoals: string,
        updateGoal: string,
        deleteGoal: string
    }
}

export type GoalItemAdd = Omit<GoalItem, 'id' | 'permissions' | 'color' | 'owner' | 'description'>;

export type GoalItemUpdate = Omit<GoalItem, 'permissions' | 'color' | 'owner'>;

export type GoalItemDelete = GoalItem['id'];

export type AddGoalResponse = {
    add: boolean
    goal?: GoalItem
};

export type GoalUpdateResponse = {
    update: boolean
    goal?: GoalItem
}

export type GoalEventMoreMenu = {
    activator: HTMLElement,
    goal: GoalItem
}

export type GoalActionsItemsEvents = 'editGoal' | 'deleteGoal';
export type GoalActionsItems = {
    id: number
    name: string
    eventName: GoalActionsItemsEvents
}[]

export type DeleteGoalResponse = {
    delete: boolean
};
