import { Component, Prop, Watch } from 'vue-property-decorator';
import { Action, State } from 'vuex-class';
import AppBase from '~/components/AppBase';
import { TasksStoreActions } from '~/store/Tasks';
import { AppTasks } from '~/classes/util/TaskTypes';

@Component
export default class Tasks extends AppBase {

    @Prop( {} )
    public componentId!: number;

    public selected: number = 0;

    @State( state => state.Tasks.tasks ) tasks!: AppTasks;

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
