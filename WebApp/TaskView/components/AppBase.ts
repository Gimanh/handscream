import { Vue, Component } from 'vue-property-decorator';

@Component
export default class AppBase extends Vue {
    logError( error: any ) {
        console.log( error );
    }

    redirectToUser() {
        if ( this.$store.state.User.accessToken ) {
            this.$router.push( { name: 'user', params: { user: this.$store.state.User.login } } );
        }
    }
}
