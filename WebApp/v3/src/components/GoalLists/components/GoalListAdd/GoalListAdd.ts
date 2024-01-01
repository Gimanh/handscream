import { defineComponent } from 'vue';
import { TTextField } from '@/components/TTextField';
import { mdiKeyboardReturn, mdiKeyboardVariant, mdiPlus } from '@mdi/js';
import { useGoalListsStore } from '@/stores/goal-lists';

type DataType = {
    storage: ReturnType<typeof useGoalListsStore>
    listName: string
    loading: boolean
};
export default defineComponent( {
    components: { TTextField },
    props: {
        goalId: {
            type: String,
            required: true
        }
    },
    data(): DataType {
        const storage = useGoalListsStore();
        return {
            storage,
            listName: '',
            loading: false,
        }
    },
    computed: {
        inputIcon(): string {
            if ( this.listName.trim() ) {
                return mdiKeyboardReturn;
            }
            return mdiKeyboardVariant;
        }
    },
    methods: {
        async addList(): Promise<boolean> {
            if ( this.loading ) {
                return false;
            }
            if ( this.listName.trim() ) {
                this.loading = true;
                const result = await this.storage.addList( {
                    name: this.listName,
                    goalId: +this.goalId
                } );
                this.loading = false;
                if ( result ) {
                    this.listName = '';
                }
            }
            return true;
        }
    }
} );
