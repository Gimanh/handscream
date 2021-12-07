export type Goal = {
    id: number
    name: string
    description: string
};

export type GoalAdd = Omit<Goal, 'id'>;

export type Goals = Goal[];

export type AddGoalResponse = {
    add: boolean
    goal?: Goal
};

export type GoalsStoreStateUrls = {
    addGoalUrl: string
    fetchGoals:string
}
