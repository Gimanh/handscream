import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class AppBase extends Vue {

    @Prop( { default: true } )
    public allowed!: boolean;

    public loading: boolean = false;

    get smallScreen(): boolean {
        return this.$vuetify.breakpoint.sm || this.$vuetify.breakpoint.xs;
    }

    get isLoggedIn(): boolean {
        return this.$ls.isLoggedIn;
    }

    get currentListId(): number | -1 {
        return +this.$route?.params?.list || -1;
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
