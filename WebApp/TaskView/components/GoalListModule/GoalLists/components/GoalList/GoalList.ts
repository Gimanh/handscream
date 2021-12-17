import { Component, Prop } from 'vue-property-decorator';
import AppBase from '~/components/AppBase';
import { GoalComponentsState } from '~/store/GoalComponents';

@Component
export default class GoalList extends AppBase {
    @Prop( {
        default: () => {
        }
    } )
    public list!: GoalComponentsState['components'][0];

    public fab: boolean = false;

    get routeTo() {
        return {
            name: 'user-goals-id-list',
            params: {
                list: this.list.id.toString()
            }
        };
    }

}
