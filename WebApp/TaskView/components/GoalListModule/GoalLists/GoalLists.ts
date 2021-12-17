import { Component, Watch } from 'vue-property-decorator';
import { Action, State } from 'vuex-class';
import AppBase from '~/components/AppBase';
import { GoalListsState, GoalListsStoreActions } from '~/store/GoalLists';

@Component
export default class GoalLists extends AppBase {

    public selected: number = 0;

    @State( state => state.GoalLists.lists ) lists!: GoalListsState['lists'];

    @Action( 'fetchAllComponents', { namespace: 'GoalLists' } ) fetchAllComponents!: GoalListsStoreActions['fetchAllComponents'];

    @Watch( '$route.params.id' )
    async routeHandler( id: string ) {
        if ( id ) {
            this.startLoading();
            await this.fetchAllComponents( id );
            this.endLoading();
        }
    }

    async created() {
        this.startLoading();
        await this.fetchAllComponents( this.$route.params.id );
        this.endLoading();
    }
}
