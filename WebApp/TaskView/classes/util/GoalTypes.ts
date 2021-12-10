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
