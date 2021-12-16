import { Component, Prop, Watch } from 'vue-property-decorator';
import { Action, State } from 'vuex-class';
import AppBase from '~/components/AppBase';
import { TasksState, TasksStoreActions } from '~/store/Tasks';

@Component
export default class Tasks extends AppBase {

    @Prop( {} )
    public componentId!: number;

    public selected: number = 0;

    public loading: boolean = false;

    @State( state => state.Tasks.tasks ) tasks!: TasksState['tasks'];

    @Action( 'fetchTasks', { namespace: 'Tasks' } ) fetchTasks!: TasksStoreActions['fetchTasks'];

    @Watch( '$route.params.list' )
    async routeHandler( id: string ) {
        if ( id ) {
            this.startLoading();
            await this.fetchTasks( +this.componentId );
            this.endLoading();
        }
    }

    startLoading() {
        this.loading = true;
    }

    endLoading() {
        setTimeout( () => {
            this.loading = false;
        }, 500 );
    }

    async created() {
        this.startLoading();
        await this.fetchTasks( +this.componentId );
        this.endLoading();
    }
}
