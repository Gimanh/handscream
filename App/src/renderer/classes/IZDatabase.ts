import { ConfigStore } from '@/classes/ConfigStore';
import {
    IAppAddLabel, IAppLabel, IAppLabels,
    IGoal,
    IGoalChangeItemsOrder,
    IGoalItem,
    IGoalItems,
    IGoalNestedItems
} from '@/interfaces/IApp';
import {
    IArgAddGoal,
    IArgAddGoalItem,
    IArgCheckboxUpdate,
    IArgItemComment,
    IArgItemDate,
    IArgItemDescription,
    IArgItemName,
    IArgNestedGoalItem, IArgReport, IArgUpdateArchiveGoalStatus,
    IArgUpdateGoal,
    INestedItem,
    INestedOrders, IReportResult, TMoveTaskArg
} from '@/store/IGoalsStore';
import { IConfigDataTaskView } from '@/classes/IConfigStore';
import { IAppSettingsItems } from '@/store/IAppMainSettings';
import { IArgStartTimeRecord, IArgStopTimeRecord, ITimeRecords } from '@/store/ITimeRecord';

export interface RequiredFields {
    date_creation: string
}

export interface BaseFields extends RequiredFields {
    id?: number     //row id in database
    parent?: number //id of parent component
    owner?: number | string  //id of owner user if value is "lcl" it means local user is owner
}

/**
 * @deprecated
 */
export interface ITarget extends BaseFields {
    name: string
    description: string,
    date_creation: string
    components: TargetComponent[],
    order_key: number,
    color: string,
    archive?: number,
    progress?: number
}

export interface DatabaseConnectOptions {
    path?: string
    login?: string
    password?: string
}

export interface AvailableComponent {
    title: string
    componentName: string
    props?: any
}

export interface TargetComponent extends BaseFields {
    name: string //component name @tag name
    props?: any
    parent: number //parent is required owner can be detected from main target
}

export interface ParentInfo {
    id: number
    type: string//table name where we keep info about component
}

export interface AddComponentOptions {
    parentId: number
    parentType: string//goal or another component which is parent for "All Components"
    componentName: string
    props: any
    headerName?: string
}

export interface AddCheckListOptions extends RequiredFields {
    parent: number
    name: string
    description?: string
}

export interface CheckListItem {
    item_id?: number //we know id after insert to database
    item_description: string
    item_date_creation: string
    item_parent_id: number
    item_checked: number
    item_order_key: number
    item_date_complete?: string
    item_reminders: {
        id: number
        date: string //Format 2019-10-25 06:04
    }[]
    item_comments: {
        id: number
        text: string
    }[]
    item_date_end: number | null
}

export interface CheckListBody {
    id: number
    header_id: number //FIXME remove this field
    header_name: string
    name: string
    header_description: string
    header_date_creation: string
    header_owner: string
    header_expanded: number //FIXME remove this field
    expanded: number
    order_key: number
}

export interface CheckList extends TargetComponent {
    props: CheckListBody
}

export interface VionxNoteProps {
    id: number
    name: string
    content: string
    expanded: number
    parent?: string
    description?: string
    order_key: number
}

export interface VionxNote extends TargetComponent {
    parent: number
    props: VionxNoteProps
}

export interface BaseCommonDatabaseEntity {
    id: number
    tableName: string
}

export interface IUpdateHeaderValue extends BaseCommonDatabaseEntity {
    value: string // new header value
}

export interface IUpdateExpandedStatus extends BaseCommonDatabaseEntity {
    value: number
}

export interface IDeleteTargetComponent extends BaseCommonDatabaseEntity {
    id: number
}

export interface IUpdateNoteContent {
    id: number
    content: string
}

export interface I18N {
    locale: string
    name: string
}

export type IArgAddNested = {
    newItem: INestedItem,
    itemsOrder: INestedOrders
};


export interface IZDatabase {
    db: any;

    config: ConfigStore;

    createDatabase( name: string, destination?: string ): any;

    openDatabase( options?: DatabaseConnectOptions ): boolean;

    hasActiveDb(): boolean;

    closeCurrentDatabase(): boolean;

    getName(): string;

    getConfigData(): IConfigDataTaskView;

    fetchGoals(): IGoal[];

    fetchGoalItems( goalId: number ): IGoalItems;

    fetchNestedGoalItems( goalItemId: string ): IGoalNestedItems;

    updateNestedGoalItemCheckboxStatus( options: IArgCheckboxUpdate ): boolean;

    updateNestedGoalItemExpDate( options: IArgItemDate ): boolean;

    updateNestedGoalItemComment( options: IArgItemComment ): boolean;

    updateNestedGoalItemDescriptions( options: IArgItemDescription ): boolean;

    updateGoalItemName( options: IArgItemName ): boolean;

    addGoal( options: IArgAddGoal ): IGoal | false;

    deleteGoal( goal: IGoal ): boolean;

    updateGoal( goalInfo: IArgUpdateGoal ): boolean;

    addGoalItem( goalItem: IArgAddGoalItem ): IGoalItem | false;

    deleteGoalItem( id: number ): boolean;

    addNestedGoalItem( nestedItem: IArgNestedGoalItem ): IArgAddNested | false;

    fetchNestedGoalItemById( id: number ): INestedItem | false;

    updateNestedItemsOrder( items: { id: number, order_key: number }[] ): boolean;

    setArchiveGoalStatus( options: IArgUpdateArchiveGoalStatus ): boolean;

    fetchProgressForGoal( goalId: number ): number;

    deleteNestedItem( item: INestedItem ): boolean;

    updateGoalsOrder( items: IGoalChangeItemsOrder ): boolean;

    updateGoalItemsOrder( items: IGoalChangeItemsOrder ): boolean;

    updateGoalNestedItemsOrder( items: IGoalChangeItemsOrder ): boolean;

    fetchAllSettings(): IAppSettingsItems

    updateAllSettings( items: IAppSettingsItems ): boolean;

    addNewLabel( label: IAppAddLabel ): IAppLabel | false;

    deleteLabel( label: IAppLabel ): boolean;

    fetchAllLabels(): IAppLabels;

    updateLabelsOnNestedItem( options: { nestedId: number; labels: IAppLabels } ): boolean;

    fetchLabelsForNestedItemById( taskId: number ): IAppLabels;

    fetchReportData( options: IArgReport ): IReportResult;

    startTimeRecordForTask( options: IArgStartTimeRecord ): false | number;

    stopTimeRecordForTask( options: IArgStopTimeRecord ): boolean;

    fetchPlanReportData( options: IArgReport ): IReportResult;

    fetchTimeActivityRecordsForTask( taskId: number ): ITimeRecords;

    fetchGoalItemStats( listId: number ): number;

    updateLabel( label: IAppLabel ): boolean;

    moveTaskToNewList( options: TMoveTaskArg ): boolean;

    deleteNestedGoalItemsExpDate( item: IGoalNestedItems[0] ): boolean;

    getLicenseText(): string;

    getRepository(): string;
}
