import { Component } from 'vue-property-decorator';
import AppBase from '~/components/AppBase';

@Component
export default class List extends AppBase {
    get cols() {
        return this.$vuetify.breakpoint.sm || this.$vuetify.breakpoint.xs ? 12 : 7;
    }

    get colClass() {
        if ( this.smallScreen ) {
            return 'pa-1';
        }
        return 'pl-1';
    }

    async goToLists() {
        await this.$router.push( {
            name: 'user-goals-id',
            params: {
                id: this.$route.params.id.toString()
            }
        } );
    }
}
