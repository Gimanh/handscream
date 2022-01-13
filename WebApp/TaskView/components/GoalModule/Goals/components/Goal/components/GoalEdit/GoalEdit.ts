import { Component, Prop, Watch } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import AppBase from '~/components/AppBase';
import { GoalsState, GoalsStoreActions } from '~/store/Goals';
import { VuetifyForm } from '~/classes/util/AppTypes';
import { GoalUpdate } from '~/classes/util/GoalTypes';

@Component
export default class GoalEdit extends AppBase {
    @Prop( {
        default: () => {
        }
    } )
    public goal!: GoalsState['goals'][0];

    public dialog: boolean = true;

    public valid: boolean = true;

    public name: string = this.goal.name;

    public description: string = this.goal.description;

    public showWarning: boolean = false;

    $refs!: {
        form: VuetifyForm
    }

    @Action( 'updateGoal', { namespace: 'Goals' } ) updateGoal!: GoalsStoreActions['updateGoal']

    @Watch( 'dialog' )
    dialogWatcher( val: boolean ) {
        if ( val ) {
            this.name = this.goal.name;
            this.description = this.goal.description;
        }
    }

    get checkGoalName() {
        return [
            ( v: string ): boolean | string => !!v.trim() || this.$t( 'msg.requiredField' ) as string
        ];
    }

    cancel() {
        this.dialog = false;
        this.name = '';
        this.description = '';
        this.emitCloseEdit();
    }

    emitCloseEdit() {
        this.$emit( 'close' );
    }

    async update() {
        this.showWarning = false;
        if ( this.$refs.form.validate() ) {
            const goalData: GoalUpdate = {
                id: this.goal.id,
                name: this.name,
                description: this.description
            };
            const result = await this.updateGoal( goalData ).catch( this.logError );
            if ( result ) {
                this.cancel();
            } else {
                this.showWarning = true;
            }
        }
    }
}
