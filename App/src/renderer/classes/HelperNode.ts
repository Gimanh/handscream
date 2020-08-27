/**
 * Add functions which can be used on desktop version using NodeJS
 */
export default class HelperNode {
    static getBaseName( path: string, ext?: string ): string {
        const fs = require( 'path' );
        return fs.basename( path, ext )
    }

    static changeFilenameInPath( fullPathWithFilename: string, justNewName: string ): string {
        const path = require( 'path' );
        let dir = path.dirname( fullPathWithFilename );
        let ext = path.extname( fullPathWithFilename );
        return path.join( dir, justNewName + ext );
    }

    static copyFile( src: string, dest: string ): void {
        const fs = require( 'fs' );
        fs.copyFileSync( src, dest );
    }

    static fileExist( src: string ): boolean {
        const fs = require( 'fs' );
        return fs.existsSync( src );
    }

    static openFileLocation( fullFilePath: string ) {
        if ( HelperNode.fileExist( fullFilePath ) ) {
            const { shell } = require( 'electron' );
            shell.showItemInFolder( fullFilePath );
        }
    }
}
