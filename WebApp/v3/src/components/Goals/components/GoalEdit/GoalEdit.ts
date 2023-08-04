import { defineComponent } from 'vue';
import type { PropType } from 'vue';
import type { GoalItem } from '@/types/goals';
import { TTextField } from '@/components/TTextField';
import { DEFAULT_GOAL_ITEM } from '@/types/goals';
import { TvBtn } from '@/components/TvBtn';
import { useGoalsStore } from '@/stores/goals';

type DataType = {
    storage: ReturnType<typeof useGoalsStore>
    projectName: string
    projectDescription: string
    loading: boolean
};

export default defineComponent( {
    components: { TTextField, TvBtn },
    props: {
        modelValue: Boolean,
        goal: {
            type: Object as PropType<GoalItem>,
            required: true,
            default: () => ( DEFAULT_GOAL_ITEM ),
        },
    },
    emits: [ 'update:modelValue' ],
    data(): DataType {
        const storage = useGoalsStore();
        return {
            storage,
            projectName: '',
            projectDescription: '',
            loading: false
        }
    },
    watch: {
        modelValue: {
            handler( value: boolean ) {
                if ( value ) {
                    this.projectName = this.goal.name;
                    this.projectDescription = this.goal.description;
                }
            },
            immediate: true
        }
    },
    computed: {
        canSave(): boolean {
            return this.projectName !== this.goal.name || this.projectDescription !== this.goal.description;
        }
    },
    methods: {
        async ok(): Promise<boolean> {
            if ( this.loading ) {
                return false;
            }
            this.loading = true;
            const result = await this.storage.updateGoal( {
                id: this.goal.id,
                name: this.projectName,
                description: this.projectDescription
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
