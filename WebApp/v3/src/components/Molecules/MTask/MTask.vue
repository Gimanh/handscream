<template>
    <v-row align="end"
           class="ma-0 mb-1">
        <v-col cols="1"
               class="d-flex justify-center">
            <a-checkbox :model-value="task.complete"
                        @change="updateTaskStatus" />
        </v-col>
        <v-col cols="11">
            <a-text-field :model-value="task.description"
                          @change="updateTaskDescription" />
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import { ACheckbox } from '@/components/Atoms/ACheckbox';
import { ATextField } from '@/components/Atoms/ATextField';
import { debounce } from '@/helpers/app-helper';
import { useTasksStore } from '@/stores/tasks.store';
import type { TaskItem } from '@/types/tasks.types';
import type { PropType } from 'vue';

const { task } = defineProps({
    task: {
        type: Object as PropType<TaskItem>,
        required: true,
    }
});

const storage = useTasksStore();

async function updateTaskStatus(complete: boolean) {
    await storage.updateTaskStatus({ taskId: task.id, complete });
}

const updateTaskDescription = debounce(async (description: string) => {
    if (description) {
        await storage.updateTaskDescription({ taskId: task.id, description });
    } else {
        const answer = confirm('Do you want delete task?');
        if (answer) {
            await storage.deleteTask({ taskId: task.id });
        }
    }
}, 500);

</script>
