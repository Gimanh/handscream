import { Component, Prop } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import AppBase from '~/components/AppBase';
import { AddGoalMode, GoalAddItem } from '~/classes/util/GoalTypes';
import { VuetifyForm } from '~/classes/util/AppTypes';
import { GoalsStoreActions } from '~/store/Goals';

@Component
export default class GoalAdd extends AppBase {

    @Prop( { default: 'form' } )
    public mode!: AddGoalMode;

    public dialog: boolean = false;

    public name: string = '';

    public description: string = '';

    $refs!: {
        form: VuetifyForm
    }

    @Action( 'addGoal', { namespace: 'Goals' } ) addGoal!: GoalsStoreActions['addGoal']

    get checkGoalName() {
        return [
            ( v: string ): boolean | string => !!v.trim() || this.$t( 'msg.requiredField' ) as string
        ];
    }

    get inlineMode(): boolean {
        return this.mode === 'inline';
    }

    cancel() {
        this.dialog = false;
        this.name = '';
        this.description = '';
    }

    async add() {
        if ( this.$refs.form.validate() ) {
            const goalData: GoalAddItem = {
                name: this.name,
                description: this.description
            };
            await this.addGoal( goalData ).catch( this.logError );
        }
    }
}
