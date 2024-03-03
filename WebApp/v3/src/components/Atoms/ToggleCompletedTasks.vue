<template>
    <ABtn icon size="small" elevation="0" @click="toggleTasks">
        <v-icon size="large">
            {{ mdiCheckboxIntermediateVariant }}
        </v-icon>
    </ABtn>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { mdiCheckboxIntermediateVariant } from '@mdi/js';
import ABtn from '@/components/Atoms/ABtn';
import { useTasksStore } from '@/stores/tasks.store';
import type { FetchTasksArg, TasksStoreState } from '@/types/tasks.types';

const tasksStore = useTasksStore();
const showCompleted = ref<TasksStoreState['showCompleted']>(0);

function toggleTasks() {
    showCompleted.value === 1
        ? (showCompleted.value = 0)
        : (showCompleted.value = 1);
    tasksStore.clearTasks();
    tasksStore.showCompleted = showCompleted.value;
    tasksStore.endOfTasks = false;
    tasksStore.currentPage = 1;

    const args: FetchTasksArg = {
        componentId: tasksStore.currentListId,
        page: 0,
        searchText: '',
        appendResults: false,
    };

    tasksStore.fetchTasks(args);
}
</script>
