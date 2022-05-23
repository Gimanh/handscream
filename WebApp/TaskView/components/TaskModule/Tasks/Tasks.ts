import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
import { Action, Mutation, State } from 'vuex-class';
import AppBase from '~/components/AppBase';
import { TasksMutations, TasksStoreActions } from '~/store/Tasks';
import { AppTask, AppTasks, FetchTasksArg } from '~/classes/util/TaskTypes';
import { GoalListsState } from '~/store/GoalLists';
import { TagsStoreActions } from '~/store/Tags';

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

    public showCompleted: boolean = false;

    public searchText: string = '';

    @State( state => state.Tasks.tasks ) tasks!: AppTasks;

    @State( state => state.GoalLists.lists ) lists!: GoalListsState['lists'];

    @Action( 'fetchTasks', { namespace: 'Tasks' } ) fetchTasks!: TasksStoreActions['fetchTasks'];

    @Action( 'fetchPriorities', { namespace: 'Tasks' } ) fetchPriorities!: TasksStoreActions['fetchPriorities'];

    @Action( 'fetchTags', { namespace: 'Tags' } ) fetchTags!: TagsStoreActions['fetchTags'];

    @Mutation( 'setCurrentListId', { namespace: 'Tasks' } ) setCurrentListId!: TasksMutations['setCurrentListId'];

    @Mutation( 'setTasks', { namespace: 'Tasks' } ) setTasks!: TasksMutations['setTasks'];

    @Watch( 'componentId', { immediate: true } )
    async routeHandler( id: string, old: string ) {
        this.currentPage = 0;
        this.noMoreTasks = false;
        if ( id !== old ) {
            this.setCurrentListId( +id );
            this.setTasks( [] );
        }
        if ( id ) {
            this.startLoading();
            await this.fetchTasks( this.fetchTasksArgs );
            this.endLoading();
        }
    }

    @Watch( 'showCompleted' )
    async showCompletedHandler() {
        this.currentPage = 0;
        this.noMoreTasks = false;
        this.setTasks( [] );
        this.startLoading();
        await this.fetchTasks( this.fetchTasksArgs );
        this.endLoading();
    }

    @Watch( 'searchText' )
    async searchTextHandler() {
        this.currentPage = 0;
        this.noMoreTasks = false;
        this.setTasks( [] );
        this.startLoading();
        await this.fetchTasks( this.fetchTasksArgs );
        this.endLoading();
    }

    get fetchTasksArgs(): FetchTasksArg {
        return {
            componentId: +this.componentId,
            page: this.currentPage,
            showCompleted: this.showCompleted ? 1 : 0,
            searchText: this.searchText
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
        await this.fetchTags();
        await this.fetchPriorities();
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

    showCompletedTasks( value: boolean ) {
        this.showCompleted = value;
    }

    searchTask( text: string ) {
        this.searchText = text;
    }
}
