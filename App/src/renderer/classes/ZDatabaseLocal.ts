import {
    DatabaseConnectOptions,
    IArgAddNested,
    IZDatabase
} from '@/classes/IZDatabase';
import { ConfigStore } from '@/classes/ConfigStore';
import { LOCAL_VERSION_NODE_ID } from '@/classes/IZBaseProp';
import { Helper } from '@/classes/Helper';
import { IDatabaseTablesVersion } from '@/classes/IDatabaseTables';
import {
    IAppAddLabel,
    IAppLabel, IAppLabels,
    IGoal,
    IGoalChangeItemsOrder,
    IGoalItem,
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
    IArgNestedGoalItem, IArgReport,
    IArgUpdateArchiveGoalStatus,
    IArgUpdateGoal,
    INestedItem, IReportResult, TMoveTaskArg
} from '@/store/IGoalsStore';
import { IConfigDataTaskView } from '@/classes/IConfigStore';
import { IAppSettingsItems } from '@/store/IAppMainSettings';
import { IArgStartTimeRecord, IArgStopTimeRecord, ITimeRecords } from '@/store/ITimeRecord';

const Database = require( 'better-sqlite3' );

export default class ZDatabaseLocal implements IZDatabase {

    public db: any = new Database();

    public static localDataKey: string = 'taskView';

    public static configFileName: string = 'TASK_VIEW_CFG.json';

    public static databaseDirectoryName = 'TaskViewDb';

    public config: ConfigStore = new ConfigStore( ZDatabaseLocal.configFileName, ZDatabaseLocal.databaseDirectoryName );

    constructor() {
        let existingData = this.config.get( ZDatabaseLocal.localDataKey );
        if ( !existingData ) {
            this.config.set( ZDatabaseLocal.localDataKey,
                {
                    databaseList: [],
                    lastOpenedDatabase: ''
                }
            )
        }
    }

    public getName(): string {
        return this.db.name;
    }

    public getConfigData(): { databaseList: { src: string, date: number }[], lastOpenedDatabase: string } {
        let configData = this.config.get( ZDatabaseLocal.localDataKey );
        if ( configData ) {
            return configData;
        }
        return {
            databaseList: [],
            lastOpenedDatabase: ''
        };
    }

    public hasActiveDb(): boolean {
        return this.readyDb;
    }

    // public addDbToConfigList( fullPath ) {
    //     let data = this.config.get<IConfigDataTaskView>( ZDatabaseLocal.localDataKey );
    //     if ( data ) {
    //         data.databaseList.push( {
    //             src: fullPath,
    //             date: Helper.dateNow()
    //         } );
    //     }
    //
    //     this.config.set( ZDatabaseLocal.localDataKey, data );
    // }

    public setLastOpenedDatabasePath( path: string ) {
        let configData = this.config.get( ZDatabaseLocal.localDataKey );
        if ( configData ) {
            configData.lastOpenedDatabase = path;
            this.config.set( ZDatabaseLocal.localDataKey, configData );
        } else {
            console.info( 'Can not read config data in setLastOpenedDatabasePath' );
        }
    }

    // public addPathToConfig( path: string ) {
    //     let data = this.config.get<IConfigDataTaskView>( ZDatabaseLocal.localDataKey );
    //     let has = false;
    //     if ( data ) {
    //         for ( let k = 0; k < data.databaseList.length; k++ ) {
    //             if ( data.databaseList[ k ].src == path ) {
    //                 has = true;
    //                 break;
    //             }
    //         }
    //         if ( !has ) {
    //             data.databaseList.unshift( {
    //                 src: path,
    //                 date: Helper.dateNow()
    //             } )
    //         }
    //         this.config.set( ZDatabaseLocal.localDataKey, data );
    //     }
    // }

    public openDatabase( options?: DatabaseConnectOptions ): boolean {
        const fs = require( 'fs' );
        if ( options && options.path ) {
            if ( fs.existsSync( options.path ) ) {
                this.config.addDbToConfigList( options.path );
                const Database = require( 'better-sqlite3' );
                this.db = new Database( options.path );
                if ( this.readyDb ) {
                    this.setLastOpenedDatabasePath( this.db.name );
                }
                return !!this.readyDb;
            } else {
                return false;
            }
        }

        return false;
    }

    public createDatabase( name: string, destination?: string ): any {
        if ( !destination ) {
            destination = this.config.getUserBaseDbDirectory();
        }
        if ( name && destination ) {
            const Database = require( 'better-sqlite3' );
            const path = require( 'path' );
            const dataBaseFullFilePath = path.join( destination, name + '.db' );
            this.db = new Database( dataBaseFullFilePath );
            if ( !!this.db ) {
                this.config.addDbToConfigList( dataBaseFullFilePath );
                this.setLastOpenedDatabasePath( this.db.name );
                const fs = require( 'fs' );
                //@ts-ignore //FIXME add __static to config
                let sql = path.join( __static, '/sql/001-init.sql' );
                let resultSql = fs.readFileSync( sql, 'utf8' );
                resultSql = resultSql.toString();
                this.db.exec( resultSql );
            }
            return !!this.db.open;
        }
    }

    get readyDb() {
        return this.db.open && this.db.memory === false;
    }

    public closeCurrentDatabase() {
        if ( this.readyDb ) {
            this.db.close();
        }
        return true;
    }

    public getDbVersion(): string | false {
        let result = this.execQueryGet<IDatabaseTablesVersion, number>( 'SELECT * FROM version WHERE id = ?', 7 );
        if ( result ) {
            return result.version;
        }
        return false;
    }

    public execQueryGet<S, O>( sql: string, options: O ): false | S {
        const result = this.db.prepare( sql ).get( options );
        if ( result ) {
            return result;
        }
        return false;
    }

    public setDbVersion( version: string ): boolean {
        let parsedVersion = version.split( '.' );
        if ( parsedVersion.length === 3 ) {
            const stmt = this.db.prepare( 'UPDATE version SET version = @version WHERE id = @id' );
            const result = stmt.run( { version, id: LOCAL_VERSION_NODE_ID } );
            return !!result.changes;
        }
        return false;
    }

    fetchGoals(): IGoal[] {
        let query = 'SELECT * FROM targets ORDER BY id';
        const stmt = this.db.prepare( query );
        let allGoals: IGoal[] = stmt.all();
        for ( let k in allGoals ) {
            allGoals[ k ].progress = this.fetchProgressForGoal( allGoals[ k ].id );
        }
        return allGoals;
    }

    fetchGoalItems( goalId: number ): IGoalItem[] {
        let query = 'SELECT * FROM checklist_header WHERE parent = @id';
        const stmt = this.db.prepare( query );
        return stmt.all( { id: goalId } );
    }

    fetchNestedGoalItems( goalItemId: string ): IGoalNestedItems {
        let query = 'SELECT ci.*,\n' +
            '       c.text          AS item_comment_text,\n' +
            '       c.id            AS item_comment_id,\n' +
            '       c.date_creation AS item_comment_date_creation,\n' +
            '       c.item_id       AS item_comment_parent_id,\n' +
            '       c.owner         AS item_comment_owner,\n' +
            '       r.id            AS item_reminder_id,\n' +
            '       r.item_id       AS item_reminder_parent_id,\n' +
            '       r.date          AS item_reminder_exp_date,\n' +
            '       r.date_creation AS item_reminder_date_creation,\n' +
            '       r.owner         AS item_reminder_owner\n' +
            'FROM checklist_item as ci\n' +
            '         LEFT JOIN comment AS c ON c.item_id = ci.id\n' +
            '         LEFT JOIN reminder AS r ON r.item_id = ci.id\n' +
            'WHERE ci.parent_id = @id';
        const stmt = this.db.prepare( query );
        let all: IGoalNestedItems = stmt.all( { id: goalItemId } );
        all.forEach( ( val ) => {
            val.labels = this.fetchLabelsForNestedItemById( val.id );
        } );
        return all;
    }

    updateNestedGoalItemCheckboxStatus( options: IArgCheckboxUpdate ): boolean {
        const stmt = this.db.prepare( 'UPDATE checklist_item SET checked = @checked, date_complete = @date_complete WHERE id = @id' );
        const result = stmt.run( {
            checked: options.status,
            id: options.item.id,
            date_complete: options.date_complete ? options.date_complete : null
        } );
        return !!result.changes;
    }

    updateNestedGoalItemExpDate( options: IArgItemDate ): boolean {
        let selectStmt = this.db.prepare( 'SELECT * FROM reminder WHERE item_id = @itemId' );
        let selectResult = selectStmt.get( { itemId: options.item.id } );
        if ( !selectResult ) {
            const insertStmt = this.db.prepare( 'INSERT INTO reminder (item_id, date, date_creation) VALUES (@itemId, @date, @date_creation)' );
            const resultInsert = insertStmt.run( {
                itemId: options.item.id,
                date: options.date,
                date_creation: Helper.dateNow()
            } );
            return !!resultInsert.changes;
        }
        const stmt = this.db.prepare( 'UPDATE reminder SET date = @date WHERE item_id = @itemId' );
        const result = stmt.run( {
            date: options.date,
            itemId: options.item.id
        } );
        return !!result.changes;
    }

    updateNestedGoalItemComment( options: IArgItemComment ): boolean {
        let selectStmt = this.db.prepare( 'SELECT * FROM comment WHERE item_id = @itemId' );
        let selectResult = selectStmt.get( { itemId: options.item.id } );
        if ( !selectResult ) {
            const insertStmt = this.db.prepare( 'INSERT INTO comment (item_id, text, date_creation) VALUES (@itemId, @text, @date_creation)' );
            const resultInsert = insertStmt.run( {
                itemId: options.item.id,
                text: options.comment,
                date_creation: Helper.dateNow()
            } );
            return !!resultInsert.changes;
        }
        const stmt = this.db.prepare( 'UPDATE comment SET text = @text WHERE item_id = @itemId' );
        const result = stmt.run( {
            text: options.comment,
            itemId: options.item.id
        } );
        return !!result.changes;
    }

    updateNestedGoalItemDescriptions( options: IArgItemDescription ): boolean {
        let stmt = this.db.prepare( 'UPDATE checklist_item SET description = @description WHERE id = @id' );
        let result = stmt.run( {
            description: options.description,
            id: options.item.id
        } );
        return !!result.changes;
    }

    updateGoalItemName( options: IArgItemName ): boolean {
        let stmt = this.db.prepare( 'UPDATE checklist_header SET name = @name WHERE id = @id' );
        let result = stmt.run( {
            name: options.name,
            id: options.id
        } );
        return !!result.changes;
    }

    addGoal( options: IArgAddGoal ): IGoal | false {
        let stmt = this.db.prepare( 'INSERT INTO targets (name, description, date_creation, owner, color, order_key) VALUES (@name, @description, @date_creation, @owner, @color, @orderKey)' );
        let result = stmt.run( {
            name: options.name,
            description: options.description,
            date_creation: Helper.dateNow(),
            owner: 'local',
            color: options.color,
            orderKey: Helper.dateNow() + 1
        } );
        if ( !!result.changes ) {
            let selectStmt = this.db.prepare( 'SELECT * FROM targets WHERE id = @id' );
            let goal: IGoal = selectStmt.get( {
                id: result.lastInsertRowid
            } );
            goal.progress = 0;
            return goal;
        }
        return false;
    }

    deleteGoal( goal: IGoal ): boolean {
        let stmt = this.db.prepare( 'DELETE FROM targets WHERE id = @id' )
        let transaction = this.db.transaction( ( object: { id: number } ) => {
            let allGoalItems = this.fetchGoalItems( object.id );
            for ( let k in allGoalItems ) {
                this.deleteGoalItem( allGoalItems[ k ].id );
            }
            stmt.run( {
                id: goal.id
            } );
        } );
        transaction( { id: goal.id } );
        return true;
    }

    updateGoal( goalInfo: IArgUpdateGoal ): boolean {
        let stmt = this.db.prepare( 'UPDATE targets SET name = @name, description = @description, color = @color WHERE id = @id' )
        let result = stmt.run( goalInfo );
        return !!result.changes;
    }

    addGoalItem( goalItem: IArgAddGoalItem ): IGoalItem | false {
        let stmt = this.db.prepare( 'INSERT INTO checklist_header (name, description, date_creation, parent) VALUES (@name, @description, @date_creation, @parent)' );
        let result = stmt.run( {
            name: goalItem.name,
            description: goalItem.description,
            date_creation: Helper.dateNow(),
            parent: goalItem.goalId
        } );
        if ( !!result.changes ) {
            let selectStmt = this.db.prepare( 'SELECT * FROM checklist_header WHERE id = @id' );
            let insertedGoalItem = selectStmt.get( { id: result.lastInsertRowid } );
            if ( insertedGoalItem ) {
                return insertedGoalItem;
            }
        }
        return false;
    }

    deleteGoalItem( id: number ): boolean {
        let stmtAllItemsId = this.db.prepare( 'SELECT id FROM checklist_item WHERE parent_id = @id' );
        let allItems = stmtAllItemsId.all( { id: id } );

        let hasItems: boolean = !!allItems.length;
        let arr: string[] = [];
        arr.length = allItems.length;
        let placeholders = '(' + arr.fill( '?' ).join( ',' ) + ')';
        let items: number[] = allItems.map( ( item ) => item.id );

        let stmtDeleteComments = this.db.prepare( 'DELETE FROM comment WHERE item_id IN ' + placeholders );
        let stmtDeleteReminders = this.db.prepare( 'DELETE FROM reminder WHERE item_id IN ' + placeholders );
        let deleteLabelsStmt = this.db.prepare( 'DELETE FROM task_label WHERE task_id IN ' + placeholders );

        let stmtDeleteNestedItems = this.db.prepare( 'DELETE FROM checklist_item WHERE parent_id = @id' )
        let stmtDeleteList = this.db.prepare( 'DELETE FROM checklist_header WHERE id = @id' );

        let transaction = this.db.transaction( ( object: { id: number } ) => {
            if ( hasItems ) {
                stmtDeleteComments.run( items );
                stmtDeleteReminders.run( items );
                deleteLabelsStmt.run( items );
            }
            stmtDeleteNestedItems.run( object );
            stmtDeleteList.run( object );
        } );
        transaction( { id: id } );
        return true;
    }

    deleteNestedItem( item: INestedItem ): boolean {
        let stmtDeleteComments = this.db.prepare( 'DELETE FROM comment WHERE item_id = @id' );
        let stmtDeleteReminders = this.db.prepare( 'DELETE FROM reminder WHERE item_id = @id' );
        let stmtDeleteItems = this.db.prepare( 'DELETE FROM checklist_item WHERE id = @id' );
        let stmtDeleteItemLabels = this.db.prepare( 'DELETE FROM task_label WHERE task_id = @id ' );

        let transaction = this.db.transaction( () => {
            stmtDeleteComments.run( { id: item.id } );
            stmtDeleteReminders.run( { id: item.id } );
            stmtDeleteItems.run( { id: item.id } );
            stmtDeleteItemLabels.run( { id: item.id } );
        } );
        transaction( { id: item.id } );
        return true;
    }

    addNestedGoalItem( nestedItem: IArgNestedGoalItem ): IArgAddNested | false {
        let stmt = this.db.prepare( 'INSERT INTO checklist_item (description, parent_id, date_creation, order_key) VALUES (@description, @parentId, @dateCreation, @orderKey)' )
        let result = stmt.run( {
            description: nestedItem.description,
            dateCreation: Helper.dateNow(),
            orderKey: nestedItem.order_key,
            parentId: nestedItem.parentId
        } );
        if ( !!result.changes ) {
            let selectStmt = this.db.prepare( 'SELECT id, order_key FROM checklist_item WHERE parent_id = @parentId ORDER BY order_key' );
            let items = selectStmt.all( {
                parentId: nestedItem.parentId
            } )
            let newItemsOrder: { order_key: number, id: number }[] = [];
            for ( let i = 0; i < items.length; i++ ) {
                newItemsOrder.push( {
                    order_key: i,
                    id: items[ i ].id
                } )
            }
            this.updateNestedItemsOrder( newItemsOrder );
            let newItem = this.fetchNestedGoalItemById( result.lastInsertRowid );
            if ( newItem ) {
                return {
                    newItem: newItem,
                    itemsOrder: newItemsOrder
                }
            }
        }
        return false;
    }

    updateNestedItemsOrder( items: { id: number, order_key: number }[] ): boolean {
        const update = this.db.prepare( 'UPDATE checklist_item SET order_key = @order_key WHERE id = @id' );
        const updateMany = this.db.transaction( ( cats ) => {
            for ( const cat of cats ) {
                update.run( cat );
            }
        } );
        updateMany( items );
        return true;
    }

    fetchNestedGoalItemById( id: number ): INestedItem | false {
        let query = 'SELECT ci.*,\n' +
            '       c.text          AS item_comment_text,\n' +
            '       c.id            AS item_comment_id,\n' +
            '       c.date_creation AS item_comment_date_creation,\n' +
            '       c.item_id       AS item_comment_parent_id,\n' +
            '       c.owner         AS item_comment_owner,\n' +
            '       r.id            AS item_reminder_id,\n' +
            '       r.item_id       AS item_reminder_parent_id,\n' +
            '       r.date          AS item_reminder_exp_date,\n' +
            '       r.date_creation AS item_reminder_date_creation,\n' +
            '       r.owner         AS item_reminder_owner\n' +
            'FROM checklist_item as ci\n' +
            '         LEFT JOIN comment AS c ON c.item_id = ci.id\n' +
            '         LEFT JOIN reminder AS r ON r.item_id = ci.id\n' +
            'WHERE ci.id = @id';
        const stmt = this.db.prepare( query );
        let item = stmt.get( { id: id } );
        item.labels = this.fetchLabelsForNestedItemById( id );
        return item;
    }

    setArchiveGoalStatus( options: IArgUpdateArchiveGoalStatus ): boolean {
        let stmt = this.db.prepare( 'UPDATE targets SET archive = @archive WHERE id = @id' );
        let result = stmt.run( {
            archive: options.archiveStatus,
            id: options.goalId
        } );
        return !!result.changes;
    }

    fetchProgressForGoal( goalId: number ): number {
        let queryProgress = 'SELECT ci.checked\n' +
            'FROM targets AS ts\n' +
            'INNER JOIN checklist_header ch on ts.id = ch.parent\n' +
            'INNER JOIN checklist_item AS ci on ch.id = ci.parent_id\n' +
            'WHERE ts.id = @id';
        let progressStmt = this.db.prepare( queryProgress );
        let allItems: { checked: number }[] = progressStmt.all( { id: goalId } );
        let checkedCount = 0;
        if ( allItems.length > 0 ) {
            for ( let i in allItems ) {
                if ( allItems.hasOwnProperty( i ) ) {
                    if ( allItems[ i ][ 'checked' ] ) {
                        checkedCount++;
                    }
                }
            }
        }
        return checkedCount > 0 ? Math.ceil( ( checkedCount / allItems.length ) * 100 ) : 0;
    }

    updateGoalsOrder( items: IGoalChangeItemsOrder ): boolean {
        const update = this.db.prepare( 'UPDATE targets SET order_key = @orderKey WHERE id = @id' );
        const updateMany = this.db.transaction( ( cats ) => {
            for ( const cat of cats ) {
                update.run( cat );
            }
        } );
        updateMany( items );
        return true;
    }

    updateGoalItemsOrder( items: IGoalChangeItemsOrder ): boolean {
        const update = this.db.prepare( 'UPDATE checklist_header SET order_key = @orderKey WHERE id = @id' );
        const updateMany = this.db.transaction( ( cats ) => {
            for ( const cat of cats ) {
                update.run( cat );
            }
        } );
        updateMany( items );
        return true;
    }

    updateGoalNestedItemsOrder( items: IGoalChangeItemsOrder ): boolean {
        const update = this.db.prepare( 'UPDATE checklist_item SET order_key = @orderKey WHERE id = @id' );
        const updateMany = this.db.transaction( ( cats ) => {
            for ( const cat of cats ) {
                update.run( cat );
            }
        } );
        updateMany( items );
        return true;
    }

    fetchAllSettings(): IAppSettingsItems {
        let stmt = this.db.prepare( 'SELECT * FROM settings' )
        return stmt.all();
    }

    updateAllSettings( items: IAppSettingsItems ): boolean {
        let stmt = this.db.prepare( 'UPDATE settings SET value = @value WHERE name = @name AND id = @id' );
        const updateMany = this.db.transaction( ( cats ) => {
            for ( const cat of cats ) {
                stmt.run( cat );
            }
        } );
        updateMany( items );
        return true;
    }

    addNewLabel( label: IAppAddLabel ): IAppLabel | false {
        try {
            let stmt = this.db.prepare( 'INSERT INTO labels (name, color, date_creation) VALUES (@name, @color, @date_creation)' )
            let result = stmt.run( label );
            if ( result.lastInsertRowid ) {
                return {
                    ...label,
                    id: result.lastInsertRowid
                };
            }
        } catch ( e ) {
            return false;
        }

        return false;
    }

    deleteLabel( label: IAppLabel ): boolean {
        let stmt = this.db.prepare( 'DELETE FROM labels WHERE id = @id' );
        let stmtRelation = this.db.prepare( 'DELETE FROM task_label WHERE label_id = @id' );
        let result = stmt.run( label );
        stmtRelation.run( label );
        return !!result.changes;
    }

    fetchAllLabels(): IAppLabels {
        try {
            let stmt = this.db.prepare( 'SELECT * FROM labels' );
            return stmt.all();
        } catch ( e ) {
            return [];
        }
    }

    updateLabelsOnNestedItem( options: { nestedId: number; labels: IAppLabels } ): boolean {
        let deleteStmt = this.db.prepare( 'DELETE FROM task_label WHERE task_id = @nestedId' );
        deleteStmt.run( options );
        let insertStmt = this.db.prepare( 'INSERT INTO task_label (task_id, label_id) VALUES (@taskId, @labelId)' );
        try {
            let transaction = this.db.transaction( ( insertOptions: { nestedId: number; labels: IAppLabels } ) => {
                for ( let k in insertOptions.labels ) {
                    insertStmt.run( {
                        taskId: options.nestedId,
                        labelId: insertOptions.labels[ k ].id
                    } )
                }
            } );
            transaction( options )
        } catch ( e ) {
            return false;
        }
        return true;
    }

    fetchLabelsForNestedItemById( taskId: number ): IAppLabels {
        try {
            let selectStmt = this.db.prepare( 'SELECT id, name, color, date_creation FROM task_label as tl LEFT JOIN labels as l on tl.label_id = l.id WHERE task_id = @taskId' );
            return selectStmt.all( { taskId: taskId } );
        } catch ( e ) {
            return [];
        }
    }

    /**
     * SELECT ci.*,
     ch.name        AS list_name,
     ch.description AS list_description,
     t.name         AS goal_name,
     t.description  AS goal_description,
     l.name         AS label_name,
     l.color        AS label_color
     FROM checklist_item AS ci
     LEFT JOIN checklist_header AS ch ON ci.parent_id = ch.id
     LEFT JOIN targets AS t ON ch.parent = t.id
     LEFT JOIN task_label AS tl ON tl.task_id = ci.id
     LEFT JOIN labels l on tl.label_id = l.id
     WHERE ci.date_complete <= 1590699540000
     AND ci.date_complete >= 1588453200000
     * @param options
     */
    fetchReportData( options: IArgReport ): IReportResult {
        let query = 'SELECT ci.*,\n' +
            '       ch.name        AS list_name,\n' +
            '       ch.description AS list_description,\n' +
            '       t.name         AS goal_name,\n' +
            '       t.description  AS goal_description,\n' +
            '       l.name         AS label_name,\n' +
            '       l.color        AS label_color,\n' +
            '       c.text         AS comment,\n' +
            '       r.date         AS deadline,\n' +
            '       tr.date_start  AS work_start,\n' +
            '       tr.date_end    AS work_end\n' +
            'FROM checklist_item AS ci\n' +
            '         LEFT JOIN checklist_header AS ch ON ci.parent_id = ch.id\n' +
            '         LEFT JOIN targets AS t ON ch.parent = t.id\n' +
            '         LEFT JOIN task_label AS tl ON tl.task_id = ci.id\n' +
            '         LEFT JOIN labels l on tl.label_id = l.id\n' +
            '         LEFT JOIN comment c on ci.id = c.item_id\n' +
            '         LEFT JOIN reminder r on ci.id = r.item_id\n' +
            '         LEFT JOIN time_record tr on ci.id = tr.task_id\n' +
            'WHERE ((ci.date_complete <= @end AND ci.date_complete >= @start)\n' +
            'OR (tr.date_creation <= @end AND tr.date_creation >= @start ))';
        if ( options.labels.length > 0 ) {
            query += ' AND tl.label_id IN (' + options.labels.join( ',' ) + ') ';
        }
        let stmt = this.db.prepare( query );
        return stmt.all( options );
    }

    startTimeRecordForTask( options: IArgStartTimeRecord ): false | number {
        let startSmt = this.db.prepare( 'INSERT INTO time_record (task_id, date_creation, date_start) VALUES (@taskId, @dateCreation, @dateStart)' )
        let result = startSmt.run( options );
        if ( !!result.changes ) {
            return result.lastInsertRowid
        }
        return false;
    }

    stopTimeRecordForTask( options: IArgStopTimeRecord ): boolean {
        let endStmt = this.db.prepare( 'UPDATE time_record SET date_end = @dateEnd WHERE id = @activeRecordInDatabaseId AND task_id = @taskId' );
        let result = endStmt.run( options );
        return result.changes;
    }

    fetchPlanReportData( options: IArgReport ): IReportResult {
        let query = 'SELECT ci.*,\n' +
            '       ch.name        AS list_name,\n' +
            '       ch.description AS list_description,\n' +
            '       t.name         AS goal_name,\n' +
            '       t.description  AS goal_description,\n' +
            '       l.name         AS label_name,\n' +
            '       l.color        AS label_color,\n' +
            '       c.text         AS comment,\n' +
            '       r.date         AS deadline,\n' +
            '       tr.date_start  AS work_start,\n' +
            '       tr.date_end    AS work_end\n' +
            'FROM checklist_item AS ci\n' +
            '         LEFT JOIN checklist_header AS ch ON ci.parent_id = ch.id\n' +
            '         LEFT JOIN targets AS t ON ch.parent = t.id\n' +
            '         LEFT JOIN task_label AS tl ON tl.task_id = ci.id\n' +
            '         LEFT JOIN labels l on tl.label_id = l.id\n' +
            '         LEFT JOIN comment c on ci.id = c.item_id\n' +
            '         LEFT JOIN reminder r on ci.id = r.item_id\n' +
            '         LEFT JOIN time_record tr on ci.id = tr.task_id\n' +
            'WHERE r.date <= @end\n' +
            '  AND r.date >= @start';
        if ( options.labels.length > 0 ) {
            query += ' AND tl.label_id IN (' + options.labels.join( ',' ) + ') ';
        }
        let stmt = this.db.prepare( query );
        return stmt.all( options );
    }

    fetchTimeActivityRecordsForTask( taskId: number ): ITimeRecords {
        let stmt = this.db.prepare( 'SELECT * FROM time_record WHERE task_id = @taskId' );
        return stmt.all( { taskId } );
    }

    fetchGoalItemStats( listId: number ): number {
        let stmt = this.db.prepare( 'SELECT COUNT(id) AS todo FROM checklist_item WHERE checked = 0 AND parent_id = @listId' );
        let stmtReady = this.db.prepare( 'SELECT COUNT(id) AS todo FROM checklist_item WHERE checked = 1 AND parent_id = @listId' );
        let result = stmt.get( { listId } );
        let readyResult = stmtReady.get( { listId } );
        let total = ( result.todo + readyResult.todo );
        let progress = 0;
        if ( total > 0 ) {
            progress = Math.ceil( ( readyResult.todo / total ) * 100 );
        }
        return progress;
    }

    updateLabel( label: IAppLabel ): boolean {
        let stmt = this.db.prepare( 'UPDATE labels SET name = @name, color = @color WHERE id = @id' );
        let result = stmt.run( label );
        return !!result.changes;
    }

    moveTaskToNewList( options: TMoveTaskArg ): boolean {
        let stmt = this.db.prepare( 'UPDATE checklist_item SET parent_id = @parentId WHERE id = @id' );
        let result = stmt.run( {
            parentId: options.newParentListId,
            id: options.taskId
        } );
        return !!result.changes;
    }

    deleteNestedGoalItemsExpDate( item: IGoalNestedItems[0] ): boolean {
        let stmt = this.db.prepare( 'DELETE FROM reminder WHERE item_id = @id' );
        let result = stmt.run( item );
        return result.changes;
    }

    // /**
    //  * @deprecated
    //  * @param goalItemId
    //  */
    // public fetchNestedGoalItemItems( goalItemId: number ) {
    //     let query = 'SELECT * FROM checklist_item WHERE parent_id = @id';
    //     let stmt = this.db.prepare( query );
    //     let result = stmt.all( { id: goalItemId } )
    //     return result;
    // }

    // public addTargetDb( target: ITarget ) {
    //     if ( this.readyDb ) {
    //         try {
    //             target.owner = 'lcl';
    //             const stmt = this.db.prepare( SQL.addTarget );
    //             let result = stmt.run( target );
    //             if ( result ) {
    //                 return {
    //                     lastInsertRowid: result.lastInsertRowid,
    //                     changes: result.changes
    //                 };
    //             }
    //             return false;
    //         } catch ( e ) {
    //             alert( e );
    //             return false;
    //         }
    //     }
    //     return false;
    // }

    // public getTarget( id: number ): ITarget | false {
    //     let target = this.db.prepare( SQL.getTarget ).get( id );
    //     if ( target ) {
    //         target.components = {
    //             lists: [],
    //             notes: []
    //         };
    //         return target/*{
    //             id: target.id,
    //             name: target.name,
    //             date_creation: target.date_creation,
    //             description: target.description,
    //             owner: target.owner,
    //             color: target.color,
    //             components: {
    //                 lists: [],
    //                 notes: []
    //             },
    //             order_key: target.order_key,
    //             archive: target.archive
    //         }*/
    //     }
    //
    //     return false;
    // }

    // public fetchProgress( options: { id: number } ): number {
    //     let progress = 0;
    //     let progressStmt = this.db.prepare( SQL.fetchCheckedStatus );
    //     let result = progressStmt.all( options );
    //     let checkedCount = 0;
    //     if ( result.length > 0 ) {
    //         for ( let i in result ) {
    //             if ( result.hasOwnProperty( i ) ) {
    //                 if ( result[ i ][ 'checked' ] ) {
    //                     checkedCount++;
    //                 }
    //             }
    //         }
    //         progress = Math.ceil( ( checkedCount / result.length ) * 100 );
    //     }
    //     return progress;
    // }

    // public getAllTargets(): ITarget[] | [] {
    //     if ( this.readyDb ) {
    //         let targets = this.db.prepare( SQL.getAllTargets ).all();
    //         targets.map( ( value ) => {
    //             value.progress = this.fetchProgress( { id: value.id } );
    //             /**
    //              * we dont need fetch all included components
    //              * if we select all targets, all included components will be fetched in a single target page
    //              */
    //             value.components = [];
    //         } );
    //         if ( targets ) {
    //             return targets;
    //         }
    //     }
    //     return [];
    // }
    //
    // public deleteTarget( id ): boolean {
    //     const stmt = this.db.prepare( SQL.deleteTarget );
    //     let result = stmt.run( id );
    //     return !!result.changes;
    // }
    //
    // public deleteAllNestedGoalComponents( goalId: number ): boolean {
    //     let allLists = this.getTargetCheckLists( goalId );
    //     if ( allLists ) {
    //         for ( let i = 0; i < allLists.length; i++ ) {
    //             this.deleteCheckListWithItems( allLists[ i ].props.id );
    //         }
    //     }
    //     return false;
    // }
    //
    // public updateTarget( target: ITarget ): ITarget | false {
    //     if ( target.id ) {
    //         const stmt = this.db.prepare( SQL.updateTarget );
    //         let result = stmt.run( target );
    //         if ( !!result.changes ) {
    //             return this.getTarget( target.id );
    //         }
    //     }
    //     return false;
    // }
    //
    // public fetchActiveTarget( id: number ): ITarget | false {
    //     let target = this.getTarget( id );
    //     if ( target ) {
    //         let checkLists = this.getTargetCheckLists( id );
    //         if ( checkLists ) {
    //             target.components = checkLists;
    //         }
    //     }
    //     return target
    // }
    //
    // public getTargetCheckLists( targetId: number ): CheckList[] | false {
    //     let result: { [ key: number ]: CheckList; } = {};
    //     let checkLists = this.db.prepare( SQL.fetchTargetCheckLists ).all( { id: targetId } );
    //     if ( checkLists.length > 0 ) {
    //         for ( let item of checkLists ) {
    //             if ( result[ item.header_id ] === undefined ) {
    //                 result[ item.header_id ] = {
    //                     name: 'CheckList',
    //                     parent: item.header_target_id,
    //                     date_creation: item.header_date_creation,
    //                     props: {
    //                         id: item.header_id,
    //                         header_id: item.header_id,
    //                         header_name: item.header_name,
    //                         name: item.header_name,
    //                         header_description: item.header_description,
    //                         header_date_creation: item.header_date_creation,
    //                         header_owner: item.header_owner,
    //                         header_expanded: item.header_expanded,
    //                         expanded: item.header_expanded,
    //                         order_key: item.order_key,
    //                     }
    //                 };
    //             }
    //             if ( item.item_id !== null ) {
    //                 let reminder: any = null;
    //                 if ( item.item_date_end_id ) {
    //                     reminder = {
    //                         id: item.item_date_end_id,
    //                         date: Helper.getDateTime( item.item_date_end )
    //                     };
    //                 }
    //                 let comment: any = null;
    //
    //                 if ( item.item_comment_id ) {
    //                     comment = {
    //                         id: item.item_comment_id,
    //                         text: item.item_comment_text
    //                     }
    //                 }
    //             }
    //         }
    //         return Object.values( result );
    //     }
    //     return false;
    // }
    //
    // public getTargetNotes( targetId: number ): VionxNote[] | false {
    //     let result: VionxNote[] = [];
    //     const stmt = this.db.prepare( SQL.fetchTargetNotes );
    //     let notes = stmt.all( { id: targetId } );
    //     if ( notes.length > 0 ) {
    //         for ( let note of notes ) {
    //             result.push( {
    //                 name: 'NoteEditor',
    //                 parent: note.parent,
    //                 date_creation: note.date_creation,
    //                 props: <VionxNoteProps> note
    //             } );
    //         }
    //         return Object.values( result ).reverse();
    //     }
    //     return false;
    // }
    //
    // public addCheckList( options: AddCheckListOptions ): CheckList | false {
    //     // debugger
    //     const stmt = this.db.prepare( SQL.addCheckList );
    //     let result = stmt.run( options );
    //     if ( !!result.changes ) {
    //         return {
    //             id: result.lastInsertRowid,
    //             name: options.name,
    //             parent: options.parent,
    //             date_creation: options.date_creation,
    //             props: {
    //                 id: result.lastInsertRowid,
    //                 header_id: result.lastInsertRowid,
    //                 header_name: options.name,
    //                 name: options.name,
    //                 header_date_creation: options.date_creation,
    //                 header_description: '',
    //                 // header_target_id: options.parent,
    //                 header_owner: '',
    //                 header_expanded: 1,
    //                 expanded: 1,
    //                 order_key: 0,
    //                 // items: []
    //             }
    //         }
    //     }
    //     return false;
    //
    // }
    //
    // public setCheckStatusToListItem( options: { itemId: number; checked: number } ): boolean {
    //     const stmt = this.db.prepare( SQL.setCheckedStatusOnListItem );
    //     let result = stmt.run( {
    //         checked: options.checked,
    //         id: options.itemId,
    //         complete: Helper.dateNow()
    //     } );
    //     return !!result.changes;
    // }

    // public updateCheckListItemDescription( options: { itemId: number, description: string } ): boolean {
    //     const stmt = this.db.prepare( SQL.updateCheckListItemDescriptionSQL );
    //     let result = stmt.run( { description: options.description, id: options.itemId } );
    //     return !!result.changes;
    // }
    //
    // public deleteCheckListItem( options: { itemId: number } ): boolean {
    //     const stmt = this.db.prepare( SQL.deleteCheckListItemSQL );
    //     const stmtReminder = this.db.prepare( SQL.deleteReminderByItemId );
    //     const stmtComment = this.db.prepare( SQL.deleteCommentByItemId );
    //     let result;
    //
    //     stmtReminder.run( options );
    //     stmtComment.run( options );
    //     result = stmt.run( { id: options.itemId } );
    //     return !!result.changes;
    // }
    //
    // public insertCheckListItem( options: CheckListItem ): false | number {
    //     const stmt = this.db.prepare( SQL.insertCheckListItemSQL );
    //     let result = stmt.run( {
    //         description: options.item_description,
    //         checked: options.item_checked,
    //         parent_id: options.item_parent_id,
    //         date_creation: options.item_date_creation,
    //         order_key: options.item_order_key
    //     } );
    //     if ( !!result.changes ) {
    //         return result.lastInsertRowid;
    //     }
    //     return false;
    // }
    //
    // public updateCheckListName( options: { checklistId: number; name: string } ) {
    //     const stmt = this.db.prepare( SQL.updateCheckListNameSQL );
    //     let result = stmt.run( {
    //         name: options.name,
    //         id: options.checklistId
    //     } );
    //     return !!result.changes;
    // }
    //
    // public deleteCheckListWithItems( id: number ): boolean {
    //     let allItemsStmt = this.db.prepare( SQL.fetchCheckListItemIds );
    //     let allResult = allItemsStmt.all( { parentId: id } );
    //     for ( let k in allResult ) {
    //         let deleteResult = this.deleteCheckListItem( { itemId: allResult[ k ][ 'id' ] } );
    //         if ( !deleteResult ) {
    //             //TODO logger
    //         }
    //     }
    //     let stmt = this.db.prepare( SQL.deleteCheckListSQL );
    //     let resultHeader = stmt.run( {
    //         id: id
    //     } );
    //     return !!resultHeader.changes;
    // }
    //
    // public updateCheckListExpanded( options: { checklistId: number; expanded: number } ): boolean {
    //     const stmt = this.db.prepare( SQL.updateCheckListExpandedSQL );
    //     const result = stmt.run( {
    //         id: options.checklistId,
    //         expanded: options.expanded
    //     } );
    //     return !!result.changes;
    // }
    //

    //
    // public addNoteComponent( options: TargetComponent ): VionxNote | false {
    //     const stmt = this.db.prepare( SQL.addNoteEditor );
    //     let result = stmt.run( options );
    //     if ( !!result.changes ) {
    //         return {
    //             name: options.name,
    //             parent: options.parent,
    //             date_creation: options.date_creation,
    //             props: {
    //                 id: result.lastInsertRowid,
    //                 name: options.name,
    //                 content: '',
    //                 expanded: 1,
    //                 order_key: 0
    //             }
    //         }
    //     }
    //     return false;
    // }
    //

    //

    //
    // public updateTargetComponentHeaderValue( options: IUpdateHeaderValue ): boolean {
    //     let query = SQL.updateEntityHeader( options.tableName );
    //     const stmt = this.db.prepare( query );
    //     const result = stmt.run( { name: options.value, id: options.id } );
    //     return !!result.changes;
    // }
    //
    // public updateTargetComponentExpandedStatus( options: IUpdateExpandedStatus ): boolean {
    //     let query = SQL.updateEntityExpand( options.tableName );
    //     const stmt = this.db.prepare( query );
    //     const result = stmt.run( { expanded: options.value, id: options.id } );
    //     return !!result.changes;
    // }
    //
    // public deleteTargetComponent( options: IDeleteTargetComponent ): boolean {
    //     let query = SQL.deleteComponent( options.tableName );
    //     const stmt = this.db.prepare( query );
    //     const result = stmt.run( { id: options.id } );
    //     return !!result.changes;
    // }
    //
    // public updateNoteContent( options: IUpdateNoteContent ): boolean {
    //     const stmt = this.db.prepare( SQL.updateNoteContent );
    //     const result = stmt.run( { content: options.content, id: options.id } );
    //     return !!result.changes;
    // }
    //
    // public fetchExpressTasks(): CheckList[] | false {
    //     return this.getTargetCheckLists( -LOCAL_EXPRESS_TASKS_ID );
    // }
    //
    // public updateCheckListItemsOrder( items: { id: number, orderKey: number }[] ): boolean {
    //     const update = this.db.prepare( SQL.updateCheckListItemsOrder );
    //     const updateMany = this.db.transaction( ( cats ) => {
    //         for ( const cat of cats ) {
    //             update.run( cat );
    //         }
    //     } );
    //     updateMany( items );
    //     return true;
    // }
    //
    // public fetchGoalListHeaders( options: { targetId: number } ): { id: number, name: string }[] | false {
    //     let stmt = this.db.prepare( SQL.fetchGoalListHeaders );
    //     let result = stmt.all( { id: options.targetId } );
    //     if ( result && result.length > 0 ) {
    //         return result;
    //     }
    //     return false;
    // }
    //
    // public changeCheckListItemParent( options: { headerId: number; itemId: number } ): boolean {
    //     const stmt = this.db.prepare( SQL.updateCheckListParent );
    //     let result = stmt.run( options );
    //     return !!result.changes;
    // }
    //
    // public updateTargetsItemsOrder( items: { id: number; orderKey: number }[] ): boolean {
    //     const update = this.db.prepare( SQL.updateTargetsOrder );
    //     const updateMany = this.db.transaction( ( cats ) => {
    //         for ( const cat of cats ) {
    //             update.run( cat );
    //         }
    //     } );
    //     updateMany( items );
    //     return true;
    // }
    //
    // public updateOrderInTable( options: { table: string, items: { id: number; orderKey: number }[] } ): boolean {
    //     let query = SQL.updateOrderInTable( options.table );
    //     const update = this.db.prepare( query );
    //     const updateMany = this.db.transaction( ( cats ) => {
    //         for ( const cat of cats ) {
    //             update.run( cat );
    //         }
    //     } );
    //     updateMany( options.items );
    //     return true;
    // }
    //
    // public updateTargetColor( options: { id: number; color: string } ): boolean {
    //     const stmt = this.db.prepare( SQL.updateColorForTarget );
    //     let result = stmt.run( options );
    //     return !!result.changes;
    // }
    //
    // public addReminderDate( options: { itemId: number; date: number; date_creation: string } ) {
    //     const stmt = this.db.prepare( SQL.addReminderSQL );
    //     let result = stmt.run( options );
    //     if ( !!result.changes ) {
    //         return result.lastInsertRowid
    //     }
    //     return false;
    // }
    //
    // public updateReminderDate( options: { itemId: number; date: number; date_creation: string } ): boolean {
    //     const stmt = this.db.prepare( SQL.updateReminderSQL );
    //     let result = stmt.run( options );
    //     return !!result.changes
    // }
    //
    // public fetchItemRemindersAndComment( options: { itemId: number } ): false | { reminders: [], comments: [] } {
    //     let itemReminders = this.db.prepare( SQL.fetchAllReminders ).all( options );
    //     for ( let k in itemReminders ) {
    //         if ( itemReminders.hasOwnProperty( k ) ) {
    //             itemReminders[ k ].date = Helper.getDateTime( itemReminders[ k ].date );
    //         }
    //     }
    //
    //     let commentItems = this.db.prepare( SQL.fetchAllComments ).all( options );
    //     return {
    //         reminders: itemReminders,
    //         comments: commentItems
    //     };
    // }
    //
    // public deleteReminderFromDb( options: { id: number, itemId: number } ) {
    //     const stmt = this.db.prepare( SQL.deleteReminderSQL );
    //     let result = stmt.run( { id: options.id } );
    //     return !!result.changes
    // }
    //
    // public addCommentText( options: { itemId: number, text: string, date_creation: string } ) {
    //     const stmt = this.db.prepare( SQL.addCommentSQL );
    //     let result = stmt.run( options );
    //     if ( !!result.changes ) {
    //         return result.lastInsertRowid
    //     }
    //     return false;
    // }
    //
    // public updateCommentText( options: { itemId: number, text: string, date_creation: string } ): boolean {
    //     const stmt = this.db.prepare( SQL.updateCommentSQL );
    //     let result = stmt.run( options );
    //     return !!result.changes
    // }
    //
    // public deleteCommentFromDb( options: { id: number, itemId: number; parentId: number } ) {
    //     const stmt = this.db.prepare( SQL.deleteCommentSQL );
    //     let result = stmt.run( { id: options.id } );
    //     return !!result.changes
    // }
    //
    // public fetchNotifications( options: { date: number } ) {
    //     if ( this.db.name !== '' ) {
    //         const stmt = this.db.prepare( SQL.fetchNotifications );
    //         let result = stmt.all( options );
    //         return result;
    //     }
    //     return [];
    // }
    //
    // public updateArchiveInGoal( options: { id: number; archive: number } ): boolean {
    //     const stmt = this.db.prepare( SQL.setArchiveStatus );
    //     let result = stmt.run( options );
    //     return !!result.changes
    // }
    //
    // public fetchCheckListItemById( options: { id: number } ): CheckListItem | false {
    //     let stmt = this.db.prepare( SQL.fetchCheckListItemById );
    //     let result = stmt.all( options );
    //     if ( result.length < 1 ) {
    //         return false;
    //     }
    //     result = result[ 0 ];
    //
    //     let item: CheckListItem = {
    //         item_id: result.id,
    //         item_description: result.description,
    //         item_order_key: result.order_key,
    //         item_checked: result.checked,
    //         item_comments: [],
    //         item_reminders: [],
    //         item_date_complete: result.date_complete,
    //         item_parent_id: result.parent_id,
    //         item_date_creation: result.date_creation,
    //         item_date_end: result.date_complete
    //     };
    //
    //     return item;
    // }
    //

}
