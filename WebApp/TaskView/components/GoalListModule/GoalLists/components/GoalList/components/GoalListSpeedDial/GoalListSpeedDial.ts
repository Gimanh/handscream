import { Component, Prop } from 'vue-property-decorator';
import AppBase from '~/components/AppBase';
import { GoalComponent } from '~/classes/util/GoalTypes';

@Component
export default class GoalListSpeedDial extends AppBase {

    @Prop( {
        default: () => {
        }
    } )
    public list!: GoalComponent;

    public activeEdit: boolean = false;

    public fab: boolean = false;

    openEdit() {
        this.activeEdit = true;
    }

    closeEdit() {
        this.activeEdit = false;
    }

}
