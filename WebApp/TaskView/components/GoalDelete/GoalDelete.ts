import { Component, Prop } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import AppBase from '~/components/AppBase';
import { GoalsStoreActions } from '~/store/Goals';

@Component
export default class GoalDelete extends AppBase {
    @Prop()
    public goalId!: number;

    @Action( 'deleteGoal', { namespace: 'Goals' } ) deleteGoal!: GoalsStoreActions['deleteGoal'];

    async deleteHandler() {
        await this.deleteGoal( this.goalId );
        this.redirect();
    }

    redirect() {
        if ( +this.$route.params.id === +this.goalId ) {
            this.goToGoals();
        }
    }

}
