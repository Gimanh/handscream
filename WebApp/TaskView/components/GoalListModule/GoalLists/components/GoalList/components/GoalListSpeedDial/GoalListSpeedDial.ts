import { Component, Prop } from 'vue-property-decorator';
import AppBase from '~/components/AppBase';
import { TGoalList } from '~/classes/util/GoalTypes';

@Component
export default class GoalListSpeedDial extends AppBase {

    @Prop( {
        default: () => {
        }
    } )
    public list!: TGoalList;

    public activeEdit: boolean = false;

    public fab: boolean = false;

    openEdit() {
        this.activeEdit = true;
    }

    closeEdit() {
        this.activeEdit = false;
    }

}
