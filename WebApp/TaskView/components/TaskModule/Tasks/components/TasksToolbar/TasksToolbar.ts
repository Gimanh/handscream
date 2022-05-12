import { Component, Prop } from 'vue-property-decorator';
import AppBase from '~/components/AppBase';

@Component
export default class TasksToolbar extends AppBase {

    @Prop( { default: false } )
    public canAddTasks!: boolean;

    @Prop()
    public componentId!: number;

    showCompletedTasks( show: boolean ) {
        this.$emit( 'showCompleted', show );
    }
}
