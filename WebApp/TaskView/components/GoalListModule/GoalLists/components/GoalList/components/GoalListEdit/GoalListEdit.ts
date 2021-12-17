import { Component, Prop, Watch } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import AppBase from '~/components/AppBase';
import { VuetifyForm } from '~/classes/util/AppTypes';
import { GoalComponentsState, GoalComponentsStoreActions } from '~/store/GoalComponents';
import { TGoalUpdateList } from '~/classes/util/GoalTypes';

@Component
export default class GoalListEdit extends AppBase {
    @Prop( {
        default: () => {
        }
    } )
    public list!: GoalComponentsState['components'][0];

    public dialog: boolean = true;

    public name: string = this.list.name;

    $refs!: {
        form: VuetifyForm
    }

    @Action( 'updateComponent', { namespace: 'GoalComponents' } ) updateComponent!: GoalComponentsStoreActions['updateComponent']

    @Watch( 'dialog' )
    dialogWatcher( val: boolean ) {
        if ( val ) {
            this.name = this.list.name;
        }
    }

    get componentName() {
        return [
            ( v: string ): boolean | string => !!v.trim() || this.$t( 'msg.requiredField' ) as string
        ];
    }

    emitCloseEdit() {
        this.$emit( 'close' );
    }

    cancel() {
        this.dialog = false;
        this.name = '';
        this.emitCloseEdit();
    }

    async update() {
        if ( this.$refs.form.validate() ) {
            const goalData: TGoalUpdateList = {
                id: this.list.id,
                name: this.name
            };
            await this.updateComponent( goalData ).catch( this.logError );
        }
        this.cancel();
    }
}
