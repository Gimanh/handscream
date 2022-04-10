import { Component, Prop } from 'vue-property-decorator';
import { Action, State } from 'vuex-class';
import AppBase from '~/components/AppBase';
import { GoalsState } from '~/store/Goals';
import { Goals, TGoalLists } from '~/classes/util/GoalTypes';
import { GoalListsState } from '~/store/GoalLists';
import { AppResponse } from '~/classes/util/AppTypes';
import { TasksStoreActions } from '~/store/Tasks';

@Component
export default class ActionMoveTask extends AppBase {

    @Prop( { default: -1 } )
    public taskId!: number;

    public dialog: boolean = false;

    public goalLists: GoalListsState['lists'] = [];

    @State( state => state.Goals.goals ) goals!: GoalsState['goals'];

    @State( state => state.GoalLists.urls ) listUrls!: GoalListsState['urls'];

    @Action( 'moveTask', { namespace: 'Tasks' } ) moveTask!: TasksStoreActions['moveTask'];

    get canShowLists(): boolean {
        return this.goalLists.length > 0;
    }

    async fetchGoalList( goalId: Goals[0]['id'] ) {
        const result = await this.$axios.$get<AppResponse<TGoalLists>>( `${ this.listUrls.fetchLists }?goalId=${ goalId }` );
        this.goalLists = result.response;
    }

    async moveTaskToList( listId: number ) {
        await this.moveTask( { listId, taskId: this.taskId } );
        this.$router.go( -1 );
        this.dialog = false;
    }

    clearLists() {
        this.goalLists = [];
    }

}
