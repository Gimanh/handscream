<template>
    <div ref="taskContainer"
         class="tv-task-container">
        <task-add v-show="canShowAddTask"
                  :list-id="listId" />
        <!-- <ToggleCompletedTasks :fetch-tasks-args="fetchTasksArgs" /> -->
        <MTask v-for="item in storage.tasks"
               :key="item.id"
               :task="item" />
        <NoTasksAlert />
    </div>
    <TasksMobileFooter v-show="!canShowAddTask" />
</template>

<script setup lang="ts">
import TasksMobileFooter from '@/components/Tasks/components/TasksMobileFooter.vue';
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
const searchText = ref('');
const listId = computed<string>(() => route.params.listId as string);
const fetchTasksArgs = computed<FetchTasksArg>(() => ({
    componentId: +listId.value,
    page: storage.currentPage,
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
    storage.currentPage = 0;
    searchText.value = '';
    fetchTasksArgs.value.appendResults = false;
    storage.endOfTasks = false;
}

async function fetchTasksWrap() {
    if (!tasksInProgress && !storage.endOfTasks) {
        tasksInProgress = true;
        await storage.fetchTasks(fetchTasksArgs.value);
        storage.currentPage++;
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
