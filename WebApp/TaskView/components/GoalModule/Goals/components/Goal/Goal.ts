import { Component, Prop } from 'vue-property-decorator';
import AppBase from '~/components/AppBase';
import { GoalsState } from '~/store/Goals';

@Component
export default class Goal extends AppBase {
    @Prop( {
        default: () => {
        }
    } )
    public goal!: GoalsState['goals'][0];

    get routeTo() {
        return {
            name: 'user-goals-id',
            params: {
                id: this.goal.id.toString()
            }
        };
    }

    get canEdit(): boolean {
        return !!this.goal.permissions.goal_can_edit;
    }

    get canDelete(): boolean {
        return !!this.goal.permissions.goal_can_delete;
    }

    get displaySpeedDial(): boolean {
        return this.canEdit || this.canDelete;
    }
}
