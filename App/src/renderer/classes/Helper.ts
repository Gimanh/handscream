/**
 * Add functions which can be used in browsers
 */
export class Helper {
    /**
     * @link https://stackoverflow.com/a/6832706
     * // Return 1 if a > b
     * // Return -1 if a < b
     * // Return 0 if a == b
     * @param a
     * @param b
     */
    static compareVersion( a, b ) {
        if ( a === b ) {
            return 0;
        }

        var a_components = a.split( '.' );
        var b_components = b.split( '.' );

        var len = Math.min( a_components.length, b_components.length );

        // loop while the components are equal
        for ( var i = 0; i < len; i++ ) {
            // A bigger than B
            if ( parseInt( a_components[ i ] ) > parseInt( b_components[ i ] ) ) {
                return 1;
            }

            // B bigger than A
            if ( parseInt( a_components[ i ] ) < parseInt( b_components[ i ] ) ) {
                return -1;
            }
        }

        // If one's a prefix of the other, the longer one is greater.
        if ( a_components.length > b_components.length ) {
            return 1;
        }

        if ( a_components.length < b_components.length ) {
            return -1;
        }

        // Otherwise they are the same.
        return 0;
    }

    static htmlEscape( value ) {
        let lt = /</g,
            gt = />/g,
            ap = /'/g,
            ic = /"/g;
        value = value.toString().replace( lt, '&lt;' ).replace( gt, '&gt;' ).replace( ap, '&#39;' ).replace( ic, '&#34;' );
        return value;
    }

    static getISODateNow() {
        let date = new Date();
        return date.toISOString();
    }

    static getLastDayOfMonthISODate() {
        return ( new Date( ( new Date ).getFullYear(), ( new Date ).getMonth() + 1, 0 ) ).toISOString();
    }

    static formatDateToYMD( date?: string | number, delimiter?: string ): string {
        if ( !date ) {
            date = ( new Date() ).getTime();
        }
        if ( !delimiter ) {
            delimiter = '.';
        }
        const dateTimeFormat = new Intl.DateTimeFormat( 'en', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        } )
        const [ { value: month }, , { value: day }, , { value: year } ] = dateTimeFormat.formatToParts( ( new Date( date ) ) )
        return `${ year }${ delimiter }${ month }${ delimiter }${ day }`;
    }

    /**
     * @deprecated
     * @param date
     */
    static vionxDateToMillisecond( date: string ) {
        return ( new Date( date ) ).getTime();
    }

    static dateNow(): number {
        return ( new Date() ).getTime();
    }

    /**
     * Returns date with time
     * @param milliseconds
     */
    static getDateTime( milliseconds?: number ): string {
        let date;
        if ( milliseconds ) {
            date = new Date( milliseconds );
        } else {
            date = new Date();
        }
        let result: string[] = [];
        result.push( date.toISOString().substr( 0, 10 ) );
        result.push( date.getHours() + ':' + date.getMinutes() );
        return result.join( ' ' );
    }

    /**
     * Converts date string for UI used in reminder
     * @param milliseconds
     * @return string '--.--.---- --:--'
     */
    static getDateTimeForUi( milliseconds: number ): string {
        if ( !milliseconds ) {
            return '';
        }
        let date = new Date( milliseconds );
        let result: string[] = [];
        let dateString = date.toISOString().substr( 0, 10 );
        let dateStringArr = dateString.split( '-' );
        dateStringArr.reverse();
        dateString = dateStringArr.join( '.' )
        result.push( dateString );
        result.push( date.getHours() + ':' + ( date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes() ) );
        return result.join( ' ' );
    }

    /**
     * Converts date string to millisecond
     * @param date - result of getDateTimeForUi
     */
    static dateStringToMillisecond( date: string ) {
        return ( new Date( date ) ).getTime();
    }

    static generateColor(): string {
        // return 'hsla(' + 360 * Math.random() + ',70%,60%,0.8)';
        // return `hsla(${ ~~( 360 * Math.random() ) },70%,70%,0.9)`;

        let saturation = Helper.getRandomInt( 20, 95 );
        let lightness = Helper.getRandomInt( 20, 95 );
        let opacity = 0.9;
        return `hsla(${ ~~( 360 * Math.random() ) }, ${ saturation }%, ${ lightness }%, ${ opacity })`;
    }

    /**
     * Конвертирует цвет RGBA  в HSLA
     * @param r
     * @param g
     * @param b
     * @param a
     */
    static convertRgbaToHsla( r, g, b, a ) {
        r = r /= 255;
        g = g /= 255;
        b = b /= 255;

        // Find greatest and smallest channel values
        let cmin = Math.min( r, g, b ),
            cmax = Math.max( r, g, b ),
            delta = cmax - cmin,
            h = 0,
            s = 0,
            l = 0;

        // Calculate hue
        // No difference
        if ( delta == 0 )
            h = 0;
        // Red is max
        else if ( cmax == r )
            h = ( ( g - b ) / delta ) % 6;
        // Green is max
        else if ( cmax == g )
            h = ( b - r ) / delta + 2;
        // Blue is max
        else
            h = ( r - g ) / delta + 4;

        h = Math.round( h * 60 );

        // Make negative hues positive behind 360°
        if ( h < 0 )
            h += 360;

        l = ( cmax + cmin ) / 2;

        // Calculate saturation
        s = delta == 0 ? 0 : delta / ( 1 - Math.abs( 2 * l - 1 ) );

        // Multiply l and s by 100
        s = +( s * 100 ).toFixed( 1 );
        l = +( l * 100 ).toFixed( 1 );

        let res = 'hsla(' + h + ',' + s + '%,' + l + '%,' + a + ')';
        // console.log( res );
        return res;
    }

    /**
     * @link https://css-tricks.com/converting-color-spaces-in-javascript/
     * @param hslaString
     */
    static appHslToRgb( hslaString: string | any, returnObject: boolean = false ) {
        let ex = /^hsla\(((((([12]?[1-9]?\d)|[12]0\d|(3[0-5]\d))(\.\d+)?)|(\.\d+))(deg)?|(0|0?\.\d+)turn|(([0-6](\.\d+)?)|(\.\d+))rad)(((,\s?(([1-9]?\d(\.\d+)?)|100|(\.\d+))%){2},\s?)|((\s(([1-9]?\d(\.\d+)?)|100|(\.\d+))%){2}\s\/\s))((0?\.\d+)|[01]|(([1-9]?\d(\.\d+)?)|100|(\.\d+))%)\)$/i;
        if ( ex.test( hslaString ) ) {
            let sep = hslaString.indexOf( ',' ) > -1 ? ',' : ' ';
            let hsla = hslaString.substr( 5 ).split( ')' )[ 0 ].split( sep );

            // strip the slash if using space-separated syntax
            if ( hsla.indexOf( '/' ) > -1 )
                hsla.splice( 3, 1 );
            let isPct;
            isPct = isPct === true;

            // must be fractions of 1
            let h = hsla[ 0 ],
                s = hsla[ 1 ].substr( 0, hsla[ 1 ].length - 1 ) / 100,
                l = hsla[ 2 ].substr( 0, hsla[ 2 ].length - 1 ) / 100,
                a = hsla[ 3 ];

            // strip label and convert to degrees (if necessary)
            if ( h.indexOf( 'deg' ) > -1 )
                h = h.substr( 0, h.length - 3 );
            else if ( h.indexOf( 'rad' ) > -1 )
                h = Math.round( h.substr( 0, h.length - 3 ) / ( 2 * Math.PI ) * 360 );
            else if ( h.indexOf( 'turn' ) > -1 )
                h = Math.round( h.substr( 0, h.length - 4 ) * 360 );
            if ( h >= 360 )
                h %= 360;

            let c = ( 1 - Math.abs( 2 * l - 1 ) ) * s,
                x = c * ( 1 - Math.abs( ( h / 60 ) % 2 - 1 ) ),
                m = l - c / 2,
                r = 0,
                g = 0,
                b = 0;

            if ( 0 <= h && h < 60 ) {
                r = c;
                g = x;
                b = 0;
            } else if ( 60 <= h && h < 120 ) {
                r = x;
                g = c;
                b = 0;
            } else if ( 120 <= h && h < 180 ) {
                r = 0;
                g = c;
                b = x;
            } else if ( 180 <= h && h < 240 ) {
                r = 0;
                g = x;
                b = c;
            } else if ( 240 <= h && h < 300 ) {
                r = x;
                g = 0;
                b = c;
            } else if ( 300 <= h && h < 360 ) {
                r = c;
                g = 0;
                b = x;
            }

            r = Math.round( ( r + m ) * 255 );
            g = Math.round( ( g + m ) * 255 );
            b = Math.round( ( b + m ) * 255 );

            let pctFound = a.indexOf( '%' ) > -1;

            if ( isPct ) {
                r = +( r / 255 * 100 ).toFixed( 1 );
                g = +( g / 255 * 100 ).toFixed( 1 );
                b = +( b / 255 * 100 ).toFixed( 1 );
                if ( !pctFound ) {
                    a *= 100;
                } else {
                    a = a.substr( 0, a.length - 1 );
                }

            } else if ( pctFound ) {
                a = a.substr( 0, a.length - 1 ) / 100;
            }

            if ( returnObject ) {
                return { r, g, b, a };
            }
            return 'rgba(' + ( isPct ? r + '%,' + g + '%,' + b + '%,' + a + '%' : +r + ',' + +g + ',' + +b + ',' + +a ) + ')';

        } else {
            return 'Invalid input color';
        }
    }

    static guidGenerator(): string {
        let S4 = function () {
            return ( ( ( 1 + Math.random() ) * 0x10000 ) | 0 ).toString( 16 ).substring( 1 );
        };
        return ( S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4() );
    }

    /**
     * https://stackoverflow.com/questions/35969656/how-can-i-generate-the-opposite-color-according-to-current-color
     * @param hex
     */
    static invertColor( hex ) {
        if ( hex.indexOf( '#' ) === 0 ) {
            hex = hex.slice( 1 );
        }
        // convert 3-digit hex to 6-digits.
        if ( hex.length === 3 ) {
            hex = hex[ 0 ] + hex[ 0 ] + hex[ 1 ] + hex[ 1 ] + hex[ 2 ] + hex[ 2 ];
        }
        if ( hex.length !== 6 ) {
            throw new Error( 'Invalid HEX color.' );
        }
        // invert color components
        let r = ( 255 - parseInt( hex.slice( 0, 2 ), 16 ) ).toString( 16 ),
            g = ( 255 - parseInt( hex.slice( 2, 4 ), 16 ) ).toString( 16 ),
            b = ( 255 - parseInt( hex.slice( 4, 6 ), 16 ) ).toString( 16 );
        // pad each with zeros and return
        return '#' + Helper.padZero( r ) + Helper.padZero( g ) + Helper.padZero( b );
    }

    /**
     * https://stackoverflow.com/questions/35969656/how-can-i-generate-the-opposite-color-according-to-current-color
     * @param str
     * @param len
     */
    static padZero( str: string, len?: number ) {
        len = len || 2;
        let zeros = new Array( len ).join( '0' );
        return ( zeros + str ).slice( -len );
    }

    static replaceAllSpacesToOne( str: string ) {
        return str.replace( /\s\s+/g, ' ' );
    }

    static deleteAllSpaces( str: string ) {
        return str.replace( /\s\s+/g, ' ' );
    }

    static getRandomInt( min, max ) {
        min = Math.ceil( min );
        max = Math.floor( max );
        return Math.floor( Math.random() * ( max - min ) ) + min;
    }

    static generateColors( colorItemsCount ) {
        let colorItems: string[] = [];
        for ( let i = colorItemsCount; i--; ) {
            let color: string = Helper.generateColor();
            colorItems.push( color )
        }
        return colorItems;
    }

    static setNewAlphaToHslaString( hslaString, alpha: number ) {
        let ex = /^hsla\(((((([12]?[1-9]?\d)|[12]0\d|(3[0-5]\d))(\.\d+)?)|(\.\d+))(deg)?|(0|0?\.\d+)turn|(([0-6](\.\d+)?)|(\.\d+))rad)(((,\s?(([1-9]?\d(\.\d+)?)|100|(\.\d+))%){2},\s?)|((\s(([1-9]?\d(\.\d+)?)|100|(\.\d+))%){2}\s\/\s))((0?\.\d+)|[01]|(([1-9]?\d(\.\d+)?)|100|(\.\d+))%)\)$/i;
        if ( ex.test( hslaString ) ) {
            let sep = hslaString.indexOf( ',' ) > -1 ? ',' : ' ';
            let hsla = hslaString.substr( 5 ).split( ')' )[ 0 ].split( sep );
            if ( hsla.indexOf( '/' ) > -1 ) {
                hsla.splice( 3, 1 );
            }
            let h = hsla[ 0 ],
                s = hsla[ 1 ],
                l = hsla[ 2 ];
            return `hsla(${ h }, ${ s }, ${ l }, ${ alpha })`;
        }
    }

    static dateToISO8601( date: string | number | Date ): string {
        if ( date ) {
            let delimiter = '-';
            const dateTimeFormat = new Intl.DateTimeFormat( 'en', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            } )
            const [ { value: month }, , { value: day }, , { value: year } ] = dateTimeFormat.formatToParts( ( new Date( date ) ) )
            return `${ year }${ delimiter }${ month }${ delimiter }${ day }`;
        }
        return '';
    }

    static objectToHsla( object: { h: number, s: number, l: number, a: number } ): string {
        return `hsla(${ object.h.toFixed( 2 ) }, ${ object.s.toFixed( 2 ) }%, ${ object.l.toFixed( 2 ) }%, ${ object.a })`;
    }
}
