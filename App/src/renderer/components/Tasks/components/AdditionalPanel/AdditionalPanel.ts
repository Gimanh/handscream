import { Component } from 'vue-property-decorator';
import ZMixin from '@/mixins/mixin';

@Component
export default class AdditionalPanel extends ZMixin {

    public active: boolean = false;

    public timeOut: number = -1;

    get labelPassive(): string {
        return this.$t( 'msg.showCompletedTasks' ) as string;
    }

    get labelActive(): string {
        return this.$t( 'msg.hideCompletedTasks' ) as string;
    }

    searchTask( text: string ) {
        if ( this.timeOut !== -1 ) {
            clearTimeout( this.timeOut );
        }
        this.timeOut = window.setTimeout( () => {
            this.$emit( 'searchTask', text )
            this.timeOut = -1
        }, 200 );

    }
}
