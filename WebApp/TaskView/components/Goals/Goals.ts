import { Component } from 'vue-property-decorator';
import AppBase from '~/components/AppBase';
import { Action, State } from 'vuex-class';
import { GoalsState, GoalsStoreActions } from '~/store/Goals';
import { AddGoalMode } from '~/classes/util/GoalTypes';

@Component
export default class Goals extends AppBase {
    @State( state => state.Goals.goals ) goals!: GoalsState['goals'];

    @Action( 'fetchGoals', { namespace: 'Goals' } ) fetchGoals!: GoalsStoreActions['fetchGoals'];

    public selected: number = 0;

    public goalAddMode: AddGoalMode = 'inline';

    async created() {
        await this.fetchGoals();
    }
}
