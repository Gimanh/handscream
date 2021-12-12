import { Component, Prop } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import AppBase from '~/components/AppBase';
import { AddGoalMode, GoalAddComponent } from '~/classes/util/GoalTypes';
import { VuetifyForm } from '~/classes/util/AppTypes';
import { GoalComponentsStoreActions } from '~/store/GoalComponents';

@Component
export default class GoalAddComponents extends AppBase {
    @Prop( { default: 'inline' } )
    public mode!: AddGoalMode;

    public name: string = '';

    public invalidName: boolean = false;

    $refs!: {
        form: VuetifyForm
    }

    @Action( 'addComponent', { namespace: 'GoalComponents' } ) addComponent!: GoalComponentsStoreActions['addComponent'];

    get inlineMode(): boolean {
        return this.mode === 'inline';
    }

    get errorMessage() {
        return this.invalidName ? this.$t( 'msg.requiredField' ) : '';
    }

    isValidName() {
        return this.name && !!this.name.trim();
    }

    canAddComponent() {
        if ( this.isValidName() ) {
            return true;
        }
        this.invalidName = true;
    }

    cancel() {
        this.name = '';
    }

    inputHandler( v: string ) {
        if ( v.trim() ) {
            this.invalidName = false;
        }
    }

    async add() {
        if ( this.canAddComponent() ) {
            const addComponent: GoalAddComponent = {
                name: this.name,
                goalId: +this.$route.params.id
            };
            const result = await this.addComponent( addComponent );
            if ( result && result.response.add ) {
                this.cancel();
            }
        }
    }
}
