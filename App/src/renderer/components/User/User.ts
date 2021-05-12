import { Component, Watch } from 'vue-property-decorator';
import { Mutation, Action } from 'vuex-class';
import { NS_GOALS, NS_MAIN_STORE } from '@/store/Types/Consts';
import ZMixin from '@/mixins/mixin';
import { $database } from '@/store/plugins/API';
import { IGoalsStoreActions } from '@/store/Types/Goals/IGoalsStoreActions';
import { IMainStoreMutations } from '@/store/Types/MainStore/IMainStoreMutations';

@Component
export default class User extends ZMixin {

    private _dialog: boolean = !this.isActiveDb;

    public showHintSelectGoal: boolean = false;

    @Mutation( 'setLayout', { namespace: NS_MAIN_STORE } ) setLayout!: IMainStoreMutations['setLayout'];

    @Action( 'fetchGoals', { namespace: NS_GOALS } ) fetchGoals!: IGoalsStoreActions['fetchGoals'];

    @Watch( 'database', { deep: true, immediate: true } )
    async handler( val ) {
        if ( val.hasActiveDb() ) {
            await this.fetchGoals().catch( this.logError );
        }
    }

    @Watch( '$route' )
    watcherRoute() {
        this.showHintSelectGoal = this.$route.name === 'user';
    }

    created() {
        this.showHintSelectGoal = this.$route.name === 'user';
    }

    get dialog(): boolean {
        console.log( this.isActiveDb );
        return !this.isActiveDb;
    }

    set dialog( value: boolean ) {
        this._dialog = value;
    }

    get database() {
        return $database;
    }

    get isActiveDb() {
        if ( $database ) {
            return $database.hasActiveDb();
        }
        return false;
    }
}
