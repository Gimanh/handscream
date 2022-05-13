import { Component, Prop } from 'vue-property-decorator';
import AppBase from '~/components/AppBase';

@Component
export default class TasksToolbar extends AppBase {

    @Prop( { default: false } )
    public canAddTasks!: boolean;

    @Prop()
    public componentId!: number;

    public showMoreFilters: boolean = false;

    get showAddTask() {
        return !this.showMoreFilters;
    }

    get colsStyle() {
        return { height: '70px' };
    }

    get colParams() {
        return {
            style: this.colsStyle,
            cols: '1',
            'align-self': 'center',
            class: 'd-flex align-center justify-center'
        };
    }

    showCompletedTasks( show: boolean ) {
        this.$emit( 'showCompleted', show );
    }
}
