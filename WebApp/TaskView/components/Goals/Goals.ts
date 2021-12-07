import { Component } from 'vue-property-decorator';
import AppBase from '~/components/AppBase';
import { Action, State } from 'vuex-class';
import { GoalsState, GoalsStoreActions } from '~/store/Goals';

@Component
export default class Goals extends AppBase {
    @State( state => state.Goals.goals ) goals!: GoalsState['goals'];

    @Action( 'fetchGoals', { namespace: 'Goals' } ) fetchGoals!: GoalsStoreActions['fetchGoals'];

    async created() {
        await this.fetchGoals();
    }
}
