import { Component, Vue, Watch } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import ZMixin from '@/mixins/mixin';
import { Helper } from '@/classes/Helper';
import { NS_GOALS } from '@/store/types';
import {
    IGoalsStoreActions,
    IReportResult,
    IReportResultClean, IReportResultCleanItem
} from '@/store/IGoalsStore';
import { IAppVTableHeaderItem, IAppVTableHeaders } from '@/Interfaces/IApp';
import HelperNode from '@/classes/HelperNode';

interface IHeader extends IAppVTableHeaderItem {
    active: boolean
    edit: boolean
}

type THeaders = IHeader[];
@Component
export default class AppDocReport extends ZMixin {

    public dialog: boolean = false;

    public selectedDates: string[] = [];

    public millisecondStart: number = 0;

    public millisecondEnd: number = 0;

    public dateStartForUi = '';

    public dateEndForUi = '';

    public fetchedResults: IReportResultClean = [];

    public reportHeaders: THeaders = [];

    public onlyActiveHeaders: THeaders = [];

    public shortcuts: { text: string, handler: string }[] = [];

    public showCalendar = true;

    public searchByLabels: number[] = [];

    public xlsA4 = 123;

    public exportExtensionWithDot: string = '.xlsx';

    public localStorageKey = 'taskview.reportHeaders';

    public exportPlan: boolean = false;

    @Action( 'fetchAllLabels', { namespace: NS_GOALS } ) fetchAllLabels!: IGoalsStoreActions['fetchAllLabels'];

    @Watch( 'reportHeaders', { deep: true } )
    reportHeadersWatcher( val ) {
        try {
            localStorage.setItem( this.localStorageKey, JSON.stringify( val ) );
        } catch ( e ) {

        }
    }

    created() {
        this.fetchAllLabels();
        this.reportHeaders = [
            {
                text: this.$t( 'msg.goal' ) as string,
                value: 'goal_name',
                active: true,
                edit: false,
            },
            {
                text: this.$t( 'msg.listName' ) as string,
                value: 'list_name',
                active: true,
                edit: false,
            },
            {
                text: this.$t( 'msg.task' ) as string,
                value: 'description',
                styles: {
                    width: 40
                },
                active: true,
                edit: false,
            },
            {
                text: this.$t( 'msg.dateCreation' ) as string,
                value: 'date_creation_locale',
                styles: {
                    width: 15
                },
                active: true,
                edit: false,
            },
            {
                text: this.$t( 'msg.dateComplete' ) as string,
                value: 'date_complete_locale',
                styles: {
                    width: 15
                },
                active: true,
                edit: false,
            },
            {
                text: this.$t( 'msg.deadline' ) as string,
                value: 'deadline_locale',
                styles: {
                    width: 15
                },
                active: true,
                edit: false,
            },
            {
                text: this.$t( 'msg.totalTime' ) as string,
                value: 'formatTotalTime',
                styles: {
                    width: 15
                },
                active: true,
                edit: false,
            },
            {
                text: this.$t( 'msg.note' ) as string,
                value: 'comment',
                active: true,
                edit: false,
            },
            {
                text: this.$t( 'msg.labels' ) as string,
                value: 'labels',
                active: true,
                edit: false,
            }
        ];
        this.shortcuts = [
            {
                text: this.$t( 'rep.today' ) as string,
                handler: 'selectToday'
            },
            {
                text: this.$t( 'rep.thisWeek' ) as string,
                handler: 'selectThisWeek'
            },
            {
                text: this.$t( 'rep.thisMonth' ) as string,
                handler: 'selectThisMonth'
            },
            {
                text: this.$t( 'rep.lastMonth' ) as string,
                handler: 'selectLastMonth'
            },
            {
                text: this.$t( 'rep.nextMonth' ) as string,
                handler: 'selectNextMonth'
            }
        ];
        try {
            let info = localStorage.getItem( this.localStorageKey );
            if ( info ) {
                let headers: THeaders = JSON.parse( info );
                if ( Array.isArray( headers ) ) {
                    //if we added new element to headers and in localStorage we keep old state
                    if ( this.reportHeaders.length > headers.length ) {
                        this.reportHeaders.forEach( ( ( header, index ) => {
                            let item = headers.find( element => element.value == header.value );
                            if ( item ) {
                                this.reportHeaders[ index ] = item
                            }
                        } ) );
                    } else {
                        this.reportHeaders = headers;
                    }
                }
            }
        } catch ( e ) {

        }
        this.onlyActiveHeaders = this.reportHeaders.filter( ( value => {
            if ( value.active ) {
                return value;
            }
        } ) );
    }

    @Action( 'fetchReportData', { namespace: NS_GOALS } )
    fetchReportData!: IGoalsStoreActions['fetchReportData'];

    @Action( 'fetchPlanReportData', { namespace: NS_GOALS } )
    fetchPlanReportData!: IGoalsStoreActions['fetchPlanReportData'];

    @Watch( 'selectedDates' )
    async handler( val, old ) {
        if ( val.length > 1 ) {
            let date1 = new Date( val[ 0 ] );
            let date2 = new Date( val[ 1 ] );

            if ( date1.getTime() > date2.getTime() ) {
                this.dateEndForUi = this.formatDate( val[ 0 ] );
                this.dateStartForUi = this.formatDate( val[ 1 ] );
                this.millisecondEnd = new Date( val[ 0 ] + ' 23:59' ).getTime();
                this.millisecondStart = new Date( val[ 1 ] + ' 00:00' ).getTime();
            } else {
                this.dateEndForUi = this.formatDate( val[ 1 ] );
                this.dateStartForUi = this.formatDate( val[ 0 ] );
                this.millisecondEnd = new Date( val[ 1 ] + ' 23:59' ).getTime();
                this.millisecondStart = new Date( val[ 0 ] + ' 00:00' ).getTime();
            }
            await this.fetchDataForDates();
        }
    }

    get selectedDateRange() {
        return this.dateStartForUi + '-' + this.dateEndForUi;
    }

    async fetchDataForDates() {
        if ( this.exportPlan ) {
            let resultPlan = await this.fetchPlanReportData( {
                start: this.millisecondStart,
                end: this.millisecondEnd,
                labels: this.searchByLabels
            } );
            this.fetchedResults = this.prepareCleanReportData( resultPlan );
        } else {
            let result = await this.fetchReportData( {
                start: this.millisecondStart,
                end: this.millisecondEnd,
                labels: this.searchByLabels
            } );
            this.fetchedResults = this.prepareCleanReportData( result );
        }
    }

    prepareCleanReportData( reportData: IReportResult ): IReportResultClean {
        let cache: { [ key: string ]: IReportResultCleanItem } = {};
        //Label cache control, we must not duplicate labels in report
        let itemLabelCache: {
            [ key: string ]: {
                [ key: string ]: boolean
            }
        } = {};

        let timeCacheControl: { [ key: string ]: boolean } = {};
        //Тут не правильно считается так как идет лефт джоин то мы дублируем расчет времени
        for ( let k in reportData ) {
            let total = 0;
            if ( reportData[ k ].work_end !== null ) {
                let start = reportData[ k ].work_start;
                if ( !timeCacheControl[ start ] ) {
                    let end = reportData[ k ].work_end;
                    let diff = end - start;
                    total = Math.ceil( diff / ( 1000 * 60 ) );
                    timeCacheControl[ start ] = true;
                }
            }
            let key = reportData[ k ].id;
            if ( !cache[ key ] ) {
                cache[ key ] = {
                    ...reportData[ k ],
                    labels: [],
                    date_complete_locale: reportData[ k ].date_complete ? ( new Date( reportData[ k ].date_complete ) ).toLocaleString() : '',
                    date_creation_locale: reportData[ k ].date_creation ? ( new Date( reportData[ k ].date_creation ) ).toLocaleString() : '',
                    deadline_locale: reportData[ k ].deadline ? ( new Date( reportData[ k ].deadline ) ).toLocaleString() : '',
                    totalTime: total,
                    formatTotalTime: ''
                }
                itemLabelCache[ key ] = {};
            } else {
                cache[ key ].totalTime += total;
            }
            if ( reportData[ k ].label_name ) {
                if ( !itemLabelCache[ key ][ reportData[ k ].label_name ] ) {
                    cache[ key ].labels.push( {
                        name: reportData[ k ].label_name,
                        color: reportData[ k ].label_color
                    } );
                    itemLabelCache[ key ][ reportData[ k ].label_name ] = true;
                }
            }
        }
        for ( let i in cache ) {
            if ( cache[ i ].totalTime > 0 ) {
                cache[ i ].formatTotalTime = this.minutesToHoursAndMinutes( cache[ i ].totalTime );
            } else {
                cache[ i ].formatTotalTime = '---'
            }
        }
        return Object.values( cache );
    }

    formatDate( date: string | number, delimiter = '-' ): string {
        const dateTimeFormat = new Intl.DateTimeFormat( 'en', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        } )
        const [ { value: month }, , { value: day }, , { value: year } ] = dateTimeFormat.formatToParts( ( new Date( date ) ) )
        return `${ day }${ delimiter }${ month }${ delimiter }${ year }`;
    }

    editItem( item: IHeader ) {
        item.edit = !item.edit;
    }

    selectToday() {
        this.selectedDates = [];
        this.$nextTick( () => {
            this.selectedDates = [ Helper.dateToISO8601( new Date() ), Helper.dateToISO8601( new Date() ) ];
        } );
    }

    selectThisWeek() {
        let curr = new Date();
        let first = curr.getDate() - curr.getDay() + 1;
        let last = first + 6;
        let firstDay = new Date( curr.setDate( first ) );
        let lastDay = new Date( curr.setDate( last ) );
        this.selectedDates = [];
        this.$nextTick( () => {
            this.selectedDates = [ Helper.dateToISO8601( firstDay ), Helper.dateToISO8601( lastDay ) ];
        } );
    }

    selectThisMonth() {
        let date = new Date();
        let firstDay = new Date( date.getFullYear(), date.getMonth(), 1 );
        let lastDay = new Date( date.getFullYear(), date.getMonth() + 1, 0 );
        this.selectedDates = [];
        this.$nextTick( () => {
            this.selectedDates = [ Helper.dateToISO8601( firstDay ), Helper.dateToISO8601( lastDay ) ];
        } );
    }

    selectLastMonth() {
        let date = new Date();
        let firstDay = new Date( date.getFullYear(), date.getMonth() - 1, 1 );
        let lastDay = new Date( date.getFullYear(), date.getMonth(), 0 );
        this.selectedDates = [];
        this.$nextTick( () => {
            this.selectedDates = [ Helper.dateToISO8601( firstDay ), Helper.dateToISO8601( lastDay ) ];
        } );
    }

    selectNextMonth() {
        let date = new Date();
        let firstDay = new Date( date.getFullYear(), date.getMonth() + 1, 1 );
        let lastDay = new Date( date.getFullYear(), date.getMonth() + 2, 0 );
        this.selectedDates = [];
        this.$nextTick( () => {
            this.selectedDates = [ Helper.dateToISO8601( firstDay ), Helper.dateToISO8601( lastDay ) ];
        } )
    }

    runAction( name: string ) {
        this[ name ]();
    }

    toggleLable( id: number ) {
        let index = this.searchByLabels.indexOf( id );
        if ( index === -1 ) {
            this.searchByLabels.push( id );
        } else {
            this.searchByLabels.splice( index, 1 );
        }
    }

    getChipClass( id: number ) {
        let index = this.searchByLabels.indexOf( id );
        if ( index === -1 ) {
            return 'grey lighten-2';
        } else {
            return '';
        }
    }

    async downloadReport() {
        const { dialog } = require( 'electron' ).remote;
        await dialog.showOpenDialog( {
            title: 'Select directory for storing database',
            properties: [ 'openDirectory' ]
        }, ( selectedPath ) => {
            if ( selectedPath && selectedPath.length === 1 ) {
                this.prepareReportDataAndSaveToPath( selectedPath[ 0 ] );
            }
        } );
    }

    toggleActiveOnItem( item: IHeader ) {
        item.active = !item.active
        this.onlyActiveHeaders = this.reportHeaders.filter( ( value => {
            if ( value.active ) {
                return value;
            }
        } ) );
    }

    prepareReportDataAndSaveToPath( folderPath: string ) {
        if ( folderPath ) {
            this.prepareHeadersWidths();
            let xl = require( 'excel4node' );
            let wb = new xl.Workbook();
            let ws = wb.addWorksheet( 'Sheet 1', {
                pageSetup: {
                    orientation: 'landscape'
                }
            } );
            let styleHeaders = wb.createStyle( {
                font: {
                    bold: true,
                    size: 12
                },
                alignment: {
                    wrapText: true,
                    horizontal: 'center',
                    vertical: 'center'
                },
                border: {
                    left: {
                        style: 'medium',
                        color: 'black'
                    },
                    right: {
                        style: 'medium',
                        color: 'black'
                    },
                    top: {
                        style: 'medium',
                        color: 'black'
                    },
                    bottom: {
                        style: 'medium',
                        color: 'black'
                    },
                },
                fill: {
                    type: 'pattern',
                    patternType: 'solid',
                    fgColor: '#b8b5b5'
                }
            } );
            let styleRows = wb.createStyle( {
                font: {
                    size: 12
                },
                alignment: {
                    wrapText: true,
                    horizontal: 'center',
                    vertical: 'center'
                },
            } );
            // let onlyActiveHeaders = this.reportHeaders.filter( ( value => {
            //     if ( value.active ) {
            //         return value;
            //     }
            // } ) );
            for ( let k = 0; k < this.onlyActiveHeaders.length; k++ ) {
                ws.cell( 1, k + 1 ).string( this.onlyActiveHeaders[ k ].text ).style( styleHeaders );
                let styleHeader = this.onlyActiveHeaders[ k ].styles;
                if ( styleHeader ) {
                    if ( styleHeader.width ) {
                        ws.column( k + 1 ).setWidth( ( styleHeader.width / 100 ) * this.xlsA4 );
                    }
                }
                for ( let h = 0; h < this.fetchedResults.length; h++ ) {
                    let val = this.fetchedResults[ h ][ this.onlyActiveHeaders[ k ].value ];
                    if ( Array.isArray( val ) ) {
                        let labels: string[] = [];
                        for ( let j in val ) {
                            labels.push( val[ j ][ 'name' ] );
                        }
                        val = labels.join( ', \n ' );
                    }
                    if ( val === null ) {
                        val = '';
                    }
                    ws.cell( h + 2, k + 1 ).string( val ).style( styleRows );
                }
            }
            const path = require( 'path' );
            let clearPath = path.join( folderPath, this.selectedDateRange + this.exportExtensionWithDot )
            for ( let i = 1; i < 30; i++ ) {
                if ( HelperNode.fileExist( clearPath ) ) {
                    clearPath = path.join( folderPath, this.selectedDateRange + ' (' + i + ') ' + this.exportExtensionWithDot )
                }
            }
            if ( HelperNode.fileExist( clearPath ) ) {
                clearPath = path.join( folderPath, this.selectedDateRange + ' (' + ( new Date() ).getTime() + ') ' + this.exportExtensionWithDot )
            }
            wb.write( clearPath, ( err, stats ) => {
                if ( err ) {
                    alert( 'Can not save file' );
                } else {
                    HelperNode.openFileLocation( clearPath );
                }
            } );
        }
    }

    prepareHeadersWidths() {
        let total = 100;
        let sumWidths = 0;
        let countWithoutWidths = 0;
        for ( let k in this.reportHeaders ) {
            let styles = this.reportHeaders[ k ].styles;
            if ( styles ) {
                sumWidths += styles.width;
            } else {
                countWithoutWidths++;
            }
        }
        if ( sumWidths < total ) {
            if ( countWithoutWidths > 0 ) {
                let freeSpace = total - sumWidths;
                let defaultItemWidth = freeSpace / countWithoutWidths;
                for ( let k in this.reportHeaders ) {
                    let styles = this.reportHeaders[ k ].styles;
                    if ( !styles ) {
                        this.reportHeaders[ k ].styles = {
                            width: defaultItemWidth
                        };
                    }
                }
            }
        }
    }

    closeDialog() {
        this.fetchedResults = [];
        this.dateStartForUi = '';
        this.dateEndForUi = '';
        this.selectedDates = [];
    }
}
