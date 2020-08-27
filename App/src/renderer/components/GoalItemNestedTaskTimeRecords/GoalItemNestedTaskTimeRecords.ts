import { Component, Prop } from 'vue-property-decorator';
import ZMixin from '@/mixins/mixin';
import { IGoalNestedItems } from '@/Interfaces/IApp';
import { Action } from 'vuex-class';
import { NS_GOALS } from '@/store/types';
import { IGoalsStoreActions } from '@/store/IGoalsStore';
import { ITimeRecords } from '@/store/ITimeRecord';
import { Helper } from '@/classes/Helper';

type Item = IGoalNestedItems[0];

@Component
export default class GoalItemNestedTaskTimeRecords extends ZMixin {

    @Prop()
    public item!: Item;

    @Action( 'fetchTimeActivityRecords', { namespace: NS_GOALS } )
    fetchTimeActivityRecords!: IGoalsStoreActions['fetchTimeActivityRecords'];

    public sourceHeaders: ITimeRecords = [];

    public totalTime: number = 0;

    get total() {
        return this.minutesToHoursAndMinutes( this.totalTime );
    }

    get records() {
        // debugger
        let result: { dateCreation: string, duration: string }[] = [];
        for ( let i in this.sourceHeaders ) {
            let duration: any = '';
            let start = this.sourceHeaders[ i ].date_start;
            let end = this.sourceHeaders[ i ].date_end;
            if ( end ) {
                let diff = end - start;
                duration = Math.ceil( diff / ( 1000 * 60 ) );
                this.totalTime += duration;
                if ( duration > 60 ) {
                    duration = this.minutesToHoursAndMinutes( duration );
                } else {
                    duration = duration + ' ' + this.$t( 'msg.min' )
                }
            } else {
                if ( this.activeRecordTask == this.item.id ) {
                    duration = this.$t('msg.active');
                } else {
                    duration = '-';
                }
            }

            result.push( {
                dateCreation: Helper.getDateTimeForUi( this.sourceHeaders[ i ].date_creation ),
                duration: duration
            } )
        }
        return result;
    }

    // minutesToHoursAndMinutes( minutes: number ) {
    //     let hours = Math.floor( minutes / 60 );
    //     let min = minutes % 60;
    //     return hours + ' ' + this.$t( 'msg.hours' ) + ' ' + min + ' ' + this.$t( 'msg.min' );
    // }

    async created() {
        this.sourceHeaders = await this.fetchTimeActivityRecords( this.item.id );
    }
}
