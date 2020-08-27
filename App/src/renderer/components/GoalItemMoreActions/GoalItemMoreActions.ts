import { Component, Prop } from 'vue-property-decorator';
import ZMixin from '@/mixins/mixin';
import { IArgUpdateArchiveGoalStatus } from '@/store/IGoalsStore';

@Component
export default class GoalItemMoreActions extends ZMixin {
    @Prop( { required: true } )
    public id!: number | string;

    @Prop()
    public archive!: number;

    public confirmDeleteDialog: boolean = false;

    deleteSelected() {
        this.$emit( 'delete', this.id );
        this.confirmDeleteDialog = false;
    }

    editSelected() {
        this.$emit( 'edit', this.id );
    }

    cancelDelete() {
        this.confirmDeleteDialog = false;
    }

    archiveGoal() {
        let options: IArgUpdateArchiveGoalStatus = {
            goalId: Number( this.id ),
            archiveStatus: Number( !this.archive )
        }
        this.$emit( 'archiveGoal', options )
    }
}
