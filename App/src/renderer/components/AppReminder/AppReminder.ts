import { Component, Prop, Watch } from 'vue-property-decorator'
import { State } from 'vuex-class';
import { NS_MAIN_STORE } from '@/store/types';
import ZMixin from '@/mixins/mixin';
import { Helper } from '@/classes/Helper';

@Component
export default class AppReminder extends ZMixin {

    //TODO check task
    @Prop()
    public givenSelectedDate!: number;

    public dialog: boolean = false;

    public selectedDate: string = this.givenSelectedDate ? Helper.getDateTime( this.givenSelectedDate ) : Helper.getDateTime();

    public canShowCalendar: boolean = false;

    get uiDate() {
        if ( this.givenSelectedDate ) {
            return Helper.getDateTimeForUi( this.givenSelectedDate )
        }

        return '--.--.---- --:--'
    }


    @Watch( 'dialog' )
    showCalendar() {
        setTimeout( () => {
            this.canShowCalendar = this.dialog;
        }, 500 );
    }

    saveDate() {
        let milliseconds = Helper.dateStringToMillisecond( this.selectedDate );
        this.$emit( 'saveDate', milliseconds );
        this.closeDialog();
    }

    resetDate() {
        this.$emit( 'resetDate' );
        this.closeDialog();
    }

    closeDialog() {
        this.dialog = false;
    }
}
