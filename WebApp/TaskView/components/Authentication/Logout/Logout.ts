import { Component } from 'vue-property-decorator';
import AppBase from '~/components/AppBase';
import { LogoutResponse } from '~/components/Authentication/LoginForm/Types';

@Component
export default class Logout extends AppBase {
    async logout() {
        const result = await this.$axios.post<LogoutResponse>( '/module/auth/logout' ).catch( this.logError );
        if ( result ) {
            if ( result.data.logout ) {
                this.$ls.invalidateTokens( this.$store );
                await this.$router.push( '/' );
            }
        }
    }
}
