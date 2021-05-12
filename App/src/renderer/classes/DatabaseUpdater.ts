import DatabaseLocal from '@/classes/DatabaseLocal';
import HelperNode from '@/classes/HelperNode';
import { Helper } from '@/classes/Helper';

export default class DatabaseUpdater {

    public path: string;

    public vionxVersion: string;

    public databaseVersion: string;

    public databaseInstance: DatabaseLocal;

    constructor( vionxVersion: string, databaseInstance: DatabaseLocal ) {
        const path = require( 'path' );
        //@ts-ignore
        this.path = path.join( __static, '/sql/' );
        this.vionxVersion = vionxVersion;
        let version = databaseInstance.getDbVersion();
        if ( version ) {
            this.databaseVersion = version;
        } else {
            this.databaseVersion = '';
        }
        this.databaseInstance = databaseInstance;
    }

    public updateDatabase(): boolean {
        let databaseVersion = this.databaseInstance.getDbVersion();
        if ( databaseVersion !== false ) {
            let result = Helper.compareVersion( this.vionxVersion, this.databaseVersion );
            if ( result === 1 ) {
                // alert("Structure of your database will updated from " + databaseVersion + " to " + this.vionxVersion);
                console.info( 'Structure of your database will updated from ' + databaseVersion + ' to ' + this.vionxVersion );
                this.runUpdate();
                return true;
            } else if ( result === -1 ) {
                alert( 'Please update your TaskView for using all features! \n ' +
                    ' Database you are using was created in version ' + databaseVersion +
                    ' \n Downgrade database not supported' );
            }
        }
        return false;
    }

    public runUpdate() {
        this.createBackupFile();
        this.createNoteTable();
        this.addOrderColumnToCheckList();
        this.addOrderColumnToTargets();
        this.addOrderColumnToNotes();
        this.addColorColumnToTargets();
        this.createReminderTable();
        this.createCommentTable();
        this.addArchiveColumnToGoal();
        this.addCheckedTimeColumnToCheckListItem();
        this.createSettingsTable();
        this.addShowCompletedTasks();
        this.createLabelsTable();
        this.createTaskLabelTable();
        this.createTimeRecordTable();
        this.addShowListStats();
        this.fixDeleteCascadeForDataIntegrity();
        this.databaseInstance.setDbVersion( this.vionxVersion );
    }

    /**
     * Fix data integrity in database lower than version '1.11.0'
     * and add on delete cascade and update cascade listeners
     */
    public fixDeleteCascadeForDataIntegrity() {
        let result = Helper.compareVersion( this.databaseVersion, '1.11.0' );
        if ( result === -1 || result === 0 ) {
            let files = [
                'u002-fix-cascade-delete-checklist-header.sql',
                'u002-fix-cascade-delete-checklist-item.sql',
                'u002-fix-cascade-delete-comment.sql',
                'u002-fix-cascade-delete-reminder.sql',
                'u002-fix-cascade-delete-task_label.sql',
                'u002-fix-cascade-delete-time_record.sql',
            ];
            let sql = '';
            for ( let k in files ) {
                sql += '\n ' + this.readFileContent( files[ k ] );
            }
            this.databaseInstance.db.exec( 'PRAGMA foreign_keys=OFF;' );
            this.databaseInstance.db.exec( sql );
            this.databaseInstance.db.exec( 'PRAGMA foreign_keys=ON;' );
        }
    }

    public addCheckedTimeColumnToCheckListItem() {
        let column: string = 'date_complete';
        this.addColumnToTable( 'checklist_item', column );
    }

    public addArchiveColumnToGoal() {
        let column: string = 'archive';
        this.addColumnToTable( 'targets', column );
    }

    public createNoteTable() {
        let noteSqlFileName = 'u001-note.sql';
        let sql = this.readFileContent( noteSqlFileName );
        this.databaseInstance.db.exec( sql );
    }

    public createSettingsTable() {
        let noteSqlFileName = 'u001-settings.sql';
        let sql = this.readFileContent( noteSqlFileName );
        this.databaseInstance.db.exec( sql );
    }

    public createLabelsTable() {
        let noteSqlFileName = 'u001-labels.sql';
        let sql = this.readFileContent( noteSqlFileName );
        this.databaseInstance.db.exec( sql );
    }

    public createTaskLabelTable() {
        let noteSqlFileName = 'u001-nested-item-label.sql';
        let sql = this.readFileContent( noteSqlFileName );
        this.databaseInstance.db.exec( sql );
    }

    public addSettingsItem( name: string, value: string ) {
        let stmt = this.databaseInstance.db.prepare( 'SELECT * FROM settings WHERE name = @name' );
        let result = stmt.all( { name } );
        if ( result.length < 1 ) {
            this.databaseInstance.db.exec( `INSERT INTO settings (name, value) VALUES('${ name }', '${ value }')` );
        }
    }

    public addShowCompletedTasks() {
        this.addSettingsItem( 'showCompletedTasks', 'false' );
    }

    public addShowListStats() {
        this.addSettingsItem( 'showListStats', 'true' );
    }

    public createReminderTable() {
        let noteSqlFileName = 'u001-reminder.sql';
        let sql = this.readFileContent( noteSqlFileName );
        this.databaseInstance.db.exec( sql );
    }

    public createCommentTable() {
        let noteSqlFileName = 'u001-comment.sql';
        let sql = this.readFileContent( noteSqlFileName );
        this.databaseInstance.db.exec( sql );
    }

    public createTimeRecordTable() {
        let noteSqlFileName = 'u001-timerecord.sql';
        let sql = this.readFileContent( noteSqlFileName );
        this.databaseInstance.db.exec( sql );
    }

    public hasServiceField( tableInfo: any ) {
        let hasServiceField = false;
        for ( let item of tableInfo ) {
            if ( item.name === 'service' ) {
                hasServiceField = true;
                break;
            }
        }
        return hasServiceField;
    }

    public getTableInfo( tableName: string ): any {
        let infoQuery = 'PRAGMA table_info(' + tableName + ');';
        return this.databaseInstance.db.prepare( infoQuery ).all();
    }

    public tableHasColumn( tableInfo: any, fieldName: string ): boolean {
        let hasField = false;
        for ( let item of tableInfo ) {
            if ( item.name === fieldName ) {
                hasField = true;
                break;
            }
        }
        return hasField;
    }

    public addColumnToTable( tableName: string, column: string, type: string = 'INTEGER' ): boolean {
        let tableInfo = this.getTableInfo( tableName );
        if ( tableInfo ) {
            if ( !this.tableHasColumn( tableInfo, column ) ) {
                let queryAddColumn = `ALTER TABLE ${ tableName } ADD COLUMN ${ column } ${ type }`;
                let stmtAddColumn = this.databaseInstance.db.prepare( queryAddColumn );
                stmtAddColumn.run();

                let checkTableInfo = this.getTableInfo( tableName );
                if ( !this.tableHasColumn( checkTableInfo, column ) ) {
                    alert( 'ERROR Database field ' + column + ' was not add' );
                    return false;
                }
            }
            return true;
        }
        return false;
    }

    public addColorColumnToTargets() {
        let column: string = 'color';
        let table: string = 'targets';
        this.addColumnToTable( table, column, 'TEXT' );
    }

    public addOrderColumnToCheckList() {
        let column: string = 'order_key';
        this.addColumnToTable( 'checklist_header', column );
        this.addColumnToTable( 'checklist_item', column );
    }

    public addOrderColumnToTargets() {
        let column: string = 'order_key';
        this.addColumnToTable( 'targets', column );
    }

    public addOrderColumnToNotes() {
        let column: string = 'order_key';
        this.addColumnToTable( 'notes', column );
    }

    public joinPath( fileNameInStaticDirectory: string ): string {
        const path = require( 'path' );
        return path.join( this.path, fileNameInStaticDirectory );
    }

    public readFileContent( fileNameInStaticDirectory: string ): string {
        const fs = require( 'fs' );
        let path = this.joinPath( fileNameInStaticDirectory );
        return fs.readFileSync( path, 'utf8' );
    }

    public createBackupFile() {
        let databaseVersion = this.databaseInstance.getDbVersion();
        if ( databaseVersion !== '0.0.1' ) {
            let databaseFile: string = this.databaseInstance.db.name;
            let name = HelperNode.getBaseName( databaseFile, '.db' );
            let newName = name + '_backup_' + Helper.formatDateToYMD( ( new Date() ).getTime(), '_' );
            let backUpPath = HelperNode.changeFilenameInPath( databaseFile, newName );
            HelperNode.copyFile( databaseFile, backUpPath );
        }
    }
}
