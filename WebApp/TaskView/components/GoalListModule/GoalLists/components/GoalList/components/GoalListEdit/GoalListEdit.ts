import { Component, Prop, Watch } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import AppBase from '~/components/AppBase';
import { VuetifyForm } from '~/classes/util/AppTypes';
import { GoalListsState, GoalListsStoreActions } from '~/store/GoalLists';
import { TGoalUpdateList } from '~/classes/util/GoalTypes';

@Component
export default class GoalListEdit extends AppBase {
    @Prop( {
        default: () => {
        }
    } )
    public list!: GoalListsState['lists'][0];

    public dialog: boolean = true;

    public name: string = this.list.name;

    public canNotUpdate: boolean = false;

    $refs!: {
        form: VuetifyForm
    }

    @Action( 'updateComponent', { namespace: 'GoalLists' } ) updateComponent!: GoalListsStoreActions['updateComponent']

    @Watch( 'dialog' )
    dialogWatcher( val: boolean ) {
        if ( val ) {
            this.name = this.list.name;
        }
    }

    get canNotUpdateMessage() {
        return this.canNotUpdate ? this.$t( 'goalComponent.canNotUpdate' ) : '';
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
        this.canNotUpdate = false;
        if ( this.$refs.form.validate() ) {
            const goalData: TGoalUpdateList = {
                id: this.list.id,
                name: this.name
            };
            const result = await this.updateComponent( goalData ).catch( this.logError );
            if ( result ) {
                this.cancel();
            } else {
                this.canNotUpdate = true;
            }
        }
    }
}
