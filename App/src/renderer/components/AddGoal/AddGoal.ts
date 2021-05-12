import ZMixin from '@/mixins/mixin';
import { Component } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import { NS_GOALS } from '@/store/Types/Consts';
import { IGoalsStoreActions } from '@/store/Types/Goals/IGoalsStoreActions';
import { IArgUpdateGoal } from '@/store/Types/Goals/Types';

@Component
export default class AddGoal extends ZMixin {

    public dialog: boolean = false;

    @Action( 'addGoal', { namespace: NS_GOALS } )
    addGoal!: IGoalsStoreActions['addGoal'];

    close() {
        this.dialog = false;
    }

    async save( event: Omit<IArgUpdateGoal, 'id'> ) {
        let result = await this.addGoal( event );
        if ( result ) {
            this.goToGoal( result.id );
        }
        this.close();
    }
}
