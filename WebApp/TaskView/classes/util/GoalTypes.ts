export type Goal = {
    id: number
    name: string
    description: string
};

export type GoalAdd = Omit<Goal, 'id'>;

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
}

export type AddGoalMode = 'inline' | 'form';

export type GoalComponentsStoreStateUrls = {
    addComponentUrl: string
    fetchComponents: string
}

export type GoalComponent = {
    id: number
    name: string
}

export type GoalComponents = GoalComponent[];

export type GoalAddComponent = {
    goalId: number
    name: string
}

export type GoalAddComponentResponse = {
    add: boolean
    component: GoalComponent
}
