import { Component } from 'vue-property-decorator';
import ZMixin from '@/mixins/mixin';
import { SortBy, SortByItem } from '@/components/Tasks/Types';

@Component
export default class SortTasks extends ZMixin {

    public sortBy: SortBy = [
        {
            text: 'sort.description',
            value: 'description',
            asc: 0,
        },
        {
            text: 'sort.date_creation',
            value: 'date_creation',
            asc: 0,
        },
        {
            text: 'sort.date_complete',
            value: 'date_complete',
            asc: 0,
        },
        {
            text: 'sort.order_key',
            value: 'order_key',
            asc: 0,
        },
    ];

    getRotate( item: SortByItem ) {
        if ( item.asc === 1 ) {
            return 'rotate180'
        }
        return '';
    }

    translate( text: string ) {
        return this.$t( text );
    }

    changeSort( item: SortByItem ) {
        switch ( item.asc ) {
            case 0:
                item.asc = 1;
                break;
            case 1:
                item.asc = -1;
                break;
            case -1:
                item.asc = 0;
                break;
            default:
                item.asc = 0;
        }
        this.emitSort();
    }

    emitSort() {
        let sortBy: SortBy = JSON.parse( JSON.stringify( this.sortBy ) );
        sortBy = sortBy.filter( ( value => {
            return value.asc !== 0;
        } ) );
        this.$emit( 'sort', sortBy );
    }

}
