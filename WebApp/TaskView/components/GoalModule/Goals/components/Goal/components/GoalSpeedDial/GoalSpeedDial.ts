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

    openEdit() {
        this.activeEdit = true;
    }

    closeEdit() {
        this.activeEdit = false;
    }
}
