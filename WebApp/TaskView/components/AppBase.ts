import { Vue, Component } from 'vue-property-decorator';

@Component
export default class AppBase extends Vue {

    public loading: boolean = false;

    get smallScreen() {
        return this.$vuetify.breakpoint.sm || this.$vuetify.breakpoint.xs;
    }

    logError( error: any ) {
        console.log( error );
    }

    redirectToUser() {
        if ( this.$store.state.User.accessToken ) {
            this.$router.push( { name: 'user', params: { user: this.$store.state.User.login } } );
        }
    }

    startLoading() {
        this.loading = true;
    }

    endLoading() {
        setTimeout( () => {
            this.loading = false;
        }, 500 );
    }

    goToGoals() {
        this.$router.push( { name: 'user-goals' } );
    }
}
