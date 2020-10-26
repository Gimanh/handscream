import {Component} from 'vue-property-decorator';
import ZMixin from '@/mixins/mixin';
import {AppCalendarEvent} from '@/interfaces/IAppCalendar';

@Component
export default class AppCalendar extends ZMixin {

    public $refs: any;

    public events: AppCalendarEvent[] = [
        {
            name: 'Some name',
            start: '2020-01-20',
            end: '2020-01-27',
            color: '#ccc',
        }
    ];

    mounted() {
        let date = new Date();
        console.log(date.getTime());
        console.log(this.$refs.calendar);

        // let f = this.$refs.calendar.getVisibleEvents();
        // console.log(f);
    }

    updateRange (obj) {
        console.log(obj);
    }
}
