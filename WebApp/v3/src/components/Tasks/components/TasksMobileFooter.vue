<template>
    <div class="pa-1 tv-tasks-footer">
        <ABtn text
              variant="outlined"
              size="small"
              elevation="0"
              class="mr-2"
              @click="goToListView">
            <v-icon>
                {{ mdiArrowLeft }}
            </v-icon>
        </ABtn>
        <task-add :list-id="listId"
                  class="tv-tasks-footer__add-task" />
    </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import ABtn from '@/components/Atoms/ABtn';
import TaskAdd from '@/components/Tasks/components/TaskAdd';
import { mdiArrowLeft } from '@mdi/js';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();
const listId = computed<string>(() => route.params.listId as string);

function goToListView() {
    router.push({ name: 'goal-lists' });
}
</script>