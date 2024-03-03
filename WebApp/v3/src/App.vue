<template>
    <component :is="layout">
        <router-view />
    </component>
</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import { isLoggedIn } from '@/helpers/app-helper';
export default defineComponent({
    components: {
        DefaultLayout: defineAsyncComponent(() => import('@/layout/DefaultLayout.vue')),
        AdminLayout: defineAsyncComponent(() => import('@/layout/AdminLayout.vue')),
        UserLayout: defineAsyncComponent(() => import('@/layout/UserLayout.vue')),
    },
    computed: {
        layout() {
            return isLoggedIn.value ? 'UserLayout' : 'DefaultLayout'
        }
    },
    created() {
        const { t } = useI18n({ inheritLocale: true })
        console.log(this.$ls);
        console.log(this.$axios);
        console.log(t, this.$t);
    }
});
</script>
