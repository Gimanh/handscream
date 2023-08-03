import { defineComponent } from 'vue';
import { TTextField } from '@/components/TTextField';
import { useGoalsStore } from '@/stores/goals';
import { mdiKeyboardReturn, mdiKeyboardVariant, mdiPlus } from '@mdi/js';

type DataType = {
    storage: ReturnType<typeof useGoalsStore>
    projectName: string
    loading: boolean
};
export default defineComponent( {
    components: { TTextField },
    data(): DataType {
        const storage = useGoalsStore();
        return {
            storage,
            projectName: '',
            loading: false,
        }
    },
    computed: {
        inputIcon(): string {
            if ( this.projectName.trim() ) {
                return mdiKeyboardReturn;
            }
            return mdiKeyboardVariant;
        }
    },
    methods: {
        async addGoal(): Promise<boolean> {
            if ( this.loading ) {
                return false;
            }
            if ( this.projectName.trim() ) {
                this.loading = true;
                const result = await this.storage.addGoal( { name: this.projectName } );
                this.loading = false;
                if ( result ) {
                    this.projectName = '';
                }
            }
            return true;
        }
    }
} );
