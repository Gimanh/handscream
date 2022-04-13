import { Component } from 'vue-property-decorator';
import AppBase from '~/components/AppBase';

@Component
export default class TasksFilters extends AppBase {

    showCompletedTasks( show: boolean ) {
        this.$emit( 'showCompleted', show );
    }

}