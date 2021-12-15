import { Component, Prop, Watch } from 'vue-property-decorator';
import AppBase from '~/components/AppBase';
import { Action } from 'vuex-class';
import { TasksStoreActions } from '~/store/Tasks';

@Component
export default class Tasks extends AppBase {

    @Prop( {} )
    public componentId!: number;

    @Action( 'fetchTasks', { namespace: 'Tasks' } ) fetchTasks!: TasksStoreActions['fetchTasks'];

    @Watch( '$route.params.list' )
    async routeHandler( id: string ) {
        if ( id ) {
            await this.fetchTasks( +this.componentId );
        }
    }

    async created() {
        await this.fetchTasks( +this.componentId );
    }
}
