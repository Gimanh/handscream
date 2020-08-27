import { Component, Vue, Watch } from 'vue-property-decorator'
import { State, Action } from 'vuex-class';
import ZMixin from '@/mixins/mixin';
import { NS_GOALS } from '@/store/types';
import {
    IAppLabel, IAppLabels, IGoal,
    IGoalNestedItems,
} from '@/Interfaces/IApp';
import { IArgNestedGoalItem, IGoalsStoreActions } from '@/store/IGoalsStore';
import { Helper } from '@/classes/Helper';
import { APP_EVENT_TASK_COMPLETE_STATUS } from '@/AppConsts';

type Item = IGoalNestedItems[0];
type IDialogEvent = { event: any, item: Item };
@Component
export default class GoalItemNested extends ZMixin {

    @State( state => state[ NS_GOALS ].nestedGoalItems )
    nestedGoalItems!: IGoalNestedItems;

    @Action( 'fetchNestedGoalItems', { namespace: NS_GOALS } )
    fetchNestedGoalItems!: IGoalsStoreActions['fetchNestedGoalItems'];

    @Action( 'updateNestedGoalItemsCheckboxStatus', { namespace: NS_GOALS } )
    updateNestedGoalItemsCheckboxStatus!: IGoalsStoreActions['updateNestedGoalItemsCheckboxStatus'];

    @Action( 'updateNestedGoalItemsExpDate', { namespace: NS_GOALS } )
    updateNestedGoalItemsExpDate!: IGoalsStoreActions['updateNestedGoalItemsExpDate'];

    @Action( 'updateNestedGoalItemsComment', { namespace: NS_GOALS } )
    updateNestedGoalItemsComment!: IGoalsStoreActions['updateNestedGoalItemsComment'];

    @Action( 'updateNestedGoalItemDescription', { namespace: NS_GOALS } )
    updateNestedGoalItemDescription!: IGoalsStoreActions['updateNestedGoalItemDescription'];

    @Action( 'addNestedGoalItem', { namespace: NS_GOALS } )
    addNestedGoalItem!: IGoalsStoreActions['addNestedGoalItem'];

    @Action( 'fetchGoalProgress', { namespace: NS_GOALS } )
    fetchGoalProgress!: IGoalsStoreActions['fetchGoalProgress'];

    @Action( 'deleteNestedItem', { namespace: NS_GOALS } )
    deleteNestedItem!: IGoalsStoreActions['deleteNestedItem'];

    @Action( 'updateGoalNestedItemsOrder', { namespace: NS_GOALS } )
    updateGoalNestedItemsOrder!: IGoalsStoreActions['updateGoalNestedItemsOrder'];

    @Action( 'deleteNestedGoalItemsExpDate', { namespace: NS_GOALS } )
    deleteNestedGoalItemsExpDate!: IGoalsStoreActions['deleteNestedGoalItemsExpDate'];


    public nestedId: string = '';

    /**
     * Признак того что мы добавляем новую запись в лист
     * если пользователь добавлят новую запись прихнак выставляется в тру
     * дальше в наблюдении за списком ищем новый элемент
     * и берет у него идентификатор и присваиваем newAddedNestedItemId
     * для того чтобы выставить фокус на нужном жлементе
     */
    public addNewItemIntoListSign: boolean = false;

    public newAddedNestedItemId: number = -1;

    public showCompleted: boolean = false;

    public deleteDialog: boolean = false;

    public itemForDelete!: Item | undefined;

    public selectedNestedItem: Item | null = null;

    @Watch( '$route' )
    routerWatcher( to ) {
        this.nestedId = to.params.nestedId;
    }

    @Watch( 'nestedId' )
    nestedIdWatcher() {
        this.loadNestedItems();
    }

    @Watch( 'sortedNestedItems', { immediate: true, deep: true } )
    nestedGoalItemsWatcher( val, old ) {
        if ( this.addNewItemIntoListSign ) {
            let idsNew: number[] = val.map( x => x.id );
            let idsOld: number[] = old.map( x => x.id );
            let difference = idsNew.filter( x => !idsOld.includes( x ) );
            if ( difference.length > 1 ) {
                console.warn( 'Was added more then one items to nested items' )
            }
            this.newAddedNestedItemId = difference[ 0 ];
        }
    }

    @Watch( 'showCompletedSettings' )
    completedSettingsHandler( val ) {
        this.showCompleted = val;
    }

    get sortedNestedItems(): IGoalNestedItems {
        let sortedItems = JSON.parse( JSON.stringify( this.nestedGoalItems ) );
        sortedItems.sort( ( a, b ) => {
            if ( a.checked && !b.checked ) {
                return -1;
            }
            if ( b.checked && !a.checked ) {
                return 1;
            }
            if ( b.checked && a.checked ) {
                return 0;
            }

            if ( a.order_key < b.order_key ) {
                return -1;
            }
            if ( a.order_key > b.order_key ) {
                return 1;
            }
            return 0;
        } );
        return sortedItems;
    }

    set sortedNestedItems( value: IGoalNestedItems ) {
        let items: { id: number, orderKey: number }[] = [];
        for ( let k in value ) {
            items.push( {
                id: Number( value[ k ].id ),
                orderKey: Number( k ) + 1
            } )
        }
        this.updateGoalNestedItemsOrder( items );
    }

    canShowItem( item: Item ) {
        if ( ( this.showCompleted ) && !this.allowSort ) {
            return true;
        }
        return !item.checked;
    }

    created() {
        this.nestedId = this.$route.params.nestedId;
        this.showCompleted = this.showCompletedSettings;
    }

    mounted() {
        document.addEventListener( 'click', this.detectClickItemOutside );
    }

    beforeDestroy() {
        document.removeEventListener( 'click', this.detectClickItemOutside );
    }

    detectClickItemOutside( e ) {
        let selectedItem = document.getElementById( 'goal-nested-items__selected-item' );
        if ( selectedItem ) {
            let target = e.target;
            if ( target ) {
                if ( !selectedItem.contains( target ) ) {
                    this.setSelectedNestedItemId( -1 );
                }
            }
        }
    }

    loadNestedItems() {
        if ( this.nestedId ) {
            this.fetchNestedGoalItems( this.nestedId );
        }
    }

    emitEventForList( item: Item ) {
        this.$eventBus.$emit( APP_EVENT_TASK_COMPLETE_STATUS + item.parent_id );

    }

    checkBoxStateChanged( event: boolean, item: Item ) {
        this.updateNestedGoalItemsCheckboxStatus( {
            status: Number( event ),
            item: item,
            date_complete: event ? Helper.dateNow() : null
        } );

        this.fetchGoalProgress( Number( this.$route.params.id ) );
        this.emitEventForList( item );
        if ( event ) {
            if ( this.activeRecordTask === item.id ) {
                this.workingOnTask( item.id )
            }
        }
    }

    saveDate( date: number, item: Item ) {
        this.updateNestedGoalItemsExpDate( {
            date: date,
            item: item
        } );
    }

    commentChanged( comment: string, item: Item ) {
        this.updateNestedGoalItemsComment( {
            comment: comment,
            item: item
        } )
    }

    deleteEmptyItem( event, item: Item ) {
        let value = event.target.value;
        value = Helper.replaceAllSpacesToOne( value );
        if ( !value || value === ' ' ) {
            if ( !item.item_comment_text && !item.item_reminder_exp_date ) {
                this.itemForDelete = item;
                this.deleteItem().catch( err => {
                    console.log( err );
                } );
            } else {
                this.showDeleteDialog( item );
            }
        }
        this.emitEventForList( item );
    }

    descriptionChanged( event, item: Item ) {
        event = Helper.replaceAllSpacesToOne( event );
        if ( event !== ' ' ) {
            this.updateNestedGoalItemDescription( {
                description: event,
                item: item
            } );
        }
    }

    showDeleteDialog( item: Item ) {
        this.deleteDialog = true;
        this.itemForDelete = item;
    }

    cancelDelete() {
        this.deleteDialog = false;
        this.itemForDelete = undefined;
    }

    async deleteItem() {
        if ( this.itemForDelete ) {
            await this.deleteNestedItem( this.itemForDelete );
            await this.fetchGoalProgress( Number( this.$route.params.id ) );
        }
        this.deleteDialog = false;
    }

    rowSelected( item: Item ) {
        this.setSelectedNestedItemId( item.id );
    }

    getUiDate( itemExpDate: number ) {
        if ( itemExpDate ) {
            return Helper.getDateTimeForUi( itemExpDate );
        }
        return '';
    }

    showDateInfo() {
        console.info( '//TODO showDateInfo' );
    }

    async addNewTaskToList( item?: Item ) {
        if ( item ) {
            if ( item.checked ) {
                item = undefined;
            }
        }
        let orderKey: number;
        if ( item ) {
            orderKey = this.getOrderKeyForNextItem( item );
        } else {
            if ( this.sortedNestedItems.length > 0 ) {
                let lastItem = this.sortedNestedItems[ this.sortedNestedItems.length - 1 ];
                orderKey = this.getOrderKeyForNextItem( lastItem );
            } else {
                orderKey = 10000;
            }
        }
        let parentId = item ? item.parent_id : Number( this.nestedId );

        let newInfo: IArgNestedGoalItem = {
            order_key: orderKey,
            parentId: parentId,
            description: ''
        };
        this.addNewItemIntoListSign = true;
        await this.addNestedGoalItem( newInfo );
        await this.setSelectedNestedItemId( this.newAddedNestedItemId );
        this.focusOnTextArea( this.newAddedNestedItemId );
        if ( item ) {
            this.emitEventForList( item );
        }
    }

    focusOnTextArea( itemId: number ) {
        let textarea = document.getElementById( 'textarea-' + itemId );
        if ( textarea ) {
            textarea.focus();
        }
    }

    getOrderKeyForNextItem( item: Item ): number {
        for ( let i = 0; i < this.sortedNestedItems.length; i++ ) {
            if ( this.sortedNestedItems[ i ].id === item.id ) {
                let nextItem = this.sortedNestedItems[ i + 1 ];
                if ( nextItem ) {
                    let newOrderKey = nextItem.order_key - 0.001;
                    if ( newOrderKey === item.order_key ) {
                        return item.order_key + 0.001;
                    }
                    return newOrderKey;
                } else {
                    return item.order_key + 1;
                }
            }
        }
        return 100000000;
    }

    toggleCompleted() {
        this.showCompleted = !this.showCompleted;
    }

    canShowNotActiveDateCommentRow( item: Item ) {
        return item.item_comment_text || item.item_reminder_exp_date;
    }

    canShowNotActiveLabelsRow( item: Item ) {
        return item.labels.length > 0;
    }

    // get selectedNestedItemForDialog() {
    //     return this.selectedNestedItem;
    // }

    setSelectedNestedItem( item: Item ) {
        this.selectedNestedItem = item;
    }

    textChangedDialog( event: IDialogEvent ) {
        this.descriptionChanged( event.event, event.item );
    }

    deleteTaskDialog( event: IDialogEvent ) {
        this.deleteEmptyItem( event.event, event.item )
    }

    commentChangedDialog( event: IDialogEvent ) {
        this.commentChanged( event.event, event.item );
    }

    saveDateDialog( event: IDialogEvent ) {
        this.saveDate( event.event, event.item );
    }

    async runTimerOnItem( item: Item ) {
        await this.workingOnTask( item.id );
    }

    canShowPlay( item: Item ) {
        return this.activeRecordTask != item.id;
    }

    canShowAnimationForItem( item: Item ) {
        return this.activeRecordTask == item.id;
    }

    getLabelsForItem( item: Item ) {
        let result: IAppLabels = [];
        for ( let itemLabel of item.labels ) {
            for ( let label of this.labels ) {
                if ( itemLabel.id === label.id ) {
                    result.push( label );
                }
            }
        }
        return result;
    }

    resetDate( item: Item ) {
        this.deleteNestedGoalItemsExpDate( item );
    }
}
