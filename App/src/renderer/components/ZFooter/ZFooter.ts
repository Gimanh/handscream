import {Component, Vue} from 'vue-property-decorator';
import {State} from 'vuex-class'
import {NS_MAIN_STORE} from '@/store/types';
import {IZDatabase} from '@/classes/IZDatabase';
import {$database} from '@/store/plugins/API';

@Component
export default class ZFooter extends Vue {

    // name: string = 'ZFooter';

    @State(state => state[NS_MAIN_STORE].version) version;

    @State(state => state[NS_MAIN_STORE].database) database!: IZDatabase;

    @State(state => state[NS_MAIN_STORE].name) name!: boolean;

    // get dbNameFull() {
    //     if ($database) {
    //         return $database.getName();
    //     }
    //     console.warn('Undefined database in store');
    //     return '';
    // }
    //
    // get dbName() {
    //     let path = require('path');
    //     return path.basename(this.dbNameFull);
    // }
}
