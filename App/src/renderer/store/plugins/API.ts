import { IZDatabase } from '@/classes/IZDatabase';
import ZDatabaseLocal from '@/classes/ZDatabaseLocal';
import DatabaseUpdater from '@/classes/DatabaseUpdater';
import Vue from 'vue';
import { ConfigStore } from '@/classes/ConfigStore';

let $database: IZDatabase;
let $vionxConfig: ConfigStore = new ConfigStore( ZDatabaseLocal.configFileName, ZDatabaseLocal.databaseDirectoryName );

export function initializeDatabase( mode: string, version ) {

    if ( mode === 'local' ) {
        $database = new ZDatabaseLocal();
        let configData = $database.getConfigData();
        let successOpen = $database.openDatabase( { path: configData.lastOpenedDatabase } );

        if ( successOpen ) {
            if ( $database instanceof ZDatabaseLocal ) {
                let updater = new DatabaseUpdater( version, $database );
                updater.updateDatabase();
            }
        }
        $database = Vue.observable( $database );


    } else {
        //TODO remote plugin
    }
}

export function createDatabaseFile( options: { name: string, destination?: string } ) {
    if ( $database ) {
        $database.createDatabase( options.name, options.destination );
    } else {
        console.error( 'Database $database is not initialized' );
    }
}

export { $database }
export { $vionxConfig }

