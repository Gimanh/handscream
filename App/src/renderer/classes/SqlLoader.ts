import { AppSqlQueries, DefaultSort } from '@/classes/Type';
import { Database, Statement } from 'better-sqlite3';
import HelperNode from '@/classes/HelperNode';

export default class SqlLoader {

    private readonly path = '';

    constructor() {
        const path = require( 'path' );
        //@ts-ignore
        this.path = path.join( __static, '/sql/app' );
    }

    loadSqlFor( sqlName: string ): string {
        const fs = require( 'fs' );
        let filePath = `${ this.path }/${ sqlName }.sql`;
        if ( HelperNode.fileExist( filePath ) ) {
            return fs.readFileSync( filePath, 'utf8' );
        }
        throw `File "${ sqlName }" not found`;
    }

    prepareSqlFor<S extends keyof AppSqlQueries>( sqlName: S, params: AppSqlQueries[S], db: Database ) {
        let sql = this.loadSqlFor( sqlName );
        let sortSql: string[] = [];
        if ( params.sortBy.length > 0 ) {
            params.sortBy.forEach( ( value ) => {
                sortSql.push( `${ value.value } ${ value.asc === 1 ? 'ASC' : 'DESC' }` )
            } )
        } else {
            let defaultSort = this.getDefaultSort( sqlName );
            if ( defaultSort ) {
                sortSql.push( defaultSort )
            }
        }
        let sqlSortString = ( sortSql.length > 0 ? ' ORDER BY ' : '' ) + sortSql.join( ', ' );
        sql = sql.replace( '@sorting', sqlSortString );
        return db.prepare<AppSqlQueries[S]>( sql );
    }

    getDefaultSort<S extends keyof AppSqlQueries>( sqlName: S ): string | false {
        if ( DefaultSort[ sqlName ] ) {
            return DefaultSort[ sqlName ]
        }
        return false;
    }
}
