import { Component } from 'vue-property-decorator';
import AppBase from '~/components/AppBase';

@Component
export default class TasksFilters extends AppBase {

    public showCompleted: boolean = false;

    get filterIcon() {
        return this.showCompleted ? 'mdi-checkbox-multiple-blank-outline' : 'mdi-checkbox-multiple-marked-outline';
    }

    showCompletedTasks() {
        this.showCompleted = !this.showCompleted;
        this.$emit( 'showCompleted', this.showCompleted );
    }
}
