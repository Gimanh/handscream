const notarize = require( 'electron-notarize' ).notarize;
const config = require('./task_view.app.conf.json');

module.exports = async ( context ) => {
    const { electronPlatformName } = context;
    if ( electronPlatformName === 'darwin' ) {
        try {
            console.log( 'Try notarize app' );
            await notarize( config.notarizeConfig );
            console.log( 'Success notarize' );
        } catch ( err ) {
            console.log( err );
        }
    }
};
