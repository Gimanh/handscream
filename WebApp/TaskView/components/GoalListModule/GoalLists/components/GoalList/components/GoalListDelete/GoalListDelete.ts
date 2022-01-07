import { Component, Prop } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import AppBase from '~/components/AppBase';
import { GoalListsState, GoalListsStoreActions } from '~/store/GoalLists';

@Component
export default class GoalListDelete extends AppBase {
    @Prop( {
        default: () => {
        }
    } )
    public list!: GoalListsState['lists'][0];

    @Action( 'deleteList', { namespace: 'GoalLists' } ) deleteList!: GoalListsStoreActions['deleteList'];

    async deleteHandler() {
        debugger
        await this.deleteList( this.list.id );
        this.redirect();
    }

    redirect() {
        // this.$router.go( -1 );
        // if ( +this.$route.params.id === +this.goalId ) {
        //     this.goToGoals();
        // }
    }
}