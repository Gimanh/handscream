import { defineComponent } from 'vue';
import type { PropType } from 'vue';
import { TTextField } from '@/components/TTextField';
import { DEFAULT_GOAL_ITEM } from '@/types/goals.types';
import { TvBtn } from '@/components/TvBtn';
import type { GoalListItem } from '@/types/goal-lists.types';
import { useGoalListsStore } from '@/stores/goal-lists.store';

type DataType = {
    storage: ReturnType<typeof useGoalListsStore>
    listName: string
    loading: boolean
};

export default defineComponent( {
    components: { TTextField, TvBtn },
    props: {
        modelValue: Boolean,
        list: {
            type: Object as PropType<GoalListItem>,
            required: true,
            default: () => ( DEFAULT_GOAL_ITEM ),
        },
    },
    emits: [ 'update:modelValue' ],
    data(): DataType {
        const storage = useGoalListsStore();
        return {
            storage,
            listName: '',
            loading: false
        }
    },
    watch: {
        modelValue: {
            handler( value: boolean ) {
                if ( value ) {
                    this.listName = this.list.name;
                }
            },
            immediate: true
        }
    },
    computed: {
        canSave(): boolean {
            return this.listName !== this.list.name;
        }
    },
    methods: {
        async ok(): Promise<boolean> {
            if ( this.loading ) {
                return false;
            }
            this.loading = true;
            const result = await this.storage.updateList( {
                id: this.list.id,
                name: this.listName,
            } );
            this.loading = false;
            if ( result ) {
                this.$emit( 'update:modelValue', false );
                return true;
            }
            return false;
        },
        cancel(): void {
            this.$emit( 'update:modelValue', false );
        }
    },
} );
