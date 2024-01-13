<template>
    <div class="tv-task-container">
        <task-add v-show="canShowAddTask"
                  :list-id="listId" />
        <m-task v-for="item in storage.tasks"
                :key="item.id"
                :task="item" />
    </div>
</template>

<script setup lang="ts">

import { useTasksStore } from '@/stores/tasks.store';
import type { FetchTasksArg } from '@/types/tasks.types';
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import TaskAdd from '@/components/Tasks/components/TaskAdd';
import { MTask } from '@/components/Molecules/MTask';
import { useDisplay } from 'vuetify';

const display = useDisplay();

const route = useRoute();
const storage = useTasksStore();
const currentPage = ref<number>(0);
const noMoreTasks = ref(false);
const showCompleted = ref(false);
const searchText = ref('');
const listId = computed<string>(() => route.params.listId as string);
const fetchTasksArgs = computed<FetchTasksArg>(() => ({
    componentId: +listId.value,
    page: currentPage.value,
    searchText: searchText.value
}));
const canShowAddTask = computed(() => !(display.sm.value || display.xs.value));
watch(listId, () => {
    storage.fetchTasks(fetchTasksArgs.value);
}, { immediate: true });

</script>
