import { Component, Prop } from 'vue-property-decorator';
import ZMixin from '@/mixins/mixin';
import { Action } from 'vuex-class';
import { IGoal } from '@/interfaces/IApp';
import { NS_GOALS } from '@/store/Types/Consts';
import { IGoalsStoreActions } from '@/store/Types/Goals/IGoalsStoreActions';
import { IArgUpdateGoal } from '@/store/Types/Goals/Types';

@Component
export default class EditGoal extends ZMixin {

    @Prop()
    public goal!: IGoal;

    @Action( 'updateGoal', { namespace: NS_GOALS } )
    updateGoal!: IGoalsStoreActions['updateGoal'];

    public dialog: boolean = true;

    public name: string = this.goal.name;

    public description: string = this.goal.description;

    editingEnd() {
        this.$emit( 'editingEnd', this.goal );
    }

    close() {
        this.dialog = false;
        this.editingEnd();
    }

    async update( event: Omit<IArgUpdateGoal, 'id'> ) {
        await this.updateGoal( { ...event, id: this.goal.id } );
        this.dialog = false;
        this.editingEnd();
    }

}
