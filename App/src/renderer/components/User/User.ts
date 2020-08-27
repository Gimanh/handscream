import { Component, Watch } from 'vue-property-decorator';
import { Mutation, Action } from 'vuex-class';
import { NS_GOALS, NS_MAIN_STORE } from '@/store/types';
import ZMixin from '@/mixins/mixin';
import { $database } from '@/store/plugins/API';

@Component
export default class User extends ZMixin {

    @Mutation( 'setLayout', { namespace: NS_MAIN_STORE } ) setLayout;

    @Action( 'fetchGoalsFromStorage', { namespace: NS_GOALS } ) fetchGoals;

    /**
     * Срабатывает постоянно так как при переходе от активной записи назад компонент создается
     * @param val
     * @param old
     */
    @Watch( 'database', { deep: true, immediate: true } )
    handler( val, old ) {
        // console.log( '@Watch( \'database\'' );
        if ( val.hasActiveDb() ) {
            // console.log( '@Watch( \'database\' HAS ACTIVE' );
            this.fetchGoals();
        }
    }

    private _dialog: boolean = !this.isActiveDb;

    public showHintSelectGoal: boolean = false;

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

    beforeDestroy() {
        // console.log('beforeDestroy');
        //FIXME
        // this.clearTargets();
    }

}
