import { defineComponent } from 'vue';
import type { AppLanguages } from '@/helpers/AppTypes';
import {mdiWeb} from '@mdi/js';

const APP_LANG_KEY = 'appLang';
export default defineComponent( {
    data() {
        return {
            selected: 0,
            items: [
                { id: 'ru', title: 'Русский' },
                { id: 'en', title: 'English' }
            ],
            mdiWeb
        }
    },
    methods: {
        setLang( item: AppLanguages[0] ) {
            this.$i18n.locale = item.id;
            // this.$i18n.setLocale( item.id );
            this.$ls.setValue( APP_LANG_KEY, item.id );
            for ( const k in this.items ) {
                if ( this.items[ k ].id === item.id ) {
                    this.selected = +k;
                }
            }
        },

        localeExist( locale: string ) {
            return this.items.find( ( value ) => {
                return value.id === locale;
            } );
        },

        created() {
            const lang = this.$ls.getValue( APP_LANG_KEY ) || navigator.language;
            const locale = this.localeExist( lang );
            if ( locale ) {
                this.setLang( locale );
            } else {
                this.setLang( this.items[ 1 ] );
            }
        }
    }
} );
