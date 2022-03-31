import { Component, Prop } from 'vue-property-decorator';
import qs from 'qs';
import AppBase from '~/components/AppBase';
import { DeleteUserResponse, UserItem } from '~/components/Admins/Types';

@Component
export default class AdminsUsersDelete extends AppBase {
    @Prop( {
        default(): UserItem {
            return {
                id: -1,
                login: '',
                email: '',
                block: 0
            };
        }
    } )
    public userData!: UserItem;

    @Prop( { default: true } )
    public disabled!: boolean;

    public dialog: boolean = false;

    cancel() {
        this.dialog = false;
    }

    async save() {
        const result = await this.$axios.$post<DeleteUserResponse>(
            '/admins/delete/user',
            qs.stringify( { id: this.userData.id } )
        ).catch( this.logError );

        if ( result ) {
            if ( result.response.delete ) {
                this.dialog = false;
                this.$emit( 'delete', result.response.delete );
            }
        }
    }
}
