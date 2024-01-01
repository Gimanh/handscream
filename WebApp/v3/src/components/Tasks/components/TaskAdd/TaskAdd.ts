import { defineComponent } from 'vue';
import { TTextField } from '@/components/TTextField';
import { mdiKeyboardReturn, mdiKeyboardVariant, mdiPlus } from '@mdi/js';
import { useTasksStore } from '@/stores/tasks.store';

type DataType = {
    storage: ReturnType<typeof useTasksStore>
    taskName: string
    loading: boolean
};
export default defineComponent( {
    components: { TTextField },
    props: {
        listId: {
            type: String,
            required: true
        }
    },
    data(): DataType {
        const storage = useTasksStore();
        return {
            storage,
            taskName: '',
            loading: false,
        }
    },
    computed: {
        inputIcon(): string {
            if ( this.taskName.trim() ) {
                return mdiKeyboardReturn;
            }
            return mdiKeyboardVariant;
        }
    },
    methods: {
        async addTask(): Promise<boolean> {
            if ( this.loading ) {
                return false;
            }
            if ( this.taskName.trim() ) {
                this.loading = true;
                const result = await this.storage.addTask( {
                    description: this.taskName,
                    componentId: +this.listId
                } );
                this.loading = false;
                if ( result ) {
                    this.taskName = '';
                }
            }
            return true;
        }
    }
} );
