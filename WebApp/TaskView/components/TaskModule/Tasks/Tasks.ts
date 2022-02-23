import { Component, Prop, Watch } from 'vue-property-decorator';
import { Action, State } from 'vuex-class';
import AppBase from '~/components/AppBase';
import { TasksStoreActions } from '~/store/Tasks';
import { AppTask, AppTasks } from '~/classes/util/TaskTypes';
import { GoalListsState } from '~/store/GoalLists';

@Component
export default class Tasks extends AppBase {

    @Prop( {} )
    public componentId!: number;

    public selected: number = 0;

    @State( state => state.Tasks.tasks ) tasks!: AppTasks;

    @State( state => state.GoalLists.lists ) lists!: GoalListsState['lists'];

    @Action( 'fetchTasks', { namespace: 'Tasks' } ) fetchTasks!: TasksStoreActions['fetchTasks'];

    @Watch( '$route.params.list' )
    async routeHandler( id: string ) {
        if ( id ) {
            this.startLoading();
            await this.fetchTasks( +this.componentId );
            this.endLoading();
        }
    }

    get canAddTasks(): boolean {
        for ( const k of this.lists ) {
            if ( +k.id === +this.componentId ) {
                if ( k.permissions.component_can_add_tasks ) {
                    return true;
                }
            }
        }
        return false;
    }

    get canWatchTasks(): boolean {
        for ( const k of this.lists ) {
            if ( +k.id === +this.componentId ) {
                if ( k.permissions.component_can_watch_content ) {
                    return true;
                }
            }
        }
        return false;
    }

    canAddSubtasksInComponent( id: AppTask['goalListId'] ) {
        for ( const k of this.lists ) {
            if ( +k.id === +id ) {
                if ( k.permissions.component_can_add_subtasks ) {
                    return true;
                }
            }
        }
        return false;
    }

    async created() {
        this.startLoading();
        await this.fetchTasks( +this.componentId );
        this.endLoading();
    }
}
