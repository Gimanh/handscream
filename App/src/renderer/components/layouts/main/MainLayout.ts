import { Component, Watch } from 'vue-property-decorator';
import { Mutation, State } from 'vuex-class';
import { NS_MAIN_STORE, NS_NOTIFICATIONS } from '@/store/types';
import ZMixin from '@/mixins/mixin';
import { $database } from '@/store/plugins/API';

@Component
export default class MainLayout extends ZMixin {

    public dialogLoadTheme: boolean = false;

    public drawer: boolean = true;

    public showError: boolean = false;

    public errorMessage: string = '';

    @State( state => state[ NS_MAIN_STORE ].usagesMode ) usagesMode;

    @State( state => state[ NS_MAIN_STORE ].name ) name!: boolean;

    @State( state => state[ NS_MAIN_STORE ].dbFileNotFound ) dbFileNotFound;

    @State( state => state[ NS_NOTIFICATIONS ].showNotificationForTasks ) showNotificationForTasks;

    @State( state => state[ NS_NOTIFICATIONS ].unsolvedCount ) unsolvedCount;

    @State( state => state[ NS_NOTIFICATIONS ].lists ) lists;

    @Mutation( 'setActiveItemId', { namespace: NS_MAIN_STORE } ) setActiveListItem!: any //IRootStateMethods['setActiveListItem'];

    @Mutation( 'setDarkMode', { namespace: NS_MAIN_STORE } ) setDarkMode!: ( v: boolean ) => void;

    @Watch( 'drawer' )
    drawerWatcher( val, old ) {
        console.log( val, old );
        console.log( this.$vuetify.breakpoint );
    }

    get showMenuIcon() {
        return this.$vuetify.breakpoint.sm || this.$vuetify.breakpoint.md;
    }

    get showNotifications() {
        return this.showNotificationForTasks;
    }

    get translatedLists(): string[] {
        let result: string[] = [];
        for ( let k of this.lists ) {
            result.push( ( this.$t( k ) as string ) );
        }
        return result;
    }

    displayNotification() {
        let message: string =
            ( this.$t( 'msg.unsolvedTasks' ) as string )
            + ' \n '
            + ( this.$t( 'msg.count' ) as string ) + ' ' + this.unsolvedCount
            + ' \n '
            + ( this.$t( 'msg.list' ) as string )
            + ' ('
            + this.translatedLists.join( ',' )
            + ')';
        new Notification( ( this.$t( 'msg.tasks' ) as string ), {
            body: message
        } );
    }

    detectClickItemOutside( e ) {
        let selectedItem = document.getElementsByClassName( 'vionx-selected-item' );
        if ( selectedItem.length > 0 ) {
            let target = e.target;
            if ( target ) {
                //@ts-ignore
                if ( selectedItem[ 0 ].contains( target ) ) {
                } else {
                    this.setActiveListItem( 0 );
                }
            }
        }
    }

    created() {
        if ( !this.usagesMode ) {
            this.$router.push( '/' );
        }

        document.addEventListener( 'click', this.detectClickItemOutside );

        /**
         * Disable Ctr+R
         */
        // const { app, globalShortcut } = require( 'electron' ).remote;
        // app.whenReady().then( () => {
        //     globalShortcut.register( 'CommandOrControl+R', ( e ) => {
        //         console.log( 'CommandOrControl+R is pressed' )
        //     } )
        // } );
        /**
         * Handler for set default value to record time task in storage when triggered event "beforeunload"
         */
        window.addEventListener( 'beforeunload', async ( event ) => {
            await this.workingOnTask( -1 );
        } );
    }

    mounted() {
        window.onbeforeunload = function ( e ) {
            alert( 'Dialog text here.' );
        };
    }

    toggleTheme() {
        this.dialogLoadTheme = true;
        setTimeout( () => {
            this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
            this.setDarkMode( this.$vuetify.theme.dark );
            $database.config.set( 'darkMode', this.$vuetify.theme.dark );
            setTimeout( () => {
                this.dialogLoadTheme = false;
            }, 400 );
        }, 400 );
    }

    async beforeDestroy() {
        await this.workingOnTask( -1 );
    }
}
