import Vue from 'vue'
import Component from 'vue-class-component'
import { State, Mutation, Action } from 'vuex-class';
import { NS_GOALS, NS_MAIN_STORE, NS_SETTINGS, NS_TIME_CONTROL } from '@/store/Types/Consts';
import { LOCAL_USER_LOGIN, TARGET_ACTIONS_COLOR } from '@/classes/IZBaseProp';
import { $database, ApplicationModes } from '@/store/plugins/API';
import { IGoalStoreState } from '@/store/Types/Goals/IGoalsState';
import { IGoalsStoreMutations } from '@/store/Types/Goals/IGoalsStoreMutations';
import { ITimeRecordState } from '@/store/Types/TimeRecord/ITimeRecordState';
import { ITimeRecordActions } from '@/store/Types/TimeRecord/ITimeRecordActions';
import { IAppMainSettingsState } from '@/store/Types/AppSettings/IAppMainSettingsState';
import { IMainStoreMutations } from '@/store/Types/MainStore/IMainStoreMutations';
import { TaskItem } from '@/interfaces/IApp';
import { APP_EVENT_TASK_COMPLETE_STATUS, ROUTE_NAME_TASK_DIALOG } from '@/AppConsts';


@Component
export default class ZMixin extends Vue {

    @State( state => state[ NS_GOALS ].selectedNestedItemId )
    selectedNestedItemId!: IGoalStoreState['selectedNestedItemId'];

    @State( state => state[ NS_MAIN_STORE ].version ) version!: any;

    @State( state => state[ NS_MAIN_STORE ].usagesMode ) mode!: ApplicationModes;

    @State( state => state[ NS_MAIN_STORE ].colorAddGoal ) colorAddGoal!: string;

    @State( state => state[ NS_MAIN_STORE ].baseDialogWidth ) baseDialogWidth!: string;

    @State( state => state[ NS_MAIN_STORE ].addBtnElevation ) addBtnElevation!: string;

    @State( state => state[ NS_MAIN_STORE ].addBtnTransition ) addBtnTransition!: string;

    @State( state => state[ NS_MAIN_STORE ].addListItemTitleTransition ) addListItemTitleTransition!: string;

    @State( state => state[ NS_MAIN_STORE ].addListItemActiveFabClass ) addListItemActiveFabClass!: string;

    @State( state => state[ NS_MAIN_STORE ].archivedGoalsClass ) archivedGoalsClass!: string;

    @State( state => state[ NS_MAIN_STORE ].completeGoalIconColor ) completeGoalIconColor!: string;

    @State( state => state[ NS_MAIN_STORE ].allowSort ) allowSort!: boolean;

    @State( state => state[ NS_SETTINGS ].items ) settingItems!: IAppMainSettingsState['items'];

    @State( state => state[ NS_MAIN_STORE ].darkMode ) dark!: boolean;

    @State( state => state[ NS_MAIN_STORE ].licenseText ) licenseText!: string;

    @State( state => state[ NS_MAIN_STORE ].repository ) repository!: string;

    @State( state => state[ NS_GOALS ].labels ) labels!: IGoalStoreState['labels'];

    @State( state => state[ NS_GOALS ].selectedTaskForDialog )
    selectedTaskForDialog!: IGoalStoreState['selectedTaskForDialog'];

    @State( state => state[ NS_TIME_CONTROL ].activeRecordTask )
    activeRecordTask!: ITimeRecordState['activeRecordTask']

    @Mutation( 'setSelectedNestedItemId', { namespace: NS_GOALS } )
    setSelectedNestedItemId!: IGoalsStoreMutations['setSelectedNestedItemId'];

    @Mutation( 'setAllowSort', { namespace: NS_MAIN_STORE } )
    setAllowSort!: IMainStoreMutations['setAllowSort'];

    @Action( 'workingOnTask', { namespace: NS_TIME_CONTROL } )
    workingOnTask!: ITimeRecordActions['workingOnTask'];

    public reorderHandleClass: string = 'reorder-node-handle';

    public dialogWidth: string = '500px';

    //TODO we do not use this prop
    get showCompletedSettings() {
        return this.settingItems[ 'showCompletedTasks' ].value;
    }

    get showStatsInListSettings() {
        return this.settingItems[ 'showListStats' ].value;
    }

    get dbNameFull() {
        if ( $database ) {
            return $database.getName();
        }
        console.warn( 'Undefined database in store' );
        return '';
    }

    get dbName() {
        let path = require( 'path' );
        return path.basename( this.dbNameFull );
    }

    get activeDatabase() {
        if ( $database ) {
            if ( this.mode === 'local' ) {
                return $database.db.open && $database.db.memory === false;
            } else {
                return true;
            }
        }

        return false;
    }

    get dragOptions() {
        return {
            animation: 150,
            ghostClass: 'ghost-item',
            handle: '.' + this.reorderHandleClass
        };
    }

    redirectToUser() {
        this.$router.push( { name: 'user', params: { 'user': LOCAL_USER_LOGIN } } );
    }

    htmlEscape( value ) {
        let lt = /</g,
            gt = />/g,
            ap = /'/g,
            ic = /"/g;
        value = value.toString().replace( lt, '&lt;' ).replace( gt, '&gt;' ).replace( ap, '&#39;' ).replace( ic, '&#34;' );
        return value;
    }

    convertDescription( value ) {
        return this.htmlEscape( value ).split( '\n' ).join( '<br/>' );
    }

    get nameRules() {
        return [
            ( v ) => ( v && v.length >= 3 ) || this.$t( 'msg.requiredField' )
        ]
    }

    get descriptionRules() {
        return [
            ( v ) => {
                if ( v ) {
                    return ( v.length >= 3 ) || this.$t( 'msg.requiredField' )
                }
                return true;
            }
        ];
    }

    goToLocalUserPage() {
        this.$router.push( { name: 'user', params: { user: 'localUser' } } );
    }

    goToGoal( id ) {
        this.$router.push( { name: 'goal-id', params: { id: id } } )
    }

    minutesToHoursAndMinutes( minutes: number ) {
        let hours = Math.floor( minutes / 60 );
        let min = minutes % 60;
        if ( hours > 0 ) {
            return hours + '' + this.$t( 'msg.hours' ) + ' ' + min + '' + this.$t( 'msg.min' );
        }
        return min + '' + this.$t( 'msg.min' );
    }

    logError( error: any ) {
        console.log( error );
    }

    emitEventForList( taskListId: number ): void {
        this.$eventBus.$emit( APP_EVENT_TASK_COMPLETE_STATUS + taskListId );
    }

    goBack( step?: number ): void {
        if ( step ) {
            step = step * -1;
            this.$router.go( step );
        } else {
            this.$router.back();
        }
    }

    goToTaskDialog( id: number ): void {
        this.$router.push( {
            name: ROUTE_NAME_TASK_DIALOG,
            params: { taskId: id.toString() }
        } );
    }
}
