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
} from '@/interfaces/IApp';
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

    /**
     * Get database name return full name with file path
     */
    public getName(): string {
        return this.db.name;
    }

    /**
     * Get config data from file
     */
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

    /**
     * Has active database
     */
    public hasActiveDb(): boolean {
        return this.readyDb;
    }

    /**
     * Set last opened database path in config file
     * @param path
     */
    public setLastOpenedDatabasePath( path: string ) {
        let configData = this.config.get( ZDatabaseLocal.localDataKey );
        if ( configData ) {
            configData.lastOpenedDatabase = path;
            this.config.set( ZDatabaseLocal.localDataKey, configData );
        } else {
            console.info( 'Can not read config data in setLastOpenedDatabasePath' );
        }
    }

    /**
     * Open database fro given path if database file exists
     * @param options
     */
    public openDatabase( options?: DatabaseConnectOptions ): boolean {
        if ( options && options.path ) {
            const fs = require( 'fs' );
            if ( fs.existsSync( options.path ) ) {
                return this.createDbInstanceForPath( options.path );
            }
        }
        return false;
    }

    /**
     * Create SQLITE3 database for given path and use it for app
     * @param path
     */
    public createDbInstanceForPath( path: string ): boolean {
        this.db = new Database();
        this.db = new Database( path );
        if ( this.db.open ) {
            this.db.exec( 'PRAGMA foreign_keys=ON;' );
            this.config.addDbToConfigList( path );
            if ( this.readyDb ) {
                this.setLastOpenedDatabasePath( this.db.name );
                return this.readyDb;
            }
        }
        return false;
    }

    /**
     * Create database and use for app as new
     * @param name
     * @param destination
     */
    public createDatabase( name: string, destination?: string ): any {
        if ( !destination ) {
            destination = this.config.getUserBaseDbDirectory();
        }
        if ( name && destination ) {
            const path = require( 'path' );
            const dataBaseFullFilePath = path.join( destination, name + '.db' );
            this.createDbInstanceForPath( dataBaseFullFilePath );
            if ( this.readyDb ) {
                const fs = require( 'fs' );
                //@ts-ignore //FIXME add __static to config
                let sql = path.join( __static, '/sql/001-init.sql' );
                let resultSql = fs.readFileSync( sql, 'utf8' );
                resultSql = resultSql.toString();
                this.db.exec( resultSql );
            }
            return this.readyDb;
        }
    }

    /**
     * Is ready database for usage
     */
    get readyDb() {
        return this.db && this.db.open && this.db.memory === false;
    }

    /**
     * Close current database connection
     */
    public closeCurrentDatabase() {
        if ( this.readyDb ) {
            this.db.close();
        }
        return true;
    }

    /**
     * Get database version
     */
    public getDbVersion(): string | false {
        let result = this.execQueryGet<IDatabaseTablesVersion, number>( 'SELECT * FROM version WHERE id = ?', 7 );
        if ( result ) {
            return result.version;
        }
        return false;
    }

    /**
     * Execute query
     * @param sql
     * @param options
     */
    public execQueryGet<S, O>( sql: string, options: O ): false | S {
        const result = this.db.prepare( sql ).get( options );
        if ( result ) {
            return result;
        }
        return false;
    }

    /**
     * Set db version into database
     * @param version
     */
    public setDbVersion( version: string ): boolean {
        let parsedVersion = version.split( '.' );
        if ( parsedVersion.length === 3 ) {
            const stmt = this.db.prepare( 'UPDATE version SET version = @version WHERE id = @id' );
            const result = stmt.run( { version, id: LOCAL_VERSION_NODE_ID } );
            return !!result.changes;
        }
        return false;
    }

    /**
     * Fetch goals
     */
    fetchGoals(): IGoal[] {
        let query = 'SELECT * FROM targets ORDER BY id';
        const stmt = this.db.prepare( query );
        let allGoals: IGoal[] = stmt.all();
        for ( let k in allGoals ) {
            allGoals[ k ].progress = this.fetchProgressForGoal( allGoals[ k ].id );
        }
        return allGoals;
    }

    /**
     * Fetch lists for goal
     * @param goalId
     */
    fetchGoalItems( goalId: number ): IGoalItem[] {
        let query = 'SELECT * FROM checklist_header WHERE parent = @id';
        const stmt = this.db.prepare( query );
        return stmt.all( { id: goalId } );
    }

    /**
     * Fetch tasks for list
     * @param goalItemId
     */
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

    /**
     * Update checked status for task
     * @param options
     */
    updateNestedGoalItemCheckboxStatus( options: IArgCheckboxUpdate ): boolean {
        const stmt = this.db.prepare( 'UPDATE checklist_item SET checked = @checked, date_complete = @date_complete WHERE id = @id' );
        const result = stmt.run( {
            checked: options.status,
            id: options.item.id,
            date_complete: options.date_complete ? options.date_complete : null
        } );
        return !!result.changes;
    }

    /**
     * Update exp. date for task
     * @param options
     */
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

    /**
     * Update note for task
     * @param options
     */
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

    /**
     * Update task description
     * @param options
     */
    updateNestedGoalItemDescriptions( options: IArgItemDescription ): boolean {
        debugger
        let stmt = this.db.prepare( 'UPDATE checklist_item SET description = @description WHERE id = @id' );
        let result = stmt.run( {
            description: options.description,
            id: options.item.id
        } );
        return !!result.changes;
    }

    /**
     * Update list name
     * @param options
     */
    updateGoalItemName( options: IArgItemName ): boolean {
        let stmt = this.db.prepare( 'UPDATE checklist_header SET name = @name WHERE id = @id' );
        let result = stmt.run( {
            name: options.name,
            id: options.id
        } );
        return !!result.changes;
    }

    /**
     * Add goal
     * @param options
     */
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

    /**
     * Delete goal
     * @param goal
     */
    deleteGoal( goal: IGoal ): boolean {
        let stmt = this.db.prepare( 'DELETE FROM targets WHERE id = @id' );
        let result = stmt.run( {
            id: goal.id
        } );
        return !!result.changes;
    }

    /**
     * Update goal info
     * @param goalInfo
     */
    updateGoal( goalInfo: IArgUpdateGoal ): boolean {
        let stmt = this.db.prepare( 'UPDATE targets SET name = @name, description = @description, color = @color WHERE id = @id' )
        let result = stmt.run( goalInfo );
        return !!result.changes;
    }

    /**
     * Add list
     * @param goalItem
     */
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

    /**
     * Delete list
     * @param id
     */
    deleteGoalItem( id: number ): boolean {
        let stmtDeleteList = this.db.prepare( 'DELETE FROM checklist_header WHERE id = @id' );
        let result = stmtDeleteList.run( { id } );
        return !!result.changes;
    }

    /**
     * Delete task
     * @param item
     */
    deleteNestedItem( item: INestedItem ): boolean {
        let stmtDeleteItems = this.db.prepare( 'DELETE FROM checklist_item WHERE id = @id' );
        let result = stmtDeleteItems.run( { id: item.id } );
        return !!result.changes;
    }

    /**
     * Add new task
     * @param nestedItem
     */
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
            let newItemsOrderResult: { order_key: number, id: number }[] = [];
            let newItemsOrder: IGoalChangeItemsOrder = [];
            for ( let i = 0; i < items.length; i++ ) {
                newItemsOrderResult.push( {
                    order_key: i,
                    id: items[ i ].id
                } );
                newItemsOrder.push( {
                    orderKey: i,
                    id: items[ i ].id
                } );
            }
            // this.updateNestedItemsOrder( newItemsOrder );
            this.updateGoalNestedItemsOrder( newItemsOrder );
            let newItem = this.fetchNestedGoalItemById( result.lastInsertRowid );
            if ( newItem ) {
                return {
                    newItem: newItem,
                    itemsOrder: newItemsOrderResult
                }
            }
        }
        return false;
    }

    /**
     * Update order for tasks
     * !!! use updateGoalNestedItemsOrder instead
     * @param items
     * @deprecated
     */
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

    /**
     * Fetch task by id
     * @param id
     */
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

    /**
     * Set archive goal status
     * @param options
     */
    setArchiveGoalStatus( options: IArgUpdateArchiveGoalStatus ): boolean {
        let stmt = this.db.prepare( 'UPDATE targets SET archive = @archive WHERE id = @id' );
        let result = stmt.run( {
            archive: options.archiveStatus,
            id: options.goalId
        } );
        return !!result.changes;
    }

    /**
     * Fetch progress stats for goal
     * @param goalId
     */
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

    /**
     * Update order for goals
     * @param items
     */
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

    /**
     * Update order for lists
     * @param items
     */
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

    /**
     * Update order for task items
     * @param items
     */
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

    /**
     * Fetch all app settings
     */
    fetchAllSettings(): IAppSettingsItems {
        let stmt = this.db.prepare( 'SELECT * FROM settings' )
        return stmt.all();
    }

    /**
     * Update all app settings in database
     * @param items
     */
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

    /**
     * Add new label to database
     * @param label
     */
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

    /**
     * Delete label from database
     * @param label
     */
    deleteLabel( label: IAppLabel ): boolean {
        let stmt = this.db.prepare( 'DELETE FROM labels WHERE id = @id' );
        let result = stmt.run( label );
        return !!result.changes;
    }

    /**
     * Fetch all labels for app
     */
    fetchAllLabels(): IAppLabels {
        try {
            let stmt = this.db.prepare( 'SELECT * FROM labels' );
            return stmt.all();
        } catch ( e ) {
            return [];
        }
    }

    /**
     * Update labels for task
     * @param options.nestedId - task id
     * @param options.labels - array with actual labels
     */
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

    /**
     * Fetch labels for given task id
     * @param taskId
     */
    fetchLabelsForNestedItemById( taskId: number ): IAppLabels {
        try {
            let selectStmt = this.db.prepare( 'SELECT id, name, color, date_creation FROM task_label as tl LEFT JOIN labels as l on tl.label_id = l.id WHERE task_id = @taskId' );
            return selectStmt.all( { taskId: taskId } );
        } catch ( e ) {
            return [];
        }
    }

    /**
     * Fetch report data between given dates
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

    /**
     * Start time recording for task
     * @param options
     */
    startTimeRecordForTask( options: IArgStartTimeRecord ): false | number {
        let startSmt = this.db.prepare( 'INSERT INTO time_record (task_id, date_creation, date_start) VALUES (@taskId, @dateCreation, @dateStart)' )
        let result = startSmt.run( options );
        if ( !!result.changes ) {
            return result.lastInsertRowid
        }
        return false;
    }

    /**
     * End time recording for task
     * @param options
     */
    stopTimeRecordForTask( options: IArgStopTimeRecord ): boolean {
        let endStmt = this.db.prepare( 'UPDATE time_record SET date_end = @dateEnd WHERE id = @activeRecordInDatabaseId AND task_id = @taskId' );
        let result = endStmt.run( options );
        return result.changes;
    }

    /**
     * Fetch planed report data
     * @param options
     */
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

    /**
     * Fetch all time activity for task
     * @param taskId
     */
    fetchTimeActivityRecordsForTask( taskId: number ): ITimeRecords {
        let stmt = this.db.prepare( 'SELECT * FROM time_record WHERE task_id = @taskId' );
        return stmt.all( { taskId } );
    }

    /**
     * Fetch item stats. Needs for displaying progress in list by progress-circular
     * @param listId
     */
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

    /**
     * Update label
     * @param label
     */
    updateLabel( label: IAppLabel ): boolean {
        let stmt = this.db.prepare( 'UPDATE labels SET name = @name, color = @color WHERE id = @id' );
        let result = stmt.run( label );
        return !!result.changes;
    }

    /**
     * Move task item to new list
     * @param options
     */
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

    getLicenseText(): string {
        const path = require( 'path' );
        const fs = require( 'fs' );
        //@ts-ignore //FIXME add __static to config
        let sql = path.join( __static, '/LICENSE' );
        return fs.readFileSync( sql, 'utf8' );
    }

    getRepository(): string {
        return 'https://github.com/Gimanh/handscream';
    }
}
