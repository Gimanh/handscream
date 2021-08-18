import { Component } from 'vue-property-decorator';
import { State, Mutation, Action } from 'vuex-class';
import { KEY_CFG_LICENSE, NS_MAIN_STORE } from '@/store/Types/Consts';
import { $vionxConfig, initializeDatabase } from '@/store/plugins/API';
import { IConfigAll, IConfigStoreLicense } from '@/classes/IConfigStore';
import ZMixin from '@/mixins/mixin';

@Component
export default class Start extends ZMixin {

    public name: string = 'Start';

    public appliedTerms: boolean = false;

    public showLicenseDialog: boolean = false;

    public remote: boolean = false;

    @State( state => state[ NS_MAIN_STORE ].version ) version!: string;

    @Mutation( 'setLayout', { namespace: NS_MAIN_STORE } ) setLayout;

    @Mutation( 'setDarkMode', { namespace: NS_MAIN_STORE } ) setDarkMode!: ( v: boolean ) => void;

    @Action( 'fetchLicenseText', { namespace: NS_MAIN_STORE } ) fetchLicenseText!: () => void;

    @Action( 'fetchRepository', { namespace: NS_MAIN_STORE } ) fetchRepository!: () => void;

    get checkBoxRule() {
        return [ v => !!v || this.$t( 'msg.mustAgree' ) ];
    }

    disagree() {
        this.showLicenseDialog = false;
        this.appliedTerms = false;
        let licenseInfo = {
            agreed: false,
            version: this.version
        };
        $vionxConfig.set( KEY_CFG_LICENSE, licenseInfo );
    }

    agree() {
        let licenseInfo = {
            agreed: true,
            version: this.version
        };
        $vionxConfig.set( KEY_CFG_LICENSE, licenseInfo );
        this.appliedTerms = true;
        this.showLicenseDialog = false;
    }

    useLocal() {
        let license = $vionxConfig.get<IConfigStoreLicense>( KEY_CFG_LICENSE );
        if ( license !== null ) {
            this.appliedTerms = license.agreed;
            if ( !this.appliedTerms ) {
                this.showLicenseDialog = true;
                return false;
            }
        }

        this.setLayout( 'MainLayout' );
        this.$router.push( { name: 'user', params: { user: 'localUser' } } );
    }

    useRemote() {
        this.remote = true;
    }

    created() {
        try {
            initializeDatabase( 'local', this.version );
        } catch ( e ) {
            console.log( e );
        }

        let darkMode = $vionxConfig.get( 'darkMode' );
        if ( darkMode !== null ) {
            this.$vuetify.theme.dark = darkMode;
            this.setDarkMode( darkMode );
        }

        let locale: IConfigAll['locale'] | null = $vionxConfig.get( 'locale' );
        if ( locale !== null && locale !== '' ) {
            this.$i18n.locale = locale;
        }

        let license = $vionxConfig.get<IConfigStoreLicense>( KEY_CFG_LICENSE );
        if ( license !== null ) {
            this.appliedTerms = license.agreed;
            if ( license.version != this.version ) {
                this.disagree();
            }
        }

        this.setLayout( 'StartLayout' );
        this.fetchLicenseText();
        this.fetchRepository();
    }

    mounted() {
        if ( process.env.NODE_ENV === 'development' ) {
            // this.useLocal();
            // this.$router.push( '/localUser/goal/237/nested-components/28044200' );
            // setTimeout( () => {
            //     let el = document.getElementById( 'textarea-1784' );
            //     if ( el ) {
            //         el.click();
            //     }
            // }, 100 );
        }
    }

    cancelRemote() {
        this.remote = false;
    }
}
