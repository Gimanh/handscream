import { Component, Prop, Watch } from 'vue-property-decorator';
import { Action, State } from 'vuex-class';
import AppBase from '~/components/AppBase';
import { TasksState, TasksStoreActions } from '~/store/Tasks';

@Component
export default class Tasks extends AppBase {

    @Prop( {} )
    public componentId!: number;

    public selected: number = 0;

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

    async created() {
        this.startLoading();
        await this.fetchTasks( +this.componentId );
        this.endLoading();
    }
}
