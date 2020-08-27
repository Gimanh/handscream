import {Component} from 'vue-property-decorator';
import ZMixin from '@/mixins/mixin';

@Component
export default class License extends ZMixin {
    public dialog: boolean = true;

    public allLicenses = [
        {
            'name': 'axios',
            'licenseType': 'MIT',
            'link': 'https://github.com/axios/axios'
        },
        {
            'name': 'better-sqlite3',
            'licenseType': 'MIT',
            'link': 'https://github.com/JoshuaWise/better-sqlite3'
        },
        {
            'name': 'vue',
            'licenseType': 'MIT',
            'link': 'https://github.com/vuejs/vue'
        },
        {
            'name': 'vue-electron',
            'licenseType': 'ISC',
            'link': 'https://github.com/SimulatedGREG/vue-electron'
        },
        {
            'name': 'vue-router',
            'licenseType': 'MIT',
            'link': 'https://github.com/vuejs/vue-router'
        },
        {
            'name': 'vuex',
            'licenseType': 'MIT',
            'link': 'https://github.com/vuejs/vuex'
        },
        {
            'name': 'vuex-electron',
            'licenseType': 'MIT',
            'link': 'https://github.com/vue-electron/vuex-electron'
        },
        {
            'name': 'electron',
            'licenseType': 'MIT',
            'link': 'https://github.com/electron/electron'
        },
        {
            'name': 'tiptap',
            'licenseType': 'MIT',
            'link': 'https://github.com/scrumpy/tiptap'
        },
        {
            'name': 'tiptap-extensions',
            'licenseType': 'MIT',
            'link': 'https://github.com/scrumpy/tiptap'
        },
        {
            'name': 'vue-ctk-date-time-picker',
            'licenseType': 'MIT',
            'link': 'https://github.com/chronotruck/vue-ctk-date-time-picker'
        },
        {
            'name': 'vue-i18n',
            'licenseType': 'MIT',
            'link': 'https://github.com/kazupon/vue-i18n'
        },
        {
            'name': 'vuedraggable',
            'licenseType': 'MIT',
            'link': 'https://github.com/SortableJS/Vue.Draggable'
        },
        {
            'name': 'vuetify',
            'licenseType': 'MIT',
            'link': 'https://github.com/vuetifyjs/vuetify'
        },
        {
            'name': 'vuex-class',
            'licenseType': 'MIT',
            'link': ' https://github.com/ktsn/vuex-class'
        },
        {
            'name': 'vuex-smart-module',
            'licenseType': 'MIT',
            'link': 'https://github.com/ktsn/vuex-smart-module'
        }
    ];

    // created() {
    // const fs = require('fs');
    // const path = require("path");
    // let result = fs.readFileSync(path.join(__dirname, '/License.json'), 'utf8');
    // result = JSON.parse(result);
    // let newResult: any[] = [];
    // for (let k in result) {
    //     newResult.push({
    //         name:result[k].name,
    //         licenseType:result[k].licenseType,
    //         link:result[k].link,
    //     });
    // }
    // fs.writeFileSync(path.join(__dirname, '/LicenseReady.json'), JSON.stringify(newResult));
    // console.log(result);
    // }
}
