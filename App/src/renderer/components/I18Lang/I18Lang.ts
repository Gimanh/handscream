import ZMixin from '@/mixins/mixin';
import {Component} from 'vue-property-decorator'
import {State} from 'vuex-class';
import {NS_MAIN_STORE} from '@/store/Types/Consts';
import {I18N} from '@/classes/IZDatabase';
import { $database } from '@/store/plugins/API';

@Component
export default class I18Lang extends ZMixin {

    @State(state => state[NS_MAIN_STORE].languages) languages!: I18N[];

    get selectedLanguage(): string {
        for (let k of this.languages) {
            if (k.locale === this.$i18n.locale) {
                return k.name;
            }
        }
        return 'i18n';
    }

    setLocale(locale: string) {
        this.$i18n.locale = locale;
        $database.config.set('locale', locale);
    }
}
