import { defineComponent } from 'vue';
import Goals from '@/components/Goals';
import { useAppStore } from '@/stores/app';

export default defineComponent( {
    components: {
        Goals
    },
    data() {
        const appStore = useAppStore();

        return {
            appStore
        }
    }
} );
