import { Component, Prop, Watch } from 'vue-property-decorator';
import AppBase from '~/components/AppBase';

@Component
export default class TaskText extends AppBase {
    @Prop( { default: '' } )
    public description!: string;

    @Prop( { default: true } )
    public showBtnMore!: boolean;

    public deleteActive: boolean = false;

    public descriptionValue: string = this.description;

    @Watch( 'description' )
    descriptionWatcher( value: string ) {
        this.descriptionValue = value;
    }

    get appendIcon() {
        return this.showBtnMore ? 'mdi-dots-horizontal' : undefined;
    }

    get label() {
        return this.$t( 'task.task' );
    }

    updateDescription() {
        if ( this.descriptionValue.trim() === '' ) {
            this.activateDelete();
        } else {
            this.$emit( 'change', this.descriptionValue );
        }
    }

    activateDelete() {
        this.deleteActive = true;
    }

    deleteTask() {
        this.$emit( 'deleteTask' );
    }

    cancelDelete() {
        this.deleteActive = false;
        this.descriptionValue = this.description;
    }

    showDetails() {
        this.$emit( 'showDetails' );
    }
}
