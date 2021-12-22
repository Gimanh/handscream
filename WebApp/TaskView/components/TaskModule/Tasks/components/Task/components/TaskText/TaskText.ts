import { Component, Prop } from 'vue-property-decorator';
import AppBase from '~/components/AppBase';

@Component
export default class TaskText extends AppBase {
    @Prop( { default: '' } )
    public description!: string;

    public deleteActive: boolean = false;

    public descriptionValue: string = this.description;

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
