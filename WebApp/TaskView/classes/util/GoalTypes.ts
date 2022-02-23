export type Goal = {
    id: number
    name: string
    description: string
};

export type GoalAddItem = Omit<Goal, 'id'>;

export type GoalUpdate = Goal;

export type Goals = Goal[];

export type AddGoalResponse = {
    add: boolean
    goal?: Goal
};

export type GoalUpdateResponse = {
    update: boolean
    goal?: Goal
}

export type GoalsStoreStateUrls = {
    addGoalUrl: string
    fetchGoals: string
    updateGoal: string
    deleteGoal: string
}

export type AddGoalMode = 'inline' | 'form';

export type TGoalListStoreStateUrls = {
    addListUrl: string
    fetchLists: string
    updateList: string
    deleteList: string
}

export type TGoalComponentPermissions = {
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
    component_can_watch?: boolean
}

// fixme rename to component
export type TGoalList = {
    id: number
    name: string
    permissions: TGoalComponentPermissions
}

export type TGoalLists = TGoalList[];

export type TGoalAddList = {
    goalId: number
    name: string
}
export type TGoalUpdateList = {
    id: number
    name: string
}

export type TGoalAddListResponse = {
    add: boolean
    component?: TGoalList
}

export type TGoalDeleteListResponse = {
    delete: boolean
}

export type TGoalListUpdateResponse = {
    update: boolean
    component?: TGoalList
}

export type DeleteGoalResponse = {
    delete: boolean
};

export type DeleteGoalArg = number;
