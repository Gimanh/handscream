import {
    IAppLabel, IAppLabels,
    IGoal,
    IGoalChangeItemsOrder,
    IGoalItem,
    IGoalItems,
    IGoalNestedItems, IGoalNestedItemWithCommentAndReminder, TaskItem, TasksOrderItems
} from '@/interfaces/IApp';
import {
    IArgAddTaskInMutation,
    IArgCheckboxUpdate,
    IArgItemComment,
    IArgItemDate,
    IArgItemDescription,
    IArgItemName, IArgSetGoalProgress,
    IArgUpdateArchiveGoalStatus,
    IArgUpdateGoal,
    TMoveTaskArg
} from '@/store/Types/Goals/Types';

export interface IGoalsStoreMutations {
    setGoals( goals: IGoal[] ): void;

    setGoalItems( goalItems: IGoalItems ): void;

    setNestedGoalItems( nestedItems: IGoalNestedItems ): void;

    addMoreTasks( nestedItems: IGoalNestedItems ): void;

    setNestedGoalItemsCheckboxStatus( options: IArgCheckboxUpdate ): void;

    setNestedGoalItemsExpDate( options: IArgItemDate ): void;

    setNestedGoalItemsComment( options: IArgItemComment ): void;

    setNestedGoalItemDescription( options: IArgItemDescription ): void;

    setGoalItemName( options: IArgItemName ): void;

    addGoal( goal: IGoal ): void;

    deleteGoal( goal: IGoal ): void;

    updateGoal( goalInfo: IArgUpdateGoal ): void;

    addGoalItem( goalItem: IGoalItem ): void;

    setSelectedNestedItemId( newId: number );

    deleteGoalItem( id: number ): void;

    addTask( item: IArgAddTaskInMutation ): void;

    updateOrderForNestedItems( values: TasksOrderItems ): void;

    setArchiveGoal( options: IArgUpdateArchiveGoalStatus ): void;

    setGoalProgress( options: IArgSetGoalProgress ): void;

    deleteTask( item: TaskItem );

    setGoalsOrder( items: IGoalChangeItemsOrder ): void;

    setGoalItemsOrder( items: IGoalChangeItemsOrder ): void;

    setGoalNestedItemsOrder( items: IGoalChangeItemsOrder ): void;

    addNewLabel( label: IAppLabel ): void;

    deleteLabel( label: IAppLabel ): void;

    setLabels( labels: IAppLabels ): void;

    updateLabelsOnNestedItem( options: { nestedId: number, labels: IAppLabels } );

    updateLabelInfo( label: IAppLabel );

    removeNestedItemFromList( options: TMoveTaskArg );

    deleteNestedGoalItemsExpDate( item: TaskItem ): void;

    setSelectedTaskForDialog( item: IGoalNestedItemWithCommentAndReminder ): void;
}
