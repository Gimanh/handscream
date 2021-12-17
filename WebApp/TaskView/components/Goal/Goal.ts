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

    public fab: boolean = false;

    get routeTo() {
        return {
            name: 'user-goals-id',
            params: {
                id: this.goal.id.toString()
            }
        };
    }
}
