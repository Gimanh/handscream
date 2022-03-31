import { Component } from 'vue-property-decorator';
import AppBase from '~/components/AppBase';
import { AdminsUsersResponse, UserItem, UserItems } from '~/components/Admins/Types';
import { AppResponse } from '~/classes/util/AppTypes';

@Component
export default class AdminsUsers extends AppBase {

    public users: UserItems = [];

    public localHeaders: AdminsUsersResponse['headers'] = [];

    public selectedRow: UserItems = [];

    public search: string = '';

    get userData(): UserItem {
        return this.selectedRow[ 0 ];
    }

    get rowSelected(): boolean {
        return this.selectedRow.length > 0;
    }

    get headers(): AdminsUsersResponse['headers'] {
        const result = [];
        for ( const k in this.localHeaders ) {
            const item = this.localHeaders[ k ];
            item.text = this.$t( item.text ) as string;
            result.push( item );
        }
        return result;
    }

    async created() {
        await this.fetchUsers();
    }

    async fetchUsers() {
        const result = await this.$axios.$get<AppResponse<AdminsUsersResponse>>( '/admins/fetch/users' );
        if ( result ) {
            this.users = result.response.items;
            this.localHeaders = result.response.headers;
        }
    }
}
