import { createI18n } from 'vue-i18n';
import ru from '@/lang/ru.json'
import en from '@/lang/en.json'

const messages = {
    en: en,
    ru: ru,
}
const i18n = createI18n( {
    locale: 'ru',
    fallbackLocale: 'en',
    messages,
    legacy: false
} );
export default i18n
const $i18n = i18n.global;
export { $i18n }
