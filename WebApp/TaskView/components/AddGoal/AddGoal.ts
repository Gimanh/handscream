import { Component, Prop } from 'vue-property-decorator';
import AppBase from '~/components/AppBase';
import { GoalAdd } from '~/classes/util/GoalTypes';
import qs from 'qs';
import { VuetifyForm } from '~/classes/util/AppTypes';
import { Action } from 'vuex-class';
import { GoalsStoreActions } from '~/store/Goals';

@Component
export default class AddGoal extends AppBase {

    @Prop( { default: true } )
    public addMode!: boolean;

    public dialog: boolean = false;

    public name: string = 'Some name';

    public description: string = 'Description';

    $refs!: {
        form: VuetifyForm
    }

    @Action( 'addGoal', { namespace: 'Goals' } ) addGoal!: GoalsStoreActions['addGoal']

    get checkGoalName() {
        return [
            ( v: string ): boolean | string => !!v.trim() || this.$t( 'msg.requiredField' ) as string
        ];
    }

    cancel() {
        this.dialog = false;
        this.name = '';
        this.description = '';
    }

    async save() {
        if ( this.$refs.form.validate() ) {
            const goalData: GoalAdd = {
                name: this.name,
                description: this.description
            };
            await this.addGoal( goalData ).catch( this.logError );
        }
    }
}
