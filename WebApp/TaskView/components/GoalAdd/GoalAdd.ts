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

    public invalidName: boolean = false;

    $refs!: {
        form: VuetifyForm
    }

    @Action( 'addGoal', { namespace: 'Goals' } ) addGoal!: GoalsStoreActions['addGoal'];

    get errorMessage() {
        return this.invalidName ? this.$t( 'msg.requiredField' ) : '';
    }

    get iconForInput() {
        if ( this.name ) {
            return 'mdi-keyboard-return';
        }
        return 'mdi-keyboard-variant';
    }

    get checkGoalName() {
        return [
            ( v: string ): boolean | string => !!v.trim() || this.$t( 'msg.requiredField' ) as string
        ];
    }

    get inlineMode(): boolean {
        return this.mode === 'inline';
    }

    isValidName() {
        return this.name && !!this.name.trim();
    }

    inputHandler( v: string ) {
        if ( v.trim() ) {
            this.invalidName = false;
        }
    }

    canAddGoal() {
        if ( this.isValidName() ) {
            return true;
        }
        this.invalidName = true;
    }

    cancel() {
        this.dialog = false;
        this.name = '';
        this.description = '';
    }

    async add() {
        if ( this.canAddGoal() ) {
            const goalData: GoalAddItem = {
                name: this.name,
                description: this.description
            };
            const result = await this.addGoal( goalData ).catch( this.logError );
            if ( result && result.response.add ) {
                this.cancel();
            }
        }
    }
}
