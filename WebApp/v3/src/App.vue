<template>
    <component :is="layout">
        <router-view />
    </component>
</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent( {
    components: {
        DefaultLayout: defineAsyncComponent( () => import('@/layout/DefaultLayout.vue') ),
        AdminLayout: defineAsyncComponent( () => import('@/layout/AdminLayout.vue') )
    },
    data() {
        return {
            layout: 'DefaultLayout'
        }
    },
    methods: {
        changeLayout() {
            if ( this.layout === 'DefaultLayout' ) {
                this.layout = 'AdminLayout';
            } else {
                this.layout = 'DefaultLayout'
            }
        }
    },
    created() {
        const { t } = useI18n( { inheritLocale: true } )
        console.log( this.$ls );
        console.log( this.$axios );
        console.log( t, this.$t );
    }
} );
</script>
