import { Component, Prop } from 'vue-property-decorator';
import AppBase from '~/components/AppBase';
import { Goal } from '~/classes/util/GoalTypes';

@Component
export default class GoalSpeedDial extends AppBase {

    @Prop( {
        default: () => {
        }
    } )
    public goal!: Goal;

    public fab: boolean = false;

    public activeEdit: boolean = false;

    get canEdit(): boolean {
        return !!this.goal.permissions.goal_can_edit;
    }

    get canDelete(): boolean {
        return !!this.goal.permissions.goal_can_delete;
    }

    openEdit() {
        this.activeEdit = true;
    }

    closeEdit() {
        this.activeEdit = false;
    }
}
