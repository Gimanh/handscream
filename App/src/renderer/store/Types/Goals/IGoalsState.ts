import {
    IAppLabels,
    IGoalItems,
    IGoalNestedItems,
    IGoalNestedItemWithCommentAndReminder,
    IGoals
} from '@/interfaces/IApp';

export interface IGoalStoreState {

    goals: IGoals;

    goalItems: IGoalItems;

    nestedGoalItems: IGoalNestedItems;

    selectedNestedItemId: number;

    labels: IAppLabels;

    selectedTaskForDialog: IGoalNestedItemWithCommentAndReminder;
}
