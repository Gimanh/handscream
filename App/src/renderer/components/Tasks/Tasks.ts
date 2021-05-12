import { Component, Watch } from 'vue-property-decorator'
import { State, Action } from 'vuex-class';
import ZMixin from '@/mixins/mixin';
import { NS_GOALS } from '@/store/Types/Consts';
import { IGoalChangeItemsOrder, IGoalNestedItems, TaskItem } from '@/interfaces/IApp';
import { IGoalsStoreActions } from '@/store/Types/Goals/IGoalsStoreActions';
import { ArgFetchTasks, IArgAddTask } from '@/store/Types/Goals/Types';
import { SortBy, TasksDraggableComponent } from '@/components/Tasks/Types';

@Component
export default class Tasks extends ZMixin {

    @State( state => state[ NS_GOALS ].nestedGoalItems )
    nestedGoalItems!: IGoalNestedItems;

    @Action( 'fetchTasks', { namespace: NS_GOALS } )
    fetchTasks!: IGoalsStoreActions['fetchTasks'];

    @Action( 'loadMoreTasks', { namespace: NS_GOALS } )
    loadMoreTasks!: IGoalsStoreActions['loadMoreTasks'];

    @Action( 'addTask', { namespace: NS_GOALS } )
    addTask!: IGoalsStoreActions['addTask'];

    @Action( 'updateGoalNestedItemsOrder', { namespace: NS_GOALS } )
    updateGoalNestedItemsOrder!: IGoalsStoreActions['updateGoalNestedItemsOrder'];

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

    public currentPage: number = 0;

    public limit: number = 20;

    public noMoreTasks: boolean = false;

    public showChecked: number = 0;

    public sortBy: SortBy = [];

    public $refs!: {
        container: HTMLElement,
        list: HTMLElement
    }

    public searchTaskText: string = '';

    @Watch( '$route' )
    routerWatcher( to ) {
        this.nestedId = to.params.nestedId;
    }

    @Watch( 'nestedId' )
    async nestedIdWatcher( val ): Promise<void> {
        if ( val ) {
            await this.loadNestedItems();
        }
    }

    async loadNestedItems(): Promise<void> {
        await this.fetchTasks( this.getTasksLoadOptions( true ) ).catch( this.logError );
    }

    getTasksLoadOptions( reset: boolean = false ): ArgFetchTasks {
        return {
            limit: this.limit,
            listId: +this.nestedId,
            offset: this.getOffset( reset ),
            checked: this.showChecked,
            description: this.searchTaskText,
            sortBy: this.sortBy
        }
    }

    resetPageLoadStates() {
        this.currentPage = 0;
        this.noMoreTasks = false;
    }

    getOffset( reset: boolean = false ): number {
        reset && this.resetPageLoadStates();
        if ( this.currentPage > 0 ) {
            let offset = this.currentPage * this.limit
            if ( !reset ) {
                offset = this.nestedGoalItems.length;
            }
            return offset;
        }
        return 0;
    }

    async onScroll() {
        let bottom = this.$refs.list.getBoundingClientRect().bottom;
        if ( bottom < this.$refs.container.clientHeight + 300 ) {
            if ( !this.noMoreTasks ) {
                this.currentPage++;
                this.noMoreTasks = !!await this.loadMoreTasks( this.getTasksLoadOptions() ).catch( this.logError );
            }
        }
    }

    get draggableComponentName(): TasksDraggableComponent {
        return this.allowSort ? 'draggable' : 'div'
    }

    get sortedNestedItems(): IGoalNestedItems {
        let sortedItems = JSON.parse( JSON.stringify( this.nestedGoalItems ) );
        return sortedItems;
    }

    set sortedNestedItems( value: IGoalNestedItems ) {
        let items: IGoalChangeItemsOrder = [];
        for ( let k in value ) {
            items.push( {
                id: Number( value[ k ].id ),
                order_key: Number( k ) + 1
            } )
        }
        this.updateGoalNestedItemsOrder( items ).catch( this.logError );
    }

    canShowItem( item: TaskItem ): boolean {
        return item.checked === this.showChecked;
    }

    created(): void {
        this.nestedId = this.$route.params.nestedId;
    }

    mounted(): void {
        document.addEventListener( 'click', this.detectClickItemOutside );
    }

    beforeDestroy(): void {
        document.removeEventListener( 'click', this.detectClickItemOutside );
    }

    detectClickItemOutside( e ): void {
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

    async addNewTaskToList( item?: TaskItem ): Promise<void> {
        if ( item ) {
            if ( item.checked ) {
                item = undefined;
            }
        }
        let insertAfterItem;
        let orderKey: number;
        if ( item ) {
            insertAfterItem = item.id;
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

        let newInfo: IArgAddTask = {
            order_key: orderKey,
            parentId: parentId,
            description: '',
            insertAfterItem: insertAfterItem
        };

        this.addNewItemIntoListSign = true;
        let result = await this.addTask( newInfo );
        if ( result ) {
            await this.setSelectedNestedItemId( result.id );
            setTimeout( () => {
                if ( result ) {
                    this.focusOnTextArea( result.id );
                }
            }, 0 );
        }


        this.emitEventForList( newInfo.parentId );

    }

    focusOnTextArea( itemId: number ): void {
        let textarea = document.getElementById( 'textarea-' + itemId );
        if ( textarea ) {
            textarea.focus();
            setTimeout( () => {
                this.addNewItemIntoListSign = false;
            }, 1000 );
        }
    }

    getOrderKeyForNextItem( item: TaskItem ): number {
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

    async toggleCompleted( event: boolean ): Promise<void> {
        this.showChecked = Number( event );
        await this.loadNestedItems();
    }

    async searchTask( text: string ) {
        this.searchTaskText = text;
        await this.loadNestedItems();
        console.log( 'search', text );
    }

    async sortTasks( sortBy: SortBy ) {
        this.sortBy = sortBy;
        await this.loadNestedItems();
    }
}
