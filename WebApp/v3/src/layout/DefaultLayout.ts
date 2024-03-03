import { defineComponent, reactive, ref } from 'vue';
import { isLoggedIn, goToLoginPage } from '@/helpers/app-helper';
import { useTheme } from 'vuetify'
import { mdiInvertColors } from '@mdi/js';
import { useAppStore } from '@/stores/app.store';

import { defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router';

const AppLogo = defineAsyncComponent(() =>
    import('@/components/AppLogo')
);
const AppLang = defineAsyncComponent(() =>
    import('@/components/AppLang')
);

const AppLogout = defineAsyncComponent(() =>
    import('@/components/Authentication/Logout')
);

export default defineComponent({
    setup() {
        const theme = useTheme()
        const router = useRouter();
        const appStore = useAppStore();
        return {
            isLoggedIn,
            mdiInvertColors,
            goToLoginPage: () => goToLoginPage(router),
            toggleTheme: () => theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark',
            appStore
        }
    },

    components: {
        AppLogo,
        AppLang,
        AppLogout
    }
});
