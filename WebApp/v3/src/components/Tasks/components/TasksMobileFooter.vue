<template>
    <div class="pb-1 tv-tasks-footer">
        <ABtn text
              variant="outlined"
              size="small"
              elevation="0"
              class="mr-2">
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
import { useRoute } from 'vue-router';

const route = useRoute();
const listId = computed<string>(() => route.params.listId as string);
</script>