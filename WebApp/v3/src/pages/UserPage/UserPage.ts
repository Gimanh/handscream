import { defineComponent } from 'vue';
import Goals from '@/components/Goals';
import { useAppStore } from '@/stores/app.store';
import { GoalAdd } from '@/components/Goals/components/GoalAdd';

type DataType = {
    appStore: ReturnType<typeof useAppStore>
};
export default defineComponent( {
    components: {
        Goals, GoalAdd
    },
    data(): DataType {
        const appStore = useAppStore();
        return {
            appStore
        }
    },
    computed: {
        addGoalStyles() {
            return {
                position: 'sticky',
                top: 0,
                zIndex: 1,
            }
        }
    },
} );
