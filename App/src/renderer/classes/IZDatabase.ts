import { ConfigStore } from '@/classes/ConfigStore';
import {
    IAppAddLabel, IAppLabel, IAppLabels,
    IGoal,
    IGoalChangeItemsOrder,
    IGoalItem,
    IGoalItems,
    IGoalNestedItems
} from '@/Interfaces/IApp';
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
    item_date_end: number | null //Поле для отображения в интерфейсе //FIXME возможно доставать сразу ремайндерсы???
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
    // items?: CheckListItem[]
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

    /**
     * Create and open created database
     * @param name
     * @param destination
     */
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
    // fetchNestedGoalItemItems( goalItemId: number );
    //
    // addTargetDb( target: ITarget ): { lastInsertRowid: number, changes: number } | boolean;
    //
    // getTarget( id: number ): ITarget | false;
    //
    // getAllTargets(): ITarget[] | [];
    //
    //
    // deleteTarget( id ): boolean;
    //
    // deleteAllNestedGoalComponents( goalId: number ): boolean;
    //

    // updateTarget( target: ITarget ): ITarget | false;
    //
    // fetchActiveTarget( id: number ): ITarget | false;
    //
    // addCheckList( parentId: AddCheckListOptions ): TargetComponent | false;
    //
    // getTargetCheckLists( targetId: number ): CheckList[] | false;
    //
    // setCheckStatusToListItem( options: { itemId: number, checked: number } ): boolean;
    //
    // updateCheckListItemDescription( options: { itemId: number, description: string } ): boolean;
    //
    // deleteCheckListItem( options: { itemId: number } ): boolean;
    //
    // insertCheckListItem( options: CheckListItem ): false | number;
    //
    // updateCheckListName( options: { checklistId: number, name: string } ): boolean;
    //
    // deleteCheckListWithItems( id: number ): boolean
    //
    // updateCheckListExpanded( options: { checklistId: number, expanded: number } ): boolean;
    //
    // addNoteComponent( options: TargetComponent ): TargetComponent | false;
    //
    // getTargetNotes( targetId: number ): VionxNote[] | false;
    //
    // updateTargetComponentHeaderValue( options: IUpdateHeaderValue ): boolean;
    //
    // updateTargetComponentExpandedStatus( options: IUpdateExpandedStatus ): boolean;
    //
    // deleteTargetComponent( options: IDeleteTargetComponent ): boolean;
    //
    // updateNoteContent( options: IUpdateNoteContent ): boolean;
    //
    // fetchExpressTasks(): CheckList[] | false;
    //
    // updateCheckListItemsOrder( items: { id: number, orderKey: number }[] ): boolean;
    //
    // fetchGoalListHeaders( options: { targetId: number } ): { id: number, name: string }[] | false;
    //
    // changeCheckListItemParent( options: { headerId: number; itemId: number } ): boolean;
    //
    // updateTargetsItemsOrder( items: { id: number, orderKey: number }[] ): boolean;
    //
    // updateOrderInTable( options: { table: string, items: { id: number; orderKey: number }[] } ): boolean;
    //
    // updateTargetColor( options: { id: number, color: string } ): boolean;
    //
    // addReminderDate( options: { itemId: number, date: number, date_creation: string } ): false | number;
    //
    // updateReminderDate( options: { itemId: number, date: number, date_creation: string } ): boolean;
    //
    // fetchItemRemindersAndComment( options: { itemId: number } ): false | { reminders: [], comments: [] };
    //
    // deleteReminderFromDb( options: { id: number, itemId: number } )
    //
    // addCommentText( options: { itemId: number, text: string, date_creation: string } ): false | number;
    //
    // updateCommentText( options: { itemId: number, text: string, date_creation: string } ): boolean;
    //
    // deleteCommentFromDb( options: { id: number, itemId: number, parentId: number } );
    //
    // fetchNotifications( options: { date: number } ): any[];
    //
    // updateArchiveInGoal( options: { id: number, archive: number } ): boolean;
    //
    // fetchProgress( options: { id: number } ): number;
    //
    // fetchCheckListItemById( options: { id: number } ): CheckListItem | false;
    //
    // execQueryGet<S, O>( sql: string, options: O ): S | false;
}

// export const SQL = {
//     // addTarget: 'INSERT INTO targets (name, description, date_creation, owner, color) VALUES (@name, @description, @date_creation, @owner, @color)',
//     // getTarget: 'SELECT * FROM targets WHERE id = ?',
//     // getAllTargets: 'SELECT * FROM targets ORDER BY id DESC ',
//     // deleteTarget: 'DELETE FROM targets WHERE id = ?',
//     // updateTarget: 'UPDATE targets SET name = @name, description = @description, date_creation = @date_creation WHERE id = @id',
//     // addCheckList: 'INSERT INTO checklist_header (name, date_creation, parent) VALUES (@name, @date_creation, @parent)',
//     // fetchTargetCheckLists: 'SELECT ch.id            AS header_id,\n' +
//     //     '       ch.name          AS header_name,\n' +
//     //     '       ch.description   AS header_description,\n' +
//     //     '       ch.date_creation AS header_date_creation,\n' +
//     //     '       ch.parent        AS header_target_id,\n' +
//     //     '       ch.owner         AS header_owner,\n' +
//     //     '       ch.expanded      AS header_expanded,\n' +
//     //     '       ch.order_key     AS order_key\n' +
//     //     'FROM checklist_header AS ch WHERE ch.parent = @id',
//     // // fetchTargetCheckLists: 'SELECT ch.id            AS header_id,\n' +
//     // //     '       ch.name          AS header_name,\n' +
//     // //     '       ch.description   AS header_description,\n' +
//     // //     '       ch.date_creation AS header_date_creation,\n' +
//     // //     '       ch.parent        AS header_target_id,\n' +
//     // //     '       ch.owner         AS header_owner,\n' +
//     // //     '       ch.expanded      AS header_expanded,\n' +
//     // //     '       ci.date_complete AS item_date_complete,\n' +
//     // //     '       ch.order_key     AS order_key,\n' +
//     // //     '       ci.id            AS item_id,\n' +
//     // //     '       ci.description   AS item_description,\n' +
//     // //     '       ci.date_creation AS item_date_creation,\n' +
//     // //     '       ci.parent_id     AS item_parent_id,\n' +
//     // //     '       ci.order_key     AS item_order_key,\n' +
//     // //     '       r.date           AS item_date_end,\n' +
//     // //     '       r.id             AS item_date_end_id,\n' +
//     // //     '       cmn.id           AS item_comment_id,\n' +
//     // //     '       cmn.text         AS item_comment_text,\n' +
//     // //     '       ci.checked       AS item_checked\n' +
//     // //     'FROM checklist_header AS ch\n' +
//     // //     '         LEFT JOIN checklist_item ci on ch.id = ci.parent_id\n' +
//     // //     '         LEFT JOIN reminder r on ci.id = r.item_id\n' +//FIXME if we will use many dates we must get other way for reminder
//     // //     '         LEFT JOIN comment cmn on cmn.item_id = r.item_id\n' +//FIXME if we will use many dates we must get other way for reminder
//     // //     'WHERE ch.parent = @id ORDER BY ci.id',
//     // setCheckedStatusOnListItem: 'UPDATE checklist_item SET checked = @checked, date_complete = @complete WHERE id = @id',
//     // updateCheckListItemDescriptionSQL: 'UPDATE checklist_item SET description = @description WHERE id = @id',
//     // deleteCheckListItemSQL: 'DELETE FROM checklist_item WHERE id = @id',
//     // insertCheckListItemSQL: 'INSERT INTO checklist_item (description, checked, parent_id, date_creation, order_key) VALUES (@description, @checked, @parent_id, @date_creation, @order_key)',
//     // updateCheckListNameSQL: 'UPDATE checklist_header SET name = @name WHERE id = @id',
//     // deleteCheckListSQL: 'DELETE FROM checklist_header WHERE id = @id',
//     // deleteCheckListItemsSQL: 'DELETE FROM checklist_item WHERE parent_id = @parent_id',
//     // updateCheckListExpandedSQL: 'UPDATE checklist_header SET expanded = @expanded WHERE id = @id',
//     // getVersion: 'SELECT * FROM version WHERE id = ?',
//     // setVersion: 'UPDATE version SET version = @version WHERE id = @id',
//     // addNoteEditor: 'INSERT INTO notes (name, date_creation, parent, owner) VALUES (@name, @date_creation, @parent, @owner)',
//     // fetchTargetNotes: 'SELECT * FROM notes WHERE parent = @id',
//     //
//     // updateEntityHeader: function ( table: string ) {
//     //     return `UPDATE ${ table } SET name = @name WHERE id = @id`;
//     // },
//     //
//     // updateEntityExpand: function ( table: string ) {
//     //     return `UPDATE ${ table } SET expanded = @expanded WHERE id = @id`;
//     // },
//     //
//     // deleteComponent: function ( table: string ) {
//     //     return `DELETE FROM ${ table } WHERE id = @id`;
//     // },
//     //
//     // updateNoteContent: 'UPDATE notes SET content = @content WHERE id = @id',
//     //
//     // updateCheckListItemsOrder: 'UPDATE checklist_item SET order_key = @orderKey WHERE id = @id ',
//     //
//     // fetchGoalListHeaders: 'SELECT id, name FROM main.checklist_header WHERE parent = @id',
//     //
//     // updateCheckListParent: 'UPDATE checklist_item SET parent_id = @headerId WHERE id = @itemId',
//     //
//     // updateTargetsOrder: 'UPDATE targets SET order_key = @orderKey WHERE id = @id ',
//     //
//     // updateOrderInTable: function ( table: string ) {
//     //     return `UPDATE ${ table } SET order_key = @orderKey WHERE id = @id`;
//     // },
//     //
//     // updateColorForTarget: 'UPDATE targets SET color = @color WHERE id = @id',
//     //
//     // addReminderSQL: 'INSERT INTO reminder (item_id, date, date_creation) VALUES (@itemId, @date, @date_creation)',
//     //
//     // updateReminderSQL: 'UPDATE reminder SET date = @date, date_creation = @date_creation WHERE item_id = @itemId',
//     //
//     // fetchAllReminders: 'SELECT * FROM reminder WHERE item_id = @itemId',
//     //
//     // fetchAllComments: 'SELECT * FROM comment WHERE item_id = @itemId',
//     //
//     // deleteReminderSQL: 'DELETE FROM reminder WHERE id = @id',
//     //
//     // deleteReminderByItemId: 'DELETE FROM reminder WHERE item_id = @itemId',
//     //
//     // addCommentSQL: 'INSERT INTO comment (item_id, text, date_creation) VALUES (@itemId, @text, @date_creation)',
//     //
//     // updateCommentSQL: 'UPDATE comment SET text = @text, date_creation = @date_creation WHERE item_id = @itemId',
//     //
//     // deleteCommentSQL: 'DELETE FROM comment WHERE id = @id',
//     //
//     // deleteCommentByItemId: 'DELETE FROM comment WHERE item_id = @itemId',
//     //
//     // fetchNotifications: 'SELECT * FROM reminder rm LEFT JOIN checklist_item  ci ON ci.id = rm.item_id LEFT JOIN checklist_header ch on ci.parent_id = ch.id WHERE date <= @date AND ci.checked = 0',
//     //
//     // fetchCheckListItemIds: 'SELECT id FROM main.checklist_item WHERE parent_id = @parentId',
//     //
//     // setArchiveStatus: 'UPDATE targets SET archive = @archive WHERE id = @id',
//     //
//     // fetchCheckedStatus: 'SELECT ci.checked\n' +
//     //     'FROM targets AS ts\n' +
//     //     'INNER JOIN checklist_header ch on ts.id = ch.parent\n' +
//     //     'INNER JOIN checklist_item AS ci on ch.id = ci.parent_id\n' +
//     //     'WHERE ts.id = @id',
//     //
//     // fetchCheckListItemById: 'SELECT * FROM main.checklist_item WHERE id = @id'
// };

// export const tableToComponent: { [ key: string ]: string } = {
//     'notes': 'NoteEditor',
//     'checklist_header': 'CheckList'
// };
