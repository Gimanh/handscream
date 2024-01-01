import { defineComponent } from 'vue';
import { TaskAdd } from '@/components/Tasks/components/TaskAdd';
import { useTasksStore } from '@/stores/tasks.store';
import type { FetchTasksArg, TaskItems } from '@/types/tasks.types';
import { MTask } from '@/components/Molecules/MTask';

type DataType = { storage: ReturnType<typeof useTasksStore> } & any;
export default defineComponent( {
    components: { TaskAdd, MTask },
    data(): DataType {
        const storage = useTasksStore();
        return {
            storage,
            currentPage: 0,
            noMoreTasks: false,
            showCompleted: false,
            searchText: '',
        };
    },
    computed: {
        listId(): string {
            return ( this.$route.params.listId as string );
        },
        fetchTasksArgs(): FetchTasksArg {
            return {
                componentId: +this.listId,
                page: this.currentPage,
                showCompleted: this.showCompleted ? 1 : 0,
                searchText: this.searchText
            };
        },
        tasks(): TaskItems {
            return this.storage.tasks;
        }
    },
    created() {
        this.storage.fetchTasks( this.fetchTasksArgs )
    }
} );
