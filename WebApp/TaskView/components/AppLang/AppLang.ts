import { Component } from 'vue-property-decorator';
import AppBase from '~/components/AppBase';
import { AppLanguages } from '~/classes/util/AppTypes';

const APP_LANG_KEY = 'appLang';
@Component
export default class AppLang extends AppBase {

    public selected: any = 0;

    public items: AppLanguages = [
        { id: 'ru', title: 'Русский' },
        { id: 'en', title: 'English' }
    ];

    setLang( item: AppLanguages[0] ) {
        this.$i18n.setLocale( item.id );
        this.$ls.setValue( APP_LANG_KEY, item.id );
    }

    created() {
        const lang = this.$ls.getValue( APP_LANG_KEY );
        if ( lang ) {
            this.$i18n.setLocale( lang );
        } else {
            this.$i18n.setLocale( this.$vuetify.lang.current );
        }

        for ( const k in this.items ) {
            if ( this.items[ k ].id === lang ) {
                this.selected = +k;
            }
        }
    }
}
