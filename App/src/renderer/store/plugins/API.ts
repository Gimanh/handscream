import { IZDatabase } from '@/classes/IZDatabase';
import DatabaseLocal from '@/classes/DatabaseLocal';
import DatabaseUpdater from '@/classes/DatabaseUpdater';
import Vue from 'vue';
import { ConfigStore } from '@/classes/ConfigStore';

let $database: IZDatabase;
let $vionxConfig: ConfigStore = new ConfigStore( DatabaseLocal.configFileName, DatabaseLocal.databaseDirectoryName );

export function initializeDatabase( mode: string, version ) {

    if ( mode === 'local' ) {
        $database = new DatabaseLocal();
        let configData = $database.getConfigData();
        let successOpen = $database.openDatabase( { path: configData.lastOpenedDatabase } );

        if ( successOpen ) {
            if ( $database instanceof DatabaseLocal ) {
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

