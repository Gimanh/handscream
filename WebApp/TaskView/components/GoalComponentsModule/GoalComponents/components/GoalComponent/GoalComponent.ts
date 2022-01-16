import { Component, Prop } from 'vue-property-decorator';
import AppBase from '~/components/AppBase';
import { GoalListsState } from '~/store/GoalLists';

@Component
export default class GoalComponent extends AppBase {
    @Prop( {
        default: () => {
        }
    } )
    public list!: GoalListsState['lists'][0];

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
