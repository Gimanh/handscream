import ZMixin from '@/mixins/mixin';
import { Component } from 'vue-property-decorator'
import { State, Action } from 'vuex-class';
import { NS_GOALS } from '@/store/Types/Consts';
import { Helper } from '@/classes/Helper';
import { Watch } from 'vue-property-decorator';
import { IGoalChangeItemsOrder, IGoalItems } from '@/interfaces/IApp';
import { ROUTE_NAME_NESTED_COMPONENTS } from '@/AppConsts';
import { IGoalsStoreActions } from '@/store/Types/Goals/IGoalsStoreActions';

@Component
export default class GoalItems extends ZMixin {

    @State( state => state[ NS_GOALS ].goalItems ) goalItems!: IGoalItems;

    @Action( 'fetchGoalItems', { namespace: NS_GOALS } )
    fetchGoalItems!: IGoalsStoreActions['fetchGoalItems'];

    @Action( 'updateGoalItemsOrder', { namespace: NS_GOALS } )
    updateGoalItemsOrder!: IGoalsStoreActions['updateGoalItemsOrder'];

    public dialog: boolean = true;

    public sheet: boolean = false;

    public dragEnabled: boolean = false;

    public listModel: any = -1;

    public showHintSelectComponent: boolean = false;

    public fab: boolean = false;

    @Watch( '$route' )
    routeWatcher( to, from ) {
        if ( to.params.id != from.params.id ) {
            this.fetchGoalItems( to.params.id );
        }
    }

    @Watch( '$route' )
    watcherRoute() {
        this.showHintSelectComponent = this.$route.name === 'goal-id';
    }

    created() {
        this.showHintSelectComponent = this.$route.name === 'goal-id';

        if ( this.activeDatabase ) {
            this.fetchGoalItems( Number( this.$route.params.id ) );
        } else {
            this.redirectToUser();
        }
    }

    get canShowLeftColumn() {
        if ( this.$route.name === ROUTE_NAME_NESTED_COMPONENTS ) {
            if ( this.$vuetify.breakpoint.sm ) {
                return false;
            }
        }
        return true;
    }

    get canShowRightColumn() {
        return true;
        // debugger
        // if ( this.$route.name === ROUTE_NAME_NESTED_COMPONENTS ) {
        //     if ( this.$vuetify.breakpoint.sm ) {
        //         return true;
        //     } else {
        //         return true;
        //     }
        // }
        // return false;
    }

    get sortedGoalItems(): IGoalItems {
        let nI = <IGoalItems> JSON.parse( JSON.stringify( this.goalItems ) );
        nI.sort( ( a, b ) => {
            if ( a.order_key < b.order_key ) {
                return -1;
            }
            if ( a.order_key > b.order_key ) {
                return 1;
            }
            return 0;
        } );
        return nI;
    }

    set sortedGoalItems( value: IGoalItems ) {
        let items: IGoalChangeItemsOrder = [];
        for ( let k in value ) {
            items.push( {
                id: Number( value[ k ].id ),
                order_key: Number( k ) + 1
            } )
        }
        this.updateGoalItemsOrder( items );
    }

    get invertColor() {
        return Helper.invertColor( '#000000' );
    }

    startDrag() {
        let items = document.querySelectorAll( '.target-item-content' );
        for ( let i = 0; i < items.length; i++ ) {
            let item = items[ i ] as HTMLElement;
            item.style.display = 'none';
        }
    }

    endDrag() {
        let items = document.querySelectorAll( '.target-item-content' );
        for ( let i = 0; i < items.length; i++ ) {
            let item = items[ i ] as HTMLElement;
            item.style.display = 'block';
        }
    }

    toggleDragEnabled() {
        this.dragEnabled = !this.dragEnabled;
        if ( this.dragEnabled ) {
            this.startDrag();
        } else {
            this.endDrag();
        }
    }

    beforeDestroy() {
        // this.clearActiveGoal();
    }
}
