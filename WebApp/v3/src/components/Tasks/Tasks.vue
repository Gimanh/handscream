<template>
    <div ref="taskContainer"
         class="tv-task-container">
        <task-add v-show="canShowAddTask"
                  :list-id="listId" />
        <m-task v-for="item in storage.tasks"
                :key="item.id"
                :task="item" />
        <NoTasksAlert />
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
import { onMounted, onBeforeUnmount } from 'vue';
import NoTasksAlert from '@/components/Atoms/NoTasksAlert.vue';


const display = useDisplay();
const taskContainer = ref<HTMLElement | null>(null);
const route = useRoute();
const storage = useTasksStore();
const currentPage = ref<number>(0);
const showCompleted = ref(false);
const searchText = ref('');
const listId = computed<string>(() => route.params.listId as string);
const fetchTasksArgs = computed<FetchTasksArg>(() => ({
    componentId: +listId.value,
    page: currentPage.value,
    searchText: searchText.value,
    appendResults: false
}));
const canShowAddTask = computed(() => !(display.sm.value || display.xs.value));
let tasksInProgress = false;

watch(listId, async () => {
    resetDefaultState();
    storage.currentListId = +listId.value;
    await fetchTasksWrap()
}, { immediate: true });

function resetDefaultState() {
    currentPage.value = 0;
    searchText.value = '';
    fetchTasksArgs.value.appendResults = false;
    storage.endOfTasks = false;
}
async function fetchTasksWrap() {
    if (!tasksInProgress && !storage.endOfTasks) {
        tasksInProgress = true;
        await storage.fetchTasks(fetchTasksArgs.value);
        currentPage.value++;
        tasksInProgress = false;
    }
}

async function scrollHandler(event: Event) {
    const target = (event.target as HTMLElement);
    const scrollPercentage = (target.scrollTop / (target.scrollHeight - target.clientHeight)) * 100;
    if (scrollPercentage > 85 && !storage.endOfTasks) {
        fetchTasksArgs.value.appendResults = true;
        await fetchTasksWrap();

    }
}

onMounted(() => {
    if (taskContainer.value) {
        taskContainer.value.addEventListener('scroll', scrollHandler);
    }
});

onBeforeUnmount(() => {
    taskContainer.value?.removeEventListener('scroll', scrollHandler);
});

</script>
