import { Component } from 'vue-property-decorator';
import AppBase from '~/components/AppBase';

@Component( {
    layout: ( ctx ) => {
        return ctx.env.isAdmin ? 'admin' : 'default';
    }
} )
export default class Index extends AppBase {
    created() {
        setTimeout( () => {
            this.redirectToUser();
        }, 5000 );
    }
}
