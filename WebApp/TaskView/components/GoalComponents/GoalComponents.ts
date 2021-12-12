import { Component, Watch } from 'vue-property-decorator';
import { Action, State } from 'vuex-class';
import AppBase from '~/components/AppBase';
import { GoalComponentsState, GoalComponentsStoreActions } from '~/store/GoalComponents';

@Component
export default class GoalComponents extends AppBase {

    @State( state => state.GoalComponents.components ) components!: GoalComponentsState['components'];

    @Action( 'fetchAllComponents', { namespace: 'GoalComponents' } ) fetchAllComponents!: GoalComponentsStoreActions['fetchAllComponents'];

    @Watch( '$route.params.id' )
    async routeHandler( id: string ) {
        if ( id ) {
            await this.fetchAllComponents( id );
        }
    }

    async created() {
        await this.fetchAllComponents( this.$route.params.id );
    }
}
