import { defineComponent } from 'vue';
import type { LogoutResponse } from '@/components/Authentication/LoginForm/Types';
import { logError } from '@/helpers/app-helper';
import { mdiExitToApp } from '@mdi/js';

export default defineComponent( {
    data() {
        return {
            mdiExitToApp
        }
    },
    methods: {
        async logout() {
            const result = await this.$axios.post<LogoutResponse>( '/module/auth/logout' )
                .catch( logError );
            if ( result ) {
                if ( result.data.logout ) {
                    this.$ls.invalidateTokens();
                    await this.$router.push( '/' );
                }
            }
        }
    }
} );
