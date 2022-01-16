import { Component, Prop } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import AppBase from '~/components/AppBase';
import { GoalListsState, GoalListsStoreActions } from '~/store/GoalLists';

@Component
export default class GoalComponentDelete extends AppBase {
    @Prop( {
        default: () => {
        }
    } )
    public list!: GoalListsState['lists'][0];

    @Action( 'deleteList', { namespace: 'GoalLists' } ) deleteList!: GoalListsStoreActions['deleteList'];

    async deleteHandler() {
        const result = await this.deleteList( this.list.id );
        if ( !result ) {
            console.log( 'Can not delete list.', this.list.id );
        }
        this.redirect();
    }

    redirect() {
        //TODO
        // this.$router.go( -1 );
        // if ( +this.$route.params.id === +this.goalId ) {
        //     this.goToGoals();
        // }
    }
}
