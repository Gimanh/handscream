import { Component, Prop, Watch } from 'vue-property-decorator';
import ZMixin from '@/mixins/mixin';
import { TaskItem } from '@/interfaces/IApp';
import { Action } from 'vuex-class';
import { NS_GOALS } from '@/store/Types/Consts';
import { Helper } from '@/classes/Helper';
import { IGoalsStoreActions } from '@/store/Types/Goals/IGoalsStoreActions';
import { ITimeRecords } from '@/store/Types/TimeRecord/Types';

@Component
export default class TaskTimeRecordsTable extends ZMixin {

    @Prop( {
        default: function () {
            return {};
        }
    } )
    public item!: TaskItem;

    @Action( 'fetchTimeActivityRecords', { namespace: NS_GOALS } )
    fetchTimeActivityRecords!: IGoalsStoreActions['fetchTimeActivityRecords'];

    @Watch( 'item' )
    async itemWatcher() {
        this.sourceHeaders = await this.fetchTimeActivityRecords( this.item.id );
    }

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
                    duration = this.$t( 'msg.active' );
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
}
