<template>
    <div class="pa-3">
        <v-alert type="warning"
                 v-if="storage.tasks.length < 1">
            No tasks is here
        </v-alert>
    </div>
</template>

<script setup lang="ts">
import { useTasksStore } from '@/stores/tasks.store';
const storage = useTasksStore();
</script>