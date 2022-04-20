import { TTaskPriority } from '~/classes/util/TaskTypes';

export function parseJwt<R>( token: string ): R {
    const base64Url = token.split( '.' )[ 1 ];
    const base64 = base64Url.replace( /-/g, '+' ).replace( /_/g, '/' );
    const jsonPayload = decodeURIComponent( atob( base64 ).split( '' ).map( function ( c ) {
        return '%' + ( '00' + c.charCodeAt( 0 ).toString( 16 ) ).slice( -2 );
    } ).join( '' ) );
    return JSON.parse( jsonPayload );
}

export function isEmail( email: string ): boolean {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test( String( email ).toLowerCase() );
}

export function validLogin( login: string ) {
    const re = /^[a-z0-9]{4,30}$/;
    return re.test( String( login ).toLowerCase() );
}

export function getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for ( let i = 0; i < 6; i++ ) {
        color += letters[ Math.floor( Math.random() * 16 ) ];
    }
    return color;
}

export function getColor( priority: TTaskPriority ): string {
    if ( priority.code === 'high' ) {
        return 'red';
    }
    if ( priority.code === 'low' ) {
        return 'grey';
    }
    if ( priority.code === 'medium' ) {
        return 'orange';
    }
    return 'green';
}
