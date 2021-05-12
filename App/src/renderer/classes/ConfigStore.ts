import electron from 'electron'
import path from 'path'
import fs from 'fs'
import { IConfigAll, IConfigDataTaskView } from '@/classes/IConfigStore';
import { Helper } from '@/classes/Helper';
import DatabaseLocal from '@/classes/DatabaseLocal';

export class ConfigStore {

    public $data!: IConfigAll;

    public $path: string;

    public databaseDirectoryName: string;

    constructor( fileName: string, databaseDirectoryName: string ) {
        const userDataPath = ( electron.app || electron.remote.app ).getPath( 'userData' );
        this.databaseDirectoryName = databaseDirectoryName;
        this.$path = path.join( userDataPath, fileName );
        if ( !this.existConfig( this.$path ) ) {
            this.$data = this.getEmptyConfig();
            fs.writeFileSync( this.$path, JSON.stringify( this.$data ) );
        }
        this.checkDatabaseDirectory();
        this.loadConfig();
    }

    checkDatabaseDirectory() {
        let dir = path.join( this.getUserDataPath(), this.databaseDirectoryName );
        if ( !fs.existsSync( dir ) ) {
            fs.mkdirSync( dir );
        }
    }

    getEmptyConfig(): IConfigAll {
        return {
            license: {
                agreed: false,
                version: ''
            },
            taskView: {
                databaseList: [],
                lastOpenedDatabase: ''
            },
            darkMode: false,
            locale: ''
        }
    }

    /**
     * Add path to list if path exists in list will be updated only usages date
     * @param fullPath
     */
    public addDbToConfigList( fullPath ) {
        let data = this.get<IConfigDataTaskView>( DatabaseLocal.localDataKey );
        let has = false;
        if ( data ) {
            for ( let k = 0; k < data.databaseList.length; k++ ) {
                if ( data.databaseList[ k ].src == fullPath ) {
                    has = true;
                    data.databaseList[ k ].date = Helper.dateNow()
                    break;
                }
            }
            if ( !has ) {
                data.databaseList.unshift( {
                    src: fullPath,
                    date: Helper.dateNow()
                } )
            }
            this.set( DatabaseLocal.localDataKey, data );
        }
    }

    getUserDataPath() {
        return ( electron.app || electron.remote.app ).getPath( 'userData' );
    }

    getUserBaseDbDirectory() {
        return path.join( this.getUserDataPath(), DatabaseLocal.databaseDirectoryName );
    }

    existConfig( path: string ): boolean {
        if ( path ) {
            return fs.existsSync( path )
        }
        if ( this.$path ) {
            return fs.existsSync( this.$path )
        }
        return false;
    }

    loadConfig(): boolean {
        if ( this.existConfig( this.$path ) ) {
            let configContent = fs.readFileSync( this.$path );
            this.$data = JSON.parse( configContent.toString() );
            return true;
        }
        return false;
    }

    get<S = any>( key: string ): S | null {
        this.loadConfig();
        if ( this.$data ) {
            if ( key in this.$data ) {
                return this.$data[ key ];
            }
            return null;
        }
        return null;
    }

    set( key: string, value: any ) {
        this.loadConfig();
        if ( this.$path ) {
            this.$data[ key ] = value;
            fs.writeFileSync( this.$path, JSON.stringify( this.$data ) );
        }
    }
}
