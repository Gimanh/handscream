import { Component } from 'vue-property-decorator';
import AppBase from '~/components/AppBase';

@Component
export default class TaskDeadline extends AppBase {

    public dialog: boolean = false;

    public date: string = ''; // (new Date()).toISOString().substr(0, 10);

    public time: string = '';

    get fullDeadline() {
        const value = `${ this.formatDate } ${ this.time }`;
        return value.trim() ? value : null;
    }

    get formatDate() {
        if ( !this.date ) {
            return '';
        }
        const [ year, month, day ] = this.date.split( '-' );
        return `${ day }-${ month }-${ year }`;
    }

    save() {
        this.dialog = false;
        console.log( this.fullDeadline );
    }

    cancel() {
        this.date = '';
        this.time = '';
    }
}
