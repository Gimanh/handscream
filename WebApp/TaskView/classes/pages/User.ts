import { Component } from 'vue-property-decorator';
// import { Action } from 'vuex-class';
import AppBase from '~/components/AppBase';
// import { UserStoreActions } from '~/store/User';

@Component( {
    middleware: 'authenticated',
    layout: ( ctx ) => {
        return ctx.env.isAdmin ? 'admin' : 'default';
    }
} )
export default class User extends AppBase {

    // @Action( 'fetchTasks', { namespace: 'User' } ) fetchTasks!: UserStoreActions['fetchTasks'];

    async created() {
        // debugger;
        // console.log( await this.fetchTasks() );
        // console.log( this.$ls );
    }

}
