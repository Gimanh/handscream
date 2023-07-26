<template>
    <div>
        <button @click="changeLayout">Change layout</button>
        <component :is="layout">
            <RouterView />
        </component>
    </div>

</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent( {
    data() {
        return {
            layout: 'DefaultLayout'
        }
    },
    components: {
        DefaultLayout: defineAsyncComponent( () => import('@/layout/DefaultLayout.vue') ),
        AdminLayout: defineAsyncComponent( () => import('@/layout/AdminLayout.vue') )
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
