import { defineComponent } from 'vue';
import qs from 'qs';
import type { LoginResponse } from '@/components/Authentication/LoginForm/Types';
import { logError, redirectToUser } from '@/helpers/app-helper';

export default defineComponent( {
    data() {
        return {
            url: '/module/auth/login',
            login: '',
            //user1!#Q
            password: '',
            valid: true
        }
    },
    computed: {
        credentialsRules() {
            return [
                ( v: string ) => !!v || this.$t( 'msg.requiredField' )
            ];
        },
        loginLabel() {
            return this.$t( 'msg.login' );
        },
        passwordLabel() {
            return this.$t( 'msg.password' );
        }
    },
    methods: {
        async submit() {
            const { url, login, password } = this;
            const data = { login, password };
            const validation = await this.$refs.form.validate();
            if ( validation.valid ) {
                const result = await this.$axios.post<LoginResponse>( url, qs.stringify( data ) )
                    .catch( logError );
                if ( result && result.data.access ) {
                    this.$ls.setToken( result.data.access );
                    this.$ls.setRefreshToken( result.data.refresh );
                    this.$ls.updateUserStoreByToken();
                    await redirectToUser( this.$router );
                }
            }
        }
    }
} );
