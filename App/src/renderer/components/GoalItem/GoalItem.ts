import ZMixin from '@/mixins/mixin';
import { Component, Prop } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import { IGoalItem } from '@/interfaces/IApp';
import { Helper } from '@/classes/Helper';
import { NS_GOALS } from '@/store/types';
import { IGoalsStoreActions } from '@/store/IGoalsStore';
import { APP_EVENT_TASK_COMPLETE_STATUS } from '@/AppConsts';

@Component
export default class GoalItem extends ZMixin implements IGoalItem {

    @Prop()
    public id!: number;

    @Prop()
    public date_creation!: number;

    @Prop()
    public description!: string;

    @Prop()
    public expanded!: number;

    @Prop()
    public name!: string;

    @Prop()
    public order_key!: number;

    @Prop()
    public owner!: string;

    @Prop()
    public parent!: number;

    @Action( 'updateGoalItemName', { namespace: NS_GOALS } )
    updateGoalItemName!: IGoalsStoreActions['updateGoalItemName'];

    @Action( 'deleteGoalItem', { namespace: NS_GOALS } )
    deleteGoalItem!: IGoalsStoreActions['deleteGoalItem'];

    @Action( 'fetchGoalProgress', { namespace: NS_GOALS } )
    fetchGoalProgress!: IGoalsStoreActions['fetchGoalProgress'];

    @Action( 'fetchGoalItemStats', { namespace: NS_GOALS } )
    fetchGoalItemStats!: IGoalsStoreActions['fetchGoalItemStats'];

    public deleteDialog: boolean = false;

    public dragEnabled: boolean = false;//TODO get from store state

    public editNameDialog: boolean = false;

    public newName: string = '';

    public stat: number = 0;

    get progressColor() {
        if ( this.stat === 100 ) {
            return '#36B37E';
        }
        if ( this.stat < 100 && this.stat >= 50 ) {
            return '#FFAB00';
        }
        if ( this.stat < 50 ) {
            return '#FF5630';
        }
    }

    get disabledSaveBtn() {
        return !( this.newName && this.newName.trim() !== this.name );
    }

    created() {
        this.$eventBus.$on( APP_EVENT_TASK_COMPLETE_STATUS + this.id, async () => {
            await this.fetchStatsFromDatabase();
        } );
    }

    async deleteItem() {
        await this.deleteGoalItem( this.id );
        await this.fetchGoalProgress( this.parent );
        this.deleteDialog = false;
        if ( this.id.toString() === this.$route.params.nestedId ) {
            this.$router.back();
        }
    }

    async mounted() {
        await this.fetchStatsFromDatabase();
    }

    async fetchStatsFromDatabase() {
        this.stat = await this.fetchGoalItemStats( this.id );
    }

    fetchNestedItems() {
        this.$router.push( {
            name: 'nested-components',
            params: {
                nestedId: this.id.toString()
            }
        } );
    }

    openEditDialog() {
        this.editNameDialog = true;
        this.newName = this.name;
    }

    cancelEditing() {
        this.editNameDialog = false;
        this.newName = '';
    }

    async updateName() {
        let name = Helper.replaceAllSpacesToOne( this.newName );
        await this.updateGoalItemName( {
            name: name,
            id: this.id
        } );
        this.editNameDialog = false;
    }
}
