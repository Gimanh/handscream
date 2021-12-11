import { Component, Prop } from 'vue-property-decorator';
import AppBase from '~/components/AppBase';
import { GoalComponentsState } from '~/store/GoalComponents';

@Component
export default class GoalComponent extends AppBase {
    @Prop( {
        default: () => {
        }
    } )
    public component!: GoalComponentsState['components'][0];

    get routeTo() {
        return {
            name: 'user-goals-id-list',
            params: {
                list: this.component.id.toString()
            }
        };
    }

}
