const notarize = require( 'electron-notarize' ).notarize;
import { notarizeConfig } from './task_view.app.conf'

module.exports = async ( context ) => {
    const { electronPlatformName } = context;
    if ( electronPlatformName === 'darwin' ) {
        try {
            console.log( 'Try notarize app' );
            await notarize( notarizeConfig );
            console.log( 'Success notarize' );
        } catch ( err ) {
            console.log( err );
        }
    }
};
