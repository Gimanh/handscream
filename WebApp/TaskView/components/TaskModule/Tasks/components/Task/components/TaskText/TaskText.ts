import { Component, Prop, Watch } from 'vue-property-decorator';
import AppBase from '~/components/AppBase';

@Component
export default class TaskText extends AppBase {
    @Prop( { default: '' } )
    public description!: string;

    @Prop( { default: true } )
    public showBtnMore!: boolean;

    @Prop( { default: false } )
    public canWatchDetails!: boolean;

    @Prop( { default: false } )
    public canDeleteTask!: boolean;

    public deleteActive: boolean = false;

    public descriptionValue: string = this.description;

    @Watch( 'description' )
    descriptionWatcher( value: string ) {
        this.descriptionValue = value;
    }

    get appendIcon() {
        return this.showBtnMore && this.canWatchDetails ? 'mdi-dots-horizontal' : undefined;
    }

    get label() {
        return this.$t( 'task.task' );
    }

    updateDescription() {
        if ( this.descriptionValue.trim() === '' ) {
            if ( this.canDeleteTask ) {
                this.activateDelete();
            } else {
                this.cancelDelete();
            }
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
        if ( this.canWatchDetails ) {
            this.$emit( 'showDetails' );
        }
    }
}
