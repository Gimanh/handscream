import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
import { Action, State } from 'vuex-class';
import AppBase from '~/components/AppBase';
import { TasksStoreActions } from '~/store/Tasks';
import { AppTask, AppTasks, FetchTasksArg } from '~/classes/util/TaskTypes';
import { GoalListsState } from '~/store/GoalLists';

@Component
export default class Tasks extends AppBase {

    @Prop( {} )
    public componentId!: number;

    public selected: number = 0;

    public $refs!: {
        list: Vue
    }

    public currentPage: number = 0;

    public noMoreTasks: boolean = false;

    @State( state => state.Tasks.tasks ) tasks!: AppTasks;

    @State( state => state.GoalLists.lists ) lists!: GoalListsState['lists'];

    @Action( 'fetchTasks', { namespace: 'Tasks' } ) fetchTasks!: TasksStoreActions['fetchTasks'];

    @Watch( '$route.params.list' )
    async routeHandler( id: string ) {
        this.currentPage = 0;
        this.noMoreTasks = false;
        if ( id ) {
            this.startLoading();
            await this.fetchTasks( this.fetchTasksArgs );
            this.endLoading();
        }
    }

    get fetchTasksArgs(): FetchTasksArg {
        return {
            componentId: +this.componentId,
            page: this.currentPage
        };
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
        await this.fetchTasks( this.fetchTasksArgs );
        this.endLoading();
        this.$refs.list.$el.addEventListener( 'scroll', this.onScroll );
    }

    async onScroll() {
        if ( !this.loading && !this.noMoreTasks ) {
            if ( ( ( this.$refs.list.$el.scrollTop + this.$refs.list.$el.clientHeight ) + 100 ) >= this.$refs.list.$el.scrollHeight ) {
                this.currentPage++;
                this.startLoading();
                const result = await this.fetchTasks( this.fetchTasksArgs );
                if ( result ) {
                    if ( result.response.length === 0 ) {
                        this.noMoreTasks = true;
                    }
                }
                this.endLoading();
            }
        }
    }
}
