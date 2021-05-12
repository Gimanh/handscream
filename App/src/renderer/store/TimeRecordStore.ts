import { Getters, Mutations, Actions, Module } from 'vuex-smart-module'
import { $database } from '@/store/plugins/API';
import { Helper } from '@/classes/Helper';
import { DEF_ACTIVE_RECORD_VAL } from '@/store/Types/TimeRecord/Types';
import { ITimeRecordActions } from '@/store/Types/TimeRecord/ITimeRecordActions';

/**
 * Class for root state each request to database
 * or server for fetching data must use only actions
 * and then mutation { DONT USE MUTATIONS FOR ACCESS TO DATABASE }
 */
class TimeRecordStoreState {
    /**
     * Default value -1 mean no task is active
     */
    public activeRecordTask: number = DEF_ACTIVE_RECORD_VAL;

    public activeRecordIdInDatabase: number = DEF_ACTIVE_RECORD_VAL;

}

class TimeRecordStoreMutations extends Mutations<TimeRecordStoreState> {

    setActiveRecordTask( id: number ) {
        this.state.activeRecordTask = id;
    }

    setActiveRecordIdInDatabase( activeRecordIdInDatabase: number ) {
        this.state.activeRecordIdInDatabase = activeRecordIdInDatabase;
    }
}

class TimeRecordStoreGetters extends Getters<TimeRecordStoreState> {

}

class TimeRecordStoreActions extends Actions<TimeRecordStoreState,
    TimeRecordStoreGetters,
    TimeRecordStoreMutations,
    TimeRecordStoreActions> implements ITimeRecordActions {

    stopTimeRecordForTask( taskId: number ): Promise<boolean> {
        let result = $database.stopTimeRecordForTask( {
            taskId: taskId,
            activeRecordInDatabaseId: this.state.activeRecordIdInDatabase,
            dateEnd: Helper.dateNow()
        } );
        if ( result ) {
            this.commit( 'setActiveRecordTask', DEF_ACTIVE_RECORD_VAL );
        } else {
            console.warn( 'Can not stop time record for task ' + taskId );
            return new Promise( ( resolve ) => {
                resolve( false );
            } );
        }
        return new Promise( ( resolve ) => {
            resolve( true );
        } );
    }

    startTimeRecordForTask( taskId: number ): Promise<boolean> {
        let result = $database.startTimeRecordForTask( {
            taskId: taskId,
            dateCreation: Helper.dateNow(),
            dateStart: Helper.dateNow()
        } );
        if ( result !== false ) {
            this.commit( 'setActiveRecordTask', taskId );
            this.commit( 'setActiveRecordIdInDatabase', result );
        } else {
            console.warn( 'Can not start record for task ' + taskId );
            return new Promise( ( resolve ) => {
                resolve( false );
            } );
        }
        return new Promise( ( resolve ) => {
            resolve( true );
        } );
    }

    async workingOnTask( taskId: number ): Promise<any> {
        //Here we close set default value for active record task
        if ( taskId === DEF_ACTIVE_RECORD_VAL ) {
            if ( this.state.activeRecordTask !== DEF_ACTIVE_RECORD_VAL ) {
                return await this.stopTimeRecordForTask( this.state.activeRecordTask );
            } else {
                console.warn( 'Given task id is -1 and active task id is -1' );
                return new Promise( ( resolve ) => {
                    resolve( false );
                } );
            }
        }
        //If user press stop btn on activeRecordTask we must stop time record and add data to DB
        if ( taskId === this.state.activeRecordTask ) {
            return await this.stopTimeRecordForTask( taskId );
        }
        //If user select other task for time record we must save date data for old task and start new task time record
        if ( taskId !== this.state.activeRecordTask ) {
            if ( this.state.activeRecordTask !== DEF_ACTIVE_RECORD_VAL ) {
                await this.stopTimeRecordForTask( this.state.activeRecordTask );
                return await this.startTimeRecordForTask( taskId );
            } else {
                return await this.startTimeRecordForTask( taskId );
            }
        }

        return new Promise( ( resolve ) => {
            resolve( true );
        } );
    }
}


const module = new Module( {
    state: TimeRecordStoreState,
    getters: TimeRecordStoreGetters,
    mutations: TimeRecordStoreMutations,
    actions: TimeRecordStoreActions
} );
export default module;
