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
    addComponentUrl: string
    fetchComponents: string
    updateComponents: string
    deleteList: string;
}

export type TGoalList = {
    id: number
    name: string
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
