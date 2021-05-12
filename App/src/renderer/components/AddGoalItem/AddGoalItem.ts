import { Component, Watch } from 'vue-property-decorator';
import ZMixin from '@/mixins/mixin';
import { Action, State } from 'vuex-class';
import { NS_GOALS } from '@/store/Types/Consts';
import { IGoalStoreState } from '@/store/Types/Goals/IGoalsState';
import { IGoalsStoreActions } from '@/store/Types/Goals/IGoalsStoreActions';

@Component
export default class AddGoalItem extends ZMixin {

    @State( state => state[ NS_GOALS ].goalItems )
    goalItems!: IGoalStoreState['goalItems'];

    public dialog: boolean = false;

    public name: string = '';

    public description: string = '';

    public selectedComponent: string = 'list';

    public valid: boolean = false;

    public addItemProcess: boolean = false;

    $refs!: {
        form: any
        nameField: HTMLElement
    };

    @Action( 'addGoalItem', { namespace: NS_GOALS } )
    addGoalItem!: IGoalsStoreActions['addGoalItem']

    get items() {
        return JSON.parse( JSON.stringify( this.goalItems ) );
    }

    @Watch( 'dialog' )
    handler( val ) {
        if ( val ) {
            setTimeout( () => {
                if ( this.$refs.nameField ) {
                    this.$refs.nameField.focus();
                }
            } )
        }
    }

    @Watch( 'items' )
    itemsWatcher( val, old ) {
        let idsNew: number[] = val.map( x => x.id );
        let idsOld: number[] = old.map( x => x.id );
        let difference = idsNew.filter( x => !idsOld.includes( x ) );
        if ( this.addItemProcess && difference.length > 1 ) {
            console.warn( 'Was added more then one items to nested items' )
        }

        if ( this.addItemProcess && difference.length === 1 ) {
            this.addItemProcess = false;
            this.$router.push( {
                name: 'nested-components',
                params: {
                    nestedId: difference[ 0 ].toString()
                }
            } );
        }
    }

    selectComponent( componentName: string ) {
        this.selectedComponent = componentName;
    }

    cancel() {
        this.dialog = false;
        this.name = '';
        this.description = '';
    }

    async addComponent() {
        if ( this.valid ) {
            this.addItemProcess = true;
            await this.addGoalItem( {
                goalId: Number( this.$route.params.id ),
                name: this.name,
                description: this.description
            } )
            this.cancel();
        }
    }
}
