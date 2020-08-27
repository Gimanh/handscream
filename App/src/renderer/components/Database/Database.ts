import { Component, Watch } from 'vue-property-decorator';
import { State } from 'vuex-class';
import { NS_MAIN_STORE } from '@/store/types';
import ZDatabaseLocal from '@/classes/ZDatabaseLocal';
import ZMixin from '@/mixins/mixin';
import { $database, createDatabaseFile } from '@/store/plugins/API';
import DatabaseUpdater from '@/classes/DatabaseUpdater';
import HelperNode from '@/classes/HelperNode';
import { Helper } from '@/classes/Helper';
import { IConfigDataTaskView } from '@/classes/IConfigStore';

type databaseListItem = {
    dateUi: string
    date: number
    src: string
    name: string
    exist: boolean
};

type databaseListItems = databaseListItem[];

@Component
export default class Database extends ZMixin {

    fileName: string = '';

    databaseDestinationFolder: string = '';

    showFileNameDialog: boolean = false;

    dialogDisabledOkBtn: boolean = false;

    public showDialogOpenStorage: boolean = false;

    public showDeleteStorageFileDialog: boolean = false;

    private itemWillBeDeleted: databaseListItem | null = null;

    @State( state => state[ NS_MAIN_STORE ].usagesMode ) mode;

    @State( state => state[ NS_MAIN_STORE ].version ) version!: string;

    $refs!: {
        fileNameField: HTMLElement
    }

    @Watch( 'showFileNameDialog' )
    handlerDialog( val ) {
        if ( val ) {
            setTimeout( () => {
                if ( this.$refs.fileNameField ) {
                    this.$refs.fileNameField.focus();
                }
            } )
        }
    }

    created() {
        this.$on( 'selectFolder', this.showDialog );
    }

    selectFolder() {
        const { dialog } = require( 'electron' ).remote;
        dialog.showOpenDialog( {
            title: 'Select directory for storing database',
            properties: [ 'openDirectory' ]
        }, ( selectedPath ) => {
            if ( selectedPath && selectedPath.length === 1 ) {
                this.databaseDestinationFolder = selectedPath[ 0 ];
                this.$emit( 'selectFolder', selectedPath[ 0 ] );
            }
        } );
    }

    createDatabase() {
        this.showDialog( 'true' );
    }

    showDialog( selectedPath ) {
        if ( !!selectedPath ) {
            this.showFileNameDialog = true;
        }
    }

    hideDialog() {
        this.showFileNameDialog = false;
        this.fileName = '';
        this.databaseDestinationFolder = '';
    }

    /**
     * Create database file if name entered in dialog
     */
    async createDatabaseFile() {
        await this.workingOnTask( -1 );
        if ( !this.fileName ) {
            alert( this.$t( 'msg.requiredField' ) as string + this.$t( 'msg.fileName' ) as string );
        }

        createDatabaseFile( {
            name: this.fileName,
            destination: this.databaseDestinationFolder
        } );

        this.hideDialog();

        if ( $database instanceof ZDatabaseLocal ) {
            let updater = new DatabaseUpdater( this.version, $database );
            updater.updateDatabase();
        }
        this.goToLocalUserPage();
    }

    get fileNameRules() {
        return [ ( v ) => {
            const valid = !!v && v.length > 1;
            if ( valid ) {
                this.dialogDisabledOkBtn = false;
                return true;
            } else {
                this.dialogDisabledOkBtn = true;
                return 'File name must isset only chars';
            }
        } ];
    }

    get databaseListClean() {
        let data = $database.getConfigData();
        if ( data ) {
            let list: databaseListItems = data.databaseList.map( ( item ) => {
                return {
                    date: Number( item.date ),
                    dateUi: Helper.getDateTimeForUi( Number( item.date ) ),
                    src: item.src,
                    name: HelperNode.getBaseName( item.src, '.db' ),
                    exist: HelperNode.fileExist( item.src )
                }
            } );
            list.sort( ( a, b ) => {
                if ( a.date > b.date ) {
                    return -1;
                }
                if ( a.date < b.date ) {
                    return 1;
                }

                return 0;
            } );
            return list;
        }
        return [];
    }

    openDatabaseDialogWithList() {
        this.showDialogOpenStorage = true;
    }

    openSelectedDatabase( item: databaseListItem ) {
        if ( item.exist ) {
            this.openDatabaseFile( item.src )
        }
    }

    wantDeleteDatabaseListItem( item: databaseListItem ) {
        this.itemWillBeDeleted = item;
        if ( item.exist ) {
            this.showDeleteStorageFileDialog = true;
        } else {
            this.deleteStorageListItem();
        }

    }

    openFileLocation() {
        if ( this.itemWillBeDeleted ) {
            if ( this.itemWillBeDeleted.exist ) {
                HelperNode.openFileLocation( this.itemWillBeDeleted.src );
            }
        } else {
            alert( 'Can not open destination without unselected item!' )
        }
    }

    deleteStorageListItem() {
        if ( this.itemWillBeDeleted ) {
            if ( $database instanceof ZDatabaseLocal ) {
                let data = $database.config.get<IConfigDataTaskView>( ZDatabaseLocal.localDataKey );
                if ( data ) {
                    for ( let k = 0; k < data.databaseList.length; k++ ) {
                        if ( data.databaseList[ k ].src == this.itemWillBeDeleted.src ) {
                            data.databaseList.splice( k, 1 );
                            break;
                        }
                    }
                }
                if ( this.itemWillBeDeleted.src == $database.db.name ) {
                    if ( data && data.lastOpenedDatabase ) {
                        data.lastOpenedDatabase = '';
                    }
                    this.$nextTick( () => {
                        this.closeDatabase().then( ( r ) => {
                            console.log( r );
                        } );
                    } );
                }
                $database.config.set( ZDatabaseLocal.localDataKey, data );
            }
        }
        this.showDeleteStorageFileDialog = false;
        this.itemWillBeDeleted = null;

    }

    cancelDeleteFile() {
        this.showDeleteStorageFileDialog = false;
        this.itemWillBeDeleted = null;
    }

    async openDatabaseFile( filePath ) {
        await this.workingOnTask( -1 );
        if ( filePath ) {
            $database.openDatabase( { path: filePath } );
            this.showDialogOpenStorage = false;
            if ( $database.db.open === true && $database.db.name === filePath ) {
                this.goToLocalUserPage();
            } else {
                this.$router.push( { name: 'start' } )
            }
        }
    }

    openSelectDatabaseFolderDialog() {
        const { dialog } = require( 'electron' ).remote;
        dialog.showOpenDialog( {
            title: this.$t( 'msg.selectDatabaseFile' ).toString(),
            properties: [ 'openFile' ]
        }, ( selectedPath ) => {
            if ( selectedPath && selectedPath.length === 1 ) {
                this.openDatabaseFile( selectedPath[ 0 ] );
            }
        } );
    }

    /**
     * Close database
     */
    async closeDatabase() {
        await this.workingOnTask( -1 );
        $database.closeCurrentDatabase();
        //FIXME reset store state
        this.$router.push( '/' );
    }
}
